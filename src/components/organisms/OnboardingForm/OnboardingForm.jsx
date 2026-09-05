import { useState } from 'react';
import styled from 'styled-components';
import { LabeledInput } from '../../molecules/LabeledInput/LabeledInput';
import { StreakButton } from '../../atoms/StreakButton/StreakButton';
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

const SkipLink = styled.button`
    background: none;
    border: none;
    padding: 0;
    color: inherit;
    text-decoration: underline;
    cursor: pointer;
    font: inherit;

    &:disabled {
        cursor: default;
        opacity: 0.6;
    }
`;

// Both actions flip onboarding_completed permanently — "Skip" is "Save" with no display_name change.
const OnboardingForm = () => {
    const [ejecting, ejectTo] = useEjectNavigate();
    const { profile, updateProfile } = useAuth();
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const finishOnboarding = async (updates) => {
        if (submitting) return;
        setSubmitting(true);
        const { error } = await updateProfile(updates);
        setSubmitting(false);

        if (error) {
            // 23505 = Postgres unique_violation (display_name).
            if (error.code === '23505') {
                setErrors({ displayName: 'That display name is taken — try another.' });
            } else {
                setErrors({ form: error.message });
            }
            return;
        }
        ejectTo('/home');
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.target);
        const displayName = data.get('displayName').trim();

        const nextErrors = {};
        if (!displayName) nextErrors.displayName = 'Enter a display name, or skip for now.';
        else if (displayName.length > 40) nextErrors.displayName = 'Keep it under 40 characters.';

        setErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) return;

        finishOnboarding({ display_name: displayName, onboarding_completed: true });
    };

    const handleSkip = () => {
        setErrors({});
        finishOnboarding({ onboarding_completed: true });
    };

    return (
        <FormCard onSubmit={handleSubmit} noValidate $ejecting={ejecting}>
            <LabeledInput
                id="displayName"
                name="displayName"
                label="Display name"
                defaultValue={profile?.display_name ?? ''}
            />
            {errors.displayName && <FieldError>{errors.displayName}</FieldError>}
            {errors.form && <FieldError>{errors.form}</FieldError>}
            <StreakButton disabled={submitting}>⏵ {submitting ? 'Saving…' : 'Save'}</StreakButton>
            <div>
                <SkipLink type="button" onClick={handleSkip} disabled={submitting}>
                    Skip for now
                </SkipLink>
            </div>
        </FormCard>
    );
};

export default OnboardingForm;
