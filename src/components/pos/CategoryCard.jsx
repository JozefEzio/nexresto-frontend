import React, { useState } from 'react'

const CategoryCard = ({ id, color, Icon, name, product_count, isActive, setIsActive }) => {
  // const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      // onMouseEnter={() => setIsHovered(true)}
      // onMouseLeave={() => setIsHovered(false)}
      key={id}
      className={`p-4 rounded-2xl flex flex-col cursor-pointer transition-colors duration-200`}
      style={{
        backgroundColor: color, outline: isActive ? '2px solid #FF6B00' : '2px solid transparent',
      }}
      onClick={() => setIsActive(prev => prev === id ? null : id)}

    >

      <div className="mb-2 text-gray-700">
        <Icon size={24}/>
      </div>
      <div className='mt-5 flex flex-col'>
        <span className="font-bold">{name}</span>
        <span className="text-xs">{product_count} Items</span>
      </div>
    </div>
  )
}

export default CategoryCard