import { useState } from 'react';
import styled from 'styled-components';
import { LabeledInput } from '../../molecules/LabeledInput/LabeledInput';
import { NameFieldRow } from '../../molecules/NameFieldRow/NameFieldRow';
import { StreakButton } from '../../atoms/StreakButton/StreakButton';
import { PageLink } from '../../atoms/PageLink/PageLink';
import { FieldError } from '../../atoms/FieldError/FieldError';
import { tapeEjectMixin } from '../../atoms/TapeEject/TapeEject';
import { useEjectNavigate } from '../../../hooks/useEjectNavigate';
import { useAuth } from '../../../hooks/useAuth';

const FormCard = styled.form`
    width: 800px;
    max-width: 90%;
    box-sizing: border-box;
    background-color: ${({ theme }) => theme.colors.background.surface};
    padding: ${({ theme }) => theme.spacing.formPaddingY} ${({ theme }) => theme.spacing.xl};
    border-radius: ${({ theme }) => theme.radii.sm};
    ${tapeEjectMixin}
`;

const RegisterForm = () => {
    const [ejecting, ejectTo] = useEjectNavigate();
    const { signUp } = useAuth();
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (submitting) return;

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
        if (Object.keys(nextErrors).length > 0) return;

        setSubmitting(true);
        const { data: signUpData, error } = await signUp({
            email,
            password,
            options: {
                data: {
                    display_name: `${firstName} ${lastName}`,
                    first_name: firstName,
                    last_name: lastName,
                },
            },
        });
        setSubmitting(false);

        if (error) {
            setErrors({ form: error.message });
            return;
        }
        if (!signUpData.session) {
            // Email confirmation is on for this project — signUp succeeded
            // but there's no session yet, so there's nothing to eject into.
            setErrors({ form: 'Check your email to confirm your account, then log in.' });
            return;
        }

        ejectTo('/onboarding');
    };

    return (
        <>
            <FormCard onSubmit={handleSubmit} noValidate $ejecting={ejecting}>
                <LabeledInput id="email" name="email" label="Email" type="email" />
                {errors.email && <FieldError>{errors.email}</FieldError>}
                <NameFieldRow
                    firstNameProps={{ name: 'firstName' }}
                    lastNameProps={{ name: 'lastName' }}
                />
                {errors.firstName && <FieldError>{errors.firstName}</FieldError>}
                {errors.lastName && <FieldError>{errors.lastName}</FieldError>}
                <LabeledInput id="password" name="password" label="Password" type="password" />
                {errors.password && <FieldError>{errors.password}</FieldError>}
                <LabeledInput id="confirmPassword" name="confirmPassword" label="Confirm Password" type="password" />
                {errors.confirmPassword && <FieldError>{errors.confirmPassword}</FieldError>}
                {errors.form && <FieldError>{errors.form}</FieldError>}
                <StreakButton disabled={submitting}>⏵ {submitting ? 'Creating…' : 'Create Account'}</StreakButton>
                <div>
                    <span>Already have an account? </span>
                    <PageLink to="../login">
                        <span>
                            Login
                        </span>
                    </PageLink>
                </div>
            </FormCard>
        </>
    )
}

export default RegisterForm
