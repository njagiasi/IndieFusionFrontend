import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'

function PreLoginLayout() {
    const {pathname} = useLocation();
    return (
        <div className={`${pathname !== '/' && 'background-image'}`}>
            <Outlet />
        </div>
    )
}

export default PreLoginLayout