import axios from "axios";
import { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import { API_URL } from "../appConfig";
import styles from './LoginRegister.module.css';

function RegisterUI(props) {
    const defaultValues = {
        "firstName": "",
        "lastName": "",
        "userName": "",
        "email": "",
        "type": "USER"
    }
    const { register, formState: { errors }, handleSubmit, reset } = useForm({
        mode: "onChange",
        defaultValues: defaultValues
    });


    const [registerStatus, setRegisterStatus] = useState({
        isLoading: false,
        errorMessage: '',
        successMessage: ''
    })

    const registerSubmitHandler = async (data) => {
        setRegisterStatus({
            isLoading: true,
            errorMessage: '',
            successMessage: ''
        })

        const response = await axios.post(`${API_URL}/register`, data)
        if (response.data.data) {
            setRegisterStatus({
                isLoading: false,
                errorMessage: '',
                successMessage: 'Registered successfully. Password is sent to your registered email'
            });
            reset();
        } else {
            setRegisterStatus({
                isLoading: false,
                errorMessage: response.data.success,
                successMessage: ''
            })
        }
    }

    return (
        <Fragment>
            {(registerStatus.errorMessage || registerStatus.successMessage) && <div className={`alert ${registerStatus.errorMessage ? 'alert-danger' : 'alert-success'}  alert-dismissible fade show`} role="alert">
                {registerStatus.errorMessage}
                {registerStatus.successMessage}
            </div>}
            <form onSubmit={handleSubmit(registerSubmitHandler)}>
               
                    <div>
                        <label htmlFor="fname" >First Name</label>
                    </div>
                    <div className="mb-3">
                        <input type="text" id="fname" className={`${styles['input-box']}`}
                            {
                            ...register('firstName', {
                                required: 'First name is required'
                            },)
                            }
                        />
                        <p className="text-danger">{errors.firstName && errors.firstName.message}</p>
                    </div>
               
                    <div>
                        <label htmlFor="lname" >Last Name</label>
                    </div>
                    <div className="mb-3">
                        <input type="text" id="lname" className={`${styles['input-box']}`}
                            {
                            ...register('lastName', {
                                required: 'Last name is required'
                            },)
                            } />
                        <p className="text-danger">{errors.lastName && errors.lastName.message}</p>
                    </div>
                
                    <div>
                        <label htmlFor="uname">Username</label>
                    </div>
                    <div className="mb-3">
                        <input type="text" id="uname" className={`${styles['input-box']}`}
                            {
                            ...register('userName', {
                                required: 'Username name is required'
                            },)
                            } />
                        <p className="text-danger">{errors.userName && errors.userName.message}</p>
                    </div>
               
                    <div>
                        <label htmlFor="email" >Email</label>
                    </div>
                    <div className="mb-3">
                        <input type="email" id="email" className={`${styles['input-box']}`}
                            {
                            ...register('email', {
                                required: 'Email is required',
                                pattern:{
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                    message: 'Invalid email format',
                                  },
                            },)
                            } />
                        <p className="text-danger">{errors.email && errors.email.message}</p>
                    </div>
                    <div className='text-center'>
                        <button type="submit" className={`btn btn-primary ${styles['btn-color']}`} disabled={registerStatus.isLoading}>{registerStatus.isLoading ? 'Loading...' : 'Register'}</button>
                    </div>
                
                    <div className="d-flex justify-content-center">
                        <p className='text-center mt-2'>Already have an account? </p>
                        <button className={`nav-link mt-2 ${styles["link"]}`} onClick={() => { props.loginHandler() }}>Login</button>
                    </div>
               
            </form>
        </Fragment>
    )
}

export default RegisterUI