import { createContext, useContext, useState, useEffect } from 'react'
import api from '../utils/api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/auth/profile')
                setUser(res.data)
            } catch {
                setUser(null)
            } finally {
                setLoading(false)
            }
        }
        fetchProfile()
    }, [])

    const login = async (email, password) => {
        const res = await api.post('/auth/login', { email, password })
        setUser(res.data.user)
        return res.data
    }

    const register = async (username, email, password) => {
        const res = await api.post('/auth/register', { username, email, password })
        setUser(res.data.user)
        return res.data
    }

    const logout = async () => {
        await api.post('/auth/logout')
        setUser(null)
    }

    const googleLogin = async (credential) => {
        const { jwtDecode } = await import('jwt-decode')
        const decoded = jwtDecode(credential)
        const res = await api.post('/auth/google', {
            email: decoded.email,
            name: decoded.name,
            picture: decoded.picture,
            googleId: decoded.sub
        })
        setUser(res.data.user)
        return res.data
    }

    return (
        <AuthContext.Provider value={{ user, setUser, loading, login, register, logout, googleLogin }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)