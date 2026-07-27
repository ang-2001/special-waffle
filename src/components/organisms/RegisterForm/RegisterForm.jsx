import styled from 'styled-components';
import { LabeledInput } from '../../molecules/LabeledInput/LabeledInput';
import { NameFieldRow } from '../../molecules/NameFieldRow/NameFieldRow';
import { ButtonDark } from '../../atoms/ButtonDark/ButtonDark';
import { PageLink } from '../../atoms/PageLink/PageLink';

const FormCard = styled.form`
    width: 800px;
    background-color: ${({ theme }) => theme.colors.background.surface};
    padding: ${({ theme }) => theme.spacing.formPaddingY} ${({ theme }) => theme.spacing.xl};
    border-radius: ${({ theme }) => theme.radii.sm};
`;

// component for regsiter form(page wraps arond this component)
const RegisterForm = () => {

    const handleSubmit = (event) => {
        event.preventDefault();
    };

    return (
        <>
            {/* form for creating an account */}
            <FormCard onSubmit={handleSubmit}>
                <LabeledInput id="email" label="Email" type="email" />
                <NameFieldRow />
                <LabeledInput id="password" label="Password" type="password" />
                <LabeledInput id="confirmPassword" label="Confirm Password" type="password" />
                {/* <Button>Create My Account</Button> */}
                <ButtonDark>⏵ Create Account</ButtonDark>
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
