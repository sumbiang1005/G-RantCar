const express = require('express')
const router = express.Router()
const { getAllRentals, getUserRentals, createRental, updateRentalStatus } = require('../controllers/rentalController')
const { protect, adminOnly } = require('../middleware/authMiddleware')

router.get('/', protect, adminOnly, getAllRentals)
router.get('/my', protect, getUserRentals)
router.post('/', protect, createRental)
router.put('/:id/status', protect, adminOnly, updateRentalStatus)

module.exports = router
