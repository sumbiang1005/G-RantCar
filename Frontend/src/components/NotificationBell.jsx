import { useState } from 'react'
import { useNotifications } from '../context/NotificationContext'
import { useTheme } from '../context/ThemeContext'
import { motion, AnimatePresence } from 'framer-motion'
import { FaBell } from 'react-icons/fa'

const NotificationBell = () => {
    const { theme } = useTheme()
    const { notifications = [], unreadCount = 0, markAsRead = () => {}, markAllAsRead = () => {} } = useNotifications() || {}
    const [isOpen, setIsOpen] = useState(false)

    const formatDate = (dateString) => {
        if (!dateString) return ''
        const date = new Date(dateString)
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getButtonClass = () => {
        if (theme === 'cyberpunk') return 'text-cyan-400 hover:bg-cyan-500/20'
        if (theme === 'dark') return 'text-gray-300 hover:bg-gray-700'
        return 'text-gray-600 hover:bg-gray-100'
    }

    const getDropdownBg = () => {
        if (theme === 'cyberpunk') return 'bg-[#1a1a4a] border-cyan-500/30'
        if (theme === 'dark') return 'bg-gray-800 border-gray-700'
        return 'bg-white border-gray-200 shadow-lg'
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

    return (
        <div className="relative inline-block">
            {/* Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`relative p-2 rounded-lg transition-colors ${getButtonClass()}`}
                title="Notifikasi"
            >
                <FaBell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-xs rounded-full flex items-center justify-center px-1">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className={`absolute left-1/2 bottom-full mb-2 w-80 -translate-x-1/2 rounded-xl overflow-hidden z-[9999] border shadow-lg ${getDropdownBg()}`}
                        style={{ maxHeight: '70vh' }}
                    >
                        {/* Header */}
                        <div className={`p-3 border-b flex justify-between items-center ${theme === 'cyberpunk' ? 'border-cyan-500/30' : 'border-gray-200 dark:border-gray-700'}`}>
                            <h3 className={`font-bold flex items-center gap-2 ${getTextClass()}`}>
                                <FaBell className="w-4 h-4" />
                                Notifikasi
                            </h3>

                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-xs text-blue-500 hover:text-blue-600"
                                >
                                    Tandai semua
                                </button>
                            )}
                        </div>

                        {/* Content */}
                        <div className="max-h-96 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center">
                                    <FaBell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                    <p className={`text-sm ${getTextSecondaryClass()}`}>
                                        Tidak ada notifikasi
                                    </p>
                                </div>
                            ) : (
                                notifications.map((notif) => (
                                    <div
                                        key={notif.id}
                                        onClick={() => markAsRead(notif.id)}
                                        className={`p-3 border-b cursor-pointer transition ${
                                            theme === 'cyberpunk'
                                                ? 'border-cyan-500/20 hover:bg-cyan-500/10'
                                                : 'border-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                        } ${!notif.read ? (theme === 'cyberpunk' ? 'bg-cyan-500/5' : 'bg-blue-50 dark:bg-blue-900/20') : ''}`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="text-2xl">
                                                {notif.icon || <FaBell className="w-5 h-5 text-gray-400" />}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm font-medium ${getTextClass()}`}>
                                                    {notif.title}
                                                </p>
                                                <p className={`text-xs mt-1 ${getTextSecondaryClass()}`}>
                                                    {notif.message}
                                                </p>
                                                <p className="text-xs mt-1 text-gray-400">
                                                    {formatDate(notif.created_at)}
                                                </p>
                                            </div>

                                            {!notif.read && (
                                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default NotificationBell