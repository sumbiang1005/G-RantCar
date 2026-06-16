const pool = require('../config/database')

const findUserByEmail = async (email) => {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    return result.rows[0]
}

const findUserById = async (id) => {
    const result = await pool.query('SELECT id, username, email, role, created_at FROM users WHERE id = $1', [id])
    return result.rows[0]
}

const createUser = async (username, email, hashedPassword) => {
    const result = await pool.query(
        'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, role',
        [username, email, hashedPassword]
    )
    return result.rows[0]
}

module.exports = { findUserByEmail, findUserById, createUser }
