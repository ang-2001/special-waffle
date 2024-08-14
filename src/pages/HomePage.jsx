import React from 'react'
import { HomePageContainer } from '../utils/styles/index.styled'
import Sidebar from '../components/messages/Sidebar'
import Messages from '../components/messages/MessageSection'

// where the main app will operate
const HomePage = () => {
  return (
    <HomePageContainer>
      <Sidebar />
      <Messages />
    </HomePageContainer>
    // sidebar
    // messages
    // chatbar
    // navbar
  )
}

export default HomePage