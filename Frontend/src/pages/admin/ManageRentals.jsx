import { useState } from 'react'
import useFetch from '../../hooks/useFetch'
import LoadingSpinner from '../../components/LoadingSpinner'
import { STATUS_LABEL, STATUS_COLOR, RENTAL_STATUS } from '../../utils/constants'
import { useTheme } from '../../context/ThemeContext'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import { 
    FaUser, 
    FaCar, 
    FaMoneyBillWave, 
    FaFilter, 
    FaSearch,
    FaEdit,
    FaCheckCircle,
    FaClock,
    FaTimesCircle,
    FaList
} from 'react-icons/fa'
import { MdDateRange } from 'react-icons/md'

const ManageRentals = () => {
    const { theme } = useTheme()
    const { data: rentals, loading, error } = useFetch('/rentals')
    const [localRentals, setLocalRentals] = useState(null)
    const [filter, setFilter] = useState('all')
    const [search, setSearch] = useState('')

    const displayRentals = localRentals ?? rentals ?? []
    const filtered = displayRentals
        .filter(r => filter === 'all' || r.status === filter)
        .filter(r =>
            r.username?.toLowerCase().includes(search.toLowerCase()) ||
            r.car_name?.toLowerCase().includes(search.toLowerCase())
        )

    const formatPrice = (price) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price)

    const handleStatusChange = async (id, status) => {
        try {
            await api.put(`/rentals/${id}/status`, { status })
            setLocalRentals(prev => (prev ?? rentals).map(r => r.id === id ? { ...r, status } : r))
            toast.success('Status rental berhasil diupdate')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Gagal update status')
        }
    }

    const getCardBgClass = () => {
        if (theme === 'cyberpunk') return 'bg-[#1a1a4a] border-cyan-500/30'
        if (theme === 'dark') return 'bg-gray-800 border-gray-700'
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
        return 'text-gray-600'
    }

    const getInputClass = () => {
        if (theme === 'cyberpunk') return 'bg-[#0a0a2a] border-cyan-500/30 text-cyan-300 placeholder-cyan-700'
        if (theme === 'dark') return 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
        return 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
    }

    const getButtonClass = (isActive = false) => {
        if (isActive) {
            return 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
        }
        if (theme === 'cyberpunk') {
            return 'bg-[#0a0a2a] border border-cyan-500/30 text-cyan-300 hover:border-cyan-400'
        }
        if (theme === 'dark') {
            return 'bg-gray-700 border border-gray-600 text-gray-300 hover:bg-gray-600'
        }
        return 'bg-gray-100 border border-gray-300 text-gray-700 hover:bg-gray-200'
    }

    const getTableHeaderClass = () => {
        if (theme === 'cyberpunk') return 'bg-[#0a0a2a]'
        if (theme === 'dark') return 'bg-gray-700'
        return 'bg-gray-100'
    }

    const getTableRowClass = () => {
        if (theme === 'cyberpunk') return 'border-cyan-500/20 hover:bg-cyan-500/10'
        if (theme === 'dark') return 'border-gray-700 hover:bg-gray-700/50'
        return 'border-gray-200 hover:bg-gray-50'
    }

    const getSelectClass = () => {
        if (theme === 'cyberpunk') return 'bg-[#0a0a2a] border-cyan-500/30 text-cyan-300'
        if (theme === 'dark') return 'bg-gray-700 border-gray-600 text-white'
        return 'bg-white border-gray-300 text-gray-900'
    }

    if (loading) return <LoadingSpinner />
    if (error) return <p className="text-red-500">{error}</p>

    return (
        <div>
            <div className="mb-6">
                <h1 className={`text-2xl font-black flex items-center gap-2 ${getTextClass()}`}>
                    <FaList className="w-6 h-6 text-blue-500" />
                    Kelola Rental
                </h1>
                <p className={`text-sm mt-1 ${getTextSecondaryClass()}`}>
                    {filtered.length} transaksi ditemukan
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="flex gap-2 flex-wrap">
                    {['all', ...Object.values(RENTAL_STATUS)].map(s => (
                        <button 
                            key={s} 
                            onClick={() => setFilter(s)} 
                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-1 ${getButtonClass(filter === s)}`}
                        >
                            <FaFilter className="w-3 h-3" />
                            {s === 'all' ? 'Semua' : STATUS_LABEL[s]}
                        </button>
                    ))}
                </div>
                <div className="relative flex-1 min-w-[200px]">
                    <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Cari user atau mobil..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className={`w-full rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors ${getInputClass()}`}
                    />
                </div>
            </div>

            <div className={`rounded-2xl overflow-hidden shadow-xl ${getCardBgClass()}`}>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className={getTableHeaderClass()}>
                            <tr className={`text-xs uppercase tracking-widest ${getTextSecondaryClass()}`}>
                                <th className="text-left px-6 py-4">User</th>
                                <th className="text-left px-6 py-4">Mobil</th>
                                <th className="text-left px-6 py-4">Tanggal</th>
                                <th className="text-left px-6 py-4">Total</th>
                                <th className="text-left px-6 py-4">Status</th>
                                <th className="text-left px-6 py-4">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((r) => (
                                <tr key={r.id} className={`border-t ${getTableRowClass()} transition-colors`}>
                                    <td className="px-6 py-4">
                                        <p className={`font-semibold ${getTextClass()}`}>{r.username}</p>
                                        <p className={`text-xs ${getTextSecondaryClass()}`}>{r.email}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className={`font-semibold ${getTextClass()}`}>{r.car_name}</p>
                                        <p className={`text-xs ${getTextSecondaryClass()}`}>{r.brand}</p>
                                    </td>
                                    <td className={`px-6 py-4 text-xs ${getTextSecondaryClass()}`}>
                                        {r.start_date}<br/>{r.end_date}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`font-black ${theme === 'cyberpunk' ? 'text-cyan-400' : 'text-blue-600'}`}>
                                            {formatPrice(r.total_price)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs px-3 py-1 rounded-full font-semibold ${STATUS_COLOR[r.status]}`}>
                                            {STATUS_LABEL[r.status]}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <select
                                            value={r.status}
                                            onChange={e => handleStatusChange(r.id, e.target.value)}
                                            className={`rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500 transition-colors cursor-pointer ${getSelectClass()}`}
                                        >
                                            {Object.values(RENTAL_STATUS).map(s => (
                                                <option key={s} value={s}>{STATUS_LABEL[s]}</option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filtered.length === 0 && (
                        <div className="text-center py-12">
                            <p className={getTextSecondaryClass()}>Tidak ada data rental</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ManageRentals