import React from 'react'
import styles from './index.module.css'

const Search = () => {
    return (
        <>
            <input type="text" className={styles.searchField} placeholder='Search' />
        </>
    )
}

export default Search