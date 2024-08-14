// side bar should consist of: friends list, settings, user
import React from 'react'
import styles from './index.module.css'
import MessageList from './MessageList'

const Messages = () => {
    return (
        // container for list of messages and message form
        <div className={styles.messageSectionContainer}>
            <div className={styles.navBar}>
                Bigbeegus
            </div>
            <MessageList />
        </div>
        
    )
}

export default Messages