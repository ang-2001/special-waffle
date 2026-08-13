import styled from 'styled-components';
import { LabeledInput } from '../LabeledInput/LabeledInput';

const Row = styled.section`
    width: 100%;
    display: flex;
    justify-content: space-between;
    gap: 0 ${({ theme }) => theme.spacing.xs};

    @media (max-width: 480px) {
        flex-direction: column;
        gap: ${({ theme }) => theme.spacing.xs} 0;
    }
`;

export const NameFieldRow = ({ firstNameProps, lastNameProps }) => (
    <Row>
        <LabeledInput id="firstName" label="First Name" {...firstNameProps} />
        <LabeledInput id="lastName" label="Last Name" {...lastNameProps} />
    </Row>
);

export default NameFieldRow;
