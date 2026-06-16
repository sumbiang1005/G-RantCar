import { useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const CalendarBooking = ({ carPrice, onDateSelect }) => {
    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)

    const handleChange = (dates) => {
        const [start, end] = dates
        setStartDate(start)
        setEndDate(end)
        if (start && end) {
            const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24))
            onDateSelect({ start, end, days, totalPrice: days * carPrice })
        }
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
            <h4 className="font-bold mb-3">Pilih Tanggal Sewa</h4>
            <DatePicker
                selectsRange={true}
                startDate={startDate}
                endDate={endDate}
                onChange={handleChange}
                minDate={new Date()}
                monthsShown={2}
                inline
                className="w-full"
            />
            {startDate && endDate && (
                <div className="mt-4 p-3 bg-blue-500/10 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        Durasi: {Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))} hari
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        Total: Rp {Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) * carPrice}
                    </p>
                </div>
            )}
        </div>
    )
}

export default CalendarBooking