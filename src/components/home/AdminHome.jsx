import React, { useEffect, useRef, useState } from 'react'
import api from '../../lib/axios'
import {
  ShoppingBag, TrendingUp, Clock, ChefHat,
  Settings, Users, Download, CalendarDays,
  XCircle, BikeIcon, Banknote, BarChart3
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import StatCard from './StatCard'
import RevenueChart from './charts/RevenueChart'
import OrderStatusChart from './charts/OrderStatusChart'
import RecentOrdersTable from './RecentOrdersTable'
import TopProducts from './TopProducts'



const AdminHome = () => {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)

  const todayStr = new Date().toISOString().split('T')[0]
  const [dateFrom, setDateFrom] = useState(todayStr)
  const [dateTo, setDateTo] = useState(todayStr)


  const quick_links = [
    { label: 'POS', sub: 'Take orders', path: '/pos', bg: '#C2E9DD', icon: <ShoppingBag size={20} />, textColor: '#2e8a6e' },
    { label: 'Kitchen', sub: 'Manage orders', path: '/kds', bg: '#C2DBE9', icon: <ChefHat size={20} />, textColor: '#3a7fa8' },
    { label: 'Settings', sub: 'Restaurant config', path: '/settings', bg: '#C9CAEF', icon: <Settings size={20} />, textColor: '#5657b5' },
    // { label: 'Users', sub: 'Manage team', path: '/settings', bg: '#C2E9DD', icon: <Users size={20} />, textColor: '#2e8a6e' },
  ]

  useEffect(() => {
    api.get('/orders')
      .then(res => setOrders(res.data))
      .finally(() => setLoading(false))
  }, [])

  const filteredOrders = orders.filter(o => {
    const d = o.created_at?.split('T')[0]
    return d >= dateFrom && d <= dateTo
  })

  const totalRevenue = filteredOrders.reduce((s, o) => s + Number(o.total_price), 0)
  const avgOrder = filteredOrders.length ? (totalRevenue / filteredOrders.length).toFixed(2) : 0
  const pending = filteredOrders.filter(o => ['new', 'preparing'].includes(o.status)).length
  const cancelled = filteredOrders.filter(o => o.status === 'cancelled').length
  const delivered = filteredOrders.filter(o => o.status === 'delivered').length
  const deliveryOrders = filteredOrders.filter(o => o.type === 'delivery').length
  const dineInOrders = filteredOrders.filter(o => o.type === 'on-site').length
  const totalItems = filteredOrders.reduce((s, o) => s + (o.order_item?.length ?? 0), 0)

  const handleDownload = () => {
    setDownloading(true)
    setTimeout(() => {
      window.print()
      setDownloading(false)
    }, 300)
  }
  return (
    <div className="flex flex-col gap-6">

      <div className="flex items-center justify-between flex-wrap gap-3 no-print">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2">
          <CalendarDays size={15} className="text-gray-400" />
          <span className="text-xs text-gray-400">From</span>
          <input type="date" value={dateFrom} max={dateTo}
            onChange={e => setDateFrom(e.target.value)}
            className="text-sm text-gray-600 outline-none cursor-pointer"
          />
          <span className="text-xs text-gray-400">To</span>
          <input type="date" value={dateTo} min={dateFrom}
            onChange={e => setDateTo(e.target.value)}
            className="text-sm text-gray-600 outline-none cursor-pointer"
          />
          {(dateFrom !== todayStr || dateTo !== todayStr) && (
            <button onClick={() => { setDateFrom(todayStr); setDateTo(todayStr) }}
              className="text-xs text-primary-orange hover:text-primary-orange-dark font-medium ml-1">
              Today
            </button>
          )}
        </div>

        <button onClick={handleDownload} disabled={downloading}
          className="flex items-center gap-2 px-4 py-2 bg-primary-orange hover:bg-primary-orange-dark disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-all cursor-pointer">
          <Download size={15} />
          {downloading ? 'Preparing...' : 'Download Report'}
        </button>
      </div>

      <div id="dashboard-print" className="flex flex-col gap-6">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 no-print">
          {quick_links.map(link => (
            <button key={link.label} onClick={() => navigate(link.path)}
              className="flex items-center gap-3 rounded-2xl px-4 py-3 transition-all cursor-pointer hover:shadow-md border border-transparent"
              style={{ backgroundColor: link.bg }}>
              <div className="w-10 h-10 rounded-xl bg-white/40 flex items-center justify-center flex-shrink-0"
                style={{ color: link.textColor }}>
                {link.icon}
              </div>
              <div className="text-left">
                <p className="font-bold text-sm" style={{ color: link.textColor }}>{link.label}</p>
                <p className="text-xs opacity-70" style={{ color: link.textColor }}>{link.sub}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <StatCard label="Total Revenue" value={`${totalRevenue.toFixed(2)} DH`} icon={<Banknote size={22} />} color="#C2E9DD" iconColor="#2e8a6e" sub={`${filteredOrders.length} orders`} />
          <StatCard label="Total Orders" value={filteredOrders.length} icon={<ShoppingBag size={22} />} color="#C2DBE9" iconColor="#3a7fa8" sub={dateFrom === dateTo ? 'Today' : 'Selected range'} />
          <StatCard label="Avg Order" value={`${avgOrder} DH`} icon={<BarChart3 size={22} />} color="#C9CAEF" iconColor="#5657b5" sub="Per order value" />
          <StatCard label="Pending" value={pending} icon={<Clock size={22} />} color="#FAC1D9" iconColor="#c0557a" sub="New + preparing" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <StatCard label="Delivered" value={delivered} icon={<TrendingUp size={22} />} color="#DFF3E3" iconColor="#2e8a6e" sub="Completed orders" />
          <StatCard label="Cancelled" value={cancelled} icon={<XCircle size={22} />} color="#FDE2E4" iconColor="#c0557a" sub="Cancelled orders" />
          <StatCard label="Delivery" value={deliveryOrders} icon={<BikeIcon size={22} />} color="#E4CDED" iconColor="#8b5cf6" sub="Delivery orders" />
          <StatCard label="Dine-in" value={dineInOrders} icon={<ChefHat size={22} />} color="#CFDDDB" iconColor="#3a7fa8" sub="On-site orders" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <RevenueChart orders={filteredOrders} />
          </div>
          <div className="md:col-span-1">
            <OrderStatusChart orders={filteredOrders} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <RecentOrdersTable orders={filteredOrders.slice(0, 10)} />
          </div>
          <div className="md:col-span-1">
            <TopProducts orders={filteredOrders} />
          </div>
        </div>

      </div>
    </div>
  )
}

export default AdminHome