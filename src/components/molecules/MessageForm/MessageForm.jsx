import { useState } from 'react'
import styled from 'styled-components';
import { CircularButton } from '../../atoms/CircularButton/CircularButton';

const ComposeBar = styled.form`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    border-top: 1px solid ${({ theme }) => theme.colors.neutralDark[400]};
`;

const ComposeInput = styled.input`
    flex: 1;
    height: 40px;
    box-sizing: border-box;
    background-color: ${({ theme }) => theme.colors.background.surfaceAlt};
    border: none;
    outline: none;
    border-radius: ${({ theme }) => theme.radii.md};
    padding: 0 ${({ theme }) => theme.spacing.md};
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    font-size: 14px;
    color: ${({ theme }) => theme.colors.text.onSurfaceAlt};
`;

export const MessageForm = ({ onSend }) => {
    const [text, setText] = useState('')

    const handleSubmit = (event) => {
        event.preventDefault();
        const trimmed = text.trim();
        if (!trimmed) return;
        onSend?.(trimmed);
        setText('');
    };

    return (
        <ComposeBar onSubmit={handleSubmit}>
            <ComposeInput
                type="text"
                value={text}
                placeholder="Message"
                onChange={(e) => setText(e.target.value)}
            />
            <CircularButton type="submit" aria-label="Send">⏵</CircularButton>
        </ComposeBar>
    )
}

export default MessageForm
