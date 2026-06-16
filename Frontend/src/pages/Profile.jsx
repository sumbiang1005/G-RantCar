import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import toast from 'react-hot-toast'
import api from '../utils/api'
import { 
    FaUser, 
    FaEnvelope, 
    FaUserTag, 
    FaCalendarAlt, 
    FaCar, 
    FaMoneyBillWave, 
    FaClock, 
    FaStar,
    FaEdit,
    FaSave,
    FaTimes,
    FaLock,
    FaKey,
    FaCheckCircle
} from 'react-icons/fa'
import { MdDateRange } from 'react-icons/md'
import { GiRank3 } from 'react-icons/gi'

const Profile = () => {
    const { user, setUser } = useAuth()
    const { theme } = useTheme()
    const [isEditing, setIsEditing] = useState(false)
    const [stats, setStats] = useState({
        totalRentals: 0,
        totalSpent: 0,
        activeRentals: 0,
        points: 0
    })
    const [loadingStats, setLoadingStats] = useState(true)
    const [formData, setFormData] = useState({
        username: user?.username || '',
        email: user?.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/auth/stats')
                setStats(res.data)
            } catch (err) {
                console.error('Failed to fetch stats:', err)
            } finally {
                setLoadingStats(false)
            }
        }
        if (user) fetchStats()
    }, [user])

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleUpdateProfile = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await api.put('/auth/profile', {
                username: formData.username,
                email: formData.email
            })
            setUser(res.data.user)
            toast.success('Profil berhasil diupdate!')
            setIsEditing(false)
        } catch (err) {
            toast.error(err.response?.data?.message || 'Gagal update profil')
        } finally {
            setLoading(false)
        }
    }

    const handleChangePassword = async (e) => {
        e.preventDefault()
        if (formData.newPassword !== formData.confirmPassword) {
            toast.error('Password baru tidak cocok!')
            return
        }
        if (formData.newPassword.length < 6) {
            toast.error('Password minimal 6 karakter!')
            return
        }
        if (!formData.currentPassword) {
            toast.error('Masukkan password saat ini!')
            return
        }
        setLoading(true)
        try {
            await api.put('/auth/password', {
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword
            })
            toast.success('Password berhasil diubah!')
            setFormData({
                ...formData,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            })
        } catch (err) {
            toast.error(err.response?.data?.message || 'Gagal ubah password')
        } finally {
            setLoading(false)
        }
    }

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price)
    }

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
        if (theme === 'cyberpunk') return 'bg-[#0a0a2a] border-cyan-500/30 text-cyan-300 placeholder-cyan-700'
        if (theme === 'dark') return 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
        return 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
    }

    const memberSince = user?.created_at 
        ? new Date(user.created_at).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
        : 'Belum diketahui'

    return (
        <div className={`min-h-screen ${getBgClass()}`}>
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className={`text-2xl font-black flex items-center gap-2 ${getTextClass()}`}>
                        <FaUser className="w-6 h-6 text-blue-500" />
                        Profil Saya
                    </h1>
                    <p className={`text-sm mt-1 flex items-center gap-2 ${getTextSecondaryClass()}`}>
                        <FaEdit className="w-4 h-4" />
                        Kelola informasi akun Anda
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className={`rounded-2xl p-6 text-center ${getCardBgClass()}`}>
                            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-4xl text-white mb-4">
                                {user?.username?.charAt(0).toUpperCase()}
                            </div>
                            <h2 className={`text-xl font-bold ${getTextClass()}`}>{user?.username}</h2>
                            <p className={`text-sm mt-1 flex items-center justify-center gap-1 ${getTextSecondaryClass()}`}>
                                <FaEnvelope className="w-3 h-3" />
                                {user?.email}
                            </p>
                            <div className="mt-3 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                <FaUserTag className="w-3 h-3" />
                                {user?.role === 'admin' ? 'Administrator' : 'Member'}
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <p className={`text-xs flex items-center justify-center gap-1 ${getTextSecondaryClass()}`}>
                                    <FaCalendarAlt className="w-3 h-3" />
                                    Bergabung sejak
                                </p>
                                <p className={`text-sm font-semibold ${getTextClass()}`}>{memberSince}</p>
                            </div>
                        </div>

                        <div className={`rounded-2xl p-4 mt-4 ${getCardBgClass()}`}>
                            <h3 className={`font-semibold flex items-center gap-2 ${getTextClass()} mb-3`}>
                                <FaCar className="w-4 h-4" />
                                Statistik
                            </h3>
                            {loadingStats ? (
                                <div className="space-y-2">
                                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className={`text-sm flex items-center gap-1 ${getTextSecondaryClass()}`}>
                                            <FaCar className="w-3 h-3" />
                                            Total Rental
                                        </span>
                                        <span className={`font-bold ${getTextClass()}`}>{stats.totalRentals}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className={`text-sm flex items-center gap-1 ${getTextSecondaryClass()}`}>
                                            <FaMoneyBillWave className="w-3 h-3" />
                                            Total Pengeluaran
                                        </span>
                                        <span className={`font-bold ${getTextClass()}`}>{formatPrice(stats.totalSpent)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className={`text-sm flex items-center gap-1 ${getTextSecondaryClass()}`}>
                                            <FaClock className="w-3 h-3" />
                                            Rental Aktif
                                        </span>
                                        <span className="font-bold text-green-500">{stats.activeRentals}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
                                        <span className={`text-sm flex items-center gap-1 ${getTextSecondaryClass()}`}>
                                            <FaStar className="w-3 h-3 text-yellow-500" />
                                            Poin Reward
                                        </span>
                                        <span className="font-bold text-yellow-500">{stats.points} pts</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className={`rounded-2xl p-6 ${getCardBgClass()}`}>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className={`font-bold flex items-center gap-2 ${getTextClass()}`}>
                                    <FaUser className="w-4 h-4 text-blue-500" />
                                    Informasi Profil
                                </h3>
                                {!isEditing && (
                                    <button onClick={() => setIsEditing(true)} className="text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1">
                                        <FaEdit className="w-3 h-3" />
                                        Edit Profil
                                    </button>
                                )}
                            </div>

                            {!isEditing ? (
                                <div className="space-y-3">
                                    <div className={`flex py-2 border-b ${theme === 'cyberpunk' ? 'border-cyan-500/30' : 'border-gray-100 dark:border-gray-700'}`}>
                                        <span className={`w-32 text-sm flex items-center gap-1 ${getTextSecondaryClass()}`}>
                                            <FaUser className="w-3 h-3" />
                                            Username
                                        </span>
                                        <span className={`flex-1 font-medium ${getTextClass()}`}>{user?.username}</span>
                                    </div>
                                    <div className={`flex py-2 border-b ${theme === 'cyberpunk' ? 'border-cyan-500/30' : 'border-gray-100 dark:border-gray-700'}`}>
                                        <span className={`w-32 text-sm flex items-center gap-1 ${getTextSecondaryClass()}`}>
                                            <FaEnvelope className="w-3 h-3" />
                                            Email
                                        </span>
                                        <span className={`flex-1 font-medium ${getTextClass()}`}>{user?.email}</span>
                                    </div>
                                    <div className={`flex py-2 border-b ${theme === 'cyberpunk' ? 'border-cyan-500/30' : 'border-gray-100 dark:border-gray-700'}`}>
                                        <span className={`w-32 text-sm flex items-center gap-1 ${getTextSecondaryClass()}`}>
                                            <GiRank3 className="w-3 h-3" />
                                            Role
                                        </span>
                                        <span className={`flex-1 font-medium capitalize ${getTextClass()}`}>{user?.role}</span>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleUpdateProfile} className="space-y-4">
                                    <div>
                                        <label className={`block text-sm font-medium mb-1 flex items-center gap-1 ${getTextClass()}`}>
                                            <FaUser className="w-3 h-3" />
                                            Username
                                        </label>
                                        <input type="text" name="username" value={formData.username} onChange={handleChange}
                                            className={`w-full px-4 py-2 rounded-xl border focus:outline-none focus:border-blue-500 ${getInputClass()}`} required />
                                    </div>
                                    <div>
                                        <label className={`block text-sm font-medium mb-1 flex items-center gap-1 ${getTextClass()}`}>
                                            <FaEnvelope className="w-3 h-3" />
                                            Email
                                        </label>
                                        <input type="email" name="email" value={formData.email} onChange={handleChange}
                                            className={`w-full px-4 py-2 rounded-xl border focus:outline-none focus:border-blue-500 ${getInputClass()}`} required />
                                    </div>
                                    <div className="flex gap-3">
                                        <button type="submit" disabled={loading}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
                                            <FaSave className="w-4 h-4" />
                                            {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                                        </button>
                                        <button type="button" onClick={() => setIsEditing(false)}
                                            className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 ${getCardBgClass()}`}>
                                            <FaTimes className="w-4 h-4" />
                                            Batal
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>

                        <div className={`rounded-2xl p-6 ${getCardBgClass()}`}>
                            <h3 className={`font-bold flex items-center gap-2 ${getTextClass()}`}>
                                <FaLock className="w-4 h-4 text-blue-500" />
                                Ganti Password
                            </h3>
                            <form onSubmit={handleChangePassword} className="space-y-4 mt-4">
                                <div>
                                    <label className={`block text-sm font-medium mb-1 flex items-center gap-1 ${getTextClass()}`}>
                                        <FaKey className="w-3 h-3" />
                                        Password Saat Ini
                                    </label>
                                    <input type="password" name="currentPassword" value={formData.currentPassword} onChange={handleChange}
                                        className={`w-full px-4 py-2 rounded-xl border focus:outline-none focus:border-blue-500 ${getInputClass()}`} required />
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium mb-1 flex items-center gap-1 ${getTextClass()}`}>
                                        <FaLock className="w-3 h-3" />
                                        Password Baru
                                    </label>
                                    <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange}
                                        className={`w-full px-4 py-2 rounded-xl border focus:outline-none focus:border-blue-500 ${getInputClass()}`} required />
                                    <p className={`text-xs mt-1 ${getTextSecondaryClass()}`}>Minimal 6 karakter</p>
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium mb-1 flex items-center gap-1 ${getTextClass()}`}>
                                        <FaCheckCircle className="w-3 h-3" />
                                        Konfirmasi Password Baru
                                    </label>
                                    <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
                                        className={`w-full px-4 py-2 rounded-xl border focus:outline-none focus:border-blue-500 ${getInputClass()}`} required />
                                </div>
                                <button type="submit" disabled={loading}
                                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 flex items-center gap-2">
                                    <FaKey className="w-4 h-4" />
                                    {loading ? 'Memproses...' : 'Ganti Password'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile