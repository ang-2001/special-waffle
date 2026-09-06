import styled from 'styled-components';
import { FieldError } from '../../atoms/FieldError/FieldError';

// Generic modal: dimmed backdrop, centered card, cancel/confirm. The
// `destructive` prop makes the confirm button red instead of gold —
// otherwise action-agnostic, reusable beyond "leave a chat".
const Backdrop = styled.div`
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: ${({ theme }) => theme.spacing.md};
    z-index: 100;
`;

const Card = styled.div`
    background-color: ${({ theme }) => theme.colors.background.surface};
    border: 2px solid ${({ theme }) => theme.colors.neutralDark[100]};
    border-radius: ${({ theme }) => theme.radii.md};
    padding: ${({ theme }) => theme.spacing.lg};
    max-width: 320px;
    width: 100%;
    box-shadow: 0 12px 30px -8px rgba(0, 0, 0, 0.55);
`;

const Title = styled.h2`
    margin: 0 0 ${({ theme }) => theme.spacing.xs};
    font-family: ${({ theme }) => theme.typography.fontFamily.display};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.text.onDark};
`;

const Body = styled.p`
    margin: 0 0 ${({ theme }) => theme.spacing.md};
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    font-size: ${({ theme }) => theme.typography.fontSize.caption};
    color: ${({ theme }) => theme.colors.neutralDark.highlight};
`;

const Actions = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.xs};
`;

const ActionButton = styled.button`
    flex: 1;
    padding: ${({ theme }) => theme.spacing.xs} 0;
    border-radius: ${({ theme }) => theme.radii.sm};
    text-align: center;
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    font-weight: 700;
    font-size: ${({ theme }) => theme.typography.fontSize.caption};
    cursor: pointer;
    border: 3px solid ${({ theme }) => theme.colors.neutralDark[500]};
    background: linear-gradient(145deg, ${({ theme }) => theme.colors.neutralDark[100]}, ${({ theme }) => theme.colors.neutralDark[400]});
    color: ${({ theme }) => theme.colors.text.onDark};

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    ${({ $destructive, theme }) => $destructive && `
        background: linear-gradient(145deg, ${theme.colors.accent.recRed}, #8f1119);
        border-color: #6e0d13;
        color: ${theme.colors.text.inverse};
    `}
`;

// Uncontrolled beyond `open` — a parent owns that state. onCancel also
// fires on a backdrop click and Escape.
export const ConfirmDialog = ({
    open,
    title,
    body,
    error,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    destructive = false,
    busy = false,
    onConfirm,
    onCancel,
}) => {
    if (!open) return null;

    return (
        <Backdrop
            onClick={(e) => {
                if (e.target === e.currentTarget) onCancel();
            }}
            onKeyDown={(e) => {
                if (e.key === 'Escape') onCancel();
            }}
        >
            <Card role="alertdialog" aria-modal="true" aria-label={title}>
                <Title>{title}</Title>
                <Body>{body}</Body>
                {error && <FieldError>{error}</FieldError>}
                <Actions>
                    <ActionButton type="button" onClick={onCancel} disabled={busy}>
                        {cancelLabel}
                    </ActionButton>
                    <ActionButton type="button" $destructive={destructive} onClick={onConfirm} disabled={busy}>
                        {confirmLabel}
                    </ActionButton>
                </Actions>
            </Card>
        </Backdrop>
    );
};

export default ConfirmDialog;
