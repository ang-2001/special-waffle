import styled from 'styled-components';
import { LabeledInput } from '../../molecules/LabeledInput/LabeledInput';
import { Button } from '../../atoms/Button/Button';
import { PageLink } from '../../atoms/PageLink/PageLink';

const FormCard = styled.form`
    width: 800px;
    background-color: ${({ theme }) => theme.colors.background.surface};
    padding: ${({ theme }) => theme.spacing.formPaddingY} ${({ theme }) => theme.spacing.xl};
    border-radius: ${({ theme }) => theme.radii.sm};
`;

const LoginForm = () => {
    const handleSubmit = (event) => {
        event.preventDefault();
    };

    return (
        <FormCard onSubmit={handleSubmit}>
            <LabeledInput id="email" label="Email" type="email" />
            <LabeledInput id="password" label="Password" type="password" />
            <Button>Login</Button>
            <div>
                <span>Don't have an account? </span>
                <PageLink to="../register">
                    <span>
                        Register
                    </span>
                </PageLink>
            </div>
        </FormCard>
    )
}

export default LoginForm
