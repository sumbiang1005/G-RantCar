const { fetchAllRentals, fetchUserRentals, addRental, changeRentalStatus } = require('../services/rentalService')

const getAllRentals = async (req, res) => {
    try {
        const rentals = await fetchAllRentals()
        res.json(rentals)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getUserRentals = async (req, res) => {
    try {
        const rentals = await fetchUserRentals(req.user.userId)
        res.json(rentals)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const createRental = async (req, res) => {
    try {
        const { car_id, start_date, end_date } = req.body
        const rental = await addRental({ user_id: req.user.userId, car_id, start_date, end_date })
        res.status(201).json({ message: 'Rental berhasil dibuat', rental })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

const updateRentalStatus = async (req, res) => {
    try {
        const rental = await changeRentalStatus(req.params.id, req.body.status)
        res.json({ message: 'Status rental diupdate', rental })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

module.exports = { getAllRentals, getUserRentals, createRental, updateRentalStatus }
