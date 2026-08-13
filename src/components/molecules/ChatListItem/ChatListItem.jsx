import styled from 'styled-components';
import { Avatar } from '../Avatar/Avatar';

const ChatListItemContainer = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
    padding: ${({ theme }) => theme.spacing.xs};
    border-radius: ${({ theme }) => theme.radii.md};
    cursor: pointer;
    background-color: ${({ theme, $active }) =>
        $active ? theme.colors.neutralDark[400] : theme.colors.background.surface};
    ${({ theme, $active }) => $active && `border-left: 4px solid ${theme.colors.accent.gold};`}
`;

const ChatName = styled.span`
    width: 100%;
    padding: ${({ theme }) => theme.spacing.xxs} ${({ theme }) => theme.spacing.xs};
    border-radius: ${({ theme }) => theme.radii.sm};
    background-color: ${({ theme }) => theme.colors.accent.beige};
    color: ${({ theme }) => theme.colors.text.onSurfaceAlt};
    font-family: ${({ theme }) => theme.typography.fontFamily.display};
    font-weight: bold;
`;

const ChatPreview = styled.span`
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    font-size: 12px;
    color: ${({ theme }) => theme.colors.neutralDark.highlight};
    display: block;
    margin-top: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

export const ChatListItem = ({ name, preview, active, ...props }) => (
    <ChatListItemContainer $active={active} {...props}>
        <Avatar name={name} />
        <ChatName>
            {name}
            {preview && <ChatPreview>{preview}</ChatPreview>}
        </ChatName>
    </ChatListItemContainer>
);

export default ChatListItem;
