import { useState } from 'react';
import styled from 'styled-components';
import { IconButton } from '../../atoms/IconButton/IconButton';
import { CircularButton } from '../../atoms/CircularButton/CircularButton';
import { InputContainer } from '../../atoms/InputContainer/InputContainer';
import { Input } from '../../atoms/Input/Input';
import { FieldError } from '../../atoms/FieldError/FieldError';
import { Heading } from '../../atoms/Heading/Heading';

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
    gap: ${({ theme }) => theme.spacing.sm};
`;

const PanelHint = styled.p`
    font-family: ${({ theme }) => theme.typography.fontFamily.mono};
    color: ${({ theme }) => theme.colors.readout.text};
    font-size: 13px;
    margin: 0;
`;

const SendRow = styled.form`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
`;

const InlineInputContainer = styled(InputContainer)`
    flex: 1;
    margin-bottom: 0;
`;

// Strips Input's default underline + vertical margin, same as SearchField's
// SearchInput — both are pill-style inputs sitting directly in the sidebar,
// not the labeled, underlined fields Login/Register use.
const PanelInput = styled(Input)`
    border-bottom: none;
    margin: 0;
`;

const Confirmation = styled.p`
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    color: ${({ theme }) => theme.colors.text.onDark};
    font-size: 13px;
    margin: 0;
`;

// No backend exists to actually deliver a request, so this only validates
// and shows a local confirmation — it doesn't add anything to Requests
// (that's the recipient's inbox) or to the friend list (accepting is the
// other side's move, not the sender's).
export const AddFriendPanel = ({ onBack }) => {
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [sentTo, setSentTo] = useState(null);

    const handleChange = (event) => {
        setUsername(event.target.value);
        setSentTo(null);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const trimmed = username.trim();
        if (!trimmed) {
            setError('Enter a username first.');
            return;
        }
        setError('');
        setSentTo(trimmed);
        setUsername('');
    };

    return (
        <>
            <PanelHeader>
                <IconButton type="button" aria-label="Back to chats" onClick={onBack}>←</IconButton>
                <Heading variant="panel">Add friend</Heading>
            </PanelHeader>
            <PanelBody>
                <PanelHint>▶ send a request by username</PanelHint>
                <SendRow onSubmit={handleSubmit} noValidate>
                    <InlineInputContainer>
                        <PanelInput placeholder="Enter a username" value={username} onChange={handleChange} />
                    </InlineInputContainer>
                    <CircularButton type="submit" aria-label="Send request">⏵</CircularButton>
                </SendRow>
                {error && <FieldError>{error}</FieldError>}
                {sentTo && <Confirmation>Request sent to {sentTo}.</Confirmation>}
            </PanelBody>
        </>
    );
};

export default AddFriendPanel;
