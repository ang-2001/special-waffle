import React from 'react'
import styles from './index.module.css'

const MessageList = () => {
  return (
    <div className={styles.messageListContainer}>
        {/* header/nav for who you're chatting with */}
        {/* section where messages will be displayed */}
        <div className={styles.messageList}>
            <div>hello</div>
            <div>hello</div>
            <div>hello</div>
            <div>hello</div>
            <div>hello</div>
            <div>hello</div>
            <div>hello</div>

        </div>

        {/* form where users input and submit messages */}
        <input className={styles.messageField} />
    </div>
  )
}

export default MessageList