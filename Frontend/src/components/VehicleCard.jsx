import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import { FaCar, FaTag, FaCheckCircle, FaTimesCircle, FaArrowRight } from 'react-icons/fa'

const VehicleCard = ({ car, index = 0 }) => {
    const { theme } = useTheme()
    
    const formatPrice = (price) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price)

    const getCardBg = () => {
        if (theme === 'cyberpunk') return 'bg-[#1a1a4a] border border-cyan-500/30'
        if (theme === 'dark') return 'bg-gray-900 border border-gray-800'
        return 'bg-white border border-gray-200'
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
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -8 }}
            className={`rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group ${getCardBg()}`}
        >
            <div className="relative overflow-hidden">
                <motion.img
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                    src={car.image_url || 'https://placehold.co/400x220?text=No+Image'}
                    alt={car.name}
                    className="w-full h-48 object-cover"
                />
                <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className={`absolute top-3 right-3 text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1 ${
                        car.is_available
                            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                            : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                    }`}
                >
                    {car.is_available ? (
                        <><FaCheckCircle className="w-3 h-3" /> Tersedia</>
                    ) : (
                        <><FaTimesCircle className="w-3 h-3" /> Tidak Tersedia</>
                    )}
                </motion.span>
            </div>
            <div className="p-4 flex flex-col flex-1">
                <h3 className={`font-bold text-lg flex items-center gap-1 ${getTextClass()} group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors`}>
                    <FaCar className="w-4 h-4 text-blue-500" />
                    {car.name}
                </h3>
                <p className={`text-sm mb-2 flex items-center gap-1 ${getTextSecondaryClass()}`}>
                    <FaTag className="w-3 h-3" />
                    {car.brand}
                </p>
                <p className={`font-semibold mt-auto ${theme === 'cyberpunk' ? 'text-cyan-400' : 'text-blue-600 dark:text-blue-400'}`}>
                    {formatPrice(car.price_per_day)}
                    <span className={`text-sm ${getTextSecondaryClass()}`}> / hari</span>
                </p>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link
                        to={`/cars/${car.id}`}
                        className="mt-3 block text-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-4 py-2 rounded-lg text-sm transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                    >
                        Lihat Detail
                        <FaArrowRight className="w-3 h-3" />
                    </Link>
                </motion.div>
            </div>
        </motion.div>
    )
}

export default VehicleCard