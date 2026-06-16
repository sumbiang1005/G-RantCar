import { createContext, useContext, useState, useEffect } from 'react'
import { FaMoon, FaSun, FaRobot } from 'react-icons/fa'

const ThemeContext = createContext(null)

const themes = {
    dark: {
        name: 'Dark',
        icon: <FaMoon className="w-5 h-5" />,
        bg: 'bg-gray-950',
        card: 'bg-gray-900',
        cardHover: 'hover:bg-gray-800',
        text: 'text-white',
        textPrimary: 'text-white',
        textSecondary: 'text-gray-400',
        border: 'border-gray-800',
        input: 'bg-gray-800 border-gray-700',
        button: 'bg-blue-600 hover:bg-blue-700',
        navbar: 'bg-gray-900/95',
    },
    light: {
        name: 'Light',
        icon: <FaSun className="w-5 h-5" />,
        bg: 'bg-gray-50',
        card: 'bg-white',
        cardHover: 'hover:bg-gray-50',
        text: 'text-gray-900',
        textPrimary: 'text-gray-900',
        textSecondary: 'text-gray-500',
        border: 'border-gray-200',
        input: 'bg-white border-gray-200',
        button: 'bg-blue-600 hover:bg-blue-700',
        navbar: 'bg-white/95',
    },
    cyberpunk: {
        name: 'Cyberpunk',
        icon: <FaRobot className="w-5 h-5" />,
        bg: 'bg-[#0a0a2a]',
        card: 'bg-[#1a1a4a]',
        cardHover: 'hover:bg-[#2a2a5a]',
        text: 'text-cyan-400',
        textPrimary: 'text-cyan-400',
        textSecondary: 'text-purple-300',
        border: 'border-cyan-500/30',
        input: 'bg-[#1a1a4a] border-cyan-500/30',
        button: 'bg-cyan-600 hover:bg-cyan-700',
        navbar: 'bg-[#0a0a2a]/95',
        neon: 'shadow-[0_0_10px_cyan]',
    }
}

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('dark')

    useEffect(() => {
        const saved = localStorage.getItem('theme')
        if (saved && themes[saved]) {
            setTheme(saved)
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('theme', theme)
    }, [theme])

    const currentTheme = themes[theme] || themes.dark

    return (
        <ThemeContext.Provider value={{ theme, setTheme, themes, currentTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = () => {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider')
    }
    return context
}