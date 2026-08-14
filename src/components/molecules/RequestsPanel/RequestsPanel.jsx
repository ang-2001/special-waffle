import styled from 'styled-components';
import { IconButton } from '../../atoms/IconButton/IconButton';
import { Heading } from '../../atoms/Heading/Heading';
import { Avatar } from '../Avatar/Avatar';
import { ButtonDark } from '../../atoms/ButtonDark/ButtonDark';

const PanelHeader = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
    padding: ${({ theme }) => theme.spacing.md};
`;

const PanelBody = styled.div`
    flex: 1;
    padding: 0 ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.md};
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xs};
    overflow-y: auto;
`;

const RequestRow = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
    background-color: ${({ theme }) => theme.colors.neutralDark[400]};
    border-radius: ${({ theme }) => theme.radii.md};
    padding: ${({ theme }) => theme.spacing.xs};
`;

const RequestName = styled.span`
    flex: 1;
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    color: ${({ theme }) => theme.colors.text.onDark};
    font-size: 13px;
`;

const RequestActions = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.xxs};
`;

// Small paired-action variant of ButtonDark, sized between IconButton (40px,
// paired header actions) and CircularButton (48px, single standalone
// action) — these are paired but inline within a compact row.
const RequestActionButton = styled(ButtonDark)`
    width: 32px;
    height: 32px;
    padding: 0;
    margin: 0;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
`;

const EmptyHint = styled.p`
    font-family: ${({ theme }) => theme.typography.fontFamily.mono};
    color: ${({ theme }) => theme.colors.neutralDark.highlight};
    font-size: 13px;
`;

// Decline only ever mutates Sidebar's local `requests` state. Accept also
// bubbles the name up to HomeTemplate (via Sidebar's onAcceptFriend) so the
// new friend shows up in the chat list — MessageSection picks it up for
// free since it already falls back to an empty thread for any friend name
// it doesn't have seed messages for.
export const RequestsPanel = ({ requests, onBack, onAccept, onDecline }) => (
    <>
        <PanelHeader>
            <IconButton type="button" aria-label="Back to chats" onClick={onBack}>←</IconButton>
            <Heading variant="panel">{requests.length > 0 ? `Requests · ${requests.length}` : 'Requests'}</Heading>
        </PanelHeader>
        <PanelBody>
            {requests.length === 0 && <EmptyHint>▶ no pending requests</EmptyHint>}
            {requests.map((request) => (
                <RequestRow key={request.id}>
                    <Avatar name={request.name} />
                    <RequestName>{request.name}</RequestName>
                    <RequestActions>
                        <RequestActionButton
                            type="button"
                            aria-label={`Accept ${request.name}`}
                            onClick={() => onAccept(request.id, request.name)}
                        >
                            ✓
                        </RequestActionButton>
                        <RequestActionButton
                            type="button"
                            aria-label={`Decline ${request.name}`}
                            onClick={() => onDecline(request.id)}
                        >
                            ✕
                        </RequestActionButton>
                    </RequestActions>
                </RequestRow>
            ))}
        </PanelBody>
    </>
);

export default RequestsPanel;
