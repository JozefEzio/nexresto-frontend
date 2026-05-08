import React, { useContext, useEffect, useState } from 'react'
import CategoryCard from './CategoryCard'
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react'
import * as Icons from 'lucide-react'
import ProductChosen from '../../context/ProductChosen'
import api from '../../lib/axios'

const COLLAPSE_ROWS = 2
const COLS = 4

const Categories = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(false)
  const { isActive, setIsActive } = useContext(ProductChosen)

  useEffect(() => {
    api.get('/categories')
      .then((res) => setCategories(res.data))
      .finally(() => setLoading(false))
  }, [])

  const visibleCount = COLLAPSE_ROWS * COLS
  const hasMore = categories.length > visibleCount
  const visible = expanded ? categories : categories.slice(0, visibleCount)

  if (loading) {
    return (
      <div>
        <h2 className="font-abeezee text-[30px] text-primary-black font-bold">Categories</h2>
        <div className="grid grid-cols-3 lg:grid-cols-4 md:grid-cols-3 gap-4 mt-4 animate-pulse">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-2xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2 className="font-abeezee text-[30px] text-primary-black font-bold">Categories</h2>
      <p className="font-abeezee text-small-gray text-[15px]">Choose a category to filter:</p>

      <div className="grid grid-cols-3 lg:grid-cols-4 md:grid-cols-3 gap-4 mt-4">
        {visible.map((cat) => {
          const Icon = Icons[cat.icon] ?? Icons['HelpCircle']
          return (
            <CategoryCard
              key={cat.id}
              id={cat.id}
              name={cat.name}
              color={cat.color}
              Icon={Icon}
              product_count={cat.product_count}
              isActive={isActive === cat.id}
              setIsActive={setIsActive}
            />
          )
        })}
      </div>

      {hasMore && (
        <div className="flex items-center gap-3 mt-3">
          <div className="flex-1 h-px bg-gray-300" />
          <button
            onClick={() => setExpanded((prev) => !prev)}
            aria-label={expanded ? 'Show fewer categories' : 'Show more categories'}
            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-all"
          >
            {expanded
              ? <ChevronUpIcon size={18} className="text-gray-600 cursor-pointer" />
              : <ChevronDownIcon size={18} className="text-gray-600 cursor-pointer" />}
          </button>
          <div className="flex-1 h-px bg-gray-300" />
        </div>
      )}
    </div>
  )
}

export default Categories
