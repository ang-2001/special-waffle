import { useState } from 'react';
import styled from 'styled-components';
import { IconButton } from '../../atoms/IconButton/IconButton';
import { Heading } from '../../atoms/Heading/Heading';
import { Avatar } from '../Avatar/Avatar';
import { SearchField } from '../SearchField/SearchField';
import { FieldError } from '../../atoms/FieldError/FieldError';
import { ChatListSkeleton } from '../ChatListSkeleton/ChatListSkeleton';

const PanelHeader = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
    padding: ${({ theme }) => theme.spacing.md};
`;

const PanelBody = styled.div`
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xs};
    overflow: hidden;
`;

const SearchWrap = styled.div`
    padding: 0 ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xs};
`;

const FriendList = styled.div`
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 0 ${({ theme }) => theme.spacing.md};
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xxs};
`;

const FriendRow = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
    padding: ${({ theme }) => theme.spacing.xs};
    border-radius: ${({ theme }) => theme.radii.md};
    cursor: pointer;
    transition: background-color ${({ theme }) => theme.transitions.fast} ease-in-out;

    &:hover {
        background-color: ${({ theme }) => theme.colors.neutralDark[100]};
    }
`;

const FriendName = styled.span`
    flex: 1;
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text.onDark};
`;

const CheckCircle = styled.span`
    width: 22px;
    height: 22px;
    flex: none;
    border-radius: 50%;
    border: 2px solid ${({ theme }) => theme.colors.neutralDark[100]};
    background-color: ${({ theme, $checked }) => ($checked ? theme.colors.accent.gold : 'transparent')};
    border-color: ${({ theme, $checked }) => $checked && theme.colors.accent.gold};
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: background-color ${({ theme }) => theme.transitions.fast} ease-in-out,
        border-color ${({ theme }) => theme.transitions.fast} ease-in-out;

    svg {
        width: 13px;
        height: 13px;
        fill: ${({ theme }) => theme.colors.text.onSurfaceAlt};
        opacity: ${({ $checked }) => ($checked ? 1 : 0)};
    }
`;

const EmptyHint = styled.p`
    font-family: ${({ theme }) => theme.typography.fontFamily.mono};
    color: ${({ theme }) => theme.colors.neutralDark.highlight};
    font-size: ${({ theme }) => theme.typography.fontSize.caption};
    padding: 0 ${({ theme }) => theme.spacing.md};
`;

const PanelFooter = styled.div`
    flex: none;
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.md};
`;

const ConfirmButton = styled.button`
    width: 100%;
    border: 4px solid ${({ theme }) => theme.colors.neutralDark[500]};
    border-radius: ${({ theme }) => theme.radii.md};
    padding: ${({ theme }) => theme.spacing.sm} 0;
    background: linear-gradient(
        145deg,
        ${({ theme }) => theme.colors.neutralDark[500]},
        ${({ theme }) => theme.colors.neutralDark[100]}
    );
    box-shadow: inset 2px 2px 0px ${({ theme }) => theme.colors.neutralDark.highlight},
        inset -2px -2px 0px ${({ theme }) => theme.colors.neutralDark[400]};
    color: ${({ theme }) => theme.colors.text.onDark};
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    font-weight: 700;
    font-size: ${({ theme }) => theme.typography.fontSize.body};
    cursor: pointer;

    &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
    }
`;

const CheckIcon = () => (
    <svg viewBox="0 -960 960 960" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
    </svg>
);

// Used both for starting a new chat (NewChatRow) and, in "add" mode, for
// inviting more people into an existing one (ChatInfoPanel) — the
// heading/backLabel/emptyHint/getConfirmLabel props let the caller swap
// copy and confirm behavior per mode; defaults match the original
// new-chat copy exactly.
const defaultConfirmLabel = (selectedFriends) => {
    if (selectedFriends.length === 1) return `Message ${selectedFriends[0].name}`;
    if (selectedFriends.length > 1) return `Start chat (${selectedFriends.length} people)`;
    return 'Select friends to start';
};

export const CreateChatPanel = ({
    friends,
    loading,
    error,
    onBack,
    onConfirm,
    heading = 'New chat',
    backLabel = 'Back to chats',
    emptyHint = '▶ add a friend first',
    getConfirmLabel = defaultConfirmLabel,
}) => {
    const [selected, setSelected] = useState(() => new Set());

    const toggle = (uid) => {
        setSelected((prev) => {
            const next = new Set(prev);
            if (next.has(uid)) next.delete(uid);
            else next.add(uid);
            return next;
        });
    };

    const selectedFriends = friends.filter((f) => selected.has(f.uid));
    const confirmLabel = getConfirmLabel(selectedFriends);

    return (
        <>
            <PanelHeader>
                <IconButton type="button" aria-label={backLabel} onClick={onBack}>←</IconButton>
                <Heading variant="panel">{heading}</Heading>
            </PanelHeader>
            <PanelBody>
                <SearchWrap>
                    <SearchField placeholder="Search friends" />
                </SearchWrap>
                <FriendList>
                    {loading && <ChatListSkeleton rows={3} />}
                    {!loading && error && <FieldError>⏸ {error}</FieldError>}
                    {!loading && !error && friends.length === 0 && <EmptyHint>{emptyHint}</EmptyHint>}
                    {!loading && !error && friends.map((friend) => {
                        const checked = selected.has(friend.uid);
                        return (
                            <FriendRow key={friend.uid} onClick={() => toggle(friend.uid)}>
                                <Avatar name={friend.name} />
                                <FriendName>{friend.name}</FriendName>
                                <CheckCircle $checked={checked}>
                                    <CheckIcon />
                                </CheckCircle>
                            </FriendRow>
                        );
                    })}
                </FriendList>
            </PanelBody>
            <PanelFooter>
                <ConfirmButton
                    type="button"
                    disabled={selectedFriends.length === 0}
                    onClick={() => onConfirm(selectedFriends)}
                >
                    {confirmLabel}
                </ConfirmButton>
            </PanelFooter>
        </>
    );
};

export default CreateChatPanel;
