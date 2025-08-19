import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styles from './Events.module.css';
import Title from '../../../shared/components/title/Title';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../../appConfig';
import { openToast } from '../../../Utils/utils';
import NoDataFound from '../../../shared/components/NodataFound/NoDataFound';
import LoadingIndicator from '../../../shared/components/LoadingIndicator/LoadingIndicator';

function Events() {
    const [eventData, setEvents] = useState({
        loading: false,
        data: []
    });

    const navigate = useNavigate();

    useEffect(() => {
        fetchAllEvents();
    }, []);

    const fetchAllEvents = () => {
        setEvents({
            loading: true,
            data: null
        });
        const userID = localStorage.getItem('USER_ID');
        axios.get(`${API_URL}/post-event/${userID}`).then((res) => {
            if (res.data) {
                setEvents({
                    loading: false,
                    data: res.data?.data,
                });
            } else {
                setEvents({
                    loading: false,
                    data: null
                });
                openToast("Unable to fetch Groups... Please try again ...")
            }
        }).catch(() => {
            openToast("Unable to fetch Groups... Please try again ...")
        })
    }
    const eventHandler = useCallback((eventId) => {
        navigate(`/events/${eventId}`);
    }, [navigate]);

    const eventList = useMemo(() => {
        return eventData?.data?.map((eachEvent) => {
            return <div className={`${styles["main-Card"]} ${styles["card-items"]}`} role='button' onClick={() => eventHandler(eachEvent?._id)}>
                <div className={`${styles["icon-box"]}`}>
                    <i className={`fa fa-calendar ${styles["fafa-icon-size"]}`} aria-hidden="true" ></i>
                </div>
                <div>
                    <p className={`${styles["p-margin"]}`}>{`${eachEvent?.userDetails?.userName}`}</p>
                    <p className={`${styles["p-margin"]}`}>{eachEvent?.title}</p>
                    <p className={`${styles["p-margin"]} ${styles["date-font"]}`}>
                        {eachEvent?.startDate && <span>{eachEvent?.startDate} </span>}
                        {eachEvent?.endDate && <span>{`to ${eachEvent?.endDate}`}</span>}
                    </p>
                </div>
            </div>
        })

    }, [eventData?.data, eventHandler]);

    const eventsLoading = useMemo(() => {
        return <LoadingIndicator/>
    }, []);

    const noEventsFound = useMemo(() => {
        return <NoDataFound/>
    }, []);
    return (
        <div className={`${styles["container"]}`}>
            <div>
                <div className={`${styles["card-gap"]}`}>
                    <div>
                        <Title heading="Events" />
                    </div>
                    {eventData.loading && eventsLoading}
                    {(!eventData.loading && eventData.data?.length <= 0) && noEventsFound}
                    {(!eventData.loading && eventData.data?.length) ? eventList : null}
                </div>
            </div>

        </div>
    )
}

export default Events