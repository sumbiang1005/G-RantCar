import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useState } from 'react'
import { motion } from 'framer-motion'
import ThemeSwitcher from '../components/ThemeSwitcher'
import NotificationBell from '../components/NotificationBell'
import Footer from '../components/Footer'
import { 
    FaHome, 
    FaHistory, 
    FaUserCog, 
    FaUser, 
    FaSignOutAlt,
    FaBell,
    FaPalette,
    FaUserCircle
} from 'react-icons/fa'
import { MdDashboard } from 'react-icons/md'

const MainLayout = () => {
    const { user, logout } = useAuth()
    const { theme } = useTheme()
    const navigate = useNavigate()
    const [collapsed, setCollapsed] = useState(false)

    const toggleSidebar = () => setCollapsed(!collapsed)

    const handleLogout = async () => {
        await logout()
        navigate('/login')
    }

    const getSidebarBg = () => {
        if (theme === 'cyberpunk') return 'bg-[#1a1a4a] border-r border-cyan-500/30'
        if (theme === 'dark') return 'bg-gray-900 border-r border-gray-800'
        return 'bg-white border-r border-gray-200 shadow-lg'
    }

    const getBgClass = () => {
        if (theme === 'cyberpunk') return 'bg-[#0a0a2a]'
        if (theme === 'dark') return 'bg-gray-950'
        return 'bg-gray-50'
    }

    const getTextClass = () => {
        if (theme === 'cyberpunk') return 'text-cyan-400'
        if (theme === 'dark') return 'text-white'
        return 'text-gray-900'
    }

    const getTextSecondaryClass = () => {
        if (theme === 'cyberpunk') return 'text-cyan-300 hover:text-cyan-200'
        if (theme === 'dark') return 'text-gray-400 hover:text-white'
        return 'text-gray-500 hover:text-gray-900'
    }

    const menuItems = [
        { path: '/', label: 'Home', icon: <FaHome className="w-4 h-4" /> },
        { path: '/history', label: 'Riwayat', icon: <FaHistory className="w-4 h-4" />, auth: true },
        { path: '/admin', label: 'Admin Panel', icon: <MdDashboard className="w-4 h-4" />, role: 'admin' },
        { path: '/profile', label: 'Profil', icon: <FaUser className="w-4 h-4" />, auth: true },
    ]

    return (
        <div className={`min-h-screen flex flex-col ${getBgClass()}`}>
            <div className="flex flex-1">
                {/* Sidebar - Tanpa tombol collapse */}
                <motion.aside
                    initial={false}
                    animate={{ width: 260 }}
                    transition={{ duration: 0.3, type: 'spring' }}
                    className={`fixed left-0 top-0 h-full z-50 flex flex-col shadow-xl ${getSidebarBg()}`}
                >
                    {/* LOGO */}
                    <div className={`p-4 border-b flex items-center gap-3 ${getSidebarBg()}`}>
                        <Link to="/" className="flex items-center gap-3">
                            <img
                                src="/logoweb.png"
                                alt="logo"
                                className="w-8 h-8 object-contain"
                            />
                            <span className={`font-bold text-lg ${getTextClass()}`}>
                                G-RantCar
                            </span>
                        </Link>
                    </div>

                    {/* User */}
                    {user && (
                        <div className="p-3 border-b">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                                    {user.username?.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={`font-semibold truncate text-sm ${getTextClass()}`}>
                                        {user.username}
                                    </p>
                                    <p className={`text-xs truncate ${getTextSecondaryClass()}`}>
                                        {user.email}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Menu */}
                    <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                        {menuItems.map((item) => {
                            if (item.auth && !user) return null
                            if (item.role && user?.role !== 'admin') return null
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${getTextSecondaryClass()}`}
                                >
                                    {item.icon}
                                    <span className="text-sm font-medium">
                                        {item.label}
                                    </span>
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Bottom */}
                    <div className="p-3 border-t">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className={`text-sm flex items-center gap-2 ${getTextSecondaryClass()}`}>
                                    <FaBell className="w-4 h-4" />
                                    Notifikasi
                                </span>
                                <NotificationBell />
                            </div>
                            <div className="flex items-center justify-between">
                                <span className={`text-sm flex items-center gap-2 ${getTextSecondaryClass()}`}>
                                    <FaPalette className="w-4 h-4" />
                                    Tema
                                </span>
                                <ThemeSwitcher />
                            </div>
                            <div className="border-t border-gray-200 dark:border-gray-700 my-2" />
                        </div>

                        {user && (
                            <button
                                onClick={handleLogout}
                                className="w-full mt-3 py-2 text-red-500 hover:bg-red-500/10 rounded-lg text-sm flex items-center justify-center gap-2"
                            >
                                <FaSignOutAlt className="w-4 h-4" />
                                Logout
                            </button>
                        )}
                    </div>
                </motion.aside>

                {/* Main Content - Sidebar selalu 260px */}
                <main className={`flex-1 transition-all duration-300 ml-[260px] flex flex-col min-h-screen`}>
                    <div className="flex-1 max-w-7xl mx-auto px-4 py-6 md:py-8 w-full">
                        <Outlet />
                    </div>
                    <Footer />
                </main>
            </div>
        </div>
    )
}

export default MainLayout