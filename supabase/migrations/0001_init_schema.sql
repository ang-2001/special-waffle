-- Run this once, top to bottom, against a fresh Supabase project.

-- ============================================================
-- Extensions
-- ============================================================

create extension if not exists pgcrypto;

create schema if not exists extensions;
create extension if not exists citext with schema extensions;

-- ============================================================
-- Tables
-- ============================================================

create table profiles (
  uid                   uuid primary key references auth.users(id) on delete cascade,
  display_name          citext not null,
  first_name            text not null,
  last_name             text not null,
  onboarding_completed  boolean not null default false,
  created_at            timestamptz not null default now(),
  constraint display_name_length check (char_length(display_name) between 1 and 40),
  constraint display_name_unique unique (display_name)
);

create table friendships (
  uida          uuid not null references profiles(uid),
  uidb          uuid not null references profiles(uid),
  status        text not null default 'pending'
                  check (status in ('pending', 'accepted', 'declined', 'blocked')),
  requested_by  uuid not null references profiles(uid),
  requested_at  timestamptz not null default now(),
  responded_at  timestamptz,
  check (uida < uidb),
  check (requested_by in (uida, uidb)),
  primary key (uida, uidb)
);
create index on friendships (uidb);

create table chats (
  chat_id               uuid primary key default gen_random_uuid(),
  title                 text,        -- null until renamed; display name falls back to participant names
  last_message_preview  text,        -- synced by a trigger, not the client
  last_message_at       timestamptz,
  created_at            timestamptz not null default now(),
  constraint chat_title_length check (title is null or char_length(title) <= 80)
);

create table chat_participants (
  chat_id   uuid not null references chats(chat_id) on delete cascade,
  uid       uuid not null references profiles(uid) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (chat_id, uid)
);
create index on chat_participants (uid);

create table messages (
  message_id uuid primary key default gen_random_uuid(),
  chat_id    uuid not null references chats(chat_id) on delete cascade,
  sender_id  uuid not null references profiles(uid),
  sent_at    timestamptz not null default now(),
  type       text not null default 'text' check (type in ('text')),
  content    text not null,
  constraint message_content_length check (char_length(content) <= 4000)
);
create index on messages (chat_id, sent_at);

-- ============================================================
-- Functions
-- ============================================================

-- Auto-create a profile row on signup. Appends a numeric suffix on a
-- display_name collision ("Kyle Chen", then "Kyle Chen 2") rather than
-- failing signup outright.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  base_name text := coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1));
  candidate_name text := base_name;
  suffix int := 1;
begin
  loop
    begin
      insert into public.profiles (uid, display_name, first_name, last_name)
      values (
        new.id,
        candidate_name,
        coalesce(new.raw_user_meta_data ->> 'first_name', ''),
        coalesce(new.raw_user_meta_data ->> 'last_name', '')
      );
      exit;
    exception when unique_violation then
      suffix := suffix + 1;
      candidate_name := base_name || ' ' || suffix;
      if suffix > 50 then
        raise exception 'Could not generate a unique display name for %', new.id;
      end if;
    end;
  end loop;
  return new;
end;
$$;

create or replace function public.prevent_friendship_identity_change()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.uida <> old.uida or new.uidb <> old.uidb or new.requested_by <> old.requested_by then
    raise exception 'uida, uidb, and requested_by cannot change once a friendship row exists';
  end if;
  return new;
end;
$$;

-- chat_id is the only identity column left to protect since type/direct_key
-- never existed in this consolidated version (see the header note).
create or replace function public.prevent_chat_identity_change()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.chat_id <> old.chat_id then
    raise exception 'chat_id cannot change after a chat is created';
  end if;
  return new;
end;
$$;

-- Keeps chats.last_message_* in sync in exactly one place.
create or replace function public.update_chat_last_message()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  update chats
  set last_message_preview = left(new.content, 140),
      last_message_at = new.sent_at
  where chat_id = new.chat_id;
  return new;
end;
$$;

-- Lets chat_participants' own SELECT policy check participancy without
-- recursing into itself: this function's internal lookup runs as its
-- owner (security definer), bypassing RLS, so the policy that calls it
-- doesn't re-trigger itself.
create or replace function public.is_chat_participant(p_chat_id uuid, p_uid uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from chat_participants
    where chat_id = p_chat_id and uid = p_uid
  );
$$;

-- The only way a chat gets created. Every invitee must already be an
-- accepted friend of the caller. Reuses an existing untitled chat with
-- this exact participant set instead of making a new one, so clicking
-- "New chat" and picking the same person twice doesn't fork a duplicate
-- conversation — scoped to untitled chats only, so a renamed chat is
-- never silently merged into.
create or replace function public.create_chat(other_user_ids uuid[], chat_title text default null)
returns uuid
language plpgsql
security definer set search_path = public
as $$
declare
  me uuid := auth.uid();
  other_id uuid;
  are_friends boolean;
  existing_chat_id uuid;
  new_id uuid;
begin
  if me is null then
    raise exception 'Must be signed in';
  end if;

  if other_user_ids is null or array_length(other_user_ids, 1) is null then
    raise exception 'Must include at least one other person';
  end if;

  -- Dedupe defensively — a repeated uid would otherwise raise a raw unique_violation.
  other_user_ids := array(select distinct unnest(other_user_ids));

  if me = any(other_user_ids) then
    raise exception 'Cannot include yourself in other_user_ids — you are added automatically';
  end if;

  foreach other_id in array other_user_ids loop
    select exists (
      select 1 from friendships
      where uida = least(me, other_id)
        and uidb = greatest(me, other_id)
        and status = 'accepted'
    ) into are_friends;

    if not are_friends then
      raise exception 'Can only start a chat with an accepted friend';
    end if;
  end loop;

  if chat_title is null then
    select cp.chat_id into existing_chat_id
    from chat_participants cp
    join chats c on c.chat_id = cp.chat_id
    where c.title is null
      and cp.chat_id in (select chat_id from chat_participants where uid = me)
    group by cp.chat_id
    having array_agg(cp.uid order by cp.uid)
         = (select array_agg(uid order by uid)
            from unnest(array_append(other_user_ids, me)) as uid)
    limit 1;

    if existing_chat_id is not null then
      return existing_chat_id;
    end if;
  end if;

  insert into chats (title) values (chat_title) returning chat_id into new_id;

  insert into chat_participants (chat_id, uid)
  select new_id, uid from unnest(array_append(other_user_ids, me)) as uid;

  return new_id;
end;
$$;

create or replace function public.rename_chat(p_chat_id uuid, p_title text)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Must be signed in';
  end if;
  if not exists (
    select 1 from chat_participants
    where chat_id = p_chat_id and uid = auth.uid()
  ) then
    raise exception 'Not a participant in this chat';
  end if;

  -- Blank clears the title, falling back to the joined-names display.
  update chats set title = nullif(trim(p_title), '')
  where chat_id = p_chat_id;
end;
$$;

create or replace function public.add_chat_participant(p_chat_id uuid, p_uid uuid)
returns void
language plpgsql
security definer set search_path = public
as $$
declare
  me uuid := auth.uid();
  are_friends boolean;
begin
  if me is null then
    raise exception 'Must be signed in';
  end if;
  if not exists (select 1 from chat_participants where chat_id = p_chat_id and uid = me) then
    raise exception 'Not a participant in this chat';
  end if;
  if p_uid = me then
    raise exception 'Already in this chat';
  end if;

  select exists (
    select 1 from friendships
    where uida = least(me, p_uid) and uidb = greatest(me, p_uid) and status = 'accepted'
  ) into are_friends;
  if not are_friends then
    raise exception 'Can only add an accepted friend';
  end if;

  -- Idempotent — a repeat call is a harmless no-op, not a unique-violation.
  insert into chat_participants (chat_id, uid) values (p_chat_id, p_uid)
  on conflict (chat_id, uid) do nothing;
end;
$$;

-- Self-removal only — "kick" needs an owner/admin permission model that
-- doesn't exist yet, out of scope here.
create or replace function public.leave_chat(p_chat_id uuid)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Must be signed in';
  end if;

  -- Deleting zero matching rows is a harmless no-op — no pre-check needed.
  delete from chat_participants
  where chat_id = p_chat_id and uid = auth.uid();
end;
$$;

-- Below 2 participants, not just 0 — a lone remaining person is as stuck
-- as an empty chat. Cascades to messages and the last participant row.
create or replace function public.delete_chat_if_empty()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if (select count(*) from chat_participants where chat_id = old.chat_id) < 2 then
    delete from chats where chat_id = old.chat_id;
  end if;
  return old;
end;
$$;

-- ============================================================
-- Triggers
-- ============================================================

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create trigger friendships_identity_is_immutable
  before update on friendships
  for each row execute function public.prevent_friendship_identity_change();

create trigger chats_identity_is_immutable
  before update on chats
  for each row execute function public.prevent_chat_identity_change();

create trigger on_message_insert
  after insert on messages
  for each row execute function public.update_chat_last_message();

create trigger chat_participants_cleanup
  after delete on chat_participants
  for each row execute function public.delete_chat_if_empty();

-- ============================================================
-- Row Level Security
-- ============================================================

alter table profiles enable row level security;

create policy "profiles are viewable by any signed-in user"
  on profiles for select
  to authenticated
  using (true);

create policy "users can update their own profile"
  on profiles for update
  to authenticated
  using (uid = auth.uid())
  with check (uid = auth.uid());

alter table friendships enable row level security;

create policy "users can view their own friendships and requests"
  on friendships for select
  to authenticated
  using (auth.uid() = uida or auth.uid() = uidb);

create policy "users can send a friend request"
  on friendships for insert
  to authenticated
  with check (
    requested_by = auth.uid()
    and auth.uid() in (uida, uidb)
    and status = 'pending'
  );

create policy "recipients can respond to a pending request"
  on friendships for update
  to authenticated
  using (
    (auth.uid() = uida or auth.uid() = uidb)
    and status = 'pending'
    and auth.uid() != requested_by
  )
  with check (
    (auth.uid() = uida or auth.uid() = uidb)
    and status in ('accepted', 'declined', 'blocked')
  );

create policy "requesters can cancel their own pending request"
  on friendships for delete
  to authenticated
  using (requested_by = auth.uid() and status = 'pending');

alter table chats enable row level security;

create policy "users can view chats they participate in"
  on chats for select
  to authenticated
  using (
    exists (
      select 1 from chat_participants cp
      where cp.chat_id = chats.chat_id and cp.uid = auth.uid()
    )
  );

-- No update policy or grant — rename_chat is the only way to change a chat
-- row, and being SECURITY DEFINER it doesn't need one. A direct grant here
-- would let a participant PATCH last_message_preview/last_message_at/
-- created_at straight through PostgREST, bypassing that function entirely.

alter table chat_participants enable row level security;

create policy "users can view participant rows for their own chats"
  on chat_participants for select
  to authenticated
  using (public.is_chat_participant(chat_id, auth.uid()));

-- No insert/update/delete policy — every write goes through create_chat,
-- add_chat_participant, or leave_chat, all SECURITY DEFINER.

alter table messages enable row level security;

create policy "users can view messages in their own chats"
  on messages for select
  to authenticated
  using (
    exists (
      select 1 from chat_participants cp
      where cp.chat_id = messages.chat_id and cp.uid = auth.uid()
    )
  );

create policy "users can send messages to their own chats"
  on messages for insert
  to authenticated
  with check (
    sender_id = auth.uid()
    and exists (
      select 1 from chat_participants cp
      where cp.chat_id = messages.chat_id and cp.uid = auth.uid()
    )
  );

-- ============================================================
-- Grants
--
-- RLS is the fine-grained gate (which rows); Postgres checks base table
-- privileges first, before RLS is even evaluated. Nothing granted to
-- anon — every policy above is scoped to authenticated already.
-- ============================================================

grant select, update on profiles to authenticated;
grant select, insert, update, delete on friendships to authenticated;
grant select on chats to authenticated;
grant select on chat_participants to authenticated;
grant select, insert on messages to authenticated;

-- Trigger-only SECURITY DEFINER functions: never meant to be called
-- directly, so EXECUTE is revoked from public to close that listing.
revoke execute on function public.handle_new_user() from public;
revoke execute on function public.update_chat_last_message() from public;
revoke execute on function public.delete_chat_if_empty() from public;

-- Called directly (via RLS policy or RPC) by the authenticated role.
revoke execute on function public.is_chat_participant(uuid, uuid) from public;
grant execute on function public.is_chat_participant(uuid, uuid) to authenticated;

revoke execute on function public.create_chat(uuid[], text) from public;
grant execute on function public.create_chat(uuid[], text) to authenticated;

revoke execute on function public.rename_chat(uuid, text) from public;
grant execute on function public.rename_chat(uuid, text) to authenticated;

revoke execute on function public.add_chat_participant(uuid, uuid) from public;
grant execute on function public.add_chat_participant(uuid, uuid) to authenticated;

revoke execute on function public.leave_chat(uuid) from public;
grant execute on function public.leave_chat(uuid) to authenticated;

-- ============================================================
-- Realtime
-- ============================================================

alter publication supabase_realtime add table messages;
alter publication supabase_realtime add table chat_participants;
