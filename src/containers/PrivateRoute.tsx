import React, { useEffect } from 'react'
import { useAuthContext } from '../providers/AuthProvider'
import { useNavigate } from 'react-router-dom'

export const PrivateRoute = (props: any) => {
    const {currentUser, loadingUser} = useAuthContext()
    const navigate = useNavigate()

    useEffect(() => {
        if (!currentUser && !loadingUser) {
            navigate('/login')
        }
    }, [])

    return props.children
}