import styled from 'styled-components';

// Renders whatever toasts HomeTemplate is holding — plain local state, one producer.
const Stack = styled.div`
    position: fixed;
    right: ${({ theme }) => theme.spacing.md};
    bottom: ${({ theme }) => theme.spacing.md};
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xs};
    z-index: 200;

    @media (max-width: 768px) {
        left: ${({ theme }) => theme.spacing.md};
        right: ${({ theme }) => theme.spacing.md};
    }
`;

const Card = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
    background-color: ${({ theme }) => theme.colors.background.surface};
    border: 1px solid ${({ theme }) => theme.colors.neutralDark[100]};
    border-left: 4px solid ${({ theme }) => theme.colors.accent.gold};
    border-radius: ${({ theme }) => theme.radii.md};
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    box-shadow: 0 10px 24px -8px rgba(0, 0, 0, 0.6);
    max-width: 320px;
`;

const IconCircle = styled.span`
    width: 30px;
    height: 30px;
    flex: none;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    background-color: ${({ theme }) => theme.colors.neutralDark[400]};
`;

const Text = styled.div`
    flex: 1;
    min-width: 0;
`;

const Title = styled.div`
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    font-weight: 700;
    font-size: ${({ theme }) => theme.typography.fontSize.caption};
    color: ${({ theme }) => theme.colors.text.onDark};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const Sub = styled.div`
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    font-size: 11px;
    color: ${({ theme }) => theme.colors.neutralDark.highlight};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const ActionLink = styled.button`
    flex: none;
    font-family: ${({ theme }) => theme.typography.fontFamily.mono};
    color: ${({ theme }) => theme.colors.readout.text};
    font-size: ${({ theme }) => theme.typography.fontSize.body};
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
`;

// `toasts`: [{ id, title, sub, actionLabel, onAction }]. Dismissal (timed
// or via the action) is the caller's job — see HomeTemplate's own timeout.
export const ToastStack = ({ toasts, onDismiss }) => {
    if (toasts.length === 0) return null;
    return (
        <Stack>
            {toasts.map((toast) => (
                <Card key={toast.id} role="status">
                    <IconCircle aria-hidden="true">👥</IconCircle>
                    <Text>
                        <Title>{toast.title}</Title>
                        {toast.sub && <Sub>{toast.sub}</Sub>}
                    </Text>
                    {toast.actionLabel && (
                        <ActionLink
                            type="button"
                            onClick={() => {
                                toast.onAction?.();
                                onDismiss(toast.id);
                            }}
                        >
                            {toast.actionLabel}
                        </ActionLink>
                    )}
                </Card>
            ))}
        </Stack>
    );
};

export default ToastStack;
