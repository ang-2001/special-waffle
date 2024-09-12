import React from 'react'
import { MessagePageContainer } from '../utils/styles/index.styled'
import Sidebar from '../components/messages/Sidebar'
import Messages from '../components/messages/MessageSection'

// where the main app will operate
const MessagePage = () => {
  return (
    <MessagePageContainer>
      <Sidebar />
      <Messages />
    </MessagePageContainer>
    // sidebar
    // messages
    // chatbar
    // navbar
  )
}

export default MessagePage