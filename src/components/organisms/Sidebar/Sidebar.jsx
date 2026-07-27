// side bar should consist of: friends list, settings, user
import React from 'react'
import styled from 'styled-components';
import { Heading } from '../../atoms/Heading/Heading';

const SideBarContainer = styled.div`
    background-color: ${({ theme }) => theme.colors.background.surface};
    color: ${({ theme }) => theme.colors.text.default};
    height: 100%;
    width: 20em;
`;

const Sidebar = () => {
  return (
    <SideBarContainer>
      <div>
        <Heading variant="section">Friends</Heading>
      </div>
      <div>

      </div>
      <div>

      </div>

    </SideBarContainer>
  )
}

export default Sidebar
