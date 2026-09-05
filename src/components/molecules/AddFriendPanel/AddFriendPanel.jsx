import { useState } from 'react';
import styled from 'styled-components';
import { IconButton } from '../../atoms/IconButton/IconButton';
import { CircularButton } from '../../atoms/CircularButton/CircularButton';
import { InputContainer } from '../../atoms/InputContainer/InputContainer';
import { Input } from '../../atoms/Input/Input';
import { FieldError } from '../../atoms/FieldError/FieldError';
import { Heading } from '../../atoms/Heading/Heading';
import { findProfileByDisplayName, getFriendshipStatus, sendFriendRequest } from '../../../lib/friends';
import { useAuth } from '../../../hooks/useAuth';

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
    font-size: ${({ theme }) => theme.typography.fontSize.caption};
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

// Strips Input's default underline/margin — a pill input, not a labeled auth field.
const PanelInput = styled(Input)`
    border-bottom: none;
    margin: 0;
    font-size: ${({ theme }) => theme.typography.fontSize.body};
`;

const Confirmation = styled.p`
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    color: ${({ theme }) => theme.colors.text.onDark};
    font-size: ${({ theme }) => theme.typography.fontSize.caption};
    margin: 0;
`;

// Looks the typed name up, then inserts a pending request. A (uidA, uidB)
// PK conflict means a row already exists — getFriendshipStatus turns that
// into a specific message instead of a raw Postgres error.
export const AddFriendPanel = ({ onBack }) => {
    const { user } = useAuth();
    const [displayName, setDisplayName] = useState('');
    const [error, setError] = useState('');
    const [sentTo, setSentTo] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (event) => {
        setDisplayName(event.target.value);
        setSentTo(null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (submitting) return;

        const trimmed = displayName.trim();
        if (!trimmed) {
            setError('Enter a display name first.');
            return;
        }

        setError('');
        setSentTo(null);
        setSubmitting(true);

        const { data: target, error: lookupError } = await findProfileByDisplayName(trimmed);
        if (lookupError) {
            setSubmitting(false);
            setError('Something went wrong looking that up — try again.');
            return;
        }
        if (!target) {
            setSubmitting(false);
            setError(`No one goes by "${trimmed}".`);
            return;
        }
        if (target.uid === user.id) {
            setSubmitting(false);
            setError("That's you.");
            return;
        }

        const { error: sendError } = await sendFriendRequest(user.id, target.uid);
        setSubmitting(false);

        if (sendError) {
            if (sendError.code === '23505') {
                const { data: existing } = await getFriendshipStatus(user.id, target.uid);
                if (existing?.status === 'accepted') {
                    setError(`You're already friends with ${target.display_name}.`);
                } else if (existing?.status === 'pending') {
                    setError(
                        existing.requested_by === user.id
                            ? `You already sent ${target.display_name} a request.`
                            : `${target.display_name} already sent you a request — check Requests.`
                    );
                } else {
                    setError(`Can't send ${target.display_name} a request right now.`);
                }
            } else {
                setError(sendError.message);
            }
            return;
        }

        setDisplayName('');
        setSentTo(target.display_name);
    };

    return (
        <>
            <PanelHeader>
                <IconButton type="button" aria-label="Back to chats" onClick={onBack}>←</IconButton>
                <Heading variant="panel">Add friend</Heading>
            </PanelHeader>
            <PanelBody>
                <PanelHint>▶ send a request by display name</PanelHint>
                <SendRow onSubmit={handleSubmit} noValidate>
                    <InlineInputContainer>
                        <PanelInput placeholder="Enter a display name" value={displayName} onChange={handleChange} />
                    </InlineInputContainer>
                    <CircularButton type="submit" aria-label="Send request" disabled={submitting}>⏵</CircularButton>
                </SendRow>
                {error && <FieldError>{error}</FieldError>}
                {sentTo && <Confirmation>Request sent to {sentTo}.</Confirmation>}
            </PanelBody>
        </>
    );
};

export default AddFriendPanel;
