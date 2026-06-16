import { useState } from 'react'
import useFetch from '../../hooks/useFetch'
import LoadingSpinner from '../../components/LoadingSpinner'
import { useTheme } from '../../context/ThemeContext'
import api from '../../utils/api'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { 
    FaCar, 
    FaSearch, 
    FaPlus, 
    FaEdit, 
    FaTrash, 
    FaTimes, 
    FaCheck,
    FaBox,
    FaTag,
    FaImage,
    FaInfoCircle,
    FaChevronLeft,
    FaChevronRight,
    FaList
} from 'react-icons/fa'
import { MdDriveEta } from 'react-icons/md'

const emptyForm = { name: '', brand: '', price_per_day: '', stock: 1, image_url: '', description: '', is_available: true }
const ITEMS_PER_PAGE = 9

const ManageCars = () => {
    const { theme } = useTheme()
    const { data: cars, loading, error } = useFetch('/cars')
    const [form, setForm] = useState(emptyForm)
    const [editId, setEditId] = useState(null)
    const [showForm, setShowForm] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [localCars, setLocalCars] = useState(null)
    const [search, setSearch] = useState('')
    const [deleteConfirm, setDeleteConfirm] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)

    const displayCars = (localCars ?? cars ?? []).filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.brand.toLowerCase().includes(search.toLowerCase())
    )

    // Pagination
    const totalItems = displayCars.length
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    const currentItems = displayCars.slice(startIndex, endIndex)

    const goToPage = (page) => {
        setCurrentPage(page)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleChange = e => {
        const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
        setForm({ ...form, [e.target.name]: val })
    }

    const handleEdit = (car) => {
        setForm(car)
        setEditId(car.id)
        setShowForm(true)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleDeleteClick = (id) => {
        setDeleteConfirm(id)
    }

    const confirmDelete = async () => {
        if (!deleteConfirm) return
        try {
            await api.delete(`/cars/${deleteConfirm}`)
            setLocalCars(prev => (prev ?? cars).filter(c => c.id !== deleteConfirm))
            toast.success('Mobil berhasil dihapus')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Gagal menghapus mobil')
        } finally {
            setDeleteConfirm(null)
        }
    }

    const handleSubmit = async e => {
        e.preventDefault()
        setSubmitting(true)
        try {
            if (editId) {
                const res = await api.put(`/cars/${editId}`, form)
                setLocalCars(prev => (prev ?? cars).map(c => c.id === editId ? res.data.car : c))
                toast.success('Mobil berhasil diupdate')
            } else {
                const res = await api.post('/cars', form)
                setLocalCars(prev => [res.data.car, ...(prev ?? cars)])
                toast.success('Mobil berhasil ditambahkan')
            }
            setForm(emptyForm)
            setEditId(null)
            setShowForm(false)
            setCurrentPage(1)
        } catch (err) {
            toast.error(err.response?.data?.message || 'Gagal menyimpan')
        } finally {
            setSubmitting(false)
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
        return 'text-gray-500'
    }

    const getInputClass = () => {
        if (theme === 'cyberpunk') return 'bg-[#0a0a2a] border-cyan-500/30 text-cyan-300 placeholder-cyan-700'
        if (theme === 'dark') return 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
        return 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
    }

    const getPaginationButtonClass = (isActive = false) => {
        if (isActive) {
            return 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
        }
        if (theme === 'cyberpunk') {
            return 'bg-[#1a1a4a] border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20'
        }
        if (theme === 'dark') {
            return 'bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700'
        }
        return 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'
    }

    if (loading) return <LoadingSpinner />
    if (error) return <p className="text-red-500">{error}</p>

    return (
        <div>
            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className={`rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl ${getCardBgClass()}`}>
                        <h3 className={`text-xl font-bold mb-3 ${getTextClass()}`}>Konfirmasi Hapus</h3>
                        <p className={`text-sm ${getTextSecondaryClass()} mb-6`}>
                            Apakah Anda yakin ingin menghapus mobil ini? Tindakan ini tidak dapat dibatalkan.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className={`flex-1 py-2.5 rounded-xl font-semibold transition-colors ${getInputClass()}`}
                            >
                                Batal
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl font-semibold transition-colors"
                            >
                                Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className={`text-2xl font-black flex items-center gap-2 ${getTextClass()}`}>
                        <FaList className="w-6 h-6 text-blue-500" />
                        Kelola Mobil
                    </h1>
                    <p className={`text-sm mt-1 ${getTextSecondaryClass()}`}>
                        {displayCars.length} mobil terdaftar
                        {totalPages > 1 && ` (Halaman ${currentPage} dari ${totalPages})`}
                    </p>
                </div>
                <button
                    onClick={() => { setShowForm(!showForm); setForm(emptyForm); setEditId(null) }}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 hover:shadow-lg flex items-center gap-2"
                >
                    {showForm ? <><FaTimes /> Tutup</> : <><FaPlus /> Tambah Mobil</>}
                </button>
            </div>

            {showForm && (
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className={`rounded-2xl p-6 mb-6 shadow-xl ${getCardBgClass()}`}>
                    <h2 className={`font-black mb-5 flex items-center gap-2 ${getTextClass()}`}>
                        {editId ? <FaEdit /> : <FaPlus />}
                        {editId ? 'Edit Mobil' : 'Tambah Mobil Baru'}
                    </h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { name: 'name', placeholder: 'Nama Mobil', icon: <MdDriveEta className="w-4 h-4" />, required: true },
                            { name: 'brand', placeholder: 'Brand', icon: <FaTag className="w-4 h-4" />, required: true },
                            { name: 'price_per_day', placeholder: 'Harga per hari (Rp)', icon: <FaTag className="w-4 h-4" />, required: true, type: 'number' },
                            { name: 'stock', placeholder: 'Stok', icon: <FaBox className="w-4 h-4" />, required: true, type: 'number' },
                            { name: 'image_url', placeholder: 'URL Gambar', icon: <FaImage className="w-4 h-4" />, required: false },
                        ].map(({ name, placeholder, icon, required, type }) => (
                            <div key={name} className="relative">
                                <label className={`text-xs uppercase tracking-widest mb-1.5 block font-semibold ${getTextSecondaryClass()}`}>{placeholder}</label>
                                <div className="relative">
                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                                        {icon}
                                    </span>
                                    <input
                                        name={name}
                                        type={type || 'text'}
                                        placeholder={placeholder}
                                        value={form[name]}
                                        onChange={handleChange}
                                        required={required}
                                        className={`w-full rounded-xl pl-10 pr-4 py-2.5 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors ${getInputClass()}`}
                                    />
                                </div>
                            </div>
                        ))}
                        <div className="md:col-span-2">
                            <label className={`text-xs uppercase tracking-widest mb-1.5 block font-semibold ${getTextSecondaryClass()}`}>Deskripsi</label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-3 text-gray-400">
                                    <FaInfoCircle className="w-4 h-4" />
                                </span>
                                <textarea
                                    name="description"
                                    placeholder="Deskripsi mobil..."
                                    value={form.description}
                                    onChange={handleChange}
                                    rows={3}
                                    className={`w-full rounded-xl pl-10 pr-4 py-2.5 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors resize-none ${getInputClass()}`}
                                />
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <div className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${form.is_available ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
                                    <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${form.is_available ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                    <input type="checkbox" name="is_available" checked={form.is_available} onChange={handleChange} className="sr-only" />
                                </div>
                                <span className={`text-sm font-medium ${getTextSecondaryClass()}`}>Mobil Tersedia</span>
                            </label>
                        </div>
                        <div className="md:col-span-2 flex gap-3">
                            <button type="submit" disabled={submitting} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-xl font-semibold disabled:opacity-60 transition-all duration-300 flex items-center gap-2">
                                {submitting ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Menyimpan...</> : editId ? <><FaCheck /> Update</> : <><FaCheck /> Simpan</>}
                            </button>
                            <button type="button" onClick={() => setShowForm(false)} className={`px-6 py-2.5 rounded-xl font-semibold transition-colors flex items-center gap-2 ${getCardBgClass()}`}>
                                <FaTimes />
                                Batal
                            </button>
                        </div>
                    </form>
                </motion.div>
            )}

            <div className="relative mb-6">
                <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                    type="text"
                    placeholder="Cari mobil atau brand..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className={`w-full rounded-xl pl-10 pr-4 py-3 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors ${getInputClass()}`}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {currentItems.map(car => (
                    <motion.div key={car.id} whileHover={{ y: -5 }} className={`rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg ${getCardBgClass()}`}>
                        <div className="relative h-44 overflow-hidden">
                            <img src={car.image_url || 'https://placehold.co/400x200/1a1a2e/4a90d9?text=No+Image'} alt={car.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            <span className={`absolute top-3 right-3 text-xs px-2 py-1 rounded-full font-semibold backdrop-blur-sm border ${
                                car.is_available
                                    ? 'bg-green-500/20 border-green-500/40 text-green-400'
                                    : 'bg-red-500/20 border-red-500/40 text-red-400'
                            }`}>
                                {car.is_available ? 'Tersedia' : 'Tidak Tersedia'}
                            </span>
                        </div>
                        <div className="p-4">
                            <h3 className={`font-black ${getTextClass()}`}>{car.name}</h3>
                            <p className={`text-xs mb-1 ${getTextSecondaryClass()}`}>{car.brand}</p>
                            <p className={`font-bold text-sm mb-3 ${theme === 'cyberpunk' ? 'text-cyan-400' : 'text-blue-600'}`}>
                                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(car.price_per_day)} / hari
                            </p>
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(car)} className="flex-1 bg-yellow-500/10 border border-yellow-500/30 text-yellow-600 dark:text-yellow-400 py-2 rounded-xl text-sm font-semibold hover:bg-yellow-500/20 transition-colors flex items-center justify-center gap-1">
                                    <FaEdit className="w-3 h-3" />
                                    Edit
                                </button>
                                <button onClick={() => handleDeleteClick(car.id)} className="flex-1 bg-red-500/10 border border-red-500/30 text-red-500 dark:text-red-400 py-2 rounded-xl text-sm font-semibold hover:bg-red-500/20 transition-colors flex items-center justify-center gap-1">
                                    <FaTrash className="w-3 h-3" />
                                    Hapus
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
                    <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${getPaginationButtonClass(false)}`}
                    >
                        <FaChevronLeft />
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => goToPage(page)}
                            className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all duration-300 ${getPaginationButtonClass(page === currentPage)}`}
                        >
                            {page}
                        </button>
                    ))}
                    
                    <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${getPaginationButtonClass(false)}`}
                    >
                        <FaChevronRight />
                    </button>
                </div>
            )}
        </div>
    )
}

export default ManageCars