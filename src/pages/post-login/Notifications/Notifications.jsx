import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styles from './Notifications.module.css';
import axios from 'axios';
import { API_URL } from '../../../appConfig';
import { capitalizeParagraph, NOTIFICATION_TYPES, openToast } from '../../../Utils/utils';
import { useNavigate } from 'react-router-dom';
import Title from '../../../shared/components/title/Title';
import LoadingIndicator from '../../../shared/components/LoadingIndicator/LoadingIndicator';
import NoDataFound from '../../../shared/components/NodataFound/NoDataFound';
const deafultProfileImage = '/Images/DefaultProfileImage.webp';

function Notifications() {

    const [notifications, setNotifications] = useState({
        loading: false,
        data: []
    });

    const navigate = useNavigate();

    const fetchNotifications = useCallback(() => {
        setNotifications({
            loading: true,
            data: null
        });
        const userID = localStorage.getItem('USER_ID');
        axios.get(`${API_URL}/notifications/${userID}`).then((res) => {
            if (res.data) {
                setNotifications({
                    loading: false,
                    data: res.data?.data,
                });
            } else {
                setNotifications({
                    loading: false,
                    data: null
                });
                openToast("Unable to fetch Groups... Please try again ...");
            }
        }).catch(() => {
            openToast("Unable to fetch Groups... Please try again ...")
        })
    }, []);

    const notificationUpdateStatus = useCallback((notificationId) => {
        // Silent api
        const userID = localStorage.getItem('USER_ID');
        axios.put(`${API_URL}/notifications/${userID}/${notificationId}`).then((res) => {
        }).catch(() => {
        })
    }, []);

    useEffect(() => {
        fetchNotifications()
    }, [fetchNotifications]);

    const navigateToExternalPage = useCallback((eachNotification) => {
        notificationUpdateStatus(eachNotification._id);
        if (eachNotification.notificationType === NOTIFICATION_TYPES.GROUP) {
            navigate(`/groups/${eachNotification?.externalId}`);
        } else {
            navigate(`/profile/${eachNotification?.notificationFrom}`);
        }
    }, [navigate, notificationUpdateStatus]);

    const notificationsList = useMemo(() => {
        return notifications?.data?.map((eachNotification) => {
            return <div className={`${styles["main-Card"]} ${styles["card-items"]} ${!eachNotification.isRead && styles["unread"]}`} key={eachNotification._id} role='button' onClick={() => navigateToExternalPage(eachNotification)}>

                {eachNotification?.notificationType === NOTIFICATION_TYPES.GROUP && <div>
                    <i className={`fa fa-users ${styles["fafa-icon-size"]}`} aria-hidden="true" ></i>
                </div>}
                {eachNotification?.notificationType === NOTIFICATION_TYPES.COLLAB && <div>
                    <img src={eachNotification?.fromUserProfileImage?.imageUrl ? `${API_URL}/${eachNotification?.fromUserProfileImage?.imageUrl}` : deafultProfileImage} alt="Profile Not found" className={`${styles["profile-img"]} ${styles["mg-right"]}`} />
                </div>}
                <div>
                    <p className={`${styles["p-margin"]}`}>
                        <span className='fw-bold'>{capitalizeParagraph(`${eachNotification?.fromUserDetails?.firstName} ${eachNotification?.fromUserDetails?.lastName}`)}</span>&nbsp;
                        <span>{`${eachNotification?.message}`}</span>
                    </p>
                    <p className={`${styles["p-margin"]} ${styles["date"]}`}>{`${eachNotification?.createdDate ? new Date(eachNotification?.createdDate).toDateString() : null}`}</p>
                </div>
            </div>
        })
    }, [navigateToExternalPage, notifications?.data]);

    const notificationLoading = useMemo(() => {
        return <LoadingIndicator/>
    }, []);

    const noPostsFound = useMemo(() => {
        return <NoDataFound/>
    }, []);

    return (
        <div className={`${styles["container"]}`}>
            <div>
                <div className={`${styles["card-gap"]}`}>
                    <div>
                        <Title heading="Notifications" />
                    </div>
                    {notifications?.loading && notificationLoading}
                    {(!notifications?.loading &&  notifications?.data?.length <= 0) && noPostsFound}
                    {notifications?.data?.length > 0 ? notificationsList : null}
                </div>
            </div>

        </div>
    )
}

export default Notifications