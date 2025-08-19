import { Fragment, useCallback, useEffect, useRef, useState } from "react"
import styles from './profile.module.css';
import { useForm } from "react-hook-form";
import axios from "axios";
import { API_URL } from "../appConfig";
import { openToast } from "../Utils/utils";
import Title from "../shared/components/title/Title";
const deafultProfileImage = '/Images/DefaultProfileImage.webp';

function Profile() {

    const [image, setImage] = useState(deafultProfileImage);
    const [ispreview, setIsPreview] = useState(false);
    const [profilePicPayload, setProfilePicPayload] = useState(null);

    const [countries, setCountries] = useState([]);
    const [cities, setCities] = useState([]);
    const referenceInput = useRef();
    const API_BASE_URL = 'https://countriesnow.space/api/v0.1/countries';

    const defaultValues = {
        user: {
            "firstName": "",
            "lastName": "",
            "userName": "",
            "email": "",
            "type": "USER"
        },
        profile: {
            "profilePhoto": "",
            "phoneNumber": "",
            "address": "",
            "skills": "",
            "gender": "",
            "dob": "",
            "bio": "",
            "interestedIn": "",
            "country": "",
            "city": "",
            "isActive": false,
            "openToCollab": false,
            "userId": localStorage.getItem("USER_ID")
        }
    }

    const { register, watch, setValue, handleSubmit, formState: { errors } } = useForm({
        mode: "onChange",
        defaultValues: defaultValues
    })

    const [loading, setLoading] = useState(false);

    const [userDetails, setUserDetails] = useState({
        email: "",
        userName: ""
    })

    useEffect(() => {
        const subscription = watch((value, { name, type }) => {
            if (name === 'profile.country') {
                const cities = countries.find((obj) => obj.country === value.profile.country)?.cities;
                setCities(cities ?? []);
            }
            return;
        });
        return () => subscription.unsubscribe();
    }, [watch, countries])


    useEffect(() => {
        async function init() {
            try {
                const countryList = await getCountries();
                setCountries(countryList);
            } catch (e) {
                openToast('unable to get countries');
            }
        }
        init();
    }, []);

    const getProfileDetails = useCallback(() => {
        const userId = localStorage.getItem("USER_ID")
        axios.get(`${API_URL}/profile-update/${userId}`).then((res) => {
            if (res?.status === 200) {
                if (res.data.data.user) {
                    setValue('user', res.data.data.user);
                    setUserDetails({
                        email: res.data.data.user?.email,
                        userName: res.data.data.user?.userName
                    })
                }
                if (res.data.data.profile) {
                    const cities = countries.find((obj) => obj.country === res.data.data?.profile?.country)?.cities;
                    setCities(cities ?? []);
                    setTimeout(() => {
                        setValue('profile', res.data.data.profile);
                    }, 0);
                }
            } else {
                openToast("Something went wrong...Please try again..!");
            }
        }).catch((e) => {
            openToast("Something went wrong...Please try again..!");
        })
    }, [countries, setValue]);

    useEffect(() => {
        if (countries.length > 0) {
            getProfileImage();
            getProfileDetails();
        }
    }, [countries, getProfileDetails]);


    const getProfileImage = () => {
        const userId = localStorage.getItem("USER_ID")
        axios.get(`${API_URL}/profile-image-upload/${userId}`).then((res) => {
            if (res?.status === 200) {
                if (res?.data?.data?.imageUrl) {
                    setImage(`${API_URL}/${res.data.data.imageUrl}`);
                }
            } else {
                openToast('Unable to fetch profile image');
            }
        }).catch((e) => {
            openToast('Something went wrong...Please try again..!');
        })
    }

    const profileHandler = async (data) => {
        setLoading(true);
        data.profile.dob = data.profile.dob.toISOString().split("T")[0];
        const response = await axios.put(`${API_URL}/profile-update`, data)
        if (response.data.data) {
            setLoading(false);
            openToast('Profile Updated successfully!', false);
        } else {
            openToast('Something went wrong..Please try again..!');
            setLoading(false);
        }
        setTimeout(() => {
            setLoading(false);
        }, 3000);
    }

    const getMaxDate = () => {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        return date.toISOString().split("T")[0]
    }



    const onImagecLick = () => {
        referenceInput.current.click();
    }

    const onImageChange = (event) => {
        if (event?.target?.files?.[0]) {
            setImage(URL.createObjectURL(event.target.files[0]));
            setProfilePicPayload(event.target.files[0]);
            setIsPreview(true);
        }
    }

    const saveImage = () => {
        setLoading(true);
        const userId = localStorage.getItem("USER_ID")
        axios.post(`${API_URL}/profile-image-upload/${userId}`, { "profile-image": profilePicPayload }, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }).then(() => {
            setLoading(false);
            setIsPreview(false);
            openToast('Profile picture successfully uploaded', false)
        }).catch((e) => {
            setLoading(false);
            openToast('Something went wrong...Please try again..!')
        }).finally(() => {
            setLoading(false);
        })
    }


    const cancelImage = () => {
        setProfilePicPayload(null);
        getProfileImage();
        setIsPreview(false);
    }

    const getCountries = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}`);
            return response.data.data
        } catch (e) {
        }
    }



    return (
        <Fragment>
            <form onSubmit={handleSubmit(profileHandler)}>
                <div className={`container ${styles["container-card"]} `}>
                    <div className={styles["profile-card"]}>
                        <div>
                            <div className='d-flex justify-content-between pb-2'>
                                <div>
                                    <Title heading="Profile Settings" />
                                    <span className="badge bg-secondary btn-sm p-2">Your post will remain private until your account is Active.</span>
                                </div>
                                <div className='text-center'>
                                    <button type="submit" className="btn btn-primary btn-color" disabled={loading}>Update </button>
                                </div>
                            </div>
                            <div>
                                <div className={`d-flex justify-content-left ${styles["profile-image-card"]}`} >
                                    <div>
                                        <div>
                                            <input type="file" id="profileImage" hidden htmlFor="profileImage" ref={referenceInput} onChange={(event) => onImageChange(event)} accept=".png, .jpeg, .jpg, .svg, .webp" />
                                            <div className="d-flex justify-content-center">
                                                <img src={image ?? deafultProfileImage} alt="ProfileImage" className={styles["profile-Image"]} />
                                            </div>
                                        </div>
                                        <div className='d-flex justify-content-around mb-3'>
                                            {!ispreview ? <div>
                                                <i className="fa fa-pencil" aria-hidden="true" onClick={() => onImagecLick()}></i>
                                            </div> :
                                                <div className='d-flex justify-content-around mb-3 mt-3'>
                                                    <div className="me-2">
                                                        <button className="btn btn-secondary btn-sm" onClick={() => cancelImage()}>Cancel</button>
                                                    </div>
                                                    <div>
                                                        <button className="btn btn-primary btn-sm" type="button" onClick={() => saveImage()}>Save</button>
                                                    </div> 
                                                </div>}
                                        </div>
                                    </div>
                                    <div className={`d-flex justify-content-between ${styles["padding-left-20"]} `}>
                                        <div className={styles["email-display"]}>
                                            <p className={`${styles["font-bold"]} mb-1`}>{userDetails.userName}</p>
                                            <p className="mb-1">{userDetails.email}</p>
                                            <div className="mb-3">
                                                <div className="form-check form-switch">
                                                    <input className="form-check-input" type="checkbox" id="openToCollab"
                                                        {
                                                        ...register('profile.openToCollab')
                                                        }
                                                    />
                                                    <label className="form-check-label" htmlFor="openToCollab">Open To Collab</label>
                                                </div>
                                                <div className="form-check form-switch">
                                                    <input className="form-check-input" type="checkbox" id="isActive"
                                                        {
                                                        ...register('profile.isActive')
                                                        }
                                                    />
                                                    <label className="form-check-label" htmlFor="isActive">Active</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles["form-grid"]}>

                                    <div>
                                        <div>
                                            <label htmlFor="fname" className={`${styles["required"]}`}>First Name</label>
                                        </div>
                                        <div className="mb-3">
                                            <input type="text" id="fname" className={`${styles["input-box"]}`}
                                                {
                                                ...register('user.firstName', {
                                                    required: "First name is required"
                                                })
                                                } />
                                            <p className="text-danger">{errors.user?.firstName?.message}</p>
                                        </div>
                                    </div>


                                    <div>
                                        <div>
                                            <label htmlFor="lname" className={`${styles["required"]}`}>Last Name</label>
                                        </div>
                                        <div className="mb-3">
                                            <input type="text" id="lname" className={`${styles["input-box"]}`}
                                                {
                                                ...register('user.lastName', {
                                                    required: "Last name is required"
                                                })
                                                } />
                                            <p className="text-danger">{errors.user?.lastName?.message}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <div>
                                            <label htmlFor="pNo" className={`${styles["required"]}`}>Phone Number</label>
                                        </div>
                                        <div className="mb-3">
                                            <input type="text" id="pNo" className={`${styles["input-box"]}`}
                                                {
                                                ...register('profile.phoneNumber', {
                                                    required: "Phone number is required",
                                                    pattern: {
                                                        value: /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}$/,
                                                        message: "Invalid phone number"
                                                    }
                                                })
                                                } />
                                            <p className="text-danger">{errors.profile?.phoneNumber?.message}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <div>
                                            <label htmlFor="address" className={`${styles["required"]}`}>Address</label>
                                        </div>
                                        <div className="mb-3">
                                            <input type="text" id="address" className={`${styles["input-box"]}`}
                                                {
                                                ...register('profile.address', {
                                                    required: "Address are required"
                                                })
                                                } />
                                            <p className="text-danger">{errors.profile?.address?.message}</p>
                                        </div>
                                    </div>


                                    <div>
                                        <div>
                                            <label htmlFor="country" className={`${styles["required"]}`}>Country</label>
                                        </div>
                                        <div className="mb-3">
                                            <select className={`${styles["input-box"]}`}
                                                {
                                                ...register('profile.country', {
                                                    required: "Country is required"
                                                })
                                                }>
                                                <option value="">Select Country</option>
                                                {
                                                    countries.map((country, index) => (
                                                        <option key={index} value={country.country}>
                                                            {country.country}
                                                        </option>
                                                    ))
                                                }

                                            </select>
                                            <p className="text-danger">{errors.profile?.address?.message}</p>
                                        </div>
                                    </div>


                                    <div>
                                        <div>
                                            <label htmlFor="city" className={`${styles["required"]}`}>City</label>
                                        </div>
                                        <div className="mb-3">
                                            <select type="text" id="city" className={`${styles["input-box"]}`}
                                                {
                                                ...register('profile.city', {
                                                    required: "City is required"
                                                })
                                                } >
                                                <option value="">Select City</option>
                                                {
                                                    cities.map((city, index) => (
                                                        <option key={city} value={city}>
                                                            {city}
                                                        </option>
                                                    ))
                                                }
                                            </select>
                                            <p className="text-danger">{errors.profile?.city?.message}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <div>
                                            <label htmlFor="gender" className={`${styles["required"]}`}>Gender</label>
                                        </div>
                                        <select className={`mb-3 ${styles["input-box"]}`} id="gender"
                                            {
                                            ...register('profile.gender', {
                                                required: "Please select Gender"
                                            })
                                            }>
                                            <option value="">Open this select menu</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Others">Others</option>
                                        </select>
                                        <p className="text-danger">{errors.profile?.gender?.message}</p>
                                    </div>


                                    <div>
                                        <div>
                                            <label htmlFor="dob" className={`${styles["required"]}`}>DOB</label>
                                        </div>
                                        <div className="mb-3">
                                            <input type="date" max={getMaxDate()} id="dob" className={`${styles["input-box"]}`} {
                                                ...register('profile.dob', {
                                                    required: "DOB is required",
                                                    valueAsDate: true
                                                })
                                            } />
                                            <p className="text-danger">{errors.profile?.dob?.message}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <div>
                                            <label htmlFor="skills" className={`${styles["required"]}`}>Skills</label>
                                        </div>
                                        <div className="mb-3">
                                            <input type="text" id="skills" className={`${styles["input-box"]}`}
                                                {
                                                ...register('profile.skills', {
                                                    required: "Skills are required"
                                                })
                                                } />
                                            <p className={styles["hint-font-size"]}>Hint:Singing,Dancing,Musician,..</p>
                                            <p className="text-danger">{errors.profile?.skills?.message}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <div>
                                            <label htmlFor="interestedIn">Interests</label>
                                        </div>
                                        <div className="mb-3">
                                            <input type="text" id="interestedIn" className={`${styles["input-box"]}`}
                                                {
                                                ...register('profile.interestedIn')
                                                } />
                                            <p className={styles["hint-font-size"]}>Hint:Singing,Dancing,Musician,..</p>
                                            <p className="text-danger">{errors.profile?.interestedIn?.message}</p>
                                        </div>
                                    </div>


                                    <div>
                                        <div>
                                            <label htmlFor="bio" >Bio</label>
                                        </div>
                                        <div className="mb-3">
                                            <textarea id="bio" className={`${styles["input-box"]}`}
                                                {
                                                ...register('profile.bio')
                                                } ></textarea>
                                            <p className="text-danger">{errors.profile?.bio?.message}</p>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </Fragment>
    )
}

export default Profile