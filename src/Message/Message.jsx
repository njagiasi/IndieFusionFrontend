import { Fragment } from "react";

function Message() {
    return (
        <Fragment>
            <form>
                <div className="container">
                    <div className='card'>
                        <div className='d-flex justify-content-center card login-card'>
                            <div>
                                <div className='d-flex justify-content-around mb-3'>
                                    <h4>Password Reset!</h4>
                                </div>
                                <div>
                                    <div className="mb-5">
                                        <p className="text-center">Your password has been reset sucessfully.</p>
                                        <p className="text-center">Click below to login magically</p>
                                    </div>
                                    <div>
                                        <div className='text-center'>
                                            <button type="submit" className="btn btn-primary btn-color">Reset Password</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </Fragment>
    );
}

export default Message