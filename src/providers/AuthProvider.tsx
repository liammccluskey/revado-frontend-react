import {createContext, useContext, useState} from 'react'

import { api } from '../utils/networking';

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
    login: (loginRequest: LoginRequest) => Promise<void>;
    registerAndLogin: (registerRequest: RegisterRequest) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<ContextType>({
    currentUser: null,
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

    // Utils

    const setToken = (token: string | null) => {
        if (token) {
            localStorage.setItem('jwt', token)
        } else {
            localStorage.removeItem('jwt')
        }
    }

    const fetchCurrentUser = async () => {
        if (localStorage.getItem('jwt')) {
            try {
                const res = await api.get('/users/self')
                setCurrentUser(res.data)
            } catch (error) {
                console.log('Error: occured while fetching current user')
                console.log(error)
                throw error
            }
        } else {
            const error = new Error('Error: cannot fetch current user without jwt token')
            console.log(error.message)
            throw error
        }
    }

    // Direct

    
    const login = async (loginRequest: LoginRequest) => {
        try {
            const res = await api.post('/auth', loginRequest)
            setToken(res.data.token)
            await fetchCurrentUser()
        } catch (error) {
            throw error
        }
    }
    
    const registerAndLogin = async (registerRequest: RegisterRequest) => {
        try {
            const res = await api.post('/auth', registerRequest)
            const {email, password} = registerRequest
            const loginRequest = {email, password}
            await login(loginRequest)
        } catch (error) {
            throw error
        }
    }
    
    const logout = () => {
        setToken(null)
        window.location.href = "/login"
    }

    return (
        <AuthContext.Provider value={{currentUser, login, registerAndLogin, logout}} >
            {props.children}
        </AuthContext.Provider>
    )
}