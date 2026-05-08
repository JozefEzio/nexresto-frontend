import React, { useEffect, useState } from 'react'
import api from '../../lib/axios'
import { Flame, Timer, CheckCircle, ArrowRight, ChefHat, Search, Clock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import StatCard from './StatCard'
import FormatTimeAgo from '../../config/FormatTimeAgo'

const ChefHome = () => {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const todayStr = new Date().toISOString().split('T')[0]
  const [currentPage, setCurrentPage] = useState(1)
  const orders_per_page = 6
  const link = { label: 'Kitchen', sub: 'Manage orders', path: '/kds', bg: '#C2DBE9', icon: <ChefHat size={20} />, textColor: '#3a7fa8' }

  const fetchOrders = () =>
    api.get('/kds/orders')
      .then((res) => setOrders(res.data?.filter((o) => o.created_at.split('T')[0] === todayStr).sort((a, b) => new Date(b.created_at) - new Date(a.created_at))))

  useEffect(() => {
    fetchOrders()
    setLoading(false)
    const interval = setInterval(fetchOrders, 30000)
    return () => clearInterval(interval)
  }, [])
  const totalPages = Math.ceil(orders.length / orders_per_page)
  const paginated = orders.slice(
    (currentPage - 1) * orders_per_page,
    currentPage * orders_per_page
  )
  const newOrders = orders.filter(o => o.status === 'new').length
  const preparing = orders.filter(o => o.status === 'preparing').length
  const ready = orders.filter(o => o.status === 'ready').length

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
        <StatCard label="New Orders" value={newOrders} icon={<Flame size={22} />} color="#FAC1D9" iconColor="#c0557a" sub="Waiting to prepare" />
        <StatCard label="Preparing" value={preparing} icon={<Timer size={22} />} color="#C9CAEF" iconColor="#5657b5" sub="In the kitchen" />
        <StatCard label="Ready" value={ready} icon={<CheckCircle size={22} />} color="#CFDDDB" iconColor="#3a7fa8" sub="Waiting for pickup" />
      </div>
      {orders.length === 0 ?
        (<>
          <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <div className="bg-gray-200 p-3 rounded-full mb-4">
              <Search size={20} className="text-gray-400" />

            </div>
            <p className="text-gray-500 font-medium text-sm">No Data found</p>
          </div>
        </>)
        : (
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h4 className="font-bold text-gray-800 mb-4">Active Orders</h4>
            <div className="flex flex-col gap-2">
              {paginated.filter(o => ['new', 'preparing', 'ready'].includes(o.status)).map(o => (
                <div key={o.id} className="flex items-center justify-between py-2 border-b border-gray-50">
                  <span className="font-medium text-sm text-gray-800">#{o.order_number}</span>
                  <span className="text-gray-400">
                    {o.total_price} DH
                  </span>
                  <span className="text-xs text-gray-400">{o.order_item?.length ?? 0} items</span>
                  <span className="text-gray-400 flex items-center">
                    <FormatTimeAgo dateString={o.created_at} />
                  </span>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium
                ${o.status === 'new' ? 'bg-blue-50 text-blue-500'
                      : o.status === 'preparing' ? 'bg-orange-50 text-orange-500'
                        : 'bg-green-50 text-green-500'}`}>
                    {o.status}
                  </span>
                </div>

              ))}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-400">
                    Showing {(currentPage - 1) * orders_per_page + 1}–{Math.min(currentPage * orders_per_page, orders.length)} of {orders.length} orders
                  </p>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentPage(p => p - 1)}
                      disabled={currentPage === 1}
                      className="w-8 h-8 cursor-pointer rounded-lg bg-gray-50 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed text-gray-500 flex items-center justify-center text-sm"
                    >‹</button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 cursor-pointer rounded-lg text-sm font-medium transition-colors
                      ${currentPage === page
                            ? 'bg-primary-orange text-white'
                            : 'bg-gray-50 hover:bg-gray-100 text-gray-500'}`}
                      >{page}</button>
                    ))}

                    <button
                      onClick={() => setCurrentPage(p => p + 1)}
                      disabled={currentPage === totalPages}
                      className="w-8 h-8 cursor-pointer rounded-lg bg-gray-50 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed text-gray-500 flex items-center justify-center text-sm"
                    >›</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

    </div>
  )
}

export default ChefHome