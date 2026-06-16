const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
require('dotenv').config()

const authRoutes = require('./routes/authRoutes')
const carRoutes = require('./routes/carRoutes')
const rentalRoutes = require('./routes/rentalRoutes')
const errorHandler = require('./middleware/errorMiddleware')

const app = express()

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRoutes)
app.use('/api/cars', carRoutes)
app.use('/api/rentals', rentalRoutes)

app.get('/', (req, res) => {
    res.json({ message: 'G-RantCar API is running!' })
})

app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})