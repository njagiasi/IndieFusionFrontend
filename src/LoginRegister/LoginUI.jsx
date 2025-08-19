import axios from "axios";
import { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../appConfig";
import styles from './LoginRegister.module.css';

function LoginUI(props) {

    const navigation = useNavigate();
    const defaultValues = {
        "email": "",
        "password": ""
    }
    const { register, formState: { errors }, handleSubmit, reset } = useForm({
        mode: "onChange",
        defaultValues: defaultValues
    });

    const [loginStatus, setLoginStatus] = useState({
        isLoading: false,
        errorMessage: '',
        successMessage: ''
    })

    const loginSubmitHandler = async (data) => {
        setLoginStatus({
            isLoading: true,
            errorMessage: '',
            successMessage: ''
        })

        try {
            const response = await axios.post(`${API_URL}/login`, data)
            if (response.data.data) {
                setLoginStatus({
                    isLoading: false,
                    errorMessage: '',
                    successMessage: 'User logged in successfully'
                });
                reset();
                localStorage.setItem('USER_ID', response.data.data?._id);
                localStorage.setItem('userName', response.data.data?.userName);
                navigation('/profile');
            } else {
                setLoginStatus({
                    isLoading: false,
                    errorMessage: response.data.success,
                    successMessage: ''
                })
            }

        } catch (e) {
            if (e?.response?.status === 404) {

                setLoginStatus({
                    isLoading: false,
                    errorMessage: 'Invalid credentials... Please try again',
                    successMessage: ''
                })
            } else {
                setLoginStatus({
                    isLoading: false,
                    errorMessage: 'Something went wrong... Please try again',
                    successMessage: ''
                })
            }
        }

    }

    return (
        <Fragment>
            {(loginStatus.errorMessage || loginStatus.successMessage) && <div className={`alert ${loginStatus.errorMessage ? 'alert-danger' : 'alert-success'}  alert-dismissible fade show`} role="alert">
                {loginStatus.errorMessage}
                {loginStatus.successMessage}
            </div>}
            <form onSubmit={handleSubmit(loginSubmitHandler)}>
                <div>
                    <label htmlFor="email" >Email</label>
                </div>
                <div className="mb-3">
                    <input type="email" id="email" className={`${styles['input-box']}`}
                        {
                        ...register('email', {
                            required: 'Email is required'
                        },)
                        } />
                    <p className="text-danger">{errors.email && errors.email.message}</p>
                </div>

                <div >
                    <label htmlFor="pass" >Password</label>
                </div>
                <div className="mb-3">
                    <input type="password" id="pass" className={`${styles['input-box']}`}
                        {
                        ...register('password', {
                            required: 'Password is required'
                        },)
                        } />
                    <p className="text-danger">{errors.password && errors.password.message}</p>
                    <p className='text-end mt-2'><Link to={'/forgot-password'}>Forgot Password? </Link></p>
                </div>

                <div className='text-center'>
                    <button type="submit" className={`btn btn-primary ${styles["btn-color"]}`} disabled={loginStatus.isLoading}>{loginStatus.isLoading ? 'Loading...' : 'Login'}</button>

                </div>


                <div className="d-flex justify-content-center">
                    <p className='text-center mt-2'>Don't have an account? </p>
                    <button type="button" className={`nav-link mt-2 ${styles["link"]}`} onClick={() => { props.registerHandler() }}>Register</button>
                </div>

            </form>
        </Fragment>
    )
}

export default LoginUI