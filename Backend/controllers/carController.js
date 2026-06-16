const { fetchAllCars, fetchCarById, addCar, editCar, removeCar } = require('../services/carService')

const getCars = async (req, res) => {
    try {
        const cars = await fetchAllCars()
        res.json(cars)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getCarDetail = async (req, res) => {
    try {
        const car = await fetchCarById(req.params.id)
        res.json(car)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

const createCar = async (req, res) => {
    try {
        const car = await addCar(req.body)
        res.status(201).json({ message: 'Mobil berhasil ditambahkan', car })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

const updateCar = async (req, res) => {
    try {
        const car = await editCar(req.params.id, req.body)
        res.json({ message: 'Mobil berhasil diupdate', car })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

const deleteCar = async (req, res) => {
    try {
        await removeCar(req.params.id)
        res.json({ message: 'Mobil berhasil dihapus' })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

module.exports = { getCars, getCarDetail, createCar, updateCar, deleteCar }