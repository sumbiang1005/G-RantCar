const { getAllRentals, getRentalsByUserId, getRentalById, createRental, updateRentalStatus } = require('../models/rentalModel')
const { getCarById } = require('../models/carModel')

const fetchAllRentals = async () => {
    return await getAllRentals()
}

const fetchUserRentals = async (userId) => {
    return await getRentalsByUserId(userId)
}

const addRental = async ({ user_id, car_id, start_date, end_date }) => {
    const car = await getCarById(car_id)
    if (!car) throw new Error('Mobil tidak ditemukan')
    if (!car.is_available || car.stock < 1) throw new Error('Mobil tidak tersedia')

    const start = new Date(start_date)
    const end = new Date(end_date)
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24))
    if (days < 1) throw new Error('Tanggal tidak valid')

    const total_price = days * car.price_per_day

    const rental = await createRental({ user_id, car_id, start_date, end_date, total_price })
    return rental
}

const changeRentalStatus = async (id, status) => {
    const rental = await getRentalById(id)
    if (!rental) throw new Error('Rental tidak ditemukan')
    return await updateRentalStatus(id, status)
}

module.exports = { fetchAllRentals, fetchUserRentals, addRental, changeRentalStatus }
