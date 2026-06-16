const { getAllCars, getCarById, createCar, updateCar, deleteCar } = require('../models/carModel')

const fetchAllCars = async () => {
    return await getAllCars()
}

const fetchCarById = async (id) => {
    const car = await getCarById(id)
    if (!car) throw new Error('Mobil tidak ditemukan')
    return car
}

const addCar = async (data) => {
    return await createCar(data)
}

const editCar = async (id, data) => {
    const car = await getCarById(id)
    if (!car) throw new Error('Mobil tidak ditemukan')
    return await updateCar(id, data)
}

const removeCar = async (id) => {
    const car = await getCarById(id)
    if (!car) throw new Error('Mobil tidak ditemukan')
    await deleteCar(id)
}

module.exports = { fetchAllCars, fetchCarById, addCar, editCar, removeCar }
