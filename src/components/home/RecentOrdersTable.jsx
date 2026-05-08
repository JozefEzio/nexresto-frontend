import { Search } from 'lucide-react'
import React, { useState } from 'react'
import { status_color } from '../../config/Colors'


const RecentOrdersTable = ({ orders }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const orders_per_page = 4
  // const style = {
  //   new: 'bg-blue-50 text-blue-500',
  //   preparing: 'bg-orange-50 text-orange-500',
  //   ready: 'bg-green-50 text-green-500',
  //   delivered: 'bg-purple-50 text-purple-500',
  //   cancelled: 'bg-red-50 text-red-400',
  // }
  const totalPages = Math.ceil(orders.length / orders_per_page)
  const paginated = orders.slice(
    (currentPage - 1) * orders_per_page,
    currentPage * orders_per_page
  )


  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <h4 className="font-bold text-gray-800 mb-4">Recent Orders</h4>
      {orders.length === 0 ?
        (<>
          <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <div className="bg-gray-200 p-3 rounded-full mb-4">
              <Search size={20} className="text-gray-400" />

            </div>
            <p className="text-gray-500 font-medium text-sm">No Data found</p>
          </div></>)
        : (
          <>
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs text-gray-400 font-medium pb-2">Order</th>
                  <th className="text-left text-xs text-gray-400 font-medium pb-2">Type</th>
                  <th className="text-left text-xs text-gray-400 font-medium pb-2">Status</th>
                  <th className="text-left text-xs text-gray-400 font-medium pb-2">Payment</th>
                  <th className="text-right text-xs text-gray-400 font-medium pb-2">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginated.map(o => (

                  <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-2.5 text-sm font-medium text-gray-800">#{o.order_number}</td>
                    <td className="py-2.5 text-xs text-gray-500 capitalize">{o.type}</td>
                    <td className="py-2.5">
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{
                          backgroundColor: status_color[o.status]?.pale ?? status_color.unknown.bg,
                          color: status_color[o.status]?.text ?? status_color.unknown.text
                        }}>
                        {o.status}
                      </span>
                    </td>
                    <td className="py-2.5 text-xs text-gray-500 capitalize">{o.payment_method}</td>
                    <td className="py-2.5 text-sm font-semibold text-gray-800 text-right">{Number(o.total_price).toFixed(2)} DH</td>
                  </tr>
                ))}

              </tbody>
            </table>
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
          </>
        )}
    </div>
  )
}

export default RecentOrdersTable