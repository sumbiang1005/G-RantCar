import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaTrophy, FaStar, FaGem } from 'react-icons/fa'
import { FaFeather } from 'react-icons/fa'

const achievements = {
    first_rental: { 
        icon: <FaTrophy className="w-6 h-6" />, 
        name: 'First Rental', 
        desc: 'Menyewa mobil pertama kali', 
        color: 'from-yellow-500 to-orange-500' 
    },
    frequent_customer: { 
        icon: <FaStar className="w-6 h-6" />, 
        name: 'Frequent Customer', 
        desc: 'Menyewa 5x', 
        color: 'from-purple-500 to-pink-500' 
    },
    loyal_member: { 
        icon: <FaGem className="w-6 h-6" />, 
        name: 'Loyal Member', 
        desc: 'Menyewa 10x', 
        color: 'from-cyan-500 to-blue-500' 
    },
    early_bird: { 
        icon: <FaFeather className="w-6 h-6" />, 
        name: 'Early Bird', 
        desc: 'Booking 7 hari sebelumnya', 
        color: 'from-green-500 to-emerald-500' 
    },
}

const AchievementBadge = ({ earned }) => {
    const [showTooltip, setShowTooltip] = useState(false)

    if (!earned || !achievements[earned.type]) return null

    const achievement = achievements[earned.type]

    return (
        <div className="relative">
            <motion.div
                whileHover={{ scale: 1.1 }}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className={`w-12 h-12 rounded-full bg-gradient-to-r ${achievement.color} flex items-center justify-center text-white cursor-pointer shadow-lg`}
            >
                {achievement.icon}
            </motion.div>

            {showTooltip && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-gray-900 text-white text-xs rounded-lg p-2 text-center z-10"
                >
                    <p className="font-bold">{achievement.name}</p>
                    <p className="text-gray-400">{achievement.desc}</p>
                </motion.div>
            )}
        </div>
    )
}

export default AchievementBadge