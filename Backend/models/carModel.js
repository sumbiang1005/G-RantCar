const pool = require('../config/database')

const getAllCars = async () => {
    const result = await pool.query('SELECT * FROM cars ORDER BY created_at DESC')
    return result.rows
}

const getCarById = async (id) => {
    const result = await pool.query('SELECT * FROM cars WHERE id = $1', [id])
    return result.rows[0]
}

const createCar = async ({ name, brand, price_per_day, stock, image_url, description }) => {
    const result = await pool.query(
        'INSERT INTO cars (name, brand, price_per_day, stock, image_url, description) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [name, brand, price_per_day, stock, image_url, description]
    )
    return result.rows[0]
}

const updateCar = async (id, { name, brand, price_per_day, stock, image_url, description, is_available }) => {
    const result = await pool.query(
        'UPDATE cars SET name=$1, brand=$2, price_per_day=$3, stock=$4, image_url=$5, description=$6, is_available=$7 WHERE id=$8 RETURNING *',
        [name, brand, price_per_day, stock, image_url, description, is_available, id]
    )
    return result.rows[0]
}

const deleteCar = async (id) => {
    await pool.query('DELETE FROM cars WHERE id = $1', [id])
}

module.exports = { getAllCars, getCarById, createCar, updateCar, deleteCar }
