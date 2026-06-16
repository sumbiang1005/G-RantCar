import { createContext, useContext, useState, useEffect } from 'react'
import api from '../utils/api'
import { useAuth } from './AuthContext'
import { 
    FaClock, 
    FaCar, 
    FaCheckCircle, 
    FaTimesCircle, 
    FaInfoCircle,
    FaBell
} from 'react-icons/fa'

const NotificationContext = createContext(null)

export const NotificationProvider = ({ children }) => {
    const { user } = useAuth()
    const [notifications, setNotifications] = useState([])
    const [unreadCount, setUnreadCount] = useState(0)

    useEffect(() => {
        if (!user) return
        
        const fetchNotifications = async () => {
            try {
                const rentalsRes = await api.get('/rentals/my')
                const rentals = rentalsRes.data || []
                
                const rentalNotifications = rentals.map(rental => {
                    let title = ''
                    let message = ''
                    let icon = null
                    
                    if (rental.status === 'pending') {
                        title = 'Menunggu Konfirmasi'
                        message = `Pesanan ${rental.car_name} menunggu konfirmasi admin`
                        icon = <FaClock className="w-4 h-4 text-yellow-500" />
                    } else if (rental.status === 'active') {
                        title = 'Rental Aktif'
                        message = `Mobil ${rental.car_name} sedang Anda gunakan hingga ${rental.end_date}`
                        icon = <FaCar className="w-4 h-4 text-blue-500" />
                    } else if (rental.status === 'completed') {
                        title = 'Rental Selesai'
                        message = `Penyewaan ${rental.car_name} telah selesai. Terima kasih!`
                        icon = <FaCheckCircle className="w-4 h-4 text-green-500" />
                    } else if (rental.status === 'cancelled') {
                        title = 'Rental Dibatalkan'
                        message = `Pesanan ${rental.car_name} telah dibatalkan`
                        icon = <FaTimesCircle className="w-4 h-4 text-red-500" />
                    } else {
                        title = 'Info Rental'
                        message = `Status rental ${rental.car_name}: ${rental.status}`
                        icon = <FaInfoCircle className="w-4 h-4 text-gray-500" />
                    }
                    
                    return {
                        id: `rental-${rental.id}`,
                        title,
                        message,
                        icon,
                        read: false,
                        created_at: rental.created_at,
                        type: 'rental'
                    }
                })
                
                rentalNotifications.reverse()
                setNotifications(rentalNotifications)
                setUnreadCount(rentalNotifications.filter(n => !n.read).length)
                
            } catch (error) {
                console.error('Failed to fetch notifications:', error)
                setNotifications([])
                setUnreadCount(0)
            }
        }
        
        fetchNotifications()
        const interval = setInterval(fetchNotifications, 30000)
        return () => clearInterval(interval)
    }, [user])

    const markAsRead = async (id) => {
        setNotifications(prev => prev.map(n => 
            n.id === id ? { ...n, read: true } : n
        ))
        setUnreadCount(prev => Math.max(0, prev - 1))
    }

    const markAllAsRead = async () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })))
        setUnreadCount(0)
    }

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead }}>
            {children}
        </NotificationContext.Provider>
    )
}

export const useNotifications = () => {
    const context = useContext(NotificationContext)
    if (!context) {
        console.warn('useNotifications must be used within NotificationProvider')
        return {
            notifications: [],
            unreadCount: 0,
            markAsRead: () => {},
            markAllAsRead: () => {}
        }
    }
    return context
}