import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowRight, FaSignInAlt } from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'

const Login = () => {
    const { login } = useAuth()
    const { theme } = useTheme()
    const navigate = useNavigate()

    const [form, setForm] = useState({ email: '', password: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

    const handleSubmit = async e => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const data = await login(form.email, form.password)
            toast.success('Login berhasil')
            navigate(data.user.role === 'admin' ? '/admin' : '/')
        } catch (err) {
            const msg = err.response?.data?.message || 'Login gagal'
            setError(msg)
            toast.error(msg)
        } finally {
            setLoading(false)
        }
    }

    const getBgClass = () => {
        if (theme === 'cyberpunk') return 'bg-[#0a0a2a]'
        if (theme === 'dark') return 'bg-gray-950'
        return 'bg-gray-50'
    }

    const getCardBgClass = () => {
        if (theme === 'cyberpunk') return 'bg-[#1a1a4a] border-cyan-500/30'
        if (theme === 'dark') return 'bg-gray-900 border-gray-800'
        return 'bg-white border-gray-200 shadow-xl'
    }

    const getTextSecondaryClass = () => {
        if (theme === 'cyberpunk') return 'text-cyan-300'
        if (theme === 'dark') return 'text-gray-400'
        return 'text-gray-500'
    }

    const getInputClass = () => {
        if (theme === 'cyberpunk') return 'bg-[#0a0a2a] border-cyan-500/30 text-cyan-300 placeholder-cyan-700'
        if (theme === 'dark') return 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
        return 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
    }

    return (
        <div className={`min-h-[90vh] flex items-center justify-center px-4 py-8 ${getBgClass()}`}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, type: 'spring' }}
                className="w-full max-w-md"
            >
                <div className={`rounded-2xl p-6 md:p-8 ${getCardBgClass()}`}>
                    {/* HEADER */}
                    <div className="text-center mb-6">
                        <img
                            src="/logoweb.png"
                            alt="logo"
                            className="w-16 h-16 mx-auto mb-3 object-contain"
                        />
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                            G-RantCar
                        </h1>
                        <p className={`text-sm mt-1 ${getTextSecondaryClass()}`}>
                            Masuk ke akun Anda
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl mb-4 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {/* Email */}
                        <div className="relative">
                            <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                name="email"
                                type="email"
                                placeholder="Email"
                                value={form.email}
                                onChange={handleChange}
                                className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:border-blue-500 transition-colors ${getInputClass()}`}
                            />
                        </div>

                        {/* Password */}
                        <div className="relative">
                            <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                value={form.password}
                                onChange={handleChange}
                                className={`w-full pl-10 pr-12 py-3 rounded-xl border focus:outline-none focus:border-blue-500 transition-colors ${getInputClass()}`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                {showPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                            </button>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white py-3 rounded-xl font-bold transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-60"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Memproses...
                                </>
                            ) : (
                                <>
                                    <FaSignInAlt className="w-4 h-4" />
                                    Login
                                    <FaArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className={`text-center mt-4 text-sm ${getTextSecondaryClass()}`}>
                        Belum punya akun?{' '}
                        <Link to="/register" className="text-blue-500 hover:text-blue-600 font-semibold transition-colors">
                            Daftar
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    )
}

export default Login