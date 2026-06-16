const pool = require('../config/database')

const getAllRentals = async () => {
    const result = await pool.query(`
        SELECT r.*, u.username, u.email, c.name as car_name, c.brand
        FROM rentals r
        JOIN users u ON r.user_id = u.id
        JOIN cars c ON r.car_id = c.id
        ORDER BY r.created_at DESC
    `)
    return result.rows
}

const getRentalsByUserId = async (userId) => {
    const result = await pool.query(`
        SELECT r.*, c.name as car_name, c.brand, c.image_url
        FROM rentals r
        JOIN cars c ON r.car_id = c.id
        WHERE r.user_id = $1
        ORDER BY r.created_at DESC
    `, [userId])
    return result.rows
}

const getRentalById = async (id) => {
    const result = await pool.query('SELECT * FROM rentals WHERE id = $1', [id])
    return result.rows[0]
}

const createRental = async ({ user_id, car_id, start_date, end_date, total_price }) => {
    const result = await pool.query(
        'INSERT INTO rentals (user_id, car_id, start_date, end_date, total_price) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [user_id, car_id, start_date, end_date, total_price]
    )
    return result.rows[0]
}

const updateRentalStatus = async (id, status) => {
    const result = await pool.query(
        'UPDATE rentals SET status = $1 WHERE id = $2 RETURNING *',
        [status, id]
    )
    return result.rows[0]
}

module.exports = { getAllRentals, getRentalsByUserId, getRentalById, createRental, updateRentalStatus }
