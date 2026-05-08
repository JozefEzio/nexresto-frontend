import React, { useContext, useEffect, useState } from 'react'
import ProductCard from './ProductCard'
import { PackageSearch } from 'lucide-react'
import ProductChosen from '../../context/ProductChosen'
import api from '../../lib/axios'

const Products = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const { isActive, onRemove, onAdd, productsChosen } = useContext(ProductChosen)

  useEffect(() => {
    api.get('/products')
      .then((res) => setProducts(res.data))
      .finally(() => setLoading(false))
  }, [])

  const filteredProducts = isActive
    ? products.filter((p) => p.category_id === isActive)
    : products

  if (loading) {
    return (
      <div>
        <h2 className="font-abeezee text-[30px] text-primary-black font-bold">Products</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 md:grid-cols-3 gap-4 mt-4 animate-pulse">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-36 bg-gray-100 rounded-2xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2 className="font-abeezee text-[30px] text-primary-black font-bold">Products</h2>
      <p className="font-abeezee text-small-gray text-[15px]">Select items to add to cart:</p>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 md:grid-cols-3 gap-4 mt-4">
          {filteredProducts.map((product) => {
            const count = productsChosen.find((item) => item.id === product.id)
            return (
              <ProductCard
                key={product.id}
                product={product}
                onAdd={onAdd}
                onRemove={onRemove}
                count={count ? count.quantity : 0}
              />
            )
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 mt-4">
          <div className="bg-gray-200 p-4 rounded-full mb-4">
            <PackageSearch size={40} className="text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium text-lg">No products found</p>
          <p className="text-gray-400 text-sm">This category is currently empty.</p>
        </div>
      )}
    </div>
  )
}

export default Products