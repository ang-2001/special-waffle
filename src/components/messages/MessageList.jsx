import React from 'react'
import styles from './index.module.css'
import Message from './Message'

const MessageList = () => {
  return (
    <div className={styles.messageListContainer}>
      {/* header/nav for who you're chatting with */}
      {/* section where messages will be displayed */}
      <div className={styles.messageList}>
        <Message />
        <Message />
        <Message />
        <Message />
      </div>

      {/* form where users input and submit messages */}
      <input type='text' className={styles.messageField} placeholder='Message' />
    </div>
  )
}

export default MessageList