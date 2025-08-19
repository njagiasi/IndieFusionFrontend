import axios from "axios";
import { API_URL } from "../appConfig";

export const fetchNotifications = () => {
    const userID = localStorage.getItem('USER_ID');
    return axios.get(`${API_URL}/notifications/${userID}`);
};