import { Search, ChevronDown } from 'lucide-react'
import React, { useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { payment_methode, status_color } from '../../../config/Colors';

const OrderStatusChart = ({ orders }) => {
  const [chartMode, setChartMode] = useState('status');

  // const colors = {
  //   // Status Colors
  //   new: '#3B82F6',
  //   preparing: '#F97316',
  //   ready: '#22C55E',
  //   delivered: '#8B5CF6',
  //   cancelled: '#EF4444',
  //   // Payment Colors
  //   cash: '#10B981',
  //   card: '#6366F1',
  //   ewallet: '#F59E0B',
  //   giftcards: '#EC4899',
  //   unknown: '#9CA3AF'
  // };

  const data = Object.entries(
    orders.reduce((acc, o) => {
      let key;
      if (chartMode === 'status') {
        key = o.status;
      } else {
        key = o.payment_method?.trim().toLowerCase() || 'unknown';
      }

      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h4 className="font-bold text-gray-800">Orders by {chartMode === 'status' ? 'Status' : 'Payment'}</h4>

        <div className="relative inline-block text-left">
          <select
            value={chartMode}
            onChange={(e) => setChartMode(e.target.value)}
            className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-1.5 px-4 pr-8 rounded-lg text-xs font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-orange/20 transition-all"
          >
            <option value="status">Order Status</option>
            <option value="payment">Payment Method</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
            <ChevronDown size={14} />
          </div>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 py-10 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <div className="bg-gray-200 p-3 rounded-full mb-4">
            <Search size={20} className="text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium text-sm">No orders found</p>
        </div>
      ) : (
        <div className="flex-1">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry) => (
                  chartMode === 'status' ? (
                    <Cell key={entry.name} fill={status_color[entry.name].bg ?? status_color['unknown']} />) : (<Cell key={entry.name} fill={payment_methode[entry.name].bg ?? payment_methode.unknown} />)
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value, name) => [value, name.toUpperCase()]}
              />
              <Legend verticalAlign="bottom" iconType="circle" iconSize={8} wrapperStyle={{ paddingTop: '20px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default OrderStatusChart;