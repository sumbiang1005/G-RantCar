import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { ThemeProvider } from './context/ThemeContext'
import { NotificationProvider } from './context/NotificationContext'  // <-- Pastikan ini ada
import AppRoutes from './routes/index'
import ToastProvider from './components/ToastProvider'
import LiveChat from './components/LiveChat'
import AchievementsPanel from './components/AchievementsPanel'

const App = () => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''

    return (
        <GoogleOAuthProvider clientId={googleClientId}>
            <BrowserRouter>
                <ThemeProvider>
                    <AuthProvider>
                        <NotificationProvider>  {/* <-- HARUS ADA DI SINI */}
                            <CartProvider>
                                <ToastProvider />
                                <AppRoutes />
                                <LiveChat />
                                <AchievementsPanel />
                            </CartProvider>
                        </NotificationProvider>
                    </AuthProvider>
                </ThemeProvider>
            </BrowserRouter>
        </GoogleOAuthProvider>
    )
}

export default App