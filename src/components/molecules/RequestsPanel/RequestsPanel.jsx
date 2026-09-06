import styled from 'styled-components';
import { IconButton } from '../../atoms/IconButton/IconButton';
import { Heading } from '../../atoms/Heading/Heading';
import { Avatar } from '../Avatar/Avatar';
import { ButtonDark } from '../../atoms/ButtonDark/ButtonDark';
import { FieldError } from '../../atoms/FieldError/FieldError';

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
    font-size: ${({ theme }) => theme.typography.fontSize.caption};
`;

const RequestActions = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.xxs};
`;

// Small paired-action variant of ButtonDark, sized between IconButton (40px) and CircularButton (48px).
const RequestActionButton = styled(ButtonDark)`
    width: 32px;
    height: 32px;
    padding: 0;
    margin: 0;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: ${({ theme }) => theme.typography.fontSize.caption};
`;

const EmptyHint = styled.p`
    font-family: ${({ theme }) => theme.typography.fontFamily.mono};
    color: ${({ theme }) => theme.colors.neutralDark.highlight};
    font-size: ${({ theme }) => theme.typography.fontSize.caption};
`;

// `request` is { uidA, uidB, otherId, name, requestedAt } (see lib/friends.js).
export const RequestsPanel = ({ requests, loading, error, respondingId, onBack, onAccept, onDecline }) => (
    <>
        <PanelHeader>
            <IconButton type="button" aria-label="Back to chats" onClick={onBack}>←</IconButton>
            <Heading variant="panel">{requests.length > 0 ? `Requests · ${requests.length}` : 'Requests'}</Heading>
        </PanelHeader>
        <PanelBody>
            {error && <FieldError>{error}</FieldError>}
            {/* Only the true first load takes over the body — a revalidating reopen keeps the existing list. */}
            {loading && requests.length === 0 && <EmptyHint>▶ loading requests…</EmptyHint>}
            {!loading && requests.length === 0 && !error && <EmptyHint>▶ no pending requests</EmptyHint>}
            {requests.map((request) => (
                <RequestRow key={request.otherId}>
                    <Avatar name={request.name} />
                    <RequestName>{request.name}</RequestName>
                    <RequestActions>
                        <RequestActionButton
                            type="button"
                            aria-label={`Accept ${request.name}`}
                            disabled={respondingId === request.otherId}
                            onClick={() => onAccept(request)}
                        >
                            ✓
                        </RequestActionButton>
                        <RequestActionButton
                            type="button"
                            aria-label={`Decline ${request.name}`}
                            disabled={respondingId === request.otherId}
                            onClick={() => onDecline(request)}
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
