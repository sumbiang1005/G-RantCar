const { Pool } = require('pg')
require('dotenv').config()

const pool = new Pool({
    connectionString: process.env.DB_URL,
    ssl: {
        rejectUnauthorized: false
    }
})

pool.connect()
    .then(() => console.log('Database connected!'))
    .catch((err) => console.error('Database error:', err))

module.exports = pool