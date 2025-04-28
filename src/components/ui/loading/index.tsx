import React from 'react'
import styles from './loading.module.css'

const Loading = ({ className = '' }:{className?:string}) => {
  return (
    <div className={`${styles.spinner} ${className}`}>
      <svg width="100" height="100" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="37" className={`${styles.twirl} ${styles.l1}`}></circle>
        <circle cx="50" cy="50" r="30" className={`${styles.twirl} ${styles.l2}`}></circle>
        <circle cx="50" cy="50" r="20" className={`${styles.twirl} ${styles.l3}`}></circle>
        <circle cx="50" cy="50" r="12" className={`${styles.pulse} ${styles.dot}`}></circle>
      </svg>
    </div>
  )
}

export default Loading