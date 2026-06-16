import useFetch from '../hooks/useFetch'
import LoadingSpinner from '../components/LoadingSpinner'
import { STATUS_LABEL, STATUS_COLOR } from '../utils/constants'
import { FaHistory, FaCar, FaMoneyBillWave, FaBoxOpen } from 'react-icons/fa'
import { MdDateRange } from 'react-icons/md'
import { TbClipboardList } from 'react-icons/tb'

const TransactionHistory = () => {
    const { data: rentals, loading, error } = useFetch('/rentals/my')

    const formatPrice = (price) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price)

    return (
        <div className="max-w-3xl mx-auto px-4">
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-purple-500/5 rounded-full blur-3xl"></div>
            </div>

            <div className="relative">
                <div className="mb-8">
                    <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                        <FaHistory className="w-7 h-7 text-purple-500" />
                        Riwayat Transaksi
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 flex items-center gap-2">
                        <TbClipboardList className="w-4 h-4" />
                        Semua riwayat pemesanan kamu
                    </p>
                </div>

                {loading && <LoadingSpinner />}

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 px-4 py-3 rounded-xl text-sm">
                        {error}
                    </div>
                )}

                {!loading && rentals?.length === 0 && (
                    <div className="text-center py-20">
                        <FaBoxOpen className="w-20 h-20 mx-auto mb-4 text-gray-300" />
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Belum Ada Transaksi</h2>
                        <p className="text-gray-500 dark:text-gray-400">Yuk mulai sewa mobil impianmu</p>
                    </div>
                )}

                <div className="flex flex-col gap-4">
                    {rentals?.map((rental) => (
                        <div
                            key={rental.id}
                            className="animate-fadeIn bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all duration-300 hover:shadow-lg"
                        >
                            <div className="flex gap-0">
                                <div className="relative w-36 flex-shrink-0 overflow-hidden">
                                    <img
                                        src={rental.image_url || 'https://placehold.co/150x120/1a1a2e/4a90d9?text=No+Image'}
                                        alt={rental.car_name}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20"></div>
                                    <div className="absolute bottom-2 left-2">
                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-sm text-white">
                                            {rental.brand}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex-1 p-4">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <FaCar className="w-4 h-4 text-blue-500" />
                                            <h3 className="font-black text-gray-900 dark:text-white">{rental.car_name}</h3>
                                        </div>
                                        <span className={`text-xs px-3 py-1 rounded-full font-semibold ${STATUS_COLOR[rental.status]}`}>
                                            {STATUS_LABEL[rental.status]}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 mt-3">
                                        <div className="bg-gray-50 dark:bg-white/5 rounded-lg px-3 py-2 flex items-center gap-2">
                                            <MdDateRange className="w-4 h-4 text-gray-400" />
                                            <div>
                                                <p className="text-xs text-gray-400 mb-0.5">Mulai</p>
                                                <p className="text-xs font-semibold text-gray-900 dark:text-white">{rental.start_date}</p>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-white/5 rounded-lg px-3 py-2 flex items-center gap-2">
                                            <MdDateRange className="w-4 h-4 text-gray-400" />
                                            <div>
                                                <p className="text-xs text-gray-400 mb-0.5">Selesai</p>
                                                <p className="text-xs font-semibold text-gray-900 dark:text-white">{rental.end_date}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100 dark:border-white/5">
                                        <span className="text-xs text-gray-400 flex items-center gap-1">
                                            <FaMoneyBillWave className="w-4 h-4" />
                                            Total Pembayaran
                                        </span>
                                        <span className="font-black bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                                            {formatPrice(rental.total_price)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default TransactionHistory