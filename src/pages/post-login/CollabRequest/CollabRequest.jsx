import styles from './CollabRequest.module.css';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../../appConfig';
import { capitalizeParagraph, openToast, STATUS } from '../../../Utils/utils';
import { useNavigate } from 'react-router-dom';
import Title from '../../../shared/components/title/Title';
import LoadingIndicator from '../../../shared/components/LoadingIndicator/LoadingIndicator';
import NoDataFound from '../../../shared/components/NodataFound/NoDataFound';
const deafultProfileImage = '/Images/DefaultProfileImage.webp';


const CollabRequest = () => {

    const [collabs, setCollabs] = useState({
        loading: false,
        data: null
    });

    const navigate = useNavigate();

    const fetchCollabRequest = useCallback(() => {
        setCollabs({
            loading: true,
            data: null
        });
        const userID = localStorage.getItem('USER_ID');
        axios.get(`${API_URL}/collab/${userID}`).then((res) => {
            setCollabs({
                loading: false,
                data: res.data?.data,
            });
        }).catch(() => {
            openToast("Unable to fetch Collab details... Please try again ...")
        })
    }, []);
    useEffect(() => {
        fetchCollabRequest();
    }, [fetchCollabRequest]);

    const onApproveOrReject = useCallback((isApproved, collabUserId) => {
        const userId = localStorage.getItem("USER_ID");
        const collabId = collabUserId;
        axios.put(`${API_URL}/collab/${userId}/${collabId}/${isApproved}`).then((res) => {
            if (res.data?.success) {
                openToast(isApproved ? "Request Approved" : "Request Declined", false);
                fetchCollabRequest();
            } else {
                openToast(res.data?.message);
            }
        }).catch((e) => {
            openToast('Something went wrong ... Please try again');
        })
    }, [fetchCollabRequest]);

    const collabsList = useMemo(() => {
        const userId = localStorage.getItem("USER_ID");
        return collabs?.data?.map((collab) => {
            collab.userId = collab.status === STATUS.APPROVED && collab?.userId?._id === userId ? collab.requestedTo : collab.userId;
            return <>
                <div className={`${styles["main-card"]} ${styles["card-items"]}`}>
                    <div>
                        <img src={collab?.userId?.imageUrl ? `${API_URL}/${collab?.userId?.imageUrl}` : deafultProfileImage} alt="Profile Not found" className={`${styles["profile-img"]} ${styles["mg-right"]}`} />
                    </div>
                    <div>
                        <p className={`${styles["p-margin"]} fs-6 fw-bold`} role='button' onClick={() => navigate(`/profile/${collab?.userId?._id}`)}>{capitalizeParagraph(`${collab?.userId?.firstName} ${collab?.userId?.lastName}`)}</p>
                        <p className={`${styles["p-margin"]} ${styles["message"]}`}>{collab?.message}</p>
                        <p className={`${styles["p-margin"]} ${styles["menu-date"]}`}>{collab?.requestedDate ? (new Date(collab?.requestedDate)).toDateString() : null}</p>
                    </div>
                    {collab?.status === STATUS.REQUESTED && <div className='text-end me-2'>
                        <i className={`fa fa-times ${styles["fafa-icons"]} me-3 text-danger`} aria-hidden="true" onClick={() => onApproveOrReject(false, collab?.userId?._id)}></i>
                        <i className={`fa fa-check ${styles["fafa-icons"]} text-success`} aria-hidden="true" onClick={() => onApproveOrReject(true, collab?.userId?._id)}></i>
                    </div>}
                </div>
            </>
        })
    }, [collabs?.data, navigate, onApproveOrReject]);

    const collabsLoading = useMemo(() => {
        return <LoadingIndicator/>
    }, []);

    const noCollabsFound = useMemo(() => {
        return <NoDataFound/>
    }, []);

    return (
        <div className={`${styles["container"]}`}>
            <div className={`${styles["main-card-container"]}`}>
                <div className={`${styles["card-gap"]}`}>
                    <div>
                        <Title heading="My Collaborations" />
                    </div>
                    {collabs.loading && collabsLoading}
                    {!collabs.loading && collabs?.data?.length ? collabsList : noCollabsFound}
                </div>
            </div>
        </div>
    )
}

export default CollabRequest