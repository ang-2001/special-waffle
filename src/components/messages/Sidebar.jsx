// side bar should consist of: friends list, settings, user
import React from 'react'
import styles from './index.module.css'
import { SectionHeader, SideBarContainer } from '../../utils/styles/index.styled'
import Search from './Search'

const Sidebar = () => {
  return (
    <SideBarContainer>
      <div className={styles.friendSection}>
        {/* friend list header section */}
        <div className={styles.friendHeader}>
          <SectionHeader>Waffler</SectionHeader>
          <div>
            <button>add</button>
            <button>requests</button>
          </div>
        </div>
      </div>

      {/* friend list + search (search and chats)*/}
      <Search />
      <div>

      </div>


      {/* user status profile and options (user nav)*/}
      <div className={styles.userSection}>
        test
      </div>

    </SideBarContainer>
  )
}

export default Sidebar