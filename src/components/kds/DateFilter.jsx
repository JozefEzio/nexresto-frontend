import { CalendarDays } from 'lucide-react'
import React from 'react'

const DateFilter = ({selectedDate, setSelectedDate, todayStr}) => {
    return (
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2">
            <CalendarDays size={16} className="text-gray-400" />
            <input
                type="date"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className=" text-gray-600 outline-none cursor-pointer text-[16px]"
            />
            {selectedDate !== todayStr && (
                <button
                    onClick={() => setSelectedDate(todayStr)}
                    className="text-sm cursor-pointer text-orange-500 hover:text-orange-600 font-medium ml-1"
                >
                    Today
                </button>
            )}
        </div>
    )
}

export default DateFilter