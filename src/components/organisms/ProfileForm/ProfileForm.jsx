import { useState } from 'react';
import styled from 'styled-components';
import { LabeledInput } from '../../molecules/LabeledInput/LabeledInput';
import { NameFieldRow } from '../../molecules/NameFieldRow/NameFieldRow';
import { StreakButton } from '../../atoms/StreakButton/StreakButton';
import { PageLink } from '../../atoms/PageLink/PageLink';
import { BackArrowIcon } from '../../atoms/BackArrowIcon/BackArrowIcon';
import { FieldError } from '../../atoms/FieldError/FieldError';
import { tapeEjectMixin } from '../../atoms/TapeEject/TapeEject';
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

// Reuses the readout token instead of inventing a new "success" color.
const SavedNote = styled.span`
    display: block;
    font-family: ${({ theme }) => theme.typography.fontFamily.mono};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    color: ${({ theme }) => theme.colors.readout.text};
    margin-top: ${({ theme }) => theme.spacing.xxs};
`;

// Local extension — RegisterForm/LoginForm's plain-text PageLinks don't need this layout.
const BackLink = styled(PageLink)`
    display: inline-flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xxs};
`;

// Reachable at /profile any time you're signed in — no gating flag.
const ProfileForm = () => {
    const { profile, updateProfile } = useAuth();
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (submitting) return;

        const data = new FormData(event.target);
        const firstName = data.get('firstName').trim();
        const lastName = data.get('lastName').trim();
        const displayName = data.get('displayName').trim();

        const nextErrors = {};
        if (!firstName) nextErrors.firstName = 'First name is required.';
        if (!lastName) nextErrors.lastName = 'Last name is required.';
        if (!displayName) nextErrors.displayName = 'Display name is required.';
        else if (displayName.length > 40) nextErrors.displayName = 'Keep it under 40 characters.';

        setSaved(false);
        setErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) return;

        setSubmitting(true);
        const { error } = await updateProfile({
            first_name: firstName,
            last_name: lastName,
            display_name: displayName,
        });
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
        setSaved(true);
    };

    return (
        <FormCard onSubmit={handleSubmit} noValidate>
            <NameFieldRow
                firstNameProps={{ name: 'firstName', defaultValue: profile?.first_name ?? '' }}
                lastNameProps={{ name: 'lastName', defaultValue: profile?.last_name ?? '' }}
            />
            {errors.firstName && <FieldError>{errors.firstName}</FieldError>}
            {errors.lastName && <FieldError>{errors.lastName}</FieldError>}
            <LabeledInput
                id="displayName"
                name="displayName"
                label="Display name"
                defaultValue={profile?.display_name ?? ''}
            />
            {errors.displayName && <FieldError>{errors.displayName}</FieldError>}
            {errors.form && <FieldError>{errors.form}</FieldError>}
            {saved && <SavedNote>Saved.</SavedNote>}
            <StreakButton disabled={submitting}>⏵ {submitting ? 'Saving…' : 'Save'}</StreakButton>
            <div>
                <BackLink to="/home">
                    <BackArrowIcon width="17px" height="17px" />
                    Back to Waffler
                </BackLink>
            </div>
        </FormCard>
    );
};

export default ProfileForm;
