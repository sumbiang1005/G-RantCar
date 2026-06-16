const bcrypt = require('bcrypt')
const { findUserByEmail, findUserById, createUser } = require('../models/userModel')

const registerUser = async (username, email, password) => {
    const existingUser = await findUserByEmail(email)
    if (existingUser) {
        throw new Error('Email sudah terdaftar')
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await createUser(username, email, hashedPassword)
    return user
}

const loginUser = async (email, password) => {
    const user = await findUserByEmail(email)
    if (!user) {
        throw new Error('Email atau password salah')
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('Email atau password salah')
    }

    return user
}

const getProfile = async (userId) => {
    const user = await findUserById(userId)
    if (!user) {
        throw new Error('User tidak ditemukan')
    }
    return user
}

module.exports = { registerUser, loginUser, getProfile }
