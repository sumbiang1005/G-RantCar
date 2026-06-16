const bcrypt = require('bcrypt')
const generateToken = require('../utils/generateToken')
const { registerUser, loginUser, getProfile } = require('../services/authService')
const { findUserByEmail, createUser } = require('../models/userModel')
const pool = require('../config/database')

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body
        const user = await registerUser(username, email, password)
        generateToken(res, user.id, user.role)
        res.status(201).json({ message: 'Registrasi berhasil', user })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await loginUser(email, password)
        generateToken(res, user.id, user.role)
        res.json({ message: 'Login berhasil', user: { id: user.id, username: user.username, email: user.email, role: user.role } })
    } catch (error) {
        res.status(401).json({ message: error.message })
    }
}

const logout = (req, res) => {
    res.clearCookie('token')
    res.json({ message: 'Logout berhasil' })
}

const profile = async (req, res) => {
    try {
        const user = await getProfile(req.user.userId)
        res.json(user)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

const googleAuth = async (req, res) => {
    try {
        const { email, name, picture, googleId } = req.body
        let user = await findUserByEmail(email)
        
        if (!user) {
            const hashedPassword = await bcrypt.hash(googleId + process.env.JWT_SECRET, 10)
            user = await createUser(name, email, hashedPassword)
        }
        
        generateToken(res, user.id, user.role)
        res.json({ 
            message: 'Login berhasil', 
            user: { id: user.id, username: user.username, email: user.email, role: user.role }
        })
    } catch (error) {
        res.status(401).json({ message: error.message })
    }
}

const updateProfile = async (req, res) => {
    try {
        const { username, email } = req.body
        const userId = req.user.userId

        if (!username || !email) {
            return res.status(400).json({ message: 'Username dan email harus diisi' })
        }

        const emailCheck = await pool.query(
            'SELECT id FROM users WHERE email = $1 AND id != $2', 
            [email, userId]
        )
        if (emailCheck.rows.length > 0) {
            return res.status(400).json({ message: 'Email sudah digunakan user lain' })
        }

        const result = await pool.query(
            'UPDATE users SET username = $1, email = $2 WHERE id = $3 RETURNING id, username, email, role, created_at',
            [username, email, userId]
        )

        res.json({ 
            message: 'Profil berhasil diupdate', 
            user: result.rows[0] 
        })
    } catch (error) {
        console.error('Update profile error:', error)
        res.status(500).json({ message: 'Terjadi kesalahan server' })
    }
}

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body
        const userId = req.user.userId

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Semua field harus diisi' })
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'Password baru minimal 6 karakter' })
        }

        const result = await pool.query('SELECT password FROM users WHERE id = $1', [userId])
        const user = result.rows[0]

        if (!user) {
            return res.status(404).json({ message: 'User tidak ditemukan' })
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: 'Password saat ini salah' })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)
        await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, userId])

        res.json({ message: 'Password berhasil diubah' })
    } catch (error) {
        console.error('Change password error:', error)
        res.status(500).json({ message: 'Terjadi kesalahan server' })
    }
}

const getUserStats = async (req, res) => {
    try {
        const userId = req.user.userId

        const totalRentalsResult = await pool.query(
            'SELECT COUNT(*) FROM rentals WHERE user_id = $1',
            [userId]
        )
        const totalRentals = parseInt(totalRentalsResult.rows[0].count)

        const totalSpentResult = await pool.query(
            'SELECT COALESCE(SUM(total_price), 0) as total FROM rentals WHERE user_id = $1 AND status = $2',
            [userId, 'completed']
        )
        const totalSpent = parseInt(totalSpentResult.rows[0].total)

        const activeRentalsResult = await pool.query(
            'SELECT COUNT(*) FROM rentals WHERE user_id = $1 AND status = $2',
            [userId, 'active']
        )
        const activeRentals = parseInt(activeRentalsResult.rows[0].count)

        const points = Math.floor(totalSpent / 100000)

        res.json({
            totalRentals,
            totalSpent,
            activeRentals,
            points
        })
    } catch (error) {
        console.error('Get user stats error:', error)
        res.status(500).json({ message: 'Terjadi kesalahan server' })
    }
}

module.exports = { 
    register, 
    login, 
    logout, 
    profile, 
    googleAuth, 
    updateProfile, 
    changePassword,
    getUserStats
}