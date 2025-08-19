import React from 'react'
import styles from './PostCard.module.css';
import { getIsImageFormat } from '../../../Utils/utils';
import { API_URL } from '../../../appConfig';

function PostCard({ eachPost, deleteEvent, editEvent }) {
    return (
        <div>
            <div className={`${styles["container-profile"]}`}>
                <div className={`${styles["header-data"]}`}>
                    <img src={eachPost.profileImage} alt="" className={`${styles["profile-img"]} ${styles["mg-right"]}`} />
                    <div className="user-wrapper">
                        <div className={`${styles["user-data"]}`} >
                            <h3 className={`${styles['user']} ${styles["mg-right"]} ${styles["bold"]}`}>{eachPost.userId?.userName}</h3>
                            <p className={`${styles["date"]}`}></p>
                        </div>
                        {eachPost?.title && <div className={`${styles["user-data"]}`}>
                            {eachPost?.title && <h3 className={`${styles['group']} ${styles["mg-right"]} fw-bold`}>{eachPost?.title}</h3>}
                        </div>}
                    </div>

                </div>
                {eachPost?.mediaUrl && <div className={` ${styles["post-data"]}`}>
                    {getIsImageFormat(eachPost?.mediaUrl) ? <img src={`${API_URL}/${eachPost?.mediaUrl}`} alt="" className={`${styles["post-img"]}`} /> : <video controls src={`${API_URL}/${eachPost?.mediaUrl}`} className={`${styles["post-img"]}`} />}
                </div>}
                {(eachPost?.mediaUrl && eachPost?.text) && <div className={`${styles["metadata"]}`}>
                    <div className={`${styles["icon-container"]} d-flex justify-content-between`}>
                        <div>
                            <p>{eachPost?.text}</p>
                        </div>
                    </div>
                </div>}
                {/* Only Text */}
                {(!eachPost?.mediaUrl && eachPost?.text) && <div>
                    <div>
                        <p className={styles['only-text-content']}>{eachPost?.text}</p>
                    </div>
                </div>}

                <div className={`d-flex justify-content-between ${!eachPost?.text ? 'pt-2' : ''}`}>
                    {!eachPost?.startDate && <div>
                        <p className={`${styles["menu-date"]}`}>{eachPost?.createdDate ? (new Date(eachPost.createdDate)).toDateString() : null}</p>
                    </div>}
                    <div>
                        <p className={`${styles["menu-date"]} mb-0`}>
                            {eachPost?.startDate && <span>{`Starts - ${(new Date(eachPost?.startDate)).toDateString()}`}</span>}
                        </p>
                        <p className={`${styles["menu-date"]}`}>
                            {eachPost?.endDate && <span>{`Ends - ${(new Date(eachPost?.endDate)).toDateString()}`}</span>}
                        </p>
                    </div>
                    <div className='d-flex justify-content-end'>
                        {editEvent && <div className='me-3'>
                            <i className={`fa fa-pencil-square ${styles["icon-size"]}`} aria-hidden="true" onClick={() => editEvent(eachPost)}></i>
                        </div>}
                        {deleteEvent && <div className='me-3'>
                            <i className={`fa fa-trash ${styles["icon-size"]}`} aria-hidden="true"
                                onClick={() => deleteEvent(eachPost)}></i>
                        </div>}

                    </div>
                </div>
            </div>
        </div>
    )
}

export default PostCard