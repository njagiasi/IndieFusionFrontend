import { Fragment, useState } from 'react';
import styles from './LoginRegister.module.css';
import LoginUI from './LoginUI';
import RegisterUI from './RegisterUI';

function LoginSignUp() {
    const [isLogin, setIsLogin] = useState(true);

    const registerHandler=()=>{
        setIsLogin(false);
    }

    const loginHandler=()=>{
        setIsLogin(true);
    }

    return (
        <Fragment>
            <div>
                <div className={`container ${styles["container-card"]}`}>
                        <div className={`d-flex justify-content-center ${styles["login-card"]}`}>
                            <div>
                                <div className='d-flex justify-content-around mb-5'>
                                    <ul className="nav nav-pills nav-fill">
                                        <li className="nav-item">
                                            <button type="button"  className={`nav-link ${isLogin ? styles['btn-color'] : ''}`}
                                            onClick={()=>loginHandler()}>Login</button>
                                        </li>
                                        <li className="nav-item">
                                            <button type="button" className={`nav-link ${styles["btn-link"]} ${!isLogin ? styles['btn-color'] : ''}`}
                                            onClick={()=>registerHandler()}>Register</button>
                                        </li>
                                    </ul>
                                </div>
                                { isLogin ? <LoginUI registerHandler={registerHandler}/> : 
                                <RegisterUI loginHandler={loginHandler}/>}  
                            </div>
                        </div>
                </div>
            </div>
        </Fragment>
    );
}


export default LoginSignUp;