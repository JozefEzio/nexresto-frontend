import React, { useContext, useEffect, useState } from 'react'
import api from '../../lib/axios'
import { ShoppingBag, TrendingUp, XCircle, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import StatCard from './StatCard'
import RecentOrdersTable from './RecentOrdersTable'

const CashierHome = () => {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const link = { label: 'POS', sub: 'Take orders', path: '/pos', bg: '#C2E9DD', icon: <ShoppingBag size={20} />, textColor: '#2e8a6e' }


  useEffect(() => {
    api.get('/orders')
      .then(res => setOrders(res.data.filter(o => o.user_id === user.id)))
      .finally(() => setLoading(false))
  }, [])
  const today = new Date().toISOString().split('T')[0]
  const todayOrders = orders.filter(o => o.created_at?.split('T')[0] === today)
  const revenue = todayOrders.reduce((s, o) => s + Number(o.total_price), 0)
  const cancelled = todayOrders.filter(o => o.status === 'cancelled').length
  console.log(todayOrders)
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

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
        <StatCard label="My Orders Today" value={todayOrders.length} icon={<ShoppingBag size={22} />} color="#CFDDDB" iconColor="#3a7fa8"  />
        <StatCard label="My Revenue Today" value={`${revenue.toFixed(2)} DH`} icon={<TrendingUp size={22} />} color="#C9CAEF" iconColor="#5657b5" />
        <StatCard label="Cancelled" value={cancelled} icon={<XCircle size={22} />} color="#FDE2E4" iconColor="#c0557a" />
      </div>

      <RecentOrdersTable orders={todayOrders} />
    </div>
  )
}

export default CashierHome