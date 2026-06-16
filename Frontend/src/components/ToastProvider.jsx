import { Toaster } from 'react-hot-toast'
import { FaCheckCircle, FaTimesCircle, FaInfoCircle } from 'react-icons/fa'

const ToastProvider = () => {
    return (
        <Toaster
            position="top-right"
            toastOptions={{
                duration: 4000,
                style: {
                    background: '#363636',
                    color: '#fff',
                    borderRadius: '12px',
                    padding: '12px 20px',
                    fontSize: '14px',
                },
                success: {
                    duration: 3000,
                    icon: <FaCheckCircle className="w-5 h-5 text-green-500" />,
                    style: {
                        background: '#1a1a2e',
                        border: '1px solid #10b981',
                    },
                },
                error: {
                    duration: 4000,
                    icon: <FaTimesCircle className="w-5 h-5 text-red-500" />,
                    style: {
                        background: '#1a1a2e',
                        border: '1px solid #ef4444',
                    },
                },
                loading: {
                    duration: 2000,
                    icon: <FaInfoCircle className="w-5 h-5 text-blue-500 animate-spin" />,
                    style: {
                        background: '#1a1a2e',
                        border: '1px solid #3b82f6',
                    },
                },
            }}
        />
    )
}

export default ToastProvider