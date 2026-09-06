import styled from 'styled-components';
import AuthPageTemplate from '../components/templates/AuthPageTemplate';
import { TapeLabel } from '../components/atoms/TapeLabel/TapeLabel';
import { PageLink } from '../components/atoms/PageLink/PageLink';

const NotFoundBody = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.md};
`;

const NotFoundPage = () => (
    <AuthPageTemplate heading="404">
        <NotFoundBody>
            <TapeLabel>▶ this tape isn't in the rack</TapeLabel>
            <PageLink to="/landing">Back to Waffler</PageLink>
        </NotFoundBody>
    </AuthPageTemplate>
);

export default NotFoundPage;
