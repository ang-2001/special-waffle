import styled from 'styled-components';
import { IconButton } from '../../atoms/IconButton/IconButton';
import { Heading } from '../../atoms/Heading/Heading';
import { LeaveIcon } from '../../atoms/LeaveIcon/LeaveIcon';
import { Avatar } from '../Avatar/Avatar';

// Participants, adding more people, and leaving — opened from the
// header's gear icon (see MessageSection).
const PanelHeader = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
    padding: ${({ theme }) => theme.spacing.md};
`;

const PanelBody = styled.div`
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 0 ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.md};
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
`;

const SectionLabel = styled.span`
    font-family: ${({ theme }) => theme.typography.fontFamily.mono};
    color: ${({ theme }) => theme.colors.neutralDark.highlight};
    font-size: ${({ theme }) => theme.typography.fontSize.caption};
`;

const ParticipantList = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xxs};
    margin-top: ${({ theme }) => theme.spacing.xs};
`;

const ParticipantRow = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
    padding: ${({ theme }) => theme.spacing.xs};
    border-radius: ${({ theme }) => theme.radii.md};
    background-color: ${({ theme }) => theme.colors.neutralDark[400]};
`;

const ParticipantName = styled.span`
    flex: 1;
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    font-weight: 600;
    font-size: ${({ theme }) => theme.typography.fontSize.body};
    color: ${({ theme }) => theme.colors.text.onDark};
`;

const YouTag = styled.span`
    font-family: ${({ theme }) => theme.typography.fontFamily.mono};
    font-size: ${({ theme }) => theme.typography.fontSize.caption};
    color: ${({ theme }) => theme.colors.neutralDark.highlight};
`;

const AddPeopleRow = styled.button`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
    width: 100%;
    padding: ${({ theme }) => theme.spacing.xs};
    margin-top: ${({ theme }) => theme.spacing.xs};
    border: 1.5px dashed ${({ theme }) => theme.colors.neutralDark[100]};
    border-radius: ${({ theme }) => theme.radii.md};
    background: none;
    color: ${({ theme }) => theme.colors.neutralDark.highlight};
    cursor: pointer;
    transition: background-color ${({ theme }) => theme.transitions.fast} ease-in-out,
        color ${({ theme }) => theme.transitions.fast} ease-in-out;

    &:hover,
    &:focus-visible {
        background-color: ${({ theme }) => theme.colors.neutralDark[100]};
        color: ${({ theme }) => theme.colors.text.onDark};
    }
`;

const LeaveRow = styled.button`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
    width: 100%;
    margin-top: auto;
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.xs};
    border: 1px solid color-mix(in srgb, ${({ theme }) => theme.colors.accent.recRed} 40%, transparent);
    border-radius: ${({ theme }) => theme.radii.md};
    background-color: color-mix(in srgb, ${({ theme }) => theme.colors.accent.recRed} 12%, ${({ theme }) => theme.colors.neutralDark[400]});
    color: ${({ theme }) => theme.colors.accent.recRed};
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    font-weight: 700;
    font-size: ${({ theme }) => theme.typography.fontSize.body};
    cursor: pointer;
`;

// `participants` is the other-people list fetchChats already resolves
// names for (see lib/chats.js) — self ("You") is added here since it's
// never part of that list.
export const ChatInfoPanel = ({ participants, onBack, onOpenAddPeople, onRequestLeave }) => (
    <>
        <PanelHeader>
            <IconButton type="button" aria-label="Back to conversation" onClick={onBack}>←</IconButton>
            <Heading variant="panel">Chat info</Heading>
        </PanelHeader>
        <PanelBody>
            <div>
                <SectionLabel>{participants.length + 1} in this chat</SectionLabel>
                <ParticipantList>
                    {participants.map((p) => (
                        <ParticipantRow key={p.uid}>
                            <Avatar name={p.name} />
                            <ParticipantName>{p.name}</ParticipantName>
                        </ParticipantRow>
                    ))}
                    <ParticipantRow>
                        <Avatar name="You" />
                        <ParticipantName>You</ParticipantName>
                        <YouTag>that's you</YouTag>
                    </ParticipantRow>
                </ParticipantList>
                <AddPeopleRow type="button" onClick={onOpenAddPeople}>
                    ＋ Add people
                </AddPeopleRow>
            </div>

            <LeaveRow type="button" onClick={onRequestLeave}>
                <LeaveIcon />
                Leave chat
            </LeaveRow>
        </PanelBody>
    </>
);

export default ChatInfoPanel;
