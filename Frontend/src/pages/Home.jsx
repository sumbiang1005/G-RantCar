import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import VehicleCard from '../components/VehicleCard'
import LoadingSpinner from '../components/LoadingSpinner'
import useFetch from '../hooks/useFetch'
import { useTheme } from '../context/ThemeContext'
import { motion } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { 
  FaSearch, 
  FaFilter, 
  FaChevronLeft, 
  FaChevronRight,
  FaCar,
  FaTag,
  FaArrowRight
} from 'react-icons/fa'
import { HiOutlineAdjustmentsHorizontal } from 'react-icons/hi2'
import { TbDeviceDesktop } from 'react-icons/tb'
import { GiCarDoor, GiRaceCar, GiJeep, GiDiamondRing } from 'react-icons/gi'

// Kategori dengan icon DAN brands
const categories = [
    { id: 'all', name: 'Semua', icon: <FaCar className="w-4 h-4" />, brands: [] },
    { id: 'sport', name: 'Sport', icon: <GiRaceCar className="w-4 h-4" />, brands: ['Ferrari', 'Lamborghini', 'Porsche', 'McLaren', 'Bugatti', 'Audi', 'BMW', 'Mercedes'] },
    { id: 'jdm', name: 'JDM', icon: <TbDeviceDesktop className="w-4 h-4" />, brands: ['Nissan', 'Toyota', 'Honda', 'Mitsubishi', 'Mazda', 'Subaru', 'Lexus'] },
    { id: 'luxury', name: 'Luxury', icon: <GiDiamondRing className="w-4 h-4" />, brands: ['Bentley', 'Rolls-Royce', 'Maserati', 'Aston Martin', 'Porsche', 'Mercedes', 'BMW', 'Audi'] },
    { id: 'suv', name: 'SUV', icon: <GiJeep className="w-4 h-4" />, brands: ['Toyota', 'Honda', 'Mitsubishi', 'Hyundai', 'Ford', 'Chevrolet', 'BMW', 'Mercedes', 'Audi'] },
]

const sortOptions = [
    { value: 'default', label: 'Default' },
    { value: 'price_asc', label: 'Harga Termurah ↑' },
    { value: 'price_desc', label: 'Harga Termahal ↓' },
    { value: 'name_asc', label: 'Nama A-Z' },
    { value: 'name_desc', label: 'Nama Z-A' },
    { value: 'brand_asc', label: 'Brand A-Z' },
]

const ITEMS_PER_PAGE = 9

const Home = () => {
    const navigate = useNavigate()
    const { theme } = useTheme()
    const { data: cars, loading, error } = useFetch('/cars')
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState('all')
    const [sortBy, setSortBy] = useState('default')
    const [priceRange, setPriceRange] = useState([0, 20000000])
    const [showFilters, setShowFilters] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)

    const filteredAndSorted = useMemo(() => {
        if (!cars) return []
        let filtered = [...cars]
        
        if (search && search.trim() !== '') {
            const searchLower = search.toLowerCase().trim()
            filtered = filtered.filter(car =>
                car.name?.toLowerCase().includes(searchLower) ||
                car.brand?.toLowerCase().includes(searchLower)
            )
        }
        
        if (category !== 'all') {
            const selectedCategory = categories.find(c => c.id === category)
            // FIX: Tambahkan guard agar tidak error jika category tidak ditemukan
            if (selectedCategory && selectedCategory.brands && selectedCategory.brands.length > 0) {
                filtered = filtered.filter(car => 
                    selectedCategory.brands.includes(car.brand)
                )
            }
        }
        
        filtered = filtered.filter(car => 
            car.price_per_day >= priceRange[0] && car.price_per_day <= priceRange[1]
        )
        
        if (sortBy === 'price_asc') {
            filtered.sort((a, b) => a.price_per_day - b.price_per_day)
        } else if (sortBy === 'price_desc') {
            filtered.sort((a, b) => b.price_per_day - a.price_per_day)
        } else if (sortBy === 'name_asc') {
            filtered.sort((a, b) => a.name.localeCompare(b.name))
        } else if (sortBy === 'name_desc') {
            filtered.sort((a, b) => b.name.localeCompare(a.name))
        } else if (sortBy === 'brand_asc') {
            filtered.sort((a, b) => a.brand.localeCompare(b.brand))
        }
        
        return filtered
    }, [cars, search, category, sortBy, priceRange])

    const totalItems = filteredAndSorted.length
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    const currentItems = filteredAndSorted.slice(startIndex, endIndex)

    const resetFilters = () => {
        setSearch('')
        setCategory('all')
        setSortBy('default')
        setPriceRange([0, 20000000])
        setCurrentPage(1)
    }

    const goToPage = (page) => {
        setCurrentPage(page)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const featuredCars = cars?.slice(0, 5) || []

    const goToCarDetail = (carId) => {
        navigate(`/cars/${carId}`)
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

    const getButtonClass = (isActive = false) => {
        if (isActive) {
            return 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
        }
        if (theme === 'cyberpunk') {
            return 'bg-[#0a0a2a] border border-cyan-500/30 text-cyan-300 hover:border-cyan-400'
        }
        if (theme === 'dark') {
            return 'bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700'
        }
        return 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
    }

    const getInputClass = () => {
        if (theme === 'cyberpunk') {
            return 'bg-[#0a0a2a] border-cyan-500/30 text-cyan-300 placeholder-cyan-700'
        }
        if (theme === 'dark') {
            return 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
        }
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
    if (error) return <p className="text-red-500 text-center py-20">{error}</p>

    return (
        <div className={`min-h-screen ${getBgClass()}`}>
            {/* Hero Section dengan Carousel */}
            <div className="relative">
                <Swiper
                    modules={[Autoplay, Pagination, Navigation]}
                    autoplay={{ delay: 5000, disableOnInteraction: false }}
                    pagination={{ clickable: true }}
                    navigation
                    className="h-[500px] rounded-2xl overflow-hidden"
                >
                    {featuredCars.map((car, idx) => (
                        <SwiperSlide key={idx}>
                            <div className="relative w-full h-full">
                                <img 
                                    src={car.image_url || 'https://placehold.co/1920x500/1a1a2e/4a90d9?text=G-RantCar'} 
                                    alt={car.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
                                    <div className="ml-12 md:ml-24 text-white">
                                        <motion.h2 
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-4xl md:text-6xl font-bold mb-3"
                                        >
                                            {car.name}
                                        </motion.h2>
                                        <motion.p 
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 }}
                                            className="text-xl mb-4"
                                        >
                                            Mulai dari Rp {car.price_per_day?.toLocaleString()}/hari
                                        </motion.p>
                                        <motion.button
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 }}
                                            onClick={() => goToCarDetail(car.id)}
                                            className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3 rounded-full font-bold hover:shadow-lg transition-all cursor-pointer flex items-center gap-2"
                                        >
                                            Sewa Sekarang
                                            <FaArrowRight className="w-4 h-4" />
                                        </motion.button>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* Search & Filter Bar */}
            <div className="max-w-6xl mx-auto px-4 -mt-10 relative z-10">
                <div className={`rounded-2xl shadow-xl p-6 ${getCardBgClass()}`}>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div className="md:col-span-2">
                            <div className="relative">
                                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Cari mobil, brand..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className={`w-full pl-12 pr-4 py-3 rounded-xl border focus:outline-none focus:border-blue-500 transition-colors ${getInputClass()}`}
                                />
                            </div>
                        </div>
                        <div>
                            <select 
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:border-blue-500 transition-colors ${getInputClass()}`}
                            >
                                {sortOptions.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`w-full px-4 py-3 rounded-xl border flex items-center justify-center gap-2 transition-colors ${getButtonClass()}`}
                            >
                                <HiOutlineAdjustmentsHorizontal className="w-5 h-5" />
                                Filter
                                {showFilters ? '▲' : '▼'}
                            </button>
                        </div>
                    </div>

                    {showFilters && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className={`mt-4 pt-4 border-t ${theme === 'cyberpunk' ? 'border-cyan-500/30' : 'border-gray-200 dark:border-gray-700'}`}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={`text-xs uppercase tracking-wider mb-2 block ${getTextSecondaryClass()}`}>
                                        Harga Maksimal: Rp {priceRange[1].toLocaleString()}
                                    </label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="20000000"
                                        step="500000"
                                        value={priceRange[1]}
                                        onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                                        className="w-full"
                                    />
                                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                                        <span>Rp 0</span>
                                        <span>Rp 5jt</span>
                                        <span>Rp 10jt</span>
                                        <span>Rp 15jt</span>
                                        <span>Rp 20jt+</span>
                                    </div>
                                </div>
                                <div className="flex items-end">
                                    <button
                                        onClick={resetFilters}
                                        className="w-full px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 transition-colors"
                                    >
                                        Reset Semua Filter
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Category Pills */}
            <div className="max-w-6xl mx-auto px-4 mt-8">
                <div className="flex gap-3 overflow-x-auto pb-4">
                    {categories.map((cat) => {
                        return (
                            <motion.button
                                key={cat.id}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setCategory(cat.id)}
                                className={`px-5 py-2 rounded-full font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
                                    category === cat.id
                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                        : getButtonClass()
                                }`}
                            >
                                {cat.icon}
                                {cat.name}
                            </motion.button>
                        )
                    })}
                </div>
            </div>

            {/* Results Info */}
            <div className="max-w-6xl mx-auto px-4 mt-4">
                <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
                    <h2 className={`text-2xl font-bold flex items-center gap-2 ${getTextClass()}`}>
                        <FaCar className="w-6 h-6" />
                        {search ? `Hasil pencarian "${search}"` : 'Semua Koleksi'}
                    </h2>
                    <p className={`text-sm ${getTextSecondaryClass()}`}>
                        Menampilkan {Math.min(ITEMS_PER_PAGE, currentItems.length)} dari {totalItems} mobil
                        {totalPages > 1 && ` (Halaman ${currentPage} dari ${totalPages})`}
                    </p>
                </div>

                {currentItems.length === 0 ? (
                    <div className={`text-center py-20 rounded-2xl ${getCardBgClass()}`}>
                        <FaSearch className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <p className={`text-lg ${getTextSecondaryClass()}`}>
                            Tidak ada mobil ditemukan untuk "{search}"
                        </p>
                        <button
                            onClick={resetFilters}
                            className="mt-4 text-blue-500 hover:text-blue-600 font-semibold"
                        >
                            Reset filter
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {currentItems.map((car, index) => (
                                <VehicleCard key={car.id} car={car} index={index} />
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
                                    <FaChevronLeft className="w-4 h-4" />
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
                                    <FaChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default Home