import { useRef, useState } from 'react';
import styled from 'styled-components';
import { Avatar } from '../../molecules/Avatar/Avatar';
import { Readout } from '../../atoms/Readout/Readout';
import { RecDot } from '../../atoms/RecDot/RecDot';
import { Message } from '../../molecules/Message/Message';
import { MessageForm } from '../../molecules/MessageForm/MessageForm';
import { TapeLabel } from '../../atoms/TapeLabel/TapeLabel';
import { ButtonDark } from '../../atoms/ButtonDark/ButtonDark';

const Section = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
    background-color: ${({ theme }) => theme.colors.background.page};
`;

const ConversationHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    border-bottom: 1px solid ${({ theme }) => theme.colors.neutralDark[400]};
`;

const ConversationWho = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
`;

const ConversationName = styled.div`
    font-family: ${({ theme }) => theme.typography.fontFamily.displayBold};
    color: ${({ theme }) => theme.colors.text.onDark};
    font-size: 17px;
`;

const ConversationStatus = styled.div`
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    font-size: 12px;
    color: ${({ theme }) => theme.colors.readout.text};
`;

const ConversationRec = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
`;

const MessageList = styled.div`
    flex: 1;
    overflow-y: auto;
    padding: ${({ theme }) => theme.spacing.md};
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.sm};
    scrollbar-width: thin;
    scrollbar-color: ${({ theme }) => theme.colors.accent.beige} ${({ theme }) => theme.colors.background.page};
`;

// Only meaningful once the sidebar and message pane can't both be on screen
// — hidden on desktop, where there's nothing to "go back" from.
const BackButton = styled(ButtonDark)`
    display: none;
    width: 32px;
    height: 32px;
    padding: 0;
    margin: 0;
    border-width: 3px;
    border-radius: ${({ theme }) => theme.radii.sm};
    align-items: center;
    justify-content: center;

    @media (max-width: 768px) {
        display: inline-flex;
    }
`;

const EmptyState = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: ${({ theme }) => theme.spacing.md};
`;

const EmptyTapeLabel = styled(TapeLabel)`
    font-size: 20px;
`;

const EmptyStateSub = styled.span`
    color: ${({ theme }) => theme.colors.neutralDark.highlight};
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    font-size: 13px;
`;

// Placeholder conversation seeds — no backend/data layer exists yet
// anywhere in the app (same reasoning as HomeTemplate's placeholder friend
// list). Each friend starts with its own thread; sent messages are kept
// in local component state, so they're lost on refresh/friend-switch-away.
// Friends with no seed thread here (e.g. a newly accepted request) just
// fall back to an empty one via `?? []` below.
const CONTACT_STATUS = 'online';
const INITIAL_MESSAGES = {
    'Big Beeg': [
        { id: 1, text: 'yo did you finish the tape splitter thing', time: '2:41 PM', own: false },
        { id: 2, text: "just fixed the FieldError placement, artifact's up", time: '2:43 PM', own: true },
        { id: 3, text: 'rewind that last part lol', time: '2:43 PM', own: false },
    ],
    "Study Grp '99": [
        { id: 4, text: 'meeting moved to 6', time: '11:02 AM', own: false },
    ],
    'VHS Club': [
        { id: 5, text: 'found a mint copy of Tron', time: '9:47 AM', own: false },
    ],
    Mom: [
        { id: 6, text: 'call me when you land', time: '8:15 AM', own: false },
    ],
};

const formatNow = () => new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

const MessageSection = ({ friend, onBack }) => {
    const [messagesByFriend, setMessagesByFriend] = useState(INITIAL_MESSAGES);
    const nextId = useRef(7);

    const handleSend = (text) => {
        const message = { id: nextId.current++, text, time: formatNow(), own: true };
        setMessagesByFriend((prev) => ({
            ...prev,
            [friend]: [...(prev[friend] ?? []), message],
        }));
    };

    if (!friend) {
        return (
            <Section>
                <EmptyState>
                    <EmptyTapeLabel>▶ select a conversation to start playing</EmptyTapeLabel>
                    <EmptyStateSub>or press ＋ to add a friend</EmptyStateSub>
                </EmptyState>
            </Section>
        );
    }

    return (
        <Section>
            <ConversationHeader>
                <ConversationWho>
                    <BackButton type="button" aria-label="Back to chat list" onClick={onBack}>
                        ←
                    </BackButton>
                    <Avatar name={friend} />
                    <div>
                        <ConversationName>{friend}</ConversationName>
                        <ConversationStatus>{CONTACT_STATUS}</ConversationStatus>
                    </div>
                </ConversationWho>
                <ConversationRec>
                    <RecDot />
                    <Readout>14:32</Readout>
                </ConversationRec>
            </ConversationHeader>
            <MessageList>
                {(messagesByFriend[friend] ?? []).map((message) => (
                    <Message
                        key={message.id}
                        name={friend}
                        text={message.text}
                        time={message.time}
                        own={message.own}
                    />
                ))}
            </MessageList>
            <MessageForm onSend={handleSend} />
        </Section>
    );
};

export default MessageSection;
