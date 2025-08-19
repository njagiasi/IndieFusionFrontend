import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from './Create.module.css'
import axios from 'axios';
import { API_URL } from '../appConfig';
import { useNavigate, useParams } from 'react-router-dom';
import { getIsImageFormat, openToast, POST_TYPES } from '../Utils/utils';
import Title from "../shared/components/title/Title";

function Create() {
    const params = useParams();
    const defaultFormState = useMemo(() => ({
        "text": "",
        media: "",
        "type": "SELF",
        "title": "",
        "startDate": "",
        endDate: ""
    }), [])
    const [formState, setFormState] = useState(defaultFormState);
    const [isImage, setIsImage] = useState(true);

    const navigate = useNavigate();

    const inputReference = useRef();
    const [isLoading, setIsLoading] = useState(false);
    const [blobPost, setBlobPost] = useState('');
    const [ispreview, setIsPreview] = useState(false);
    const [isOnlyText, setIsOnlyText] = useState(false);

    const getPostDetailsByID = useCallback(() => {
        const userId = localStorage.getItem('USER_ID');
        axios.get(`${API_URL}/post/${userId}/${params?.postId}`).then((res) => {
            if (res.data?.data) {
                const responseData = res.data.data;
                setFormState({
                    text: responseData.text,
                    type: responseData.type,
                    title: responseData?.title,
                    startDate: responseData?.startDate,
                    endDate: responseData?.endDate
                });
                if (responseData?.mediaUrl) {
                    setBlobPost(`${API_URL}/${responseData.mediaUrl}`);
                    setIsPreview(true);
                    setIsImage(getIsImageFormat(responseData?.mediaUrl));
                } else {
                    setIsOnlyText(true);
                }
            } else {
                openToast("Not able to fetch the data now... Try again later... ");
            }
        }).catch((e) => {
            openToast("Something went wrong... Please try again");
        })
    }, [params?.postId]);

    useEffect(() => {
        if (params.postId) {
            getPostDetailsByID();
        } else {
            setIsPreview(false);
            setFormState(defaultFormState)
        }
    }, [params?.postId, defaultFormState, getPostDetailsByID]);



    const onPostImage = (event) => {
        if (event?.target?.files?.[0]) {
            const file = event.target.files[0];
            setIsImage(getIsImageFormat(file.name))
            setBlobPost(URL.createObjectURL(file));
            setFormState({ ...formState, media: file });
            setIsPreview(true);
        }
    }

    const onImagecLick = () => {
        inputReference.current.click();
    }

    const profileHandler = async () => {
        if (params.postId) {
            updatePost();
        } else {
            createPost()
        }
    }

    const backToHome = () => {
        navigate('/dashboard');
    }

    const createPost = async () => {
        const userID = localStorage.getItem('USER_ID');
        setIsLoading(true);
        try {
            const response = await axios.post(`${API_URL}/post/${userID}`, formState, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
            if (response.data.data) {
                setIsLoading(false);
                openToast("Post Created successfully!", false);
                setTimeout(() => {
                    navigate('/dashboard');
                }, 2000);
            } else {
                setIsLoading(false);
                openToast("Unable to create ... Please try again");
            }
            setTimeout(() => {
                setIsLoading(false);
            }, 3000);
        } catch (e) {
            setIsLoading(false);
            openToast("Something went wrong..Please try again..!");
        }

    }

    const updatePost = async () => {
        const userID = localStorage.getItem('USER_ID');
        setIsLoading(true);
        try {
            const response = await axios.put(`${API_URL}/post/${userID}/${params.postId}`, formState, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
            if (response.data.data) {
                setIsLoading(false);
                openToast("Post Updated successfully!", false);
            } else {
                setIsLoading(false);
                openToast("Unable to Update ... Please try again");
            }
            setTimeout(() => {
                setIsLoading(false);
            }, 3000);
        } catch (e) {
            setIsLoading(false);
            openToast("Something went wrong..Please try again..!");
        }

    }

    const getIsDisabled = useCallback(() => {
        if (formState.type === POST_TYPES.SELF) {
            return isLoading || (!ispreview && !formState.text)
        } else if (POST_TYPES.EVENT === formState.type) {
            if (!formState.startDate || !formState.endDate || !formState.title) {
                return true;
            }
            return isLoading || (!ispreview && !formState.text);
        } else {
            if (!formState.title) {
                return false;
            }
            return isLoading || (!ispreview && !formState.text);
        }
    }, [ispreview, formState, isLoading]);


    return (
        <div className={styles["createPostCard"]}>
            <div className={`card p-3 ${styles["post-height"]}`}>
                <div className={`d-flex justify-content-between mb-3`}>
                    <div>
                        <Title heading={params.postId ? "Update Post" : "Create Post"} />
                    </div>
                    <div>
                        <label htmlFor="collabPost" className={`${styles["font-size-family"]}`} >Post Type</label>
                        <select className={`${styles["input-box"]}`} id='collabPost' disabled={params.postId}
                            value={formState.type} onChange={(event) => setFormState({ ...formState, type: event.target.value })}>
                            <option value={POST_TYPES.SELF} className={`text-capitalize`}>Self</option>
                            <option value={POST_TYPES.COLLAB} className='text-capitalize'>Collab</option>
                            <option value={POST_TYPES.EVENT} className='text-capitalize'>Event</option>
                        </select>
                    </div>
                </div>

                <div>
                    <div className={`mb-3`}>
                        {formState?.type !== POST_TYPES.SELF && <div className="form-floating">
                            <input className="form-control" placeholder="Title" id="title" value={formState.title} onChange={(event) => setFormState({ ...formState, title: event.target.value })} />
                            <label htmlFor="title">Title</label>
                        </div>}
                    </div>
                    <div className={`mb-3`}>
                        {formState?.type === POST_TYPES.EVENT && <div className="form-floating">
                            <input type='date' min={new Date().toJSON().slice(0, 10)} className="form-control" placeholder="Start Date" id="start-date" value={formState.startDate} onChange={(event) => setFormState({ ...formState, startDate: event.target.value })} />
                            <label htmlFor="start-date">Start Date</label>
                        </div>}
                    </div>

                    <div className={`mb-3`}>
                        {formState?.type === POST_TYPES.EVENT && <div className="form-floating">
                            <input type='date' min={new Date().toJSON().slice(0, 10)} className="form-control" placeholder="End Date" id="end-date" value={formState.endDate} onChange={(event) => setFormState({ ...formState, endDate: event.target.value })} />
                            <label htmlFor="end-date">End Date</label>
                        </div>}
                    </div>
                    <div className={`mb-3`}>
                        <div className="form-floating">
                            <textarea style={{ height: '100px' }} className="form-control" placeholder="Type Here...." id="floatingTextarea" rows={5} value={formState.text} onChange={(event) => setFormState({ ...formState, text: event.target.value })}></textarea>
                            <label htmlFor="floatingTextarea">Status</label>
                        </div>
                    </div>
                    {!isOnlyText && <div className={`d-flex justify-content-center align-items-center ${styles["image-upload"]} ${(!params.id && !ispreview) ? styles['withBackground'] : ''}`}>

                        {!ispreview ?
                            <>
                                <input type="file" id="media" hidden htmlFor="media" ref={inputReference} onChange={(event) => onPostImage(event)} accept=".mp4, .mov, .png, .jpeg, .jpg, .svg, .webp" />
                                <div>
                                    <i className={`fa fa-upload ${styles["icon"]}`} aria-hidden="true" onClick={() => onImagecLick()}></i>
                                </div>
                            </> :
                            <div className="d-flex justify-content-center">
                                {
                                    isImage ? <img src={blobPost} alt="postImage" /> : <video src={blobPost} controls />
                                }
                            </div>
                        }
                    </div>}
                    <div className={'d-flex justify-content-center pt-3'}>
                        <div >
                            <button className={'btn btn-primary'} onClick={() => backToHome()} disabled={isLoading}>Cancel</button>
                        </div>
                        <div className={'ms-3'}>
                            <button className={'btn btn-primary'} onClick={profileHandler} disabled={getIsDisabled()}>{params.postId ? "Update" : "Create"}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Create;