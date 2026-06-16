import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useTheme } from '../context/ThemeContext'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { 
    FaArrowLeft, 
    FaCar, 
    FaCalendarAlt, 
    FaClock, 
    FaMoneyBillWave, 
    FaShoppingCart,
    FaTimes,
    FaCheckCircle
} from 'react-icons/fa'
import { MdDateRange } from 'react-icons/md'
import { GiCancel } from 'react-icons/gi'

const BookingCart = () => {
    const { cart, clearCart } = useCart()
    const { theme } = useTheme()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const formatPrice = (price) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price)

    const handleConfirm = async () => {
        setError('')
        setLoading(true)
        try {
            await api.post('/rentals', {
                car_id: cart.car.id,
                start_date: cart.startDate,
                end_date: cart.endDate,
            })
            clearCart()
            toast.success('Pemesanan berhasil')
            navigate('/history')
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal membuat rental')
            toast.error(err.response?.data?.message || 'Gagal membuat rental')
        } finally {
            setLoading(false)
        }
    }

    // Style berdasarkan tema
    const getBgClass = () => {
        if (theme === 'cyberpunk') return 'bg-[#0a0a2a]'
        if (theme === 'dark') return 'bg-gray-950'
        return 'bg-gray-50'
    }

    const getCardBgClass = () => {
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

    const getButtonClass = (primary = true) => {
        if (primary) {
            if (theme === 'cyberpunk') return 'bg-cyan-600 hover:bg-cyan-700'
            return 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500'
        }
        if (theme === 'cyberpunk') return 'bg-[#0a0a2a] border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20'
        if (theme === 'dark') return 'bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700'
        return 'bg-gray-100 border border-gray-300 text-gray-700 hover:bg-gray-200'
    }

    if (!cart) return (
        <div className={`min-h-[70vh] flex flex-col items-center justify-center text-center px-4 ${getBgClass()}`}>
            <FaShoppingCart className="w-20 h-20 mx-auto mb-4 text-gray-400" />
            <h2 className={`text-2xl font-black ${getTextClass()}`}>Keranjang Kosong</h2>
            <p className={`${getTextSecondaryClass()} mb-6`}>Belum ada mobil yang dipilih</p>
            <button
                onClick={() => navigate('/')}
                className={`px-8 py-3 rounded-xl font-bold transition-all duration-300 text-white ${getButtonClass(true)}`}
            >
                <FaCar className="inline mr-2 w-4 h-4" />
                Lihat Koleksi Mobil
            </button>
        </div>
    )

    return (
        <div className={`min-h-screen ${getBgClass()}`}>
            <div className="max-w-2xl mx-auto px-4 py-8">
                <button 
                    onClick={() => navigate(-1)} 
                    className={`mb-6 ${getTextSecondaryClass()} hover:text-blue-600 transition-colors text-sm flex items-center gap-2`}
                >
                    <FaArrowLeft className="w-4 h-4" />
                    Kembali
                </button>

                <h1 className={`text-2xl font-black flex items-center gap-2 ${getTextClass()} mb-6`}>
                    <FaCheckCircle className="w-6 h-6 text-green-500" />
                    Konfirmasi Pemesanan
                </h1>

                {/* Car Card */}
                <div className={`rounded-2xl overflow-hidden shadow-xl mb-6 ${getCardBgClass()}`}>
                    <div className="relative h-56 overflow-hidden">
                        <img
                            src={cart.car.image_url || 'https://placehold.co/600x250/1a1a2e/4a90d9?text=No+Image'}
                            alt={cart.car.name}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                        <div className="absolute bottom-4 left-5">
                            <span className="text-xs px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 text-gray-300 font-medium mb-2 inline-block">
                                <FaCar className="inline mr-1 w-3 h-3" />
                                {cart.car.brand}
                            </span>
                            <h2 className="text-2xl font-black text-white">{cart.car.name}</h2>
                        </div>
                    </div>

                    <div className="p-5">
                        {/* Booking Details */}
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <div className={`rounded-xl p-3 ${getCardBgClass()}`}>
                                <p className={`text-xs ${getTextSecondaryClass()} mb-1 flex items-center gap-1`}>
                                    <FaCalendarAlt className="w-3 h-3" />
                                    Tanggal Mulai
                                </p>
                                <p className={`font-bold text-sm ${getTextClass()}`}>{cart.startDate}</p>
                            </div>
                            <div className={`rounded-xl p-3 ${getCardBgClass()}`}>
                                <p className={`text-xs ${getTextSecondaryClass()} mb-1 flex items-center gap-1`}>
                                    <FaCalendarAlt className="w-3 h-3" />
                                    Tanggal Selesai
                                </p>
                                <p className={`font-bold text-sm ${getTextClass()}`}>{cart.endDate}</p>
                            </div>
                            <div className={`rounded-xl p-3 ${getCardBgClass()}`}>
                                <p className={`text-xs ${getTextSecondaryClass()} mb-1 flex items-center gap-1`}>
                                    <FaClock className="w-3 h-3" />
                                    Durasi Sewa
                                </p>
                                <p className={`font-bold text-sm ${getTextClass()}`}>{cart.days} hari</p>
                            </div>
                            <div className={`rounded-xl p-3 ${getCardBgClass()}`}>
                                <p className={`text-xs ${getTextSecondaryClass()} mb-1 flex items-center gap-1`}>
                                    <FaMoneyBillWave className="w-3 h-3" />
                                    Harga per Hari
                                </p>
                                <p className={`font-bold text-sm ${getTextClass()}`}>{formatPrice(cart.car.price_per_day)}</p>
                            </div>
                        </div>

                        {/* Total */}
                        <div className={`bg-gradient-to-r from-blue-500/10 to-purple-500/10 border ${theme === 'cyberpunk' ? 'border-cyan-500/30' : 'border-blue-500/20'} rounded-xl p-4 flex justify-between items-center`}>
                            <span className={`font-semibold flex items-center gap-1 ${getTextSecondaryClass()}`}>
                                <FaMoneyBillWave className="w-4 h-4" />
                                Total Pembayaran
                            </span>
                            <span className={`text-2xl font-black ${theme === 'cyberpunk' ? 'text-cyan-400' : 'bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent'}`}>
                                {formatPrice(cart.totalPrice)}
                            </span>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl mb-4 text-sm flex items-center gap-2">
                        <FaTimes className="w-4 h-4" />
                        {error}
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${getButtonClass(false)}`}
                    >
                        <GiCancel className="w-4 h-4" />
                        Batal
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={loading}
                        className={`flex-1 py-3 rounded-xl font-bold disabled:opacity-60 transition-all duration-300 text-white flex items-center justify-center gap-2 ${getButtonClass(true)}`}
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Memproses...
                            </>
                        ) : (
                            <>
                                <FaCheckCircle className="w-4 h-4" />
                                Konfirmasi Pesan
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default BookingCart