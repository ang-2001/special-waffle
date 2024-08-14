import React from 'react'
import styles from './index.module.css'
const ChatList = () => {
    return (
        <ul className={styles.chatList}>
            <li className={styles.chatListItem}>
                <div className={styles.chatContainer}>
                    <img className={styles.profileImage} src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/e47f43c3-d1b5-4cb6-be78-0170bca3daef/dd5lmp1-1e89ca90-4f21-4f47-9005-8d36b26ce913.jpg/v1/fill/w_800,h_800,q_75,strp/fat_toad_by_phiphiauthon_dd5lmp1-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9ODAwIiwicGF0aCI6IlwvZlwvZTQ3ZjQzYzMtZDFiNS00Y2I2LWJlNzgtMDE3MGJjYTNkYWVmXC9kZDVsbXAxLTFlODljYTkwLTRmMjEtNGY0Ny05MDA1LThkMzZiMjZjZTkxMy5qcGciLCJ3aWR0aCI6Ijw9ODAwIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.xbgv59kxb9WxQOXDDcA6zeVMhfXOJfvAdM6a3VCFENQ" alt="" />
                    <div>
                        <span>
                            Big Beeg
                        </span>
                    </div>
                </div>
            </li>
            <li>
                <div className={styles.chatContainer}>
                    <img className={styles.profileImage} src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/e47f43c3-d1b5-4cb6-be78-0170bca3daef/dd5lmp1-1e89ca90-4f21-4f47-9005-8d36b26ce913.jpg/v1/fill/w_800,h_800,q_75,strp/fat_toad_by_phiphiauthon_dd5lmp1-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9ODAwIiwicGF0aCI6IlwvZlwvZTQ3ZjQzYzMtZDFiNS00Y2I2LWJlNzgtMDE3MGJjYTNkYWVmXC9kZDVsbXAxLTFlODljYTkwLTRmMjEtNGY0Ny05MDA1LThkMzZiMjZjZTkxMy5qcGciLCJ3aWR0aCI6Ijw9ODAwIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.xbgv59kxb9WxQOXDDcA6zeVMhfXOJfvAdM6a3VCFENQ" alt="" />
                    <div>
                        <span>
                            Big Beeg
                        </span>
                    </div>
                </div>
            </li>
        </ul>
    )
}

export default ChatList