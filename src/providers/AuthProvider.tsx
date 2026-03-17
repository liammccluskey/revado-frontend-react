import {createContext, useContext, useEffect, useState} from 'react'

import { api, getErrorMessage } from '../utils/networking';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginResponse {
  token: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
}

interface ContextType {
    currentUser: User | null;
    loadingUser: boolean;
    login: (loginRequest: LoginRequest) => Promise<void>;
    registerAndLogin: (registerRequest: RegisterRequest) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<ContextType>({
    currentUser: null,
    loadingUser: true,
    login: async () => {},
    registerAndLogin: async () => {},
    logout: () => {}
})

export const useAuthContext = () => {
    return useContext(AuthContext)
}

export const AuthProvider = (props: any) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null)
    const [loadingUser, setLoadingUser] = useState<boolean>(true)

    useEffect(() => {
        fetchCurrentUser()
    }, [])

    // Utils

    const setToken = (token: string | null) => {
        if (token) {
            localStorage.setItem('jwt', token)
        } else {
            localStorage.removeItem('jwt')
        }
    }

    const fetchCurrentUser = async () => {
        setLoadingUser(true)

        const token = localStorage.getItem('jwt')

        if (!token) {
            setCurrentUser(null)
            setLoadingUser(false)
            return
        }

        try {
            const res = await api.get('/users/self')
            setCurrentUser(res.data)
        } catch (error) {
            console.log("Failed to fetch user")
            setToken(null)
            setCurrentUser(null)
        }

        setLoadingUser(false)
    }

    // Direct

    
    const login = async (loginRequest: LoginRequest) => {
        try {
            const res = await api.post('/auth/login', loginRequest)
            setToken(res.data.token)
            await fetchCurrentUser()
        } catch (error: any) {
            throw new Error(getErrorMessage(error))
        }
    }
    
    const registerAndLogin = async (registerRequest: RegisterRequest) => {
        try {
            const res = await api.post('/auth/register', registerRequest)
            const {email, password} = registerRequest
            const loginRequest = {email, password}
            await login(loginRequest)
        } catch (error: any) {
            throw new Error(getErrorMessage(error))
        }
    }
    
    const logout = () => {
        setToken(null)
        setCurrentUser(null)
        window.location.href = "/login"
    }

    return (
        <AuthContext.Provider value={{currentUser, loadingUser, login, registerAndLogin, logout}} >
            {!loadingUser && props.children}
        </AuthContext.Provider>
    )
}