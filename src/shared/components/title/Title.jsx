import React from 'react';
import styles from './Title.module.css'

function Title(props) {
  return (
    <div className={`${styles["heading-font"]}`}>{props.heading}</div>
  )
}

export default Title