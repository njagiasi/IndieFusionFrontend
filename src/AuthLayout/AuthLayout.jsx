import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import styles from './AuthLayout.module.css'
import Navbar from '../Navbar/Navbar';
import { fetchNotifications } from '../Utils/axios';

function AuthLayout() {
    const navigate = useNavigate();
    const [notificationCount, setNotificationCount] = useState(0);


    useEffect(() => {
        const interval = setInterval(() => {
            fetchNotifications().then((res) => {
                const count = res?.data?.data?.filter((obj) => !obj.isRead)?.length ?? [];
                setNotificationCount(count)
            });
        }, 2000);
        return () => clearTimeout(interval);
    }, []);
    
    useEffect(() => {
        const userId = localStorage.getItem('USER_ID');
        if (!userId) {
            navigate('/login');
        }
    }, [navigate]);

    return (
        <div className={styles["postContainer"]}>
            <Navbar notificationCount={notificationCount}/>
            <div className={`${styles["main-posts"]}`}>

                <Outlet />
            </div>
        </div>
    )
}

export default AuthLayout