import React from 'react'
import { NavLink } from 'react-router-dom'
import styles from './Navbar.module.css';
function Navbar(props) {

    const getActiveStyles = ({ isActive }) => {
        if (isActive) {
            return {
                color: '#853ff1',
                fontWeight: 'bold',
            }
        }
    }

    const logoutHandler = () => {
        localStorage.clear();

    }
    const UserName = localStorage.getItem('userName');
    return (
        <div className={styles["side-nav-bar"]}>
            <div className='mb-5'>
                <label className={`${styles["title"]}`}>Indie Fusion</label>
            </div>
            <div className='text-center'>
                <div>
                    <NavLink to='/dashboard' className={`d-flex ${styles['remove-anchor-defaults']}`}>
                        {(isActive) => {
                            return <div className={`d-flex ${styles['nav-containers']}`}>
                                <i className={`fa fa-home ${styles["icon-name-font"]}`} style={getActiveStyles(isActive)} aria-hidden="true"></i>
                                <p className={styles["nav-names"]} style={getActiveStyles(isActive)}>Home</p>
                            </div>
                        }}
                    </NavLink>
                </div>
                <div>
                    <NavLink to='/create' className={`d-flex ${styles['remove-anchor-defaults']}`} >
                        {(isActive) => {
                            return <div className={`d-flex ${styles['nav-containers']}`}>
                                <i className={`fa fa-plus-circle ${styles["icon-name-font"]}`} style={getActiveStyles(isActive)} aria-hidden="true"></i>
                                <p className={styles["nav-names"]} style={getActiveStyles(isActive)}>Create Post</p>
                            </div>
                        }}
                    </NavLink>
                </div>

                <div>
                    <NavLink to='/search' className={`d-flex ${styles['remove-anchor-defaults']}`}>
                        {(isActive) => {
                            return <div className={`d-flex ${styles['nav-containers']}`}>
                                <i className={`fa fa-search ${styles["icon-name-font"]}`} style={getActiveStyles(isActive)} aria-hidden="true"></i>
                                <p className={styles["nav-names"]} style={getActiveStyles(isActive)}>Search</p>
                            </div>
                        }}
                    </NavLink>
                </div>

                <div>
                    <NavLink to='/groups' className={`d-flex ${styles['remove-anchor-defaults']}`}>
                        {(isActive) => {
                            return <div className={`d-flex ${styles['nav-containers']}`}>
                                <i className={`fa fa-users ${styles["icon-name-font"]}`} style={getActiveStyles(isActive)} aria-hidden="true"></i>
                                <p className={styles["nav-names"]} style={getActiveStyles(isActive)}>Groups</p>
                            </div>
                        }}
                    </NavLink>
                </div>

                <div>
                    <NavLink to='/events' className={`d-flex ${styles['remove-anchor-defaults']}`}>

                        {(isActive) => {
                            return <div className={`d-flex ${styles['nav-containers']}`}>
                                <i className={`fa fa-calendar ${styles["icon-name-font"]}`} style={getActiveStyles(isActive)} aria-hidden="true"></i>
                                <p className={styles["nav-names"]} style={getActiveStyles(isActive)}>Events</p>
                            </div>
                        }}
                    </NavLink>
                </div>

                <div>
                    <NavLink to='/collab-request' className={`d-flex ${styles['remove-anchor-defaults']}`}>
                        {(isActive) => {
                            return <div className={`d-flex ${styles['nav-containers']}`}>
                                <i className={`fa fa-handshake-o ${styles["icon-name-font"]}`} style={getActiveStyles(isActive)} aria-hidden="true"></i>
                                <p className={styles["nav-names"]} style={getActiveStyles(isActive)}>My Collaborations</p>
                            </div>
                        }}
                    </NavLink>
                </div>

                <div>
                    <NavLink to='/notifications' className={`d-flex ${styles['remove-anchor-defaults']}`}>
                        {(isActive) => {
                            return <div className={`d-flex ${styles['nav-containers']}`}>
                                <i className={`fa fa-bell ${styles["icon-name-font"]}`} style={getActiveStyles(isActive)} aria-hidden="true"></i>
                                <p className={styles["nav-names"]} style={getActiveStyles(isActive)}>Notifications</p>
                                {props?.notificationCount ? <span className={`${styles["dot"]}`}></span> : null}
                            </div>
                        }}
                    </NavLink>
                </div>
                <div className='pb-3'>
                    <hr />
                </div>
                <div>
                    <NavLink to='/my-profile-page' className={`d-flex ${styles['remove-anchor-defaults']}`} >
                        {(isActive) => {
                            return <div className={`d-flex ${styles['nav-containers']}`}>
                                <i className={`fa fa-user ${styles["icon-name-font"]}`} style={getActiveStyles(isActive)} aria-hidden="true"></i>
                                <p className={styles["nav-names"]} style={getActiveStyles(isActive)}>{UserName}</p>
                            </div>
                        }}
                    </NavLink>
                </div>


                <div>
                    <NavLink to='/profile' className={`d-flex ${styles['remove-anchor-defaults']}`}>
                        {(isActive) => {
                            return <div className={`d-flex ${styles['nav-containers']}`}>
                                <i className={`fa fa-wrench ${styles["icon-name-font"]}`} style={getActiveStyles(isActive)} aria-hidden="true"></i>
                                <p className={styles["nav-names"]} style={getActiveStyles(isActive)}>Account Settings</p>
                            </div>
                        }}
                    </NavLink>
                </div>
                <div>
                    <NavLink to='/reset-password' className={`d-flex ${styles['remove-anchor-defaults']}`}>
                        {(isActive) => {
                            return <div className={`d-flex ${styles['nav-containers']}`}>
                                <i className={`fa fa-key ${styles["icon-name-font"]}`} style={getActiveStyles(isActive)} aria-hidden="true"></i>
                                <p className={styles["nav-names"]} style={getActiveStyles(isActive)}>Reset Password</p>
                            </div>
                        }}
                    </NavLink>
                </div>
            </div>

            <div>
                <NavLink to='/login' onClick={logoutHandler} className={`d-flex ${styles['remove-anchor-defaults']}`} >
                    {(isActive) => {
                        return <div className={`d-flex ${styles['nav-containers']}`}>
                            <i className={`fa fa-sign-out ${styles["icon-name-font"]}`} style={getActiveStyles(isActive)} aria-hidden="true"></i>
                            <p className={styles["nav-names"]} style={getActiveStyles(isActive)}>Logout</p>
                        </div>
                    }}
                </NavLink>
            </div>
        </div>
    )
}

export default Navbar