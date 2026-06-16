import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import AdminLayout from '../layouts/AdminLayout'
import ProtectedRoute from '../components/ProtectedRoute'
import LoadingSpinner from '../components/LoadingSpinner'

const Home = lazy(() => import('../pages/Home'))
const Login = lazy(() => import('../pages/Login'))
const Register = lazy(() => import('../pages/Register'))
const Profile = lazy(() => import('../pages/Profile'))  // <-- TAMBAHKAN INI
const VehicleDetail = lazy(() => import('../pages/VehicleDetail'))
const BookingCart = lazy(() => import('../pages/BookingCart'))
const TransactionHistory = lazy(() => import('../pages/TransactionHistory'))
const Dashboard = lazy(() => import('../pages/admin/Dashboard'))
const ManageCars = lazy(() => import('../pages/admin/ManageCars'))
const ManageRentals = lazy(() => import('../pages/admin/ManageRentals'))

const AppRoutes = () => (
    <Suspense fallback={<LoadingSpinner fullPage />}>
        <Routes>
            {/* Public & User Routes */}
            <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/cars/:id" element={<VehicleDetail />} />
                <Route path="/profile" element={   // <-- TAMBAHKAN ROUTE INI
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                } />
                <Route path="/cart" element={
                    <ProtectedRoute>
                        <BookingCart />
                    </ProtectedRoute>
                } />
                <Route path="/history" element={
                    <ProtectedRoute>
                        <TransactionHistory />
                    </ProtectedRoute>
                } />
            </Route>

            {/* Admin Routes */}
            <Route element={
                <ProtectedRoute adminOnly>
                    <AdminLayout />
                </ProtectedRoute>
            }>
                <Route path="/admin" element={<Dashboard />} />
                <Route path="/admin/cars" element={<ManageCars />} />
                <Route path="/admin/rentals" element={<ManageRentals />} />
            </Route>
        </Routes>
    </Suspense>
)

export default AppRoutes