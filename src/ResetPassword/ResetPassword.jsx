import { Fragment, useState } from "react";
import styles from './ResetPassword.module.css'
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { API_URL } from "../appConfig";

function ResetPassword() {

    const defaultValues = {
        "oldPassword": "",
        "newPassword": "",
        "confirmPassword": ""
    }
    const { register, formState: { errors }, handleSubmit, reset } = useForm({
        mode: "onChange",
        defaultValues: defaultValues
    });

    const [resetPasswordStatus, setResetPasswordStatus] = useState({
        isLoading: false,
        errorMessage: '',
        successMessage: ''
    })

    const resetPasswordSubmitHandler = async (data) => {
        setResetPasswordStatus({
            isLoading: true,
            errorMessage: '',
            successMessage: ''
        })
        const userId = localStorage.getItem("USER_ID");
        try {
            const response = await axios.post(`${API_URL}/reset-password/${userId}`, data)
            if (response.data.data) {
                setResetPasswordStatus({
                    isLoading: false,
                    errorMessage: '',
                    successMessage: 'Password reset successfull'
                });
                reset();
            } else {
                setResetPasswordStatus({
                    isLoading: false,
                    errorMessage: response.data.success,
                    successMessage: ''
                })
            }

        } catch (e) {
            if (e?.response?.status === 404) {

                setResetPasswordStatus({
                    isLoading: false,
                    errorMessage: 'Invalid credentials... Please try again',
                    successMessage: ''
                })
            } else {
                setResetPasswordStatus({
                    isLoading: false,
                    errorMessage: 'Something went wrong... Please try again',
                    successMessage: ''
                })
            }
        }

    }


    return (
        <Fragment>

            <form onSubmit={handleSubmit(resetPasswordSubmitHandler)}>
                <div className={`${styles["container"]}`}>
                    <div className={`d-flex justify-content-center card  ${styles["login-card"]}`}>
                        <div>
                            <div className='d-flex justify-content-around mb-5'>
                                <h4>Reset Password</h4>
                            </div>
                            {(resetPasswordStatus.errorMessage || resetPasswordStatus.successMessage) && <div className={`alert ${resetPasswordStatus.errorMessage ? 'alert-danger' : 'alert-success'}  alert-dismissible fade show`} role="alert">
                                {resetPasswordStatus.errorMessage}
                                {resetPasswordStatus.successMessage}
                            </div>}
                            <div>
                                <div>
                                    <label htmlFor="oldPass" >Old Password</label>
                                </div>
                                <div className="mb-3">
                                    <input type="password" id="oldPass" className={styles["input-box"]}
                                        {
                                        ...register('oldPassword', {
                                            required: 'Old password is required'
                                        },)
                                        } />
                                    <p className="text-danger">{errors.oldPassword && errors.oldPassword.message}</p>
                                </div>
                                <div>
                                    <label htmlFor="newPass" >New Password</label>
                                </div>
                                <div className="mb-3">
                                    <input type="password" id="newPass" className={styles["input-box"]}
                                        {
                                        ...register('newPassword', {
                                            required: 'New password is required'
                                        },)
                                        } />
                                    <p className="text-danger">{errors.newPassword && errors.newPassword.message}</p>
                                </div>
                                <div>
                                    <label htmlFor="confirmPass" >Confirm Password</label>
                                </div>
                                <div className="mb-3">
                                    <input type="password" id="confirmPass" className={styles["input-box"]}
                                        {
                                        ...register('confirmPassword', {
                                            required: 'Confirm password is required'
                                        },)
                                        } />
                                    <p className="text-danger">{errors.confirmPassword && errors.confirmPassword.message}</p>
                                </div>
                                <div className='text-center'>
                                    <button type="submit" className={`btn btn-primary ${styles["btn-color"]}`} disabled={resetPasswordStatus.isLoading}>{resetPasswordStatus.isLoading ? 'Loading...' : 'Reset Password'}</button>
                                </div>
                                <div className="d-flex justify-content-center">
                                    <i className="fa fa-long-arrow-left mt-1" aria-hidden="true"></i>
                                    <p className="fontSize"><Link to={'/dashboard'}>Back to Home</Link></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </Fragment>
    );
}

export default ResetPassword