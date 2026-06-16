export const ROLES = {
    USER: 'user',
    ADMIN: 'admin',
}

export const RENTAL_STATUS = {
    PENDING: 'pending',
    ACTIVE: 'active',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
}

export const STATUS_LABEL = {
    pending: 'Menunggu',
    active: 'Aktif',
    completed: 'Selesai',
    cancelled: 'Dibatalkan',
}

export const STATUS_COLOR = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    active: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
}

// New constants
export const PAYMENT_METHODS = {
    MANUAL: 'manual',
    TRANSFER: 'transfer',
    QRIS: 'qris',
}

export const PAYMENT_LABEL = {
    manual: 'Tunai',
    transfer: 'Transfer Bank',
    qris: 'QRIS',
}

export const CAR_FILTERS = {
    ALL: 'all',
    AVAILABLE: 'available',
    CHEAPEST: 'cheapest',
    EXPENSIVE: 'expensive',
}

export const SORT_OPTIONS = [
    { value: 'newest', label: 'Terbaru' },
    { value: 'price_asc', label: 'Harga Terendah' },
    { value: 'price_desc', label: 'Harga Tertinggi' },
    { value: 'name_asc', label: 'Nama A-Z' },
]