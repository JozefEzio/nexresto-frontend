import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { BikeIcon, MapPin, Phone, User } from 'lucide-react'
import { useToast } from '../context/ToastContext'
import DateFilter from '../components/kds/DateFilter'
import api from '../lib/axios'

const DELIVERY_STATUS = {
  pending: { label: 'Pending', next: 'picked_up', action: 'Pick Up', bg: '#FF6B00', pale: '#FFF0E6', text: '#CC5500' },
  picked_up: { label: 'Picked Up', next: 'delivered', action: 'Mark Delivered', bg: '#2E81E0', pale: '#EBF4FF', text: '#1a5fa8' },
  delivered: { label: 'Delivered', next: null, action: null, bg: '#22C55E', pale: '#EDFAF3', text: '#16873f' },
}

const FILTER_TABS = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'picked_up', label: 'Picked Up' },
  { id: 'delivered', label: 'Delivered' },
]

const Deliveries = () => {
  const { user } = useContext(AuthContext)
  const { toast } = useToast()
  const isAdmin = user?.role?.label === 'Admin'

  const [deliveries, setDeliveries] = useState([])
  const [users, setUsers] = useState([])
  const [selectedDriver, setSelectedDriver] = useState('all')
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const todayStr = new Date().toISOString().split('T')[0]
  const [selectedDate, setSelectedDate] = useState(todayStr)

  const fetchDeliveries = () => {
    const endpoint = isAdmin ? '/deliveries/all' : '/deliveries'
    api.get(endpoint)
      .then((res) => {
        setDeliveries(res.data.deliveries)
        setUsers(res.data.users ?? [])
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchDeliveries()
    const interval = setInterval(fetchDeliveries, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleUpdateStatus = async (delivery, newStatus) => {
    setDeliveries((prev) => prev.map((d) => d.id === delivery.id ? { ...d, status: newStatus } : d))
    try {
      await api.patch(`/deliveries/${delivery.id}/updateStatus`, { status: newStatus })
      toast({ message: `Order #${delivery.order?.order_number} marked as ${newStatus.replace('_', ' ')}!`, type: 'success' })
    } catch {
      fetchDeliveries()
      toast({ message: 'Failed to update status', type: 'error' })
    }
  }

  const byDriver = selectedDriver === 'all'
    ? deliveries
    : deliveries.filter((d) => d.user_id === Number(selectedDriver))

  const dateFiltered = byDriver.filter((d) => !selectedDate || d.created_at?.split('T')[0] === selectedDate)
  const filteredDeliveries = filter !== 'all' ? dateFiltered.filter((d) => d.status === filter) : dateFiltered

  return (
    <div className="py-5 px-6 bg-[#F8F9FA] min-h-screen">
      <h2 className="font-abeezee text-[30px] text-primary-black font-bold">Deliveries</h2>
      <p className="font-abeezee text-small-gray text-[15px] mb-6">Manage all delivery orders</p>

      {isAdmin && (
        <div className="flex gap-2 flex-wrap mb-6">
          <button onClick={() => setSelectedDriver('all')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all cursor-pointer"
            style={{ backgroundColor: selectedDriver === 'all' ? '#1A1A1A' : '#fff', color: selectedDriver === 'all' ? '#fff' : '#6B7280', borderColor: selectedDriver === 'all' ? '#1A1A1A' : '#E5E7EB' }}>
            <BikeIcon size={14} /> All Drivers
            <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: selectedDriver === 'all' ? 'rgba(255,255,255,0.2)' : '#F3F4F6', color: selectedDriver === 'all' ? '#fff' : '#6B7280' }}>
              {deliveries.filter((d) => d.created_at?.split('T')[0] === selectedDate).length}
            </span>
          </button>
          {users.map((driver) => {
            const isActive = selectedDriver === String(driver.id)
            return (
              <button key={driver.id} onClick={() => setSelectedDriver(String(driver.id))}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all cursor-pointer"
                style={{ backgroundColor: isActive ? '#7C3AED' : '#fff', color: isActive ? '#fff' : '#6B7280', borderColor: isActive ? '#7C3AED' : '#E5E7EB' }}>
                <User size={14} /> {driver.name}
                <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : '#F3F4F6', color: isActive ? '#fff' : '#6B7280' }}>
                  {deliveries.filter((d) => d.user_id === driver.id && d.created_at?.split('T')[0] === selectedDate).length}
                </span>
              </button>
            )
          })}
        </div>
      )}

      <div className="flex items-center justify-between mt-2 flex-wrap gap-3 mb-8">
        <div className="flex gap-2 flex-wrap">
          {FILTER_TABS.map((tab) => {
            const isActive = filter === tab.id
            const config = DELIVERY_STATUS[tab.id]
            return (
              <button key={tab.id} onClick={() => setFilter(tab.id)}
                className="px-4 py-2 rounded-xl text-sm font-medium border transition-all cursor-pointer"
                style={{ backgroundColor: isActive ? (config?.bg ?? '#1A1A1A') : '#fff', color: isActive ? '#fff' : (config?.text ?? '#6B7280'), borderColor: isActive ? (config?.bg ?? '#1A1A1A') : '#E5E7EB' }}>
                {tab.label}
                <span className="ml-2 text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : '#F3F4F6', color: isActive ? '#fff' : '#6B7280' }}>
                  {tab.id === 'all' ? dateFiltered.length : dateFiltered.filter((d) => d.status === tab.id).length}
                </span>
              </button>
            )
          })}
        </div>
        <DateFilter selectedDate={selectedDate} setSelectedDate={setSelectedDate} todayStr={todayStr} />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-52 bg-gray-100 rounded-2xl" />)}
        </div>
      ) : filteredDeliveries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <BikeIcon size={40} className="mb-3 text-gray-300" />
          <p className="font-medium">No deliveries found</p>
          <p className="text-sm mt-1">Try adjusting the filters above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDeliveries.map((d) => {
            const config = DELIVERY_STATUS[d.status] ?? DELIVERY_STATUS.pending
            return (
              <div key={d.id} className="bg-white rounded-2xl overflow-hidden" style={{ border: `1.5px solid ${config.bg}` }}>
                <div className="px-4 py-3 flex items-center justify-between" style={{ backgroundColor: config.pale }}>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-800">#{d.order?.order_number ?? d.order_id}</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-medium" style={{ backgroundColor: config.bg, color: '#fff' }}>{config.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-600 font-medium flex items-center gap-1">
                      <User size={10} /> {d.user?.name ?? 'Unassigned'}
                    </span>
                    <span className="font-bold text-sm" style={{ color: config.text }}>{Number(d.order?.total_price ?? 0).toFixed(2)} DH</span>
                  </div>
                </div>
                <div className="px-4 py-3 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-sm text-gray-700"><User size={14} className="text-gray-400 flex-shrink-0" /><span className="font-medium">{d.customer_name}</span></div>
                  <div className="flex items-center gap-2 text-sm"><Phone size={14} className="text-gray-400 flex-shrink-0" /><a href={`tel:${d.phone}`} className="hover:underline" style={{ color: config.text }}>{d.phone}</a></div>
                  <div className="flex items-start gap-2 text-sm"><MapPin size={14} className="text-gray-400 flex-shrink-0 mt-0.5" /><a href={`https://maps.google.com/?q=${encodeURIComponent(d.address)}`} target="_blank" rel="noopener noreferrer" className="hover:underline underline-offset-2" style={{ color: config.text }}>{d.address}</a></div>
                </div>
                <div className="px-4 pb-3">
                  <div className="rounded-xl p-3 flex flex-col gap-1" style={{ backgroundColor: config.pale }}>
                    {d.order?.order_item?.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex justify-between text-xs" style={{ color: config.text }}>
                        <span>{item.quantity}x {item.product?.name ?? `Product #${item.product_id}`}</span>
                        <span style={{ opacity: 0.7 }}>{(item.price * item.quantity).toFixed(2)} DH</span>
                      </div>
                    ))}
                    {(d.order?.order_item?.length ?? 0) > 3 && (
                      <p className="text-xs" style={{ color: config.text, opacity: 0.6 }}>+{d.order.order_item.length - 3} more items</p>
                    )}
                  </div>
                </div>
                <div className="px-4 pb-2 text-xs text-gray-400">
                  {new Date(d.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} · {new Date(d.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                {config.next && (
                  <div className="px-4 pb-4">
                    <button onClick={() => handleUpdateStatus(d, config.next)}
                      className="w-full py-2.5 rounded-xl text-white text-sm font-bold transition-all cursor-pointer hover:opacity-90"
                      style={{ backgroundColor: config.bg }}>
                      {config.action} ›
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Deliveries