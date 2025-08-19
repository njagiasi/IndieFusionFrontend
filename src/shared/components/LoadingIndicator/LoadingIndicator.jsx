import React from 'react';
import styles from './LoadingIndicator.module.css';

function LoadingIndicator() {
  return (
    <div className={`${styles["loading-container"]}`}>
            <div className={`spinner-border text-primary ${styles["indicator"]}`} role="status" >
                <span className="sr-only"></span>
            </div>
        </div>
  )
}

export default LoadingIndicator