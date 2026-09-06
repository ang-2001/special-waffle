import styled, { css, keyframes } from 'styled-components';
import { Avatar } from '../Avatar/Avatar';

const settlePulse = keyframes`
    0% { transform: scale(1); }
    40% { transform: scale(1.015); }
    100% { transform: scale(1); }
`;

// "Added to a chat" glow — persists until opened (see HomeTemplate's newChatIds).
const goldPulse = keyframes`
    0%, 100% { box-shadow: 0 0 0 2px var(--chat-row-gold), 0 0 8px 0 color-mix(in srgb, var(--chat-row-gold) 40%, transparent); }
    50% { box-shadow: 0 0 0 2px var(--chat-row-gold), 0 0 20px 4px color-mix(in srgb, var(--chat-row-gold) 70%, transparent); }
`;

const ChatListItemContainer = styled.div`
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
    padding: ${({ theme }) => theme.spacing.xs};
    border-radius: ${({ theme }) => theme.radii.md};
    cursor: pointer;
    background-color: ${({ theme, $active }) =>
        $active ? theme.colors.neutralDark[400] : theme.colors.background.surface};
    transition: background-color ${({ theme }) => theme.transitions.fast} ease-in-out;
    --chat-row-gold: ${({ theme }) => theme.colors.accent.gold};

    /* Selected-state accent bar via transform (scaleX), not border-left —
       transform can animate smoothly, a border-style change can't. */
    &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 4px;
        background-color: ${({ theme }) => theme.colors.accent.gold};
        transform: scaleX(0);
        transform-origin: left;
        transition: transform 200ms ease-out;
    }

    /* Selecting a row also gets a brief tactile settle. */
    ${({ $active }) => $active && css`
        &::before {
            transform: scaleX(1);
        }
        animation: ${settlePulse} 220ms ease-out;
    `}

    @media (prefers-reduced-motion: reduce) {
        &::before { transition: none; }
        animation: none;
    }

    /* Only non-active rows get a hover treatment. */
    ${({ theme, $active }) => !$active && css`
        &:hover {
            background-color: ${theme.colors.neutralDark[100]};
        }
    `}

    ${({ $isNew }) => $isNew && css`
        animation: ${goldPulse} 2.4s ease-in-out infinite;

        @media (prefers-reduced-motion: reduce) {
            animation: none;
        }
    `}
`;

// Sits inside the row's bounds — overflow: hidden above would clip a peeking badge.
const NewTag = styled.span`
    position: absolute;
    top: 4px;
    right: 4px;
    background-color: ${({ theme }) => theme.colors.accent.gold};
    color: ${({ theme }) => theme.colors.text.onSurfaceAlt};
    font-family: ${({ theme }) => theme.typography.fontFamily.display};
    font-size: 9px;
    letter-spacing: 0.06em;
    padding: 2px 6px;
    border-radius: ${({ theme }) => theme.radii.sm};
    text-transform: uppercase;
`;

// font-family is body/Inter, matching ChatPreview below it.
const ChatName = styled.span`
    width: 100%;
    padding: ${({ theme }) => theme.spacing.xxs} ${({ theme }) => theme.spacing.xs};
    border-radius: ${({ theme }) => theme.radii.sm};
    background-color: ${({ theme }) => theme.colors.accent.beige};
    color: ${({ theme }) => theme.colors.text.onSurfaceAlt};
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    font-weight: 600;
`;

const ChatPreview = styled.span`
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    font-size: ${({ theme }) => theme.typography.fontSize.caption};
    color: ${({ theme }) => theme.colors.neutralDark.highlight};
    display: block;
    margin-top: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    /* Italic for a placeholder line ("say hi 👋") vs. a real preview. */
    font-style: ${({ $muted }) => ($muted ? 'italic' : 'normal')};
`;

export const ChatListItem = ({ name, preview, previewMuted, active, isNew, ...props }) => (
    <ChatListItemContainer $active={active} $isNew={isNew} {...props}>
        {isNew && <NewTag aria-hidden="true">new</NewTag>}
        <Avatar name={name} />
        <ChatName>
            {name}
            {preview && <ChatPreview $muted={previewMuted}>{preview}</ChatPreview>}
        </ChatName>
    </ChatListItemContainer>
);

export default ChatListItem;
