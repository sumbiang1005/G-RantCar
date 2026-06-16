const express = require('express')
const router = express.Router()
const { 
    register, 
    login, 
    logout, 
    profile, 
    googleAuth, 
    updateProfile, 
    changePassword,
    getUserStats
} = require('../controllers/authController')
const { protect } = require('../middleware/authMiddleware')

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.get('/profile', protect, profile)
router.put('/profile', protect, updateProfile)
router.put('/password', protect, changePassword)
router.get('/stats', protect, getUserStats)
router.post('/google', googleAuth)

module.exports = router