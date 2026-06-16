import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ThemeSwitcher from './ThemeSwitcher'
import NotificationBell from './NotificationBell'

const Navbar = () => {
    const { user, logout } = useAuth()
    const { theme } = useTheme()
    const navigate = useNavigate()
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleLogout = async () => {
        await logout()
        navigate('/login')
    }

    const getNavbarBg = () => {
        if (scrolled) {
            if (theme === 'cyberpunk') return 'bg-[#0a0a2a]/95 backdrop-blur-md border-b border-cyan-500/30'
            if (theme === 'dark') return 'bg-gray-900/95 backdrop-blur-md border-b border-gray-800'
            return 'bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm'
        }
        return 'bg-transparent'
    }

    const getTextClass = () => {
        if (theme === 'cyberpunk') return 'text-cyan-400'
        if (theme === 'dark') return 'text-white'
        return 'text-gray-900'
    }

    const getTextSecondaryClass = () => {
        if (theme === 'cyberpunk') return 'text-cyan-300 hover:text-cyan-200'
        if (theme === 'dark') return 'text-gray-300 hover:text-white'
        return 'text-gray-600 hover:text-gray-900'
    }

    const getDropdownBgClass = () => {
        if (theme === 'cyberpunk') return 'bg-[#1a1a4a]'
        if (theme === 'dark') return 'bg-gray-800'
        return 'bg-white'
    }

    const getDropdownBorderClass = () => {
        if (theme === 'cyberpunk') return 'border border-cyan-500/30'
        if (theme === 'dark') return 'border border-gray-700'
        return 'border border-gray-200 shadow-lg'
    }

    const getDropdownTextClass = () => {
        if (theme === 'cyberpunk') return 'text-cyan-300'
        if (theme === 'dark') return 'text-gray-300'
        return 'text-gray-800'
    }

    const getDropdownHoverClass = () => {
        if (theme === 'cyberpunk') return 'hover:bg-cyan-500/20'
        if (theme === 'dark') return 'hover:bg-gray-700'
        return 'hover:bg-gray-100'
    }

    const getDropdownDividerClass = () => {
        if (theme === 'cyberpunk') return 'border-cyan-500/30'
        if (theme === 'dark') return 'border-gray-700'
        return 'border-gray-200'
    }

    const getUserEmailClass = () => {
        if (theme === 'cyberpunk') return 'text-cyan-500/70'
        if (theme === 'dark') return 'text-gray-500'
        return 'text-gray-500'
    }

    const getLogoutHoverClass = () => {
        if (theme === 'cyberpunk') return 'hover:bg-red-500/20'
        if (theme === 'dark') return 'hover:bg-red-900/20'
        return 'hover:bg-red-50'
    }

    const getButtonClass = () => {
        if (theme === 'cyberpunk') return 'bg-cyan-600 hover:bg-cyan-700'
        return 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500'
    }

    const getAvatarButtonClass = () => {
        if (theme === 'cyberpunk') return 'hover:bg-cyan-500/20'
        if (theme === 'dark') return 'hover:bg-gray-800'
        return 'hover:bg-gray-100'
    }

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${getNavbarBg()}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
                {/* Logo Section - KIRI */}
                <Link to="/" className="flex items-center gap-3 group">
                    <motion.img
                        src="/logoweb.png"
                        alt="G-RantCar Logo"
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        transition={{ duration: 0.3 }}
                        className="w-10 h-10 md:w-12 md:h-12 object-contain"
                    />
                    <div className="flex flex-col">
                        <span className="text-xl md:text-2xl font-extrabold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent tracking-wide">
                            G-RantCar
                        </span>
                        <span className={`text-[10px] md:text-xs tracking-wider hidden md:block ${getTextSecondaryClass()}`}>
                            PREMIUM CAR RENTAL
                        </span>
                    </div>
                </Link>

                {/* Menu Section - KANAN */}
                <div className="hidden md:flex items-center gap-6">
                    <Link to="/" className={`transition-colors text-sm font-medium ${getTextSecondaryClass()}`}>
                        Home
                    </Link>

                    {user && (
                        <Link to="/history" className={`transition-colors text-sm font-medium ${getTextSecondaryClass()}`}>
                            Riwayat
                        </Link>
                    )}

                    {user?.role === 'admin' && (
                        <Link to="/admin" className={`transition-colors text-sm font-medium ${getTextSecondaryClass()}`}>
                            Admin Panel
                        </Link>
                    )}

                    <div className="h-5 w-px bg-gray-300 dark:bg-gray-600"></div>

                    <NotificationBell />
                    <ThemeSwitcher />

                    {user ? (
                        <div className="relative">
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-colors ${getAvatarButtonClass()}`}
                            >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                                    {user.username?.charAt(0).toUpperCase()}
                                </div>
                                <span className={`text-sm font-medium ${getTextClass()}`}>
                                    {user.username}
                                </span>
                                <svg
                                    className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''} ${getTextSecondaryClass()}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            <AnimatePresence>
                                {dropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className={`absolute right-0 mt-2 w-56 rounded-xl overflow-hidden z-50 ${getDropdownBorderClass()} ${getDropdownBgClass()}`}
                                    >
                                        <div className={`p-3 border-b ${getDropdownDividerClass()}`}>
                                            <p className={`font-semibold ${getTextClass()}`}>{user.username}</p>
                                            <p className={`text-xs ${getUserEmailClass()}`}>{user.email}</p>
                                        </div>

                                        <Link
                                            to="/profile"
                                            onClick={() => setDropdownOpen(false)}
                                            className={`block px-4 py-2.5 text-sm transition-colors ${getDropdownTextClass()} ${getDropdownHoverClass()}`}
                                        >
                                            Profil Saya
                                        </Link>

                                        <Link
                                            to="/history"
                                            onClick={() => setDropdownOpen(false)}
                                            className={`block px-4 py-2.5 text-sm transition-colors ${getDropdownTextClass()} ${getDropdownHoverClass()}`}
                                        >
                                            Riwayat Transaksi
                                        </Link>

                                        <div className={`border-t ${getDropdownDividerClass()} mt-1`}>
                                            <button
                                                onClick={handleLogout}
                                                className={`w-full text-left px-4 py-2.5 text-sm transition-colors text-red-600 ${getLogoutHoverClass()}`}
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <div className="flex gap-3">
                            <Link
                                to="/login"
                                className={`px-4 py-2 rounded-xl transition-colors text-sm font-medium ${getTextSecondaryClass()}`}
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className={`px-5 py-2 rounded-xl text-white font-semibold transition-all hover:shadow-lg ${getButtonClass()}`}
                            >
                                Daftar
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button - tetap di kanan untuk mobile */}
                <div className="md:hidden flex items-center gap-3">
                    <NotificationBell />
                    <ThemeSwitcher />
                    {user ? (
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm"
                        >
                            {user.username?.charAt(0).toUpperCase()}
                        </button>
                    ) : (
                        <Link to="/login" className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-sm">
                            Login
                        </Link>
                    )}
                </div>
            </div>

            {/* Mobile Dropdown */}
            <AnimatePresence>
                {dropdownOpen && user && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`md:hidden mx-4 mb-3 rounded-xl overflow-hidden z-50 ${getDropdownBorderClass()} ${getDropdownBgClass()}`}
                    >
                        <div className={`p-3 border-b ${getDropdownDividerClass()}`}>
                            <p className={`font-semibold ${getTextClass()}`}>{user.username}</p>
                            <p className={`text-xs ${getUserEmailClass()}`}>{user.email}</p>
                        </div>
                        <Link to="/profile" onClick={() => setDropdownOpen(false)} className={`block px-4 py-3 text-sm transition-colors ${getDropdownTextClass()} ${getDropdownHoverClass()}`}>
                            Profil Saya
                        </Link>
                        <Link to="/history" onClick={() => setDropdownOpen(false)} className={`block px-4 py-3 text-sm transition-colors ${getDropdownTextClass()} ${getDropdownHoverClass()}`}>
                            Riwayat Transaksi
                        </Link>
                        <button onClick={handleLogout} className={`w-full text-left px-4 py-3 text-sm transition-colors text-red-600 ${getLogoutHoverClass()}`}>
                            Logout
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    )
}

export default Navbar