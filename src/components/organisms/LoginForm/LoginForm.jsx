import { useState } from 'react';
import styled from 'styled-components';
import { LabeledInput } from '../../molecules/LabeledInput/LabeledInput';
import { StreakButton } from '../../atoms/StreakButton/StreakButton';
import { PageLink } from '../../atoms/PageLink/PageLink';
import { FieldError } from '../../atoms/FieldError/FieldError';
import { tapeEjectMixin } from '../../atoms/TapeEject/TapeEject';
import { useEjectNavigate } from '../../../hooks/useEjectNavigate';

const FormCard = styled.form`
    width: 800px;
    max-width: 90%;
    box-sizing: border-box;
    background-color: ${({ theme }) => theme.colors.background.surface};
    padding: ${({ theme }) => theme.spacing.formPaddingY} ${({ theme }) => theme.spacing.xl};
    border-radius: ${({ theme }) => theme.radii.sm};
    ${tapeEjectMixin}
`;

const LoginForm = () => {
    const [ejecting, ejectTo] = useEjectNavigate();
    const [errors, setErrors] = useState({});

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.target);
        const email = data.get('email').trim();
        const password = data.get('password');

        const nextErrors = {};
        if (!email) nextErrors.email = 'Email is required.';
        else if (!email.includes('@')) nextErrors.email = 'Enter a valid email address.';
        if (!password) nextErrors.password = 'Password is required.';

        setErrors(nextErrors);
        if (Object.keys(nextErrors).length === 0) {
            ejectTo('/home');
        }
    };

    return (
        <FormCard onSubmit={handleSubmit} noValidate $ejecting={ejecting}>
            <LabeledInput id="email" name="email" label="Email" type="email" />
            {errors.email && <FieldError>{errors.email}</FieldError>}
            <LabeledInput id="password" name="password" label="Password" type="password" />
            {errors.password && <FieldError>{errors.password}</FieldError>}
            <StreakButton>⏵ Login</StreakButton>
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
