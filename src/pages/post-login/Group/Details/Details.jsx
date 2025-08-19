import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styles from './Details.module.css'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../../../appConfig';
import { capitalizeParagraph, openToast, STATUS } from '../../../../Utils/utils';
import ConfirmationModal from '../../../../ConfirmationModal/ConfirmationModal';
import PostCard from '../../post-card/PostCard';
const deafultProfileImage = '/Images/DefaultProfileImage.webp';

function Details() {

    const [groupsData, setGroups] = useState({
        loading: false,
        data: null
    });

    const [modalDetails, setModalDetails] = useState({
        showConfirmation: false,
        modalTitle: "",
        modalMessage: "",
        memberDetails: null,
        isDelete: false
    });

    const [exitModalDetails, setExistModalDetails] = useState({
        showConfirmation: false,
        modalTitle: "",
        modalMessage: "",
        postDetails: null,
        isDeactivate: false
    });

    const params = useParams();
    const navigate = useNavigate();

    const fetchCurrentUserGroupDetails = useCallback(() => {
        setGroups({
            loading: true,
            data: null
        });
        const userID = localStorage.getItem('USER_ID');
        const groupId = params.groupId;
        axios.get(`${API_URL}/group/${userID}/${groupId}`).then((res) => {
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
    }, [params.groupId]);

    useEffect(() => {
        fetchCurrentUserGroupDetails();
    }, [fetchCurrentUserGroupDetails, params.groupId]);

    const closeConfirmation = useCallback(() => {
        setModalDetails({
            showConfirmation: false,
            modalMessage: "",
            modalTitle: "",
            memberDetails: null,
            isDelete: false
        })
    }, [setModalDetails]);

    const updateUserStatus = useCallback((eachMember, isDelete) => {
        setGroups({
            loading: true,
            data: null
        });
        const userId = localStorage.getItem("USER_ID");
        axios.put(`${API_URL}/group/update-status/${userId}/${params.groupId}`, {
            userId: eachMember?.userDetails?._id,
            isApproved: !isDelete
        }).then((updateStatus) => {
            setGroups({
                loading: false,
                data: null
            });
            closeConfirmation();
            if (updateStatus.data?.data) {
                openToast(`${isDelete ? 'User Removed successfully' : 'User Added successfully'}`, false);
                fetchCurrentUserGroupDetails();
            } else {
                openToast("Unable to remove the group member");
            }
        }).catch((e) => {
            closeConfirmation();
            setGroups({
                loading: false,
                data: null
            });
            openToast("Unable to remove the group member... Please try again");
        });
    }, [closeConfirmation, fetchCurrentUserGroupDetails, params.groupId]);

    const closeExitConfirmation = useCallback(() => {
        setExistModalDetails({
            showConfirmation: false,
            modalMessage: "",
            modalTitle: "",
            postDetails: null
        })
    }, []);

    const deleteGroup = useCallback(() => {
        setGroups({
            loading: true,
            data: null
        });
        const userId = localStorage.getItem("USER_ID");
        axios.delete(`${API_URL}/post/${userId}/${exitModalDetails?.postDetails?._id}`).then((updateStatus) => {
            setGroups({
                loading: false,
                data: null
            });
            closeExitConfirmation();
            if (updateStatus.data?.data) {
                openToast(`Group Exited successfully`, false);
                navigate('/groups');
            } else {
                openToast("Unable to remove the group member");
            }
        }).catch((e) => {
            closeExitConfirmation();
            setGroups({
                loading: false,
                data: null
            });
            openToast("Unable to remove the group member... Please try again");
        });
    }, [closeExitConfirmation, exitModalDetails?.postDetails?._id, navigate]);


    const removeMemberFromGroup = useCallback(() => {
        setGroups({
            loading: true,
            data: null
        });
        const userId = localStorage.getItem("USER_ID");
        axios.put(`${API_URL}/group/remove-member/${userId}/${params.groupId}`).then((updateStatus) => {
            setGroups({
                loading: false,
                data: null
            });
            closeExitConfirmation();
            if (updateStatus.data?.data) {
                openToast(`Group Exited successfully`, false);
                navigate('/groups');
            } else {
                openToast("Unable to remove the group member");
            }
        }).catch((e) => {
            closeExitConfirmation();
            setGroups({
                loading: false,
                data: null
            });
            openToast("Unable to remove the group member... Please try again");
        });
    }, [closeExitConfirmation, navigate, params.groupId]);

    const deactivateOrActivateGroup = useCallback(() => {
        setGroups({
            loading: true,
            data: null
        });
        const userId = localStorage.getItem("USER_ID");
        const isActiveGroup = groupsData?.data?.isActive ? false : true;
        axios.put(`${API_URL}/group/activate/${userId}/${params.groupId}/${isActiveGroup}`).then((updateStatus) => {
            setGroups({
                loading: false,
                data: null
            });
            closeExitConfirmation();
            if (updateStatus.data?.data) {
                openToast(`Group Exited successfully`, false);
                navigate('/groups');
            } else {
                openToast("Unable to remove the group member");
            }
        }).catch((e) => {
            closeExitConfirmation();
            setGroups({
                loading: false,
                data: null
            });
            openToast("Unable to remove the group member... Please try again");
        });
    }, [closeExitConfirmation, groupsData?.data?.isActive, navigate, params.groupId]);

    const memberConfirmation = (eachMember, isDelete) => {
        setModalDetails({
            showConfirmation: true,
            modalMessage: isDelete ? "Are you sure to remove the member ?" : "Are you sure to approve the member ?",
            modalTitle: "Confirmation",
            memberDetails: eachMember,
            isDelete
        });
    }

    const navigateToProfile = useCallback((eachMember) => {
        navigate(`/profile/${eachMember?.userDetails?._id}`);
    }, [navigate]);

    const usersList = useMemo(() => {
        if (groupsData?.data?.members.length <= 0) {
            if (groupsData?.data?.requestedMember?.status === STATUS.REJECTED) {
                return <div class="alert alert-warning d-flex align-items-center" role="alert">
                    <i className="fa fa-exclamation-triangle fs-2" aria-hidden="true"></i>&nbsp;
                    <div>
                        <strog>Request Denied</strog>: You do not have access to view the members of this group.
                    </div>
                </div>

            }
            return <div className="alert alert-secondary d-flex align-items-center mt-2 ms-2" role="alert">
                <i className="fa fa-exclamation-triangle fs-2" aria-hidden="true"></i>&nbsp;
                <div className='ps-2'>
                    <strog>Request Pending</strog>: Your request is awaiting admin approval..!
                </div>
            </div>
        }
        const userId = localStorage.getItem('USER_ID');
        return groupsData?.data?.members?.map((eachMember) => {
            return (eachMember?.status === STATUS.APPROVED || groupsData?.data?.requestedMember?.isAdmin) ? <div className={`${styles["card"]} ${styles["card-details"]}`} key={eachMember._id}>
                <>
                    <div className='d-flex align-items-center'>
                        <div>
                            <img src={eachMember?.profileImage ? `${API_URL}/${eachMember?.profileImage?.imageUrl}` : deafultProfileImage} className={`${styles["image"]}`} alt={`${eachMember?.userDetails?.username} not found`} />
                        </div>
                        <div className='ms-4' onClick={() => navigateToProfile(eachMember)}>
                            <p className={`${styles["p-margin"]}`}>{userId === eachMember?.userDetails?._id ? `You ${eachMember?.isAdmin ? '- Admin' : ''}` : `${eachMember?.userDetails?.firstName} ${eachMember?.userDetails?.lastName} ${eachMember?.isAdmin ? '(Admin)' : ''}`}</p>
                            {(userId !== eachMember?.userDetails?._id && !eachMember?.isAdmin) && <p className={`m-0 ${eachMember?.status === STATUS.APPROVED ? 'text-success' : eachMember?.status === STATUS.REJECTED ? 'text-danger' : 'text-warning'}`}>
                                {eachMember?.status ? capitalizeParagraph(eachMember?.status) : ""}
                            </p>}
                        </div>
                    </div>

                    {(groupsData?.data?.requestedMember?.isAdmin && !eachMember?.isAdmin) && <div className='d-flex justify-content-evenly'>
                        {(eachMember.status === STATUS.APPROVED || eachMember.status === STATUS.REQUESTED) && <i className={`fa fa-times ${styles["fafa-icons"]} me-3 text-danger`} aria-hidden="true" onClick={() => memberConfirmation(eachMember, true)}></i>}
                        {(eachMember.status === STATUS.REQUESTED || eachMember.status === STATUS.REJECTED) && <i className={`fa fa-check ${styles["fafa-icons"]} text-success`} aria-hidden="true" onClick={() => memberConfirmation(eachMember, false)}></i>}
                    </div>}
                </>
            </div> : null;
        })

    }, [groupsData?.data?.members, groupsData?.data?.requestedMember?.isAdmin, groupsData?.data?.requestedMember?.status, navigateToProfile]);

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
                ...groupsData?.data?.postDetails,
                profileImage: groupsData?.data?.postUserDetails?.profileImage ? `${API_URL}/${groupsData?.data?.postUserDetails?.profileImage}` : deafultProfileImage,
                userId: groupsData?.data?.postUserDetails,
            }} />
        </div>
    }, [groupsData?.data?.postDetails, groupsData?.data?.postUserDetails]);

    const exitGroupBeforeConfirmation = useCallback((isDeactivate = false) => {
        setExistModalDetails({
            showConfirmation: true,
            modalMessage: groupsData?.data?.requestedMember?.isAdmin ?
                isDeactivate ? " You can reactivate your group at any time after deactivation"
                    : "If you proceed with deleting the group, all members will be exited along with the group" :
                "Leaving the group will revoke your access, requiring a new request and admin approval to join again.",
            modalTitle: "Confirmation",
            postDetails: groupsData?.data?.postDetails,
            isDeactivate
        })
    }, [groupsData?.data?.postDetails, groupsData?.data?.requestedMember?.isAdmin]);

    const groupDetails = useMemo(() => {
        return <>
            <div className='d-flex justify-content-between pb-2'>
                <div>
                    {!groupsData?.data?.isActive && <div class="alert alert-danger" role="alert">
                        <i className="fa fa-exclamation-triangle fs-5" aria-hidden="true"></i>&nbsp;
                        Group Not Operational
                    </div>}
                </div>
                <div>
                    {groupsData.data?.requestedMember?.isAdmin && <button onClick={() => exitGroupBeforeConfirmation(true)} className='btn btn-primary'>
                        {groupsData?.data?.isActive ? 'Deactivate Group' : "Activate Group"}
                    </button>}&nbsp;
                    <button onClick={() => exitGroupBeforeConfirmation()} className='btn btn-primary'>
                        Exit Group
                    </button>
                </div>
            </div>
            <div className={`${styles["main-Card"]} ${!groupsData?.data?.isActive && styles["no-actions"]}`}>
                {postDetails}
                <div>
                    {groupsData?.data?.members && <div className={`${styles["details-card"]}`}>
                        {usersList}
                    </div>}
                </div>
            </div>
        </>
    }, [groupsData.data?.requestedMember?.isAdmin, groupsData.data?.isActive, groupsData.data?.members, postDetails, usersList, exitGroupBeforeConfirmation]);

    const handleSubmit = useCallback(() => {
        updateUserStatus(modalDetails.memberDetails, modalDetails.isDelete);
    }, [updateUserStatus, modalDetails.memberDetails, modalDetails.isDelete]);


    const handleExitSubmit = useCallback(() => {
        if (groupsData.data?.requestedMember?.isAdmin) {
            if (exitModalDetails.isDeactivate) {
                deactivateOrActivateGroup();
            } else {
                deleteGroup();
            }
        } else {
            removeMemberFromGroup();
        }
    }, [deactivateOrActivateGroup, deleteGroup, exitModalDetails.isDeactivate, groupsData.data?.requestedMember?.isAdmin, removeMemberFromGroup]);

    const confirmationModal = useMemo(() => {
        return <ConfirmationModal
            title={modalDetails.modalTitle}
            show={modalDetails?.showConfirmation}
            closeLabel={"Cancel"}
            submitLabel={"Confirm"}
            handleClose={() => closeConfirmation()}
            handleSubmit={() => handleSubmit()}>
            <p>{modalDetails?.modalMessage}</p>
        </ConfirmationModal>
    }, [handleSubmit, modalDetails?.modalMessage, modalDetails.modalTitle, modalDetails?.showConfirmation, closeConfirmation]);

    const exitConfirmationModal = useMemo(() => {
        return <ConfirmationModal
            title={exitModalDetails.modalTitle}
            show={exitModalDetails?.showConfirmation}
            closeLabel={"Cancel"}
            submitLabel={"Confirm"}
            handleClose={() => closeExitConfirmation()}
            handleSubmit={() => handleExitSubmit()}>
            <p>{exitModalDetails?.modalMessage}</p>
        </ConfirmationModal>
    }, [exitModalDetails.modalTitle, exitModalDetails?.showConfirmation, exitModalDetails?.modalMessage, closeExitConfirmation, handleExitSubmit]);

    return (
        <div>
            {groupsData.loading && groupDetailsLoading}
            {(!groupsData.loading && groupsData) && groupDetails}
            {modalDetails?.showConfirmation && confirmationModal}
            {exitModalDetails?.showConfirmation && exitConfirmationModal}
        </div>
    )
}

export default Details