import axios from 'axios';
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom';
import { API_URL } from '../../../../appConfig';
import {  openToast } from '../../../../Utils/utils';
import PostCard from '../../post-card/PostCard';
import styles from './EventDetails.module.css';
const deafultProfileImage = '/Images/DefaultProfileImage.webp';


function EventDetails() {

    const [groupsData, setGroups] = useState({
        loading: false,
        data: null
    });

    const params = useParams();

    const fetchCurrentUserGroupDetails = useCallback(() => {
        setGroups({
            loading: true,
            data: null
        });
        const userID = localStorage.getItem('USER_ID');
        const postId = params.id;
        axios.get(`${API_URL}/post-event/${userID}/${postId}`).then((res) => {
            if (res.data) {
                setGroups({
                    loading: false,
                    data: res.data?.data?.[0],
                });
            } else {
                setGroups({
                    loading: true,
                    data: null
                });
                openToast("Unable to fetch Group details... Please try again ...")
            }
        }).catch(() => {
            setGroups({
                loading: false,
                data: null
            });
            openToast("Unable to fetch Group details... Please try again ...")
        })
    }, [params.id]);

    useEffect(() => {
        fetchCurrentUserGroupDetails();
    }, [fetchCurrentUserGroupDetails, params.groupId]);

    const groupDetailsLoading = useMemo(() => {
        return <div className={`${styles["loading-container"]}`}>
            <div className={`spinner-border text-primary ${styles["indicator"]}`} role="status" >
                <span className="sr-only"></span>
            </div>
        </div>
    }, []);

    const postDetails = useMemo(() => {
        return <div className={`${styles["post-container"]}`}>
            <PostCard eachPost={{
                ...groupsData?.data,
                profileImage: groupsData?.data?.profileImageUrl ? `${API_URL}/${groupsData?.data?.profileImageUrl}` : deafultProfileImage,
                userId: groupsData?.data?.userDetails,
                endDate: groupsData?.data?.endDate,
                startDate: groupsData?.data?.startDate,
                text: groupsData?.data?.text
            }} />
        </div>
    }, [groupsData?.data]);

    const groupDetails = useMemo(() => {
        return <>
            <div className={`${styles["main-Card"]} ${!groupsData?.data?.isActive && styles["no-actions"]} d-flex justify-content-center`}>
                {postDetails}
            </div>
        </>
    }, [groupsData?.data?.isActive, postDetails]);

    return (
        <div>
            {groupsData.loading && groupDetailsLoading}
            {(!groupsData.loading && groupsData) && groupDetails}
        </div>
    )
}

export default EventDetails