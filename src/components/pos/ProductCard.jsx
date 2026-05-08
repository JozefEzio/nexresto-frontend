import { Minus, Plus } from 'lucide-react'
import { categoriesStyle } from '../../config/categoryStyles'
import React from 'react'

const ProductCard = ({ product, onAdd, onRemove, count }) => {
  if (!product) return null;
  // const style = categoriesStyle[product.category?.name] || categoriesStyle.default

  return (
    <div className="bg-white rounded-2xl flex flex-col transition-colors duration-200"
      style={{ borderLeft: `10px solid ${product.category.color}` }}
    >
      {product.is_available == 1 ? (<div className="py-2 px-3 flex flex-col flex-1 ">
        <span className="text-gray-400 mb-1 text-[12px]">
          categories → {product.category?.name}
        </span>
        <p className="font-bold  text-gray-800 leading-tight text-sm">{product.name}</p>
        <p className="text-gray-500 mt-1 text-sm">{product.price} DH</p>

        <div className="flex items-center gap-2 mt-5 pt-3">
          <div className='ml-auto flex items-center gap-2'>
            <button
              onClick={() => onRemove(product.id)}
              className="w-5 h-5 cursor-pointer rounded border border-gray-200 bg-gray-50 text-sm flex items-center justify-center hover:bg-gray-100 transition-colors"
            ><Minus /></button>
            <span className="min-w-[16px] text-center font-medium">{count}</span>
            <button
              onClick={() => onAdd(product)}
              className="w-5 h-5 cursor-pointer rounded border border-gray-200 bg-gray-50 text-sm flex items-center justify-center hover:bg-gray-100 transition-colors"
            ><Plus /></button>
          </div>

        </div>
      </div>) : (
        <div>
          {product.name} Is not available
        </div>
      )}
    </div>
  )
}

export default ProductCard