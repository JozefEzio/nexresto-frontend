import React from 'react'

const StatCard = ({ label, value, icon, color, iconColor, sub }) => (
  <div
    className="bg-white rounded-2xl p-5 flex items-center gap-4"
  >
    <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
      style={{ color: iconColor, backgroundColor:color }}>
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium" style={{opacity: 0.8 }}>{label}</p>
      <p className="font-bold text-2xl" >{value}</p>
      {sub && <p className="text-xs mt-0.5" style={{opacity: 0.6 }}>{sub}</p>}
    </div>
  </div>
)

export default StatCard