import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { 
    FaHome, 
    FaCar, 
    FaList, 
    FaSignOutAlt,
    FaUserCog,
    FaUser,
    FaArrowLeft
} from 'react-icons/fa'
import { MdDashboard } from 'react-icons/md'

const menuItems = [
    { to: '/admin', label: 'Dashboard', icon: <MdDashboard className="w-5 h-5" /> },
    { to: '/admin/cars', label: 'Kelola Mobil', icon: <FaCar className="w-5 h-5" /> },
    { to: '/admin/rentals', label: 'Kelola Rental', icon: <FaList className="w-5 h-5" /> },
]

const AdminLayout = () => {
    const { user, logout } = useAuth()
    const { theme } = useTheme()
    const navigate = useNavigate()
    const location = useLocation()

    const handleLogout = async () => {
        await logout()
        navigate('/login')
    }

    const getBgClass = () => {
        if (theme === 'dark') return 'bg-gray-950'
        if (theme === 'cyberpunk') return 'bg-[#0a0a2a]'
        return 'bg-gray-50'
    }

    const getSidebarClass = () => {
        if (theme === 'cyberpunk') return 'bg-[#1a1a4a] border-cyan-500/30'
        if (theme === 'dark') return 'bg-gray-900 border-gray-800'
        return 'bg-white border-gray-200'
    }

    const getTextClass = () => {
        if (theme === 'cyberpunk') return 'text-cyan-400'
        if (theme === 'dark') return 'text-white'
        return 'text-gray-900'
    }

    const getTextSecondaryClass = () => {
        if (theme === 'cyberpunk') return 'text-cyan-300'
        if (theme === 'dark') return 'text-gray-400'
        return 'text-gray-500'
    }

    const getMenuClass = (isActive) => {
        if (isActive) {
            return 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
        }
        if (theme === 'cyberpunk') {
            return 'text-cyan-300 hover:bg-cyan-500/20'
        }
        if (theme === 'dark') {
            return 'text-gray-400 hover:bg-gray-800'
        }
        return 'text-gray-600 hover:bg-gray-100'
    }

    return (
        <div className={`min-h-screen flex ${getBgClass()}`}>
            {/* Sidebar */}
            <aside className={`w-64 flex flex-col fixed h-full border-r ${getSidebarClass()}`}>
                <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-3">
                        <img
                            src="/logoweb.png"
                            alt="G-RantCar Logo"
                            className="w-10 h-10 object-contain"
                        />
                        <h2 className="font-black text-xl bg-gradient-to-r from-[#7C3AED] via-[#8B5CF6] to-[#60A5FA] bg-clip-text text-transparent">
                            G-RantCar
                        </h2>
                    </div>

                    <span
                        className={`text-xs px-2 py-0.5 rounded-full mt-3 inline-block ${
                            theme === 'cyberpunk'
                                ? 'bg-cyan-500/20 text-cyan-400'
                                : 'bg-gray-100 dark:bg-white/10 text-gray-400'
                        }`}
                    >
                        <FaUserCog className="inline mr-1 w-3 h-3" />
                        Admin Panel
                    </span>
                </div>

                <nav className="flex flex-col gap-1 p-4 flex-1">
                    {menuItems.map(item => (
                        <Link
                            key={item.to}
                            to={item.to}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${getMenuClass(location.pathname === item.to)}`}
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    ))}

                    <div className="border-t border-gray-200 dark:border-gray-800 mt-2 pt-2">
                        <Link
                            to="/"
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${getMenuClass(false)}`}
                        >
                            <FaArrowLeft className="w-4 h-4" />
                            Kembali ke Home
                        </Link>
                    </div>
                </nav>

                <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-3 mb-3 px-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-black">
                            {user?.username?.charAt(0).toUpperCase()}
                        </div>

                        <div>
                            <p className={`text-sm font-semibold ${getTextClass()}`}>
                                {user?.username}
                            </p>

                            <p
                                className={`text-xs ${
                                    theme === 'cyberpunk'
                                        ? 'text-cyan-500/70'
                                        : 'text-gray-400'
                                }`}
                            >
                                Administrator
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="w-full bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 py-2 rounded-xl text-sm font-semibold hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2"
                    >
                        <FaSignOutAlt className="w-4 h-4" />
                        Logout
                    </button>
                </div>
            </aside>

            <main className="flex-1 ml-64 p-8 overflow-auto">
                <Outlet />
            </main>
        </div>
    )
}

export default AdminLayout