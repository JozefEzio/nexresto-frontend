import { Search } from 'lucide-react'
import React from 'react'

const TopProducts = ({ orders }) => {
  const productMap = {}
  orders.forEach(o => {
    o.order_item?.forEach(item => {
      const name = item.product?.name ?? `Product #${item.product_id}`
      if (!productMap[name]) productMap[name] = { name, qty: 0, revenue: 0 }
      productMap[name].qty += item.quantity
      productMap[name].revenue += item.price * item.quantity
    })
  })
  // console.log("orders", orders)
  const top5 = Object.values(productMap)
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5)

  const max = top5[0]?.qty || 1

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <h4 className="font-bold text-gray-800 mb-4">Top Products</h4>
      {orders.length === 0 ?
        (<>
          <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <div className="bg-gray-200 p-3 rounded-full mb-4">
              <Search size={20} className="text-gray-400" />

            </div>
            <p className="text-gray-500 font-medium text-sm">No Data found</p>
          </div></>)
        : (
          <div className="flex flex-col gap-3">
            {top5.map((p, i) => (
              <div key={p.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700 truncate flex-1">{p.name}</span>
                  <span className="text-xs text-gray-400 ml-2">{p.qty}x</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full">
                  <div
                    className="h-1.5 rounded-full bg-primary-orange transition-all"
                    style={{ width: `${(p.qty / max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
            {top5.length === 0 && <p className="text-gray-400 text-sm text-center py-4">No data yet</p>}
          </div>)}
    </div>
  )
}

export default TopProducts