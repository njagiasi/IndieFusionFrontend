import { useCallback, useEffect, useMemo, useState } from 'react'
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal'
import styles from './MyProfilePage.module.css'
import axios from 'axios';
import { API_URL } from '../appConfig';
import { capitalizeParagraph, getIsImageFormat, openToast, STATUS } from '../Utils/utils';
import { Link, useNavigate, useParams } from 'react-router-dom';
import NoDataFound from '../shared/components/NodataFound/NoDataFound';
import LoadingIndicator from '../shared/components/LoadingIndicator/LoadingIndicator';
const deafultProfileImage = '/Images/DefaultProfileImage.webp';

function MyProfilePage() {
    const navigate = useNavigate();
    const [modalShow, setModalShow] = useState(false);
    const [postIdForDelete, setPostIdForDelete] = useState(null);
    const [messageModalPopup, setMessageModalPopup] = useState({
        show: false,
        message: ''
    });
    const [collabStatus, setCollabStatus] = useState(null);
    const [details, setDetails] = useState(null);

    const [profileImage, setProfileImage] = useState(deafultProfileImage);
    const [collabEnabled, setIsCollab] = useState(true);
    const [postList, setPostList] = useState({
        loading: false,
        data: []
    });
    const params = useParams();

    const getAllPosts = useCallback(() => {
        setPostList({
            loading: true,
            data: null
        });
        const userId = params?.profileId ?? localStorage.getItem('USER_ID');
        axios.get(`${API_URL}/post/${userId}`).then((res) => {
            if (res.data?.data) {
                const responseData = res.data.data;
                setPostList({
                    loading: false,
                    data: responseData.posts?.reverse()
                });
                if (responseData.imageUrl) {
                    setProfileImage(`${API_URL}/${responseData.imageUrl}`);
                }
                setDetails({
                    profileDetails: responseData?.profileDetails,
                    userDetails: responseData?.userDetails
                })
                if (responseData?.profileDetails) {

                }
                setIsCollab(responseData?.profileDetails?.openToCollab);
            } else {
                openToast("Not able to fetch the data now... Try again later... ");
            }
        }).catch((e) => {
            openToast("Something went wrong... Please try again");
        })
    }, [params?.profileId]);

    const getCollabrationId = useCallback(() => {
        if (!params.profileId) {
            return;
        }
        const userId = localStorage.getItem("USER_ID");
        const collabId = params.profileId;

        axios.get(`${API_URL}/collab/${userId}/${collabId}`).then((res) => {
            setCollabStatus(res.data?.data?.length ? res.data?.data?.[0] : null);
        }).catch((e) => {
            openToast('Something went wrong while fetching collab details ... Please try again');
        })
    }, [params.profileId]);

    useEffect(() => {
        getAllPosts();
        getCollabrationId();
    }, [getAllPosts, params.profileId, getCollabrationId]);

    const deleteBeforeConfirmation = (postId) => {
        setPostIdForDelete(postId._id);
        setModalShow(true);
    }

    const deleteAfterConfirmation = () => {
        const userId = localStorage.getItem('USER_ID');
        axios.delete(`${API_URL}/post/${userId}/${postIdForDelete}`).then((res) => {
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

    const sendCollabration = useCallback(() => {
        if (messageModalPopup.message) {
            const userId = localStorage.getItem("USER_ID");
            const collabId = params.profileId;
            axios.post(`${API_URL}/collab/${userId}/${collabId}`, { message: messageModalPopup.message }).then((res) => {
                setMessageModalPopup({
                    show: false,
                    message: ''
                });
                if (res.data?.data) {
                    openToast('Request Sent Successfully', false);
                    getCollabrationId();
                } else {
                    openToast('Not able to request... Please try again');
                }
            }).catch((e) => {
                setMessageModalPopup({
                    show: false,
                    message: ''
                });
                openToast('Something went wrong ... Please try again');
            })
        } else {
            openToast("Message is required");
        }

    }, [getCollabrationId, messageModalPopup.message, params.profileId]);


    const onApproveOrReject = useCallback((isApproved) => {
        if (!params.profileId) {
            return;
        }
        const userId = localStorage.getItem("USER_ID");
        const collabId = params.profileId;
        axios.put(`${API_URL}/collab/${userId}/${collabId}/${isApproved}`).then((res) => {
            if (res.data?.success) {
                openToast(res.data?.message, false);
                getCollabrationId();
            } else {
                openToast(res.data?.message);
            }
        }).catch((e) => {
            openToast('Something went wrong ... Please try again');
        })
    }, [getCollabrationId, params.profileId]);

    const onCancelRequest = useCallback((isApproved) => {
        const userId = localStorage.getItem("USER_ID");
        const collabId = params.profileId;
        axios.put(`${API_URL}/collab/${collabId}/${userId}/${isApproved}`).then((res) => {
            if (res.data?.success) {
                openToast(res.data?.message, false);
                getCollabrationId();
            } else {
                openToast(res.data?.message);
            }
        }).catch((e) => {
            openToast('Something went wrong ... Please try again');
        })
    }, [getCollabrationId, params.profileId]);

    const getCollabStatus = useMemo(() => {
        const user_id = localStorage.getItem("USER_ID");
        if (!collabStatus?.userId) {
            if (!collabEnabled) {
                return <div className={`badge bg-secondary btn-sm`}>
                    Collab Unavailable
                </div>
            }
            return <button className='btn btn-primary' onClick={() => setMessageModalPopup({
                show: true,
                message: ''
            })}>{'Request Collab'}</button>;
        }
        if (collabStatus?.status === STATUS.APPROVED) {
            return <div className={`badge bg-secondary btn-sm`}>
                Collabed
            </div>
        }
        if (collabStatus?.requestedTo?._id === user_id) {
            return <>
                <button className='btn btn-primary' onClick={() => onApproveOrReject(true)}>{'Approve'}</button> &nbsp;
                <button className='btn btn-primary' onClick={() => onApproveOrReject(false)}>{'Reject'}</button>
            </>
        } else if (collabStatus?.userId?._id === user_id) {
            return <>
                {/* <button className='btn btn-primary'>{capitalizeParagraph(collabStatus?.status)}</button>&nbsp; */}
                <div className={`badge bg-secondary btn-sm`}>
                    {capitalizeParagraph(collabStatus?.status)}
                </div>&nbsp;
                <button className='btn btn-primary' onClick={() => onCancelRequest(false)}>{'Cancel Request'}</button>
            </>;
        }
    }, [collabEnabled, collabStatus?.requestedTo?._id, collabStatus?.status, collabStatus?.userId, onApproveOrReject, onCancelRequest]);

    const postListMemo = useCallback((eachPost) => {
        return <div className={`${styles["container-profile"]}`} key={eachPost._id}>
            <div className={`${styles["header-data"]}`}>
                <img src={profileImage} alt="" className={`${styles["profile-img"]} ${styles["mg-right"]}`} />
                <div className="user-wrapper">
                    <div className={`${styles["user-data"]}`} >
                        <h3 className={`${styles['user']} ${styles["mg-right"]} ${styles["bold"]}`}>{eachPost.userId?.userName}</h3>
                        <p className={`${styles["date"]}`}></p>
                    </div>
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
                <div>
                    <p className={`${styles["menu-date"]}`}>{eachPost?.createdDate ? (new Date(eachPost.createdDate)).toDateString() : null}</p>
                </div>
                {localStorage.getItem("USER_ID") === params.profileId && <div className='d-flex justify-content-end'>
                    <div className='me-3'>
                        <i className={`fa fa-pencil-square ${styles["icon-size"]}`} aria-hidden="true" onClick={() => navigate(`/edit/${eachPost._id}`)}></i>
                    </div>
                    <div className='me-3'>
                        <i className={`fa fa-trash ${styles["icon-size"]}`} aria-hidden="true"
                            onClick={() => deleteBeforeConfirmation(eachPost)}></i>
                    </div>

                </div>}
            </div>
        </div>
    }, [navigate, params.profileId, profileImage]);

    const postsLoading = useMemo(() => {
        return <LoadingIndicator />
    }, []);

    const noPostsFound = useMemo(() => {
        return <NoDataFound />
    }, []);



    return (
        <div className={`${styles["container"]}`}>

            {postList.loading && postsLoading}
            {!postList.loading && <>
                <div>
                    <div className={`${styles["profile-container"]} ${styles["profile-image-grid"]}`}>
                        <div className={`${styles["image-request-button"]}`}>
                            <img src={profileImage} className={`${styles["image"]}`} alt={'Profile'} />
                            <div>
                                {(params?.profileId && localStorage.getItem("USER_ID") !== params?.profileId) && getCollabStatus}
                            </div>
                        </div>
                        <div>
                            <div>
                                <p className={`${styles["profile-name-font"]}`}>{`${details?.userDetails?.firstName} ${details?.userDetails?.lastName}`}</p>
                                <p className={`${styles["profile-username-font"]}`}>{details?.userDetails?.userName}</p>
                                <p className={`${styles["profile-bio-font"]}`}>{details?.profileDetails?.bio}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`${styles["main-container"]}`}>
                    {(!postList.loading && postList?.data?.length > 0) ? postList?.data?.map((eachPost) => postListMemo(eachPost)) : null}
                    {!postList.loading && postList?.data?.length <= 0 && <>
                        <div>
                            <div>
                                {noPostsFound}
                            </div>
                            <div>
                                <Link to={'/create'}>Create Here</Link>
                            </div>
                        </div>
                    </>}
                    <div>
                        <ConfirmationModal show={modalShow} handleClose={() => setModalShow(false)} handleSubmit={() => deleteAfterConfirmation()} title="Delete Post">
                            <p>Are you sure you want to delete this post?</p>
                        </ConfirmationModal>
                    </div>

                    <div>
                        {messageModalPopup.show && <ConfirmationModal show={messageModalPopup.show} handleClose={() => setMessageModalPopup({
                            show: false,
                            message: ''
                        })} handleSubmit={() => sendCollabration()} title="Request Message" submitDisable={!messageModalPopup.message}>
                            <div class="form-floating">
                                <textarea class="form-control" placeholder="Leave a message here" id="floatingTextarea" onChange={(event) => setMessageModalPopup({ ...messageModalPopup, message: event.target.value })}></textarea>
                                <label for="floatingTextarea">Your Request Message</label>
                            </div>
                        </ConfirmationModal>}
                    </div>
                </div>
            </>}
        </div>
    )
}

export default MyProfilePage