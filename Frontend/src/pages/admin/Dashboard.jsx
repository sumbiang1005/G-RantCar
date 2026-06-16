import { useState, useEffect } from 'react'
import useFetch from '../../hooks/useFetch'
import LoadingSpinner from '../../components/LoadingSpinner'
import { STATUS_LABEL, STATUS_COLOR } from '../../utils/constants'
import { useTheme } from '../../context/ThemeContext'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import { Bar, Doughnut } from 'react-chartjs-2'
import { motion } from 'framer-motion'
import { 
    FaCar, 
    FaCheckCircle, 
    FaList, 
    FaClock, 
    FaMoneyBillWave, 
    FaLock, 
    FaTimesCircle,
    FaChartBar,
    FaChartPie,
    FaUser,
    FaCalendarAlt
} from 'react-icons/fa'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

const StatCard = ({ label, value, icon, gradient, change, delay = 0, theme }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className={`relative rounded-2xl p-5 overflow-hidden hover:-translate-y-1 transition-all duration-300 ${
            theme === 'cyberpunk' 
                ? 'bg-[#1a1a4a] border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.3)]' 
                : theme === 'dark'
                    ? 'bg-gray-800 border border-gray-700'
                    : 'bg-white border border-gray-200 shadow-md'
        }`}
    >
        <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-20 ${gradient}`}></div>
        <div className="relative">
            <div className="flex justify-between items-start">
                <span className="text-3xl">{icon}</span>
                {change && (
                    <span className={`text-xs px-2 py-1 rounded-full ${change > 0 ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                        {change > 0 ? `+${change}%` : `${change}%`}
                    </span>
                )}
            </div>
            <p className={`text-sm mt-2 ${theme === 'cyberpunk' ? 'text-cyan-300' : 'text-gray-500 dark:text-gray-400'}`}>{label}</p>
            <p className={`text-2xl font-black mt-1 ${theme === 'cyberpunk' ? 'text-cyan-400' : 'text-gray-900 dark:text-white'}`}>{value}</p>
        </div>
    </motion.div>
)

const Dashboard = () => {
    const { theme } = useTheme()
    const { data: cars, loading: loadingCars } = useFetch('/cars')
    const { data: rentals, loading: loadingRentals } = useFetch('/rentals')
    const [monthlyData, setMonthlyData] = useState({ revenue: Array(12).fill(0), count: Array(12).fill(0) })

    useEffect(() => {
        if (rentals && rentals.length > 0) {
            const revenueData = Array(12).fill(0)
            const countData = Array(12).fill(0)
            
            rentals.forEach(rental => {
                if (rental.created_at && rental.status === 'completed') {
                    const date = new Date(rental.created_at)
                    const month = date.getMonth()
                    revenueData[month] += Number(rental.total_price) || 0
                    countData[month] += 1
                }
            })
            
            setMonthlyData({ revenue: revenueData, count: countData })
        }
    }, [rentals])

    if (loadingCars || loadingRentals) return <LoadingSpinner />

    const totalCars = cars?.length || 0
    const availableCars = cars?.filter(c => c.is_available).length || 0
    const totalRentals = rentals?.length || 0
    const pendingRentals = rentals?.filter(r => r.status === 'pending').length || 0
    const totalRevenue = rentals?.filter(r => r.status === 'completed').reduce((sum, r) => sum + Number(r.total_price), 0) || 0
    const activeRentals = rentals?.filter(r => r.status === 'active').length || 0
    const cancelledRentals = rentals?.filter(r => r.status === 'cancelled').length || 0

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']

    const barChartData = {
        labels: months,
        datasets: [
            {
                label: 'Pendapatan (Rp)',
                data: monthlyData.revenue,
                backgroundColor: theme === 'cyberpunk' ? 'rgba(6, 182, 212, 0.6)' : 'rgba(59, 130, 246, 0.6)',
                borderColor: theme === 'cyberpunk' ? '#06b6d4' : '#3b82f6',
                borderWidth: 2,
                borderRadius: 8,
            },
        ],
    }

    const doughnutData = {
        labels: ['Selesai', 'Aktif', 'Menunggu', 'Dibatalkan'],
        datasets: [
            {
                data: [
                    rentals?.filter(r => r.status === 'completed').length || 0,
                    activeRentals,
                    pendingRentals,
                    cancelledRentals,
                ],
                backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'],
                borderWidth: 0,
            },
        ],
    }

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                labels: {
                    color: theme === 'cyberpunk' ? '#06b6d4' : '#6b7280'
                }
            }
        },
        scales: {
            y: {
                ticks: { color: theme === 'cyberpunk' ? '#06b6d4' : '#6b7280' },
                grid: { color: theme === 'cyberpunk' ? 'rgba(6, 182, 212, 0.2)' : 'rgba(0,0,0,0.1)' }
            },
            x: {
                ticks: { color: theme === 'cyberpunk' ? '#06b6d4' : '#6b7280' },
                grid: { color: theme === 'cyberpunk' ? 'rgba(6, 182, 212, 0.2)' : 'rgba(0,0,0,0.1)' }
            }
        }
    }

    const formatPrice = (price) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price)

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

    return (
        <div className={`min-h-screen ${getBgClass()}`}>
            <div className="mb-8">
                <h1 className={`text-2xl font-black flex items-center gap-2 ${getTextClass()}`}>
                    <FaChartBar className="w-6 h-6 text-blue-500" />
                    Dashboard
                </h1>
                <p className={`text-sm mt-1 flex items-center gap-2 ${getTextSecondaryClass()}`}>
                    <FaUser className="w-4 h-4" />
                    Selamat datang di panel admin G-RantCar
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard label="Total Mobil" value={totalCars} icon={<FaCar />} gradient="bg-blue-500" delay={0} theme={theme} />
                <StatCard label="Mobil Tersedia" value={availableCars} icon={<FaCheckCircle />} gradient="bg-green-500" delay={0.1} theme={theme} />
                <StatCard label="Total Rental" value={totalRentals} icon={<FaList />} gradient="bg-purple-500" delay={0.2} theme={theme} />
                <StatCard label="Menunggu Konfirmasi" value={pendingRentals} icon={<FaClock />} gradient="bg-yellow-500" delay={0.3} theme={theme} />
                <StatCard label="Total Pendapatan" value={formatPrice(totalRevenue)} icon={<FaMoneyBillWave />} gradient="bg-emerald-500" delay={0.4} theme={theme} />
                <StatCard label="Tidak Tersedia" value={totalCars - availableCars} icon={<FaLock />} gradient="bg-red-500" delay={0.5} theme={theme} />
                <StatCard label="Rental Aktif" value={activeRentals} icon={<FaCar />} gradient="bg-indigo-500" delay={0.6} theme={theme} />
                <StatCard label="Rental Dibatalkan" value={cancelledRentals} icon={<FaTimesCircle />} gradient="bg-pink-500" delay={0.7} theme={theme} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className={`rounded-2xl p-6 ${getCardBgClass()}`}>
                    <h3 className={`font-bold mb-4 flex items-center gap-2 ${getTextClass()}`}>
                        <FaChartBar className="w-5 h-5 text-blue-500" />
                        Grafik Pendapatan {new Date().getFullYear()}
                    </h3>
                    <Bar data={barChartData} options={chartOptions} />
                </div>
                <div className={`rounded-2xl p-6 ${getCardBgClass()}`}>
                    <h3 className={`font-bold mb-4 flex items-center gap-2 ${getTextClass()}`}>
                        <FaChartPie className="w-5 h-5 text-purple-500" />
                        Status Rental
                    </h3>
                    <div className="w-64 h-64 mx-auto">
                        <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: true }} />
                    </div>
                </div>
            </div>

            <div className={`rounded-2xl overflow-hidden ${getCardBgClass()}`}>
                <div className={`px-6 py-4 border-b ${theme === 'cyberpunk' ? 'border-cyan-500/30' : 'border-gray-100 dark:border-gray-700'}`}>
                    <h2 className={`font-black flex items-center gap-2 ${getTextClass()}`}>
                        <FaList className="w-5 h-5" />
                        Rental Terbaru
                    </h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className={theme === 'cyberpunk' ? 'bg-[#0a0a2a]' : 'bg-gray-50 dark:bg-gray-800/50'}>
                            <tr className={`text-xs uppercase tracking-widest ${getTextSecondaryClass()}`}>
                                <th className="text-left px-6 py-3">User</th>
                                <th className="text-left px-6 py-3">Mobil</th>
                                <th className="text-left px-6 py-3">Tanggal</th>
                                <th className="text-left px-6 py-3">Total</th>
                                <th className="text-left px-6 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rentals?.slice(0, 5).map((r) => (
                                <tr key={r.id} className={`border-t ${theme === 'cyberpunk' ? 'border-cyan-500/20 hover:bg-cyan-500/10' : 'border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}>
                                    <td className="px-6 py-4">
                                        <p className={`font-semibold ${getTextClass()}`}>{r.username}</p>
                                        <p className={`text-xs ${getTextSecondaryClass()}`}>{r.email}</p>
                                    </td>
                                    <td className={`px-6 py-4 ${getTextClass()}`}>{r.car_name}</td>
                                    <td className={`px-6 py-4 text-xs ${getTextSecondaryClass()}`}>
                                        <div>{r.start_date}</div>
                                        <div>→ {r.end_date}</div>
                                    </td>
                                    <td className={`px-6 py-4 font-bold ${theme === 'cyberpunk' ? 'text-cyan-400' : 'text-blue-600'}`}>
                                        {formatPrice(r.total_price)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs px-3 py-1 rounded-full font-semibold ${STATUS_COLOR[r.status]}`}>
                                            {STATUS_LABEL[r.status]}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {rentals?.length === 0 && (
                        <div className="text-center py-12">
                            <p className={getTextSecondaryClass()}>Belum ada data rental</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Dashboard