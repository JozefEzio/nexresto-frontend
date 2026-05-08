import { Search } from 'lucide-react'
import React, { useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

const RevenueChart = ({ orders = [] }) => {
  const [filter, setFilter] = useState('week')

  const getData = () => {
    const now = new Date()

    if (filter === 'year') {
      const currentYear = now.getFullYear()

      const months = Array.from({ length: 12 }, (_, i) => ({
        label: new Date(0, i).toLocaleDateString('en-US', { month: 'short' }),
        revenue: 0
      }))

      orders.forEach(o => {
        if (!o.created_at) return
        const d = new Date(o.created_at)

        if (d.getFullYear() !== currentYear) return

        const monthIndex = d.getMonth()
        months[monthIndex].revenue += Number(o.total_price)
      })

      return months.map(m => ({
        ...m,
        revenue: +m.revenue.toFixed(2)
      }))
    }

    const days = filter === 'week' ? 7 : 30
    const result = []

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)

      const dateStr = d.toISOString().split('T')[0]
      const label = d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      })

      const dayOrders = orders.filter(
        o => o.created_at?.split('T')[0] === dateStr
      )

      const revenue = dayOrders.reduce(
        (sum, o) => sum + Number(o.total_price),
        0
      )

      result.push({
        label,
        revenue: +revenue.toFixed(2)
      })
    }

    return result
  }

  const data = getData()

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-bold text-gray-800">Revenue Overview</h4>

        <div className="flex gap-1">
          {['week', 'month', 'year'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all
                ${filter === f
                  ? 'bg-primary-orange text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <div className="bg-gray-200 p-3 rounded-full mb-4">
            <Search size={20} className="text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium text-sm">No Data found</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#9ca3af' }} />
            <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} />
            <Tooltip formatter={(v) => [`${v} DH`, 'Revenue']} />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#F07B26"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

export default RevenueChart