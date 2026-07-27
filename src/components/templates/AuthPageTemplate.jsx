import styled from 'styled-components';
import { Heading } from '../atoms/Heading/Heading';

const Page = styled.div`
    height: auto;
    min-height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

// Shared page skeleton for the login/register/landing pages — replaces the
// <Page>[<PageHeader>]<Form/></Page> composition previously duplicated inline
// in each of those page files.
const AuthPageTemplate = ({ heading, children }) => (
    <Page>
        {heading && <Heading variant="page">{heading}</Heading>}
        {children}
    </Page>
);

export default AuthPageTemplate;
