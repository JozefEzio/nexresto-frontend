import React, { useContext, useEffect, useState } from 'react'
import CategoryCard from './CategoryCard'
import axios from 'axios'
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react'
// import { categoriesStyle } from '../../config/categoryStyles'
import * as Icons from 'lucide-react'

import {
  HelpCircleIcon
} from 'lucide-react'
import ProductChosen from '../../context/ProductChosen'


const collapsefRows = 2
const cols = 4


const Categories = () => {
  const [categories, setCategories] = useState([])
  const [expanded, setExpanded] = useState(false)
  const { isActive, setIsActive } = useContext(ProductChosen)

  useEffect(() => {
    axios.get('http://nexresto-api.test/api/categories')
      .then(res => setCategories(res.data))
  }, [])

  const visibleCount = collapsefRows * cols
  const hasMore = categories.length > visibleCount
  const visible = expanded ? categories : categories.slice(0, visibleCount)

  return (
    <div>
      <h2 className="font-abeezee text-[30px] text-primary-black font-bold">Categories</h2>
      <p className="font-abeezee text-small-gray text-[15px]">Chose category to order:</p>

      <div className="grid grid-cols-3 lg:grid-cols-4 md:grid-cols-3 gap-4 mt-4">
        {visible.map(cat => {
          // const style = categoriesStyle[cat.name] || categoriesStyle.default;
          const Icon = Icons[cat.icon] ?? Icons['HelpCircleIcon'];

          return (
            <CategoryCard
              key={cat.id}
              id={cat.id}
              name={cat.name}
              color={cat.color}
              Icon={Icon}
              product_count={cat.product_count}
              // hover={style.hover}
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
            onClick={() => setExpanded(prev => !prev)}
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