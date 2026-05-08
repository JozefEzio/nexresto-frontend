import React, { useEffect, useState } from 'react'
import Filter from '../components/kds/Filter'
import KdsCard from '../components/kds/KdsCard'
import { CalendarDays } from 'lucide-react'
import DateFilter from '../components/kds/DateFilter'
import { kds_status } from '../config/colors'
import api from '../lib/axios'

const Kds = () => {
  const [orders, setOrders] = useState([])
  const [activeFilter, setActiveFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  const todayStr = new Date().toISOString().split('T')[0]
  const [selectedDate, setSelectedDate] = useState(todayStr)

  const fetchOrders = () => {
    api.get('/kds/orders')
      .then((res) => {
        setOrders(res.data)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchOrders()
    const interval = setInterval(fetchOrders, 30000)
    return () => clearInterval(interval)
  }, [])

  const activeOrders = orders.filter((o) =>
    ['new', 'preparing', 'ready', 'shipping'].includes(o.status)
  )

  const dateFiltered = activeOrders.filter((o) =>
    !selectedDate || o.created_at?.split('T')[0] === selectedDate
  )

  const filteredOrders = activeFilter !== 'all'
    ? dateFiltered.filter((o) => o.status === activeFilter)
    : dateFiltered

  const onUpdateStatus = (order, newStatus) => {
    const isTerminal = ['delivered', 'cancelled'].includes(newStatus)

    if (!isTerminal) {
      setOrders((prev) => prev.map((o) => o.id === order.id ? { ...o, status: newStatus } : o))
    }

    api.patch(`/orders/${order.id}`, { status: newStatus })
      .then((res) => {
        if (isTerminal) {
          setOrders((prev) => prev.filter((o) => o.id !== order.id))
        } else {
          setOrders((prev) => prev.map((o) => o.id === order.id ? res.data : o))
        }
      })
      .catch(() => fetchOrders())
  }

  return (
    <div className="py-5 px-6 bg-[#F8F9FA] min-h-screen">
      <h2 className="font-abeezee text-[30px] text-primary-black font-bold">Kitchen Display System</h2>
      <p className="font-abeezee text-small-gray text-[15px]">Real-time order management for the kitchen</p>

      <div className="flex items-center justify-between mt-5 flex-wrap gap-3 mb-8">
        <Filter
          orders={dateFiltered}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          status_config={kds_status}
        />
        <DateFilter selectedDate={selectedDate} setSelectedDate={setSelectedDate} todayStr={todayStr} />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-4 animate-pulse">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 bg-gray-100 rounded-2xl" />
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400">
          <CalendarDays size={36} className="mb-3 text-gray-300" />
          <p className="font-medium">No orders for this date</p>
          <p className="text-sm mt-1">
            {new Date(selectedDate).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-4">
          {filteredOrders.map((order) => (
            <KdsCard
              key={order.id}
              order={order}
              status={kds_status}
              onUpdateStatus={onUpdateStatus}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Kds