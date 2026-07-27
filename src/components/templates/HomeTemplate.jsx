import styled from 'styled-components';
import Sidebar from '../organisms/Sidebar/Sidebar';

const HomePageContainer = styled.div`
    height: 100%;
`;

// sidebar
// messages
// chatbar
// navbar
const HomeTemplate = () => (
    <HomePageContainer>
        <Sidebar />
    </HomePageContainer>
);

export default HomeTemplate;
