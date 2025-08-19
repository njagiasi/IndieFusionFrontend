import React, { useEffect, useMemo, useState } from 'react';
import styles from './Search.module.css';
import { API_URL } from '../../../appConfig';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { capitalizeParagraph, openToast } from '../../../Utils/utils';
import Title from '../../../shared/components/title/Title';
import { useNavigate } from 'react-router-dom';
import NoDataFound from '../../../shared/components/NodataFound/NoDataFound';
const deafultProfileImage = '/Images/DefaultProfileImage.webp';



function Search() {
    const [countries, setCountries] = useState([]);
    const [cities, setCities] = useState([]);
    const [details, setDetails] = useState({
        loading: false,
        data: null
    });
    const API_BASE_URL = 'https://countriesnow.space/api/v0.1/countries';
    const { register, watch, handleSubmit } = useForm({
        mode: "onChange",
    })

    const navigate = useNavigate();

    useEffect(() => {
        const subscription = watch((value, { name, type }) => {
            if (name === 'country') {
                const cities = countries.find((obj) => obj.country === value.country)?.cities;
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


    const searchAPI = (data) => {
        setDetails({
            data: null,
            loading: true
        })
        const userId = localStorage.getItem("USER_ID")
        axios.post(`${API_URL}/search/${userId}`, data).then((res) => {
            if (res?.status === 200) {
                setDetails({
                    data: res.data?.data,
                    loading: false
                })
            } else {
                setDetails({
                    data: null,
                    loading: false
                })
                openToast("Something went wrong...Please try again..!");
            }
        }).catch((e) => {
            setDetails({
                data: null,
                loading: false
            })
            openToast("Something went wrong...Please try again..!");
        })
    };


    const getCountries = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}`);
            return response.data.data
        } catch (e) {
        }
    }

    const list = useMemo(() => {
        const userId = localStorage.getItem('USER_ID');
        return details?.data?.map((eachItem) => {
            return eachItem?.userDetails?._id !== userId && <div className={`${styles["main-Card"]} ${styles["card-items"]} ${!eachItem?.openToCollab ? styles["inactive-user"] : null}`} key={eachItem?._id} role='button' onClick={() => navigate(`/profile/${eachItem?.userDetails?._id}`)}>
                <img src={eachItem?.profileImage?.imageUrl ? `${API_URL}/${eachItem?.profileImage?.imageUrl}` : deafultProfileImage} className={`${styles["profile-img"]} ${styles["mg-right"]}`} alt={'profile img'} />
                <div>
                    <p className={`fw-bold ${styles["p-margin"]}`}>{eachItem?.userDetails?.userName}</p>
                    <p className={`${styles["p-margin"]}`}>{capitalizeParagraph(`${eachItem?.userDetails?.firstName} ${eachItem?.userDetails?.lastName}`)}</p>
                </div>
            </div>
        })
    }, [details?.data, navigate]);

    const loading = useMemo(() => {
        return <div className={`${styles["loading-container"]}`}>
            <div className={`spinner-border text-primary ${styles["indicator"]}`} role="status" >
                <span className="sr-only"></span>
            </div>
        </div>
    }, []);

    return (
        <div className={`${styles["container"]}`}>
            <div className={`${styles["main-Card-container"]}`}>
                <div>
                    <div>
                        <Title heading="Browse, Connect, Collaborate with Top Talent" />
                    </div>
                    <form onSubmit={handleSubmit(searchAPI)}>
                        <input className="form-control me-2 mt-3" type="search" placeholder="Search by First name, Last name, User name, Email, Skills" aria-label="Search" {
                            ...register('searchTerm')
                        } />
                        <div className='d-flex mt-3'>
                            <select className={`form-select`}
                                {
                                ...register('country')
                                }>
                                <option value="">Select Country</option>
                                {
                                    countries.map((country, index) => (
                                        <option key={`${country.country}_${index}`} value={country.country}>
                                            {country.country}
                                        </option>
                                    ))
                                }
                            </select>
                            <select type="text" id="city" className={`form-select ms-3`}
                                {
                                ...register('state')
                                } >
                                <option value="">Select City</option>
                                {
                                    cities.map((city) => (
                                        <option key={city} value={city}>
                                            {city}
                                        </option>
                                    ))
                                }
                            </select>
                        </div>
                        <div className='d-flex justify-content-end'>
                            <button className="btn btn-secondary mt-3 me-3" type="submit">Cancel</button>
                            <button className="btn btn-primary mt-3" type="submit">Search</button>
                        </div>
                    </form>
                </div>
                <div className='pt-5'>
                    <div className={`${styles["card-gap"]}`}>
                        {details?.loading && loading}
                        {(!details?.loading && details?.data?.length > 0) ? list : null}
                        {(!details?.loading && details?.data?.length <= 0) && <NoDataFound />}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Search;