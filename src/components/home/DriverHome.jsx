import React, { useContext, useEffect, useState } from 'react'
import api from '../../lib/axios'
import { BikeIcon, CheckCircle, Clock, ArrowRight, ShoppingBag } from 'lucide-react'
import { AuthContext } from '../../context/AuthContext'
import StatCard from './StatCard'
import { useNavigate } from 'react-router-dom'



const DriverHome = () => {
  const { user } = useContext(AuthContext)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const link = { label: 'Deliveries', sub: 'Manage deliveries', path: '/deliveries', bg: '#C2E9DD', icon: <BikeIcon size={20} />, textColor: '#2e8a6e' }


  const status_style = {
    pending: 'bg-[#FFF0E6] text-[#FF6B00]',
    delivered: 'bg-[#22C55E] text-[#EDFAF3]',
    cancelled: 'bg-[#FEF0F0] text-[#b91c1c]',
  }
  const delivery_status = {
    pending: { label: 'Pending', next: 'picked_up', action: 'Pick Up', bg: '#FF6B00', pale: '#FFF0E6', text: '#CC5500' },
    picked_up: { label: 'Picked Up', next: 'delivered', action: 'Delivered', bg: '#2E81E0', pale: '#EBF4FF', text: '#1a5fa8' },
    delivered: { label: 'Delivered', next: null, action: null, bg: '#22C55E', pale: '#EDFAF3', text: '#16873f' },
  }
  useEffect(() => {
    api.get('/deliveries')
      .then(res => setOrders(res.data.deliveries))
      .finally(() => setLoading(false))
  }, [])

  console.log(orders)
  const today = new Date().toISOString().split('T')[0]
  const pending = orders?.filter(o => o.status === 'pending').length
  const delivered = orders?.filter(o => o.order.status === 'delivered').length
  const todayRuns = orders?.filter(o => o.created_at?.split('T')[0] === today).length

  return (
    <div className="flex flex-col gap-6">
      <button key={link.label} onClick={() => navigate(link.path)}
        className="flex items-center justify-between gap-3 rounded-2xl px-4 py-3 transition-all cursor-pointer hover:shadow-md border border-transparent w-full"
        style={{ backgroundColor: link.bg }}>
        <div className='flex items-center gap-3'>
          <div className="w-10 h-10 rounded-xl bg-white/40 flex items-center justify-center flex-shrink-0"
            style={{ color: link.textColor }}>
            {link.icon}
          </div>
          <div className="text-left">
            <p className="font-bold text-sm" style={{ color: link.textColor }}>{link.label}</p>
            <p className="text-xs opacity-70" style={{ color: link.textColor }}>{link.sub}</p>
          </div>
        </div>
        <ArrowRight size={24} color={link.textColor} />
      </button>
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Pending Deliveries" value={pending} icon={<Clock size={22} />} color={delivery_status['pending'].pale} iconColor={delivery_status['pending'].bg} sub="Waiting for pickup" />
        <StatCard label="Delivered Today" value={delivered} icon={<CheckCircle size={22} />} color={delivery_status['picked_up'].pale} iconColor={delivery_status['picked_up'].bg} />
        <StatCard label="Today's Runs" value={todayRuns} icon={<BikeIcon size={22} />} color={delivery_status['delivered'].pale} iconColor={delivery_status['delivered'].bg} />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h4 className="font-bold text-gray-800 mb-4">My Deliveries</h4>
        {loading ? (
          <p className="text-gray-400 text-sm text-center py-6">Loading...</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-6">No deliveries assigned yet 🏍️</p>
        ) : (
          <div className="flex flex-col gap-3">
            {orders.map(o => (
              <div key={o.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm text-gray-800">#{o.order.order_number}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${status_style[o?.status] ?? 'bg-gray-100 text-gray-500'}`}>
                      {o?.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 font-medium">{o?.customer_name}</p>
                  <p className="text-xs text-gray-400 truncate">{o?.address}</p>
                  <p className="text-xs text-gray-400">{o?.phone}</p>
                </div>
                <div className="text-right flex-shrink-0 ml-3">
                  <p className="font-bold text-sm text-gray-800">{Number(o.order.total_price).toFixed(2)} DH</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(o.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default DriverHome