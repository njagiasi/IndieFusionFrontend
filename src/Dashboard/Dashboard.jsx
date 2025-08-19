import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styles from './Dashboard.module.css';
import axios from 'axios';
import { API_URL } from '../appConfig';
import { getIsImageFormat, openToast, POST_TYPES, STATUS } from '../Utils/utils';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';
import NoDataFound from '../shared/components/NodataFound/NoDataFound';
import LoadingIndicator from '../shared/components/LoadingIndicator/LoadingIndicator';
const deafultProfileImage = '/Images/DefaultProfileImage.webp';

function Dashboard() {
    const navigate = useNavigate();
    const [postList, setPostList] = useState({
        loading: false,
        data: []
    });
    const [modalShow, setModalShow] = useState(false);
    const [requestShowModel, setRequestShowModel] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState(null);

    const [currentLoggedInUser] = useState(localStorage.getItem('USER_ID') ?? '');

    const deleteAfterConfirmation = () => {
        setModalShow(false);
        const userId = localStorage.getItem('USER_ID');
        axios.delete(`${API_URL}/post/${userId}/${selectedPostId}`).then((res) => {
            if (res.data?.data) {
                openToast('Post Deleted Successfully', false);
                getAllPosts();
            } else {
                openToast('Not able to delete... Please try again');
            }
        }).catch((e) => {
            openToast('Something went wrong ... Please try again');
        }).finally(() => {
            setModalShow(false);
        })
    }

    const sendCollabRequest = () => {
        setRequestShowModel(false);
        const userId = localStorage.getItem('USER_ID');
        axios.put(`${API_URL}/group/add-member/${userId}/${selectedPostId}`).then((res) => {
            if (res.data?.data) {
                openToast("Collab request sent", false);
                getAllPosts();
            } else {
                openToast('Not able to send the collab request... Please try again');
            }
        }).catch((e) => {
            openToast('Something went wrong ... Please try again');
        }).finally(() => {
            setModalShow(false);
        })
    }

    const deleteBeforeConfirmation = (postId) => {
        setSelectedPostId(postId._id);
        setModalShow(true);
    }

    const collabRequestBeforeConfirmation = (postId) => {
        setSelectedPostId(postId._id);
        setRequestShowModel(true);
    }

    useEffect(() => {
        getAllPosts();
    }, []);

    const getAllPosts = () => {
        setPostList({
            loading: true,
            data: null
        });
        const userId = localStorage.getItem('USER_ID');
        axios.get(`${API_URL}/post-dashboard/${userId}`).then((res) => {
            if (res.data?.data) {
                const responseData = res.data.data;
                const filteredData = responseData?.filter((obj) => obj.isActive) ?? [];
                setPostList({
                    loading: false,
                    data: filteredData.reverse()
                });
            } else {
                setPostList({
                    loading: false,
                    data: []
                })
                openToast("Not able to fetch the data now... Try again later... ");
            }
        }).catch((e) => {
            setPostList({
                loading: false,
                data: []
            })
            openToast("Something went wrong... Please try again");
        })
    }

    const onShareLink = (postId) => {
        //http://localhost:3000/view/postId
        // i have to create a route for the view--(view/postId)
        const origin = window.location.origin;
        const sharableUrl = `${origin}/post/${postId}`;
        navigator.clipboard.writeText(sharableUrl);
        openToast("Link Copied", false);
    }

    const navigateBasedOnType = useCallback((eachPost) => {
        if (eachPost.type === POST_TYPES.SELF) {
            navigate(`/profile/${eachPost?.userId}`)
        } else if (eachPost.type === POST_TYPES.COLLAB) {
            navigate(`/groups`);
        } else {
            navigate(`/events`);
        }

    }, [navigate]);

    const getCollabIcon=useCallback((eachPost)=>{
        if (eachPost?.type === POST_TYPES.COLLAB) {
            const currentLoggedInUser = localStorage.getItem("USER_ID");
            const memberUser = eachPost?.members?.find((obj) => obj.userId === currentLoggedInUser);
            if (memberUser) {
                if (memberUser?.isAdmin) {
                    return null;
                } else if (memberUser?.status === STATUS.APPROVED) {
                    // APPROVED UI
                    return <div className={`me-3 badge bg-secondary btn-sm`}>
                        Approved
                    </div>
                } else if (memberUser?.status === STATUS.REQUESTED) {
                    // REQUESTED UI
                    return <div className={`me-3 badge bg-secondary btn-sm`}>
                        Requested
                    </div>
                } else if (memberUser?.status === STATUS.REJECTED) {
                    // REJECTED UI
                    return <div className={`me-3 badge bg-secondary btn-sm`}>
                        REJECTED
                    </div>
                }
            }
            return <div className='me-3'>
                <button className='btn btn-primary btn-sm' onClick={() => collabRequestBeforeConfirmation(eachPost)}>Request</button>
            </div>
        } else if (eachPost?.type === POST_TYPES.EVENT) {
            return <div className={`me-3 badge bg-secondary btn-sm`}>
                Event
            </div>
        }
        return null;
    }, [])

    const postListMemo = useMemo(() => {
        return postList?.data?.map((eachPost) => {
            if ((eachPost.type === POST_TYPES.COLLAB) && !eachPost?.isGroupActive) {
                return null;
            }
            return <div className={`${styles["container-dashboard"]}`} key={eachPost._id}>
                <div className={`${styles["header-data"]}`}>
                    <img src={eachPost.profileImageUrl ? `${API_URL}/${eachPost.profileImageUrl}` : deafultProfileImage} alt="Profile Not found" className={`${styles["profile-img"]} ${styles["mg-right"]}`} />
                    <div className="user-wrapper ps-2">
                        <div className={`${styles["user-data"]}`} role="button" onClick={() => navigateBasedOnType(eachPost)}>
                            <h3 className={`${styles['user']} ${styles["mg-right"]} ${styles["bold"]}`}>{eachPost.userDetails?.userName}</h3>
                            <p className={`${styles["date"]}`}></p>
                        </div>
                        <div className={`${styles["user-data"]}`}>
                            {eachPost?.title && <h3 className={`${styles['group']} ${styles["mg-right"]} ${styles["bold"]}`}>{eachPost?.title}</h3>}
                        </div>
                    </div>
                </div>
                {eachPost?.mediaUrl && <div className={` ${styles["post-data"]}`}>
                    {getIsImageFormat(eachPost?.mediaUrl) ? <img src={`${API_URL}/${eachPost?.mediaUrl}`} alt="Media URL not found" className={`${styles["post-img"]}`} /> : <video controls src={`${API_URL}/${eachPost?.mediaUrl}`} className={`${styles["post-img"]}`} />}
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
                    {eachPost.type !== POST_TYPES.EVENT && <div>
                        <p className={`${styles["menu-date"]}`}>{eachPost?.createdDate ? (new Date(eachPost.createdDate)).toDateString() : null}</p>
                    </div>}

                    {eachPost.type === POST_TYPES.EVENT && <div>
                        <p className={`${styles["menu-date"]} mb-0 fw-bold`}>
                            {eachPost?.startDate && <span>{`Starts - ${(new Date(eachPost?.startDate)).toDateString()}`}</span>}
                        </p>
                        <p className={`${styles["menu-date"]} fw-bold`}>
                            {eachPost?.endDate && <span>{`Ends - ${(new Date(eachPost?.endDate)).toDateString()}`}</span>}
                        </p>
                    </div>}
                    <div className='d-flex justify-content-end align-items-center'>
                        {getCollabIcon(eachPost)}
                        <div className='me-3'>
                            <i className={`fa fa-share-square ${styles["icon-size"]}`} aria-hidden="true"
                                onClick={() => onShareLink(eachPost._id)}></i>
                        </div>
                        {(currentLoggedInUser === eachPost.userId) && <div className='me-3'>
                            <i className={`fa fa-pencil-square ${styles["icon-size"]}`} aria-hidden="true" onClick={() => navigate(`/edit/${eachPost._id}`)}></i>
                        </div>}
                        {(currentLoggedInUser === eachPost.userId) && <div className='me-3'>
                            <i className={`fa fa-trash ${styles["icon-size"]}`} aria-hidden="true"
                                onClick={() => deleteBeforeConfirmation(eachPost)}></i>
                        </div>}

                    </div>
                </div>
            </div>
        })

    }, [currentLoggedInUser, getCollabIcon, navigate, navigateBasedOnType, postList?.data]);

    const postsLoading = useMemo(() => {
        return <LoadingIndicator/>
    }, []);

    const noPostsFound = useMemo(() => {
        return <NoDataFound/>
    }, []);

    return (
        <div className={`${styles["dashboardCard"]} ${styles["background-Color"]}`} >
            <div className={` ${styles["card-height"]} ${styles["align-items-center"]}`}>

                <div className={`${styles["main-container"]}`}>

                    {postList.loading && postsLoading}
                    {(!postList.loading && postList.data?.length <= 0) && noPostsFound}
                    {(!postList.loading && postList.data?.length) ? postListMemo : null}
                    <div>
                        <ConfirmationModal show={modalShow} handleClose={() => setModalShow(false)} handleSubmit={() => deleteAfterConfirmation()} title="Delete Post">
                            <p>Are you sure you want to delete this post?</p>
                        </ConfirmationModal>
                    </div>
                    <div>
                        <ConfirmationModal show={requestShowModel} handleClose={() => setRequestShowModel(false)} handleSubmit={() => sendCollabRequest()} title="Send Collab Request">
                            <p>Are you sure you want to send collab request?</p>
                        </ConfirmationModal>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard