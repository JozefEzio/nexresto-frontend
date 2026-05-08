import React, { useContext, useEffect, useState } from 'react'
import { X, BikeIcon, UtensilsIcon, Clock, RotateCcw, XCircle } from 'lucide-react'
import FormatTimeAgo from '../../config/FormatTimeAgo'
import ProductChosen from '../../context/ProductChosen'
import api from '../../lib/axios'

const STATUS_STYLES = {
  new:       'bg-blue-50 text-blue-500',
  preparing: 'bg-orange-50 text-orange-500',
  ready:     'bg-green-50 text-green-500',
  delivered: 'bg-purple-50 text-purple-500',
  cancelled: 'bg-red-50 text-red-400',
  shipping:  'bg-yellow-50 text-yellow-600',
}

const RecentOrdersSidebar = ({ isOpen, onClose }) => {
  const { onRecallOrder } = useContext(ProductChosen)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState(null)
  const todayStr = new Date().toISOString().split('T')[0]

  useEffect(() => {
    if (!isOpen) return
    setLoading(true)
    api.get('/orders')
      .then((res) => setOrders(res.data.filter((o) => o.created_at?.split('T')[0] === todayStr)))
      .finally(() => setLoading(false))
  }, [isOpen])

  const handleCancel = (orderId, e) => {
    e.stopPropagation()
    api.patch(`/pos/orders/${orderId}`, { status: 'cancelled' })
      .then(() => setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: 'cancelled' } : o)))
  }

  const handleRecall = (order, e) => {
    e.stopPropagation()
    const recalled = order.order_item.map((item) => ({
      id: item.product_id,
      name: item.product?.name ?? `Product #${item.product_id}`,
      price: Number(item.price),
      quantity: item.quantity,
      category_color: item.product?.category?.color ?? '#ccc',
    }))
    onRecallOrder(recalled)
    onClose()
  }

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/20 z-40 transition-opacity" onClick={onClose} />
      )}

      <div className={`fixed top-0 right-0 h-full w-full max-w-[400px] bg-white z-50 shadow-2xl flex flex-col
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className="font-bold text-gray-800 text-lg">Recent Orders</h2>
            <p className="text-xs text-gray-400">{orders.length} orders today</p>
          </div>
          <button onClick={onClose} aria-label="Close sidebar"
            className="w-8 h-8 cursor-pointer rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
            <X size={16} className="text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3">
          {loading ? (
            <div className="flex flex-col gap-3 animate-pulse">
              {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-20 bg-gray-100 rounded-2xl" />)}
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400 text-sm">
              <UtensilsIcon size={32} className="mb-3 text-gray-300" />
              <p className="font-medium">No orders today yet</p>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id}
                onClick={() => setExpandedId((prev) => prev === order.id ? null : order.id)}
                className="bg-gray-50 hover:bg-gray-100 rounded-2xl border border-gray-100 cursor-pointer transition-colors">
                <div className="flex items-center gap-3 px-4 py-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-gray-800 text-sm">#{order.order_number}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[order.status] ?? 'bg-gray-100 text-gray-500'}`}>
                        {order.status}
                      </span>
                      <span className="text-[10px] text-gray-400 flex items-center gap-0.5 ml-auto">
                        <Clock size={10} /><FormatTimeAgo dateString={order.created_at} />
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        {order.type === 'delivery' ? <><BikeIcon size={11} /> Delivery</> : <><UtensilsIcon size={11} /> Dine-in</>}
                      </span>
                      <span>{order.order_item?.length ?? 0} items</span>
                      <span className="ml-auto font-semibold text-gray-600">{Number(order.total_price).toFixed(2)} DH</span>
                    </div>
                  </div>
                </div>

                {expandedId === order.id && (
                  <div className="px-4 pb-3 border-t border-gray-100">
                    <div className="flex flex-col gap-1.5 mt-2 mb-3">
                      {order.order_item?.map((item) => (
                        <div key={item.id} className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">
                            <span className="font-medium text-gray-700">{item.quantity}x </span>
                            {item.product?.name ?? `Product #${item.product_id}`}
                          </span>
                          <span className="text-gray-400">{(item.price * item.quantity).toFixed(2)} DH</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-2">
                      {order.status !== 'cancelled' && (
                        <button onClick={(e) => handleRecall(order, e)}
                          className="flex-1 flex items-center justify-center gap-1.5 cursor-pointer py-2 bg-primary-orange text-white rounded-xl text-xs font-semibold hover:bg-primary-orange-dark transition-colors">
                          <RotateCcw size={12} /> Recall Order
                        </button>
                      )}
                      {!['cancelled', 'delivered'].includes(order.status) && (
                        <button onClick={(e) => handleCancel(order.id, e)}
                          className="flex-1 flex items-center justify-center gap-1.5 cursor-pointer py-2 bg-red-50 text-red-400 hover:bg-red-100 rounded-xl text-xs font-semibold transition-colors">
                          <XCircle size={12} /> Cancel
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}

export default RecentOrdersSidebar