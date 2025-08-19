import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styles from './Group.module.css';
import axios from 'axios';
import { API_URL } from '../../../appConfig';
import { openToast } from '../../../Utils/utils';
import { useNavigate } from 'react-router-dom';
import Title from '../../../shared/components/title/Title';
import LoadingIndicator from '../../../shared/components/LoadingIndicator/LoadingIndicator';
import NoDataFound from '../../../shared/components/NodataFound/NoDataFound';

function Group() {

  const [groupsData, setGroups] = useState({
    loading: false,
    data: []
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchCurrentUserGroups();
  }, []);

  const fetchCurrentUserGroups = () => {
    setGroups({
      loading: true,
      data: null
    });
    const userID = localStorage.getItem('USER_ID');
    axios.get(`${API_URL}/group/${userID}`).then((res) => {
      if (res.data) {
        setGroups({
          loading: false,
          data: res.data?.data,
        });
      } else {
        setGroups({
          loading: false,
          data: null
        });
        openToast("Unable to fetch Groups... Please try again ...")
      }
    }).catch(() => {
      openToast("Unable to fetch Groups... Please try again ...")
    })
  }

  const groupHandler = useCallback((groupId) => {
    navigate(`/groups/${groupId}`);
  }, [navigate]);

  const groupsList = useMemo(() => {
    return groupsData?.data?.map((eachGroup) => {
      return <div className={`${styles["main-Card"]} ${styles["card-items"]}`} key={eachGroup.groupId} onClick={() => groupHandler(eachGroup.groupId)}>
        <div className={`${styles["icon-box"]}`}>
          <i className={`fa fa-users ${styles["fafa-icon-size"]} ${(eachGroup?.isAdmin && eachGroup?.isActive) && 'text-success'} ${(eachGroup?.isAdmin && !eachGroup?.isActive) && 'text-danger'}`} aria-hidden="true" ></i>
        </div>
        <div>
          <div className='d-flex justify-content-between'>
            <div>
              <p className={`${styles["p-margin"]} fw-bold fst-bold fs-5`}>{eachGroup?.postDetails?.title}</p>
            </div>
            <div>
              {eachGroup?.isAdmin && <p className={`${styles["p-margin"]} fw-bold ${styles["date-font"]} ${eachGroup?.isActive ? 'text-success' : "text-danger"}`}>{'Admin'}</p>}
            </div>
          </div>
          <p className={`${styles["p-margin"]} fs-6`}>{eachGroup?.userDetails?.userName}</p>
          <p className={`${styles["p-margin"]} ${styles["date-font"]}`}>{eachGroup?.postDetails?.createdDate ? (new Date(eachGroup?.postDetails?.createdDate))?.toDateString() : null}</p>
          <p className={`${styles["p-margin"]} ${styles["date-font"]} ${eachGroup?.isActive ? 'text-success' : 'text-danger'}`}>{eachGroup?.isActive ? "Active" : "Inactive"}</p>
        </div>
      </div>
    })

  }, [groupsData.data, groupHandler]);

  const groupsLoading = useMemo(() => {
    return <LoadingIndicator/>
  }, []);

  const noGroupsFound = useMemo(() => {
    return <NoDataFound/>
  }, []);

  return (
    <div className={`${styles["container"]}`}>
      <div className={`${styles["main-Card-container"]}`}>
        <div className={`${styles["card-gap"]}`}>
          <div>
            <Title heading="Groups" />
          </div>
          {groupsData.loading && groupsLoading}
          {(!groupsData.loading && groupsData.data?.length <= 0) && noGroupsFound}
          {(!groupsData.loading && groupsData.data?.length) ? groupsList : null}
        </div>
      </div>
    </div>
  )
}

export default Group