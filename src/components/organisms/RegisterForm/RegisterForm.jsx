import { useState } from 'react';
import styled from 'styled-components';
import { LabeledInput } from '../../molecules/LabeledInput/LabeledInput';
import { NameFieldRow } from '../../molecules/NameFieldRow/NameFieldRow';
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

// component for regsiter form(page wraps arond this component)
const RegisterForm = () => {
    const [ejecting, ejectTo] = useEjectNavigate();
    const [errors, setErrors] = useState({});

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.target);
        const email = data.get('email').trim();
        const firstName = data.get('firstName').trim();
        const lastName = data.get('lastName').trim();
        const password = data.get('password');
        const confirmPassword = data.get('confirmPassword');

        const nextErrors = {};
        if (!email) nextErrors.email = 'Email is required.';
        else if (!email.includes('@')) nextErrors.email = 'Enter a valid email address.';
        if (!firstName) nextErrors.firstName = 'First name is required.';
        if (!lastName) nextErrors.lastName = 'Last name is required.';
        if (!password) nextErrors.password = 'Password is required.';
        else if (password.length < 8) nextErrors.password = 'Password must be at least 8 characters.';
        if (!confirmPassword) nextErrors.confirmPassword = 'Please confirm your password.';
        else if (confirmPassword !== password) nextErrors.confirmPassword = "Passwords don't match.";

        setErrors(nextErrors);
        if (Object.keys(nextErrors).length === 0) {
            ejectTo('/home');
        }
    };

    return (
        <>
            {/* form for creating an account */}
            <FormCard onSubmit={handleSubmit} noValidate $ejecting={ejecting}>
                <LabeledInput id="email" name="email" label="Email" type="email" />
                {errors.email && <FieldError>{errors.email}</FieldError>}
                <NameFieldRow
                    firstNameProps={{ name: 'firstName' }}
                    lastNameProps={{ name: 'lastName' }}
                />
                {(errors.firstName || errors.lastName) && (
                    <FieldError>{errors.firstName || errors.lastName}</FieldError>
                )}
                <LabeledInput id="password" name="password" label="Password" type="password" />
                {errors.password && <FieldError>{errors.password}</FieldError>}
                <LabeledInput id="confirmPassword" name="confirmPassword" label="Confirm Password" type="password" />
                {errors.confirmPassword && <FieldError>{errors.confirmPassword}</FieldError>}
                <StreakButton>⏵ Create Account</StreakButton>
                <div>
                    <span>Already have an account? </span>
                    <PageLink to="../login">
                        <span>
                            Login
                        </span>
                    </PageLink>
                </div>
            </FormCard>

            {/* value attribute = inital value of the button output */}
        </>
    )
}

export default RegisterForm
