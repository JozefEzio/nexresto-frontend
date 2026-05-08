import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'
import AccessDenied from './AccessDenied'

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { loading, isAuth, user } = useContext(AuthContext);
    if (loading) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50">
                <div className="relative w-20 h-20">
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-primary-orange rounded-full border-t-transparent animate-spin"></div>
                </div>
                <h2 className="mt-4 font-abeezee text-xl font-semibold animate-pulse">
                    NexResto
                </h2>
            </div>
        );
    }

    if (!isAuth) {
        return <Navigate to={'/login'} replace />
    }

    if (allowedRoles && !allowedRoles.includes(user?.role.label)) {
        return <AccessDenied/>
    }

    return children
}

export default ProtectedRoute