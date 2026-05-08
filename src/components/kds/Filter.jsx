import React from 'react'

const Filter = ({ activeFilter, setActiveFilter, orders = [], status_config }) => {
  const statues = [
    { id: 'all', label: 'All' },
    { id: 'new', label: 'New Orders' },
    { id: 'preparing', label: 'Preparing' },
    { id: 'ready', label: 'Ready' },
    { id: 'shipping', label: 'Shipped' },
  ]

  const getCount = (statusId) => {
    if (statusId === 'all') return orders.length;
    return orders.filter(o => o.status === statusId).length;
  }

  return (
    <div className="flex items-center gap-4 flex-wrap">
      {statues.map(status => {
        const styles = status_config[status.id]
        const isActive = activeFilter === status.id
        const count = getCount(status.id)

        return (
          <button
            key={status.id}
            onClick={() => setActiveFilter(status.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-medium transition-all cursor-pointer
              ${isActive ? styles.active : styles.inactive}`}
          >
            {status.label}
            <span className={`text-xs px-2 py-1 rounded-full font-bold
              ${isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
              {count}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export default Filter