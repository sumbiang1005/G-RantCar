import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import { motion, AnimatePresence } from 'framer-motion'

const ThemeSwitcher = () => {
    const { theme, setTheme, themes } = useTheme()
    const [isOpen, setIsOpen] = useState(false)

    const handleThemeChange = (newTheme) => {
        setTheme(newTheme)
        setIsOpen(false)
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

    const getOptionClass = (isActive) => {
        if (isActive) return 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
        if (theme === 'cyberpunk') return 'hover:bg-cyan-500/20 text-cyan-300'
        if (theme === 'dark') return 'hover:bg-gray-700 text-gray-300'
        return 'hover:bg-gray-100 text-gray-700'
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2 rounded-lg transition-colors ${getButtonClass()}`}
                title="Ganti Tema"
            >
                <span className="text-xl">{themes[theme].icon}</span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className={`absolute right-0 bottom-full mb-2 w-40 rounded-xl overflow-hidden z-[9999] border shadow-lg ${getDropdownBg()}`}
                        style={{ maxHeight: '60vh' }}
                    >
                        {Object.entries(themes).map(([key, t]) => (
                            <button
                                key={key}
                                onClick={() => handleThemeChange(key)}
                                className={`w-full px-4 py-2.5 text-left flex items-center gap-3 ${getOptionClass(theme === key)}`}
                            >
                                <span className="text-lg">{t.icon}</span>
                                <span className="text-sm font-medium">{t.name}</span>
                                {theme === key && <span className="ml-auto">✓</span>}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default ThemeSwitcher