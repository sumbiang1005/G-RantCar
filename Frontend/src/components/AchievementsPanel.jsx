import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import { FaTrophy, FaStar, FaCheck, FaLock, FaFeather } from 'react-icons/fa'

const AchievementsPanel = () => {
    const { theme } = useTheme()
    const [isOpen, setIsOpen] = useState(false)

    const achievements = [
        { type: 'first_rental', earned: true, name: 'First Rental', icon: <FaTrophy className="w-5 h-5" />, desc: 'Menyewa mobil pertama kali', color: 'from-yellow-500 to-orange-500' },
        { type: 'early_bird', earned: false, name: 'Early Bird', icon: <FaFeather className="w-5 h-5" />, desc: 'Booking 7 hari sebelumnya', color: 'from-green-500 to-emerald-500' },
        { type: 'reviewer', earned: true, name: 'Reviewer', icon: <FaStar className="w-5 h-5" />, desc: 'Memberikan review', color: 'from-indigo-500 to-purple-500' },
    ]

    const totalPoints = 150

    const getButtonBgClass = () => {
        if (theme === 'cyberpunk') return 'bg-gradient-to-r from-cyan-500 to-purple-600'
        return 'bg-gradient-to-r from-yellow-500 to-orange-500'
    }

    const getPanelBgClass = () => {
        if (theme === 'cyberpunk') return 'bg-[#1a1a4a] border-cyan-500/30'
        if (theme === 'dark') return 'bg-gray-800 border-gray-700'
        return 'bg-white border-gray-200 shadow-xl'
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

    const getAchievementBgClass = (earned) => {
        if (earned) {
            if (theme === 'cyberpunk') return 'bg-cyan-500/10'
            if (theme === 'dark') return 'bg-green-500/10'
            return 'bg-green-50'
        }
        if (theme === 'cyberpunk') return 'bg-[#0a0a2a]'
        if (theme === 'dark') return 'bg-gray-700'
        return 'bg-gray-100'
    }

    return (
        <div className="fixed bottom-6 left-6 z-40">
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-white hover:shadow-xl transition-all cursor-pointer ${getButtonBgClass()}`}
            >
                <FaTrophy className="w-6 h-6" />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className={`absolute bottom-14 left-0 w-80 rounded-2xl shadow-2xl p-4 border z-50 ${getPanelBgClass()}`}
                    >
                        <div className="flex justify-between items-center mb-3">
                            <h3 className={`font-bold flex items-center gap-2 ${getTextClass()}`}>
                                <FaTrophy className="w-4 h-4 text-yellow-500" />
                                Pencapaian Saya
                            </h3>
                            <span className="text-sm bg-yellow-500/20 text-yellow-600 px-2 py-1 rounded-full flex items-center gap-1">
                                <FaStar className="w-3 h-3" />
                                {totalPoints} pts
                            </span>
                        </div>
                        
                        <div className="space-y-3 max-h-80 overflow-y-auto">
                            {achievements.map((ach, idx) => (
                                <div key={idx} className={`flex items-center gap-3 p-2 rounded-xl ${getAchievementBgClass(ach.earned)} ${!ach.earned ? 'opacity-60' : ''}`}>
                                    <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${ach.color} flex items-center justify-center text-white text-xl`}>
                                        {ach.icon}
                                    </div>
                                    <div className="flex-1">
                                        <p className={`font-semibold text-sm ${getTextClass()}`}>{ach.name}</p>
                                        <p className={`text-xs ${getTextSecondaryClass()}`}>{ach.desc}</p>
                                    </div>
                                    {ach.earned ? (
                                        <FaCheck className="w-4 h-4 text-green-500" />
                                    ) : (
                                        <FaLock className="w-4 h-4 text-gray-400" />
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className={`mt-3 pt-3 border-t ${theme === 'cyberpunk' ? 'border-cyan-500/30' : 'border-gray-100 dark:border-gray-700'}`}>
                            <p className={`text-xs text-center ${getTextSecondaryClass()}`}>Semakin sering menyewa, semakin banyak pencapaian</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default AchievementsPanel