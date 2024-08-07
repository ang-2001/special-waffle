// side bar should consist of: friends list, settings, user
import React from 'react'
import styles from './index.module.css'

const Messages = () => {
    return (
        // container for list of messages and message form
        <div className={styles.messageContainer}>
            {/* header/nav for who you're chatting with */}
            {/* section where messages will be displayed */}
            <div className={styles.messageList} >
                hello
                {/* message */}
            </div>

            {/* form where users input and submit messages */}
            <input className={styles.messageInput} />
        </div>
    )
}

export default Messages