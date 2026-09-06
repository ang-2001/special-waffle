import styled from 'styled-components';

// Dashed/muted, not ChatListItem's solid fill, so it reads as an action, not a conversation.
const Row = styled.button`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
    flex: none;
    width: 100%;
    padding: ${({ theme }) => theme.spacing.xs};
    border: 1.5px dashed ${({ theme }) => theme.colors.neutralDark[100]};
    border-radius: ${({ theme }) => theme.radii.md};
    background: none;
    color: ${({ theme }) => theme.colors.neutralDark.highlight};
    cursor: pointer;
    transition: background-color ${({ theme }) => theme.transitions.fast} ease-in-out,
        border-color ${({ theme }) => theme.transitions.fast} ease-in-out,
        color ${({ theme }) => theme.transitions.fast} ease-in-out;

    &:hover,
    &:focus-visible {
        background-color: ${({ theme }) => theme.colors.neutralDark[400]};
        border-color: ${({ theme }) => theme.colors.neutralDark.highlight};
        color: ${({ theme }) => theme.colors.text.onDark};
    }
`;

const PlusBadge = styled.span`
    width: 40px;
    height: 40px;
    flex: none;
    border-radius: 50%;
    border: 1.5px dashed currentColor;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
`;

const Label = styled.span`
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    font-weight: 600;
    font-size: ${({ theme }) => theme.typography.fontSize.body};
`;

export const NewChatRow = (props) => (
    <Row type="button" {...props}>
        <PlusBadge aria-hidden="true">＋</PlusBadge>
        <Label>New chat</Label>
    </Row>
);

export default NewChatRow;
