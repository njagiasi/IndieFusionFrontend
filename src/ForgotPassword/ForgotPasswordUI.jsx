import { Fragment, useState } from "react";
import styles from './ForgotPasswordUI.module.css';
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { API_URL } from "../appConfig";
import axios from "axios";

function ForgotPasswordUI() {
    const defaultValues = {
        "email": ""
    }
    const { register, formState: { errors }, handleSubmit, reset } = useForm({
        mode: "onChange",
        defaultValues: defaultValues
    });

    const [forgotStatus, setForgotStatus] = useState({
        isLoading: false,
        errorMessage: '',
        successMessage: ''
    })

    const forgotPasswordSubmitHandler = async (data) => {
        setForgotStatus({
            isLoading: true,
            errorMessage: '',
            successMessage: ''
        })

        const response = await axios.post(`${API_URL}/forgot-password`, data)
        if (response.data.data) {
            setForgotStatus({
                isLoading: false,
                errorMessage: '',
                successMessage: 'Password has been sent to your email'
            });
            reset();
        } else {
            setForgotStatus({
                isLoading: false,
                errorMessage: response.data.success,
                successMessage: ''
            })
        }
    }

    return (
        <Fragment>

            <form onSubmit={handleSubmit(forgotPasswordSubmitHandler)}>
                <div className={`container ${styles["container-card"]}`}>
                    <div className={`d-flex justify-content-center card ${styles['login-card']}`}>
                        <div>
                            <div className='d-flex justify-content-around mb-5'>
                                <h4>Forgot Password?</h4>
                            </div>
                            {(forgotStatus.errorMessage || forgotStatus.successMessage) && <div className={`alert ${forgotStatus.errorMessage ? 'alert-danger' : 'alert-success'}  alert-dismissible fade show`} role="alert">
                                {forgotStatus.errorMessage}
                                {forgotStatus.successMessage}
                            </div>}
                            <div>
                                <div>
                                    <div className="text-center">
                                        <label htmlFor="email" >Email</label>
                                    </div>
                                    <div className="mb-3 text-center">
                                        <input type="email" id="email" className={`${styles['input-box']}`}
                                            {
                                            ...register('email', {
                                                required: 'Email is required'
                                            },)
                                            } />
                                        <p className="text-danger">{errors.email && errors.email.message}</p>
                                    </div>
                                </div>
                                <div className='text-center'>
                                    <button type="submit" className={`btn btn-primary ${styles['btn-color']}`} disabled={forgotStatus.isLoading}>{forgotStatus.isLoading ? 'Loading...' : 'Submit'}</button>
                                </div>
                                <div className="d-flex justify-content-center">
                                    <i className="fa fa-long-arrow-left mt-1" aria-hidden="true"></i>
                                    <p className={`${styles["fontSize"]}`}><Link to={'/login'}>Back to Login</Link></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </Fragment>
    );
}


export default ForgotPasswordUI;