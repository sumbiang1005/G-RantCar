import { createContext, useContext, useState } from 'react'

const CartContext = createContext(null)

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(null)

    const addToCart = (car, startDate, endDate) => {
        const days = Math.ceil(
            (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)
        )
        setCart({
            car,
            startDate,
            endDate,
            days,
            totalPrice: days * car.price_per_day,
        })
    }

    const clearCart = () => setCart(null)

    return (
        <CartContext.Provider value={{ cart, addToCart, clearCart }}>
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => useContext(CartContext)
