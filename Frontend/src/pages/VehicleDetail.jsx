import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useTheme } from '../context/ThemeContext'
import useFetch from '../hooks/useFetch'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'
import { FaArrowLeft, FaCar, FaTag, FaBox, FaCheckCircle, FaTimesCircle, FaCalendarAlt } from 'react-icons/fa'
import { MdDateRange } from 'react-icons/md'

const VehicleDetail = () => {
    const { id } = useParams()
    const { user } = useAuth()
    const { addToCart } = useCart()
    const { theme } = useTheme()
    const navigate = useNavigate()
    const { data: car, loading, error } = useFetch(`/cars/${id}`)
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [dateError, setDateError] = useState('')

    const today = new Date().toISOString().split('T')[0]
    const maxDate = new Date(new Date().setFullYear(new Date().getFullYear() + 2)).toISOString().split('T')[0]

    const formatPrice = (price) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price)

    const calculateDays = () => {
        if (!startDate || !endDate) return 0
        return Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24))
    }

    const handleBook = () => {
        setDateError('')
        if (!user) return navigate('/login')
        if (!startDate || !endDate) return setDateError('Pilih tanggal mulai dan selesai')

        const start = new Date(startDate)
        const end = new Date(endDate)
        const maxYear = new Date().getFullYear() + 2

        if (start.getFullYear() > maxYear || end.getFullYear() > maxYear) {
            return setDateError(`Tahun maksimal ${maxYear}`)
        }
        if (calculateDays() < 1) return setDateError('Tanggal selesai harus setelah tanggal mulai')
        if (calculateDays() > 30) return setDateError('Maksimal sewa 30 hari')

        addToCart(car, startDate, endDate)
        navigate('/cart')
        toast.success('Mobil ditambahkan ke keranjang')
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

    const getInputClass = () => {
        if (theme === 'cyberpunk') return 'bg-[#0a0a2a] border-cyan-500/30 text-cyan-300'
        if (theme === 'dark') return 'bg-gray-800 border-gray-700 text-white'
        return 'bg-white border-gray-200 text-gray-900'
    }

    if (loading) return <LoadingSpinner />
    if (error) return (
        <div className={`min-h-screen flex items-center justify-center ${getBgClass()}`}>
            <p className="text-red-400 bg-red-500/10 border border-red-500/20 rounded-2xl px-6 py-4 inline-block">
                {error}
            </p>
        </div>
    )
    if (!car) return null

    const days = calculateDays()

    return (
        <div className={`min-h-screen ${getBgClass()}`}>
            <div className="max-w-4xl mx-auto px-4 py-8">
                <button 
                    onClick={() => navigate(-1)} 
                    className={`mb-6 ${getTextSecondaryClass()} hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm flex items-center gap-2`}
                >
                    <FaArrowLeft className="w-4 h-4" />
                    Kembali
                </button>

                <div className={`rounded-2xl overflow-hidden shadow-xl ${getCardBgClass()}`}>
                    {/* Image */}
                    <div className="relative h-80 overflow-hidden">
                        <img
                            src={car.image_url || 'https://placehold.co/800x400/1a1a2e/4a90d9?text=No+Image'}
                            alt={car.name}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                        <div className="absolute bottom-6 left-6">
                            <span className={`text-xs px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 ${getTextSecondaryClass()} font-medium mb-2 inline-block`}>
                                {car.brand}
                            </span>
                            <h1 className="text-3xl font-black text-white">{car.name}</h1>
                        </div>
                        <span className={`absolute top-4 right-4 text-xs px-3 py-1.5 rounded-full font-semibold backdrop-blur-sm border ${
                            car.is_available
                                ? 'bg-green-500/20 border-green-500/40 text-green-400'
                                : 'bg-red-500/20 border-red-500/40 text-red-400'
                        } flex items-center gap-1.5`}>
                            {car.is_available ? (
                                <>
                                    <FaCheckCircle className="w-3 h-3" />
                                    Tersedia
                                </>
                            ) : (
                                <>
                                    <FaTimesCircle className="w-3 h-3" />
                                    Tidak Tersedia
                                </>
                            )}
                        </span>
                    </div>

                    <div className="p-6 grid md:grid-cols-2 gap-8">
                        {/* Info Mobil */}
                        <div>
                            <div className="flex items-end gap-1 mb-4">
                                <span className={`text-3xl font-black ${theme === 'cyberpunk' ? 'text-cyan-400' : 'bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent'}`}>
                                    {formatPrice(car.price_per_day)}
                                </span>
                                <span className={`text-sm mb-1 ${getTextSecondaryClass()}`}>/ hari</span>
                            </div>

                            {car.description && (
                                <div className={`rounded-xl p-4 mb-4 ${getCardBgClass()}`}>
                                    <p className={`text-xs uppercase tracking-widest mb-2 font-semibold ${getTextSecondaryClass()}`}>Deskripsi</p>
                                    <p className={`text-sm leading-relaxed ${getTextClass()}`}>{car.description}</p>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-3">
                                <div className={`rounded-xl p-3 text-center ${getCardBgClass()}`}>
                                    <FaBox className={`w-5 h-5 mx-auto mb-1 ${getTextSecondaryClass()}`} />
                                    <p className={`text-xs ${getTextSecondaryClass()}`}>Stok</p>
                                    <p className={`font-bold ${getTextClass()}`}>{car.stock} unit</p>
                                </div>
                                <div className={`rounded-xl p-3 text-center ${getCardBgClass()}`}>
                                    <FaTag className={`w-5 h-5 mx-auto mb-1 ${getTextSecondaryClass()}`} />
                                    <p className={`text-xs ${getTextSecondaryClass()}`}>Status</p>
                                    <p className={`font-bold text-sm ${car.is_available ? 'text-green-500' : 'text-red-500'}`}>
                                        {car.is_available ? 'Tersedia' : 'Tidak Tersedia'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Booking Form */}
                        <div className={`rounded-xl p-5 ${getCardBgClass()}`}>
                            <h3 className={`font-bold mb-4 flex items-center gap-2 ${getTextClass()}`}>
                                <FaCalendarAlt className="w-5 h-5" />
                                Pilih Tanggal Sewa
                            </h3>
                            <div className="flex flex-col gap-3">
                                <div>
                                    <label className={`text-xs uppercase tracking-widest mb-1.5 block font-semibold flex items-center gap-1 ${getTextSecondaryClass()}`}>
                                        <MdDateRange className="w-4 h-4" />
                                        Tanggal Mulai
                                    </label>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={e => setStartDate(e.target.value)}
                                        min={today}
                                        max={maxDate}
                                        className={`w-full rounded-xl px-3 py-2.5 focus:outline-none focus:border-blue-500 transition-colors ${getInputClass()}`}
                                    />
                                </div>
                                <div>
                                    <label className={`text-xs uppercase tracking-widest mb-1.5 block font-semibold flex items-center gap-1 ${getTextSecondaryClass()}`}>
                                        <MdDateRange className="w-4 h-4" />
                                        Tanggal Selesai
                                    </label>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={e => setEndDate(e.target.value)}
                                        min={startDate || today}
                                        max={maxDate}
                                        className={`w-full rounded-xl px-3 py-2.5 focus:outline-none focus:border-blue-500 transition-colors ${getInputClass()}`}
                                    />
                                </div>

                                {days > 0 && (
                                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className={getTextSecondaryClass()}>Durasi</span>
                                            <span className={`font-semibold ${getTextClass()}`}>{days} hari</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className={`text-sm ${getTextSecondaryClass()}`}>Total</span>
                                            <span className={`font-black text-lg ${theme === 'cyberpunk' ? 'text-cyan-400' : 'bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent'}`}>
                                                {formatPrice(days * car.price_per_day)}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {dateError && (
                                    <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                                        {dateError}
                                    </p>
                                )}

                                <button
                                    onClick={handleBook}
                                    disabled={!car.is_available}
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white py-3 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2"
                                >
                                    <FaCar className="w-5 h-5" />
                                    {car.is_available ? 'Pesan Sekarang' : 'Tidak Tersedia'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VehicleDetail