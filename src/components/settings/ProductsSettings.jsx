import api from '../../lib/axios';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useToast } from '../../context/ToastContext'
import AddProductModal from './productModel/AddProductModal';
import EditProductModal from './productModel/EditProductModal';
import DeleteProductModal from './productModel/DeleteProductModal';


const ProductsSettings = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [addOpen, setAddOpen] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [deleteProduct, setDeleteProduct] = useState(null)
  const { toast } = useToast()
  const [currentPage, setCurrentPage] = useState(1)
  const products_per_page = 6

  useEffect(() => {
    Promise.all([
      api.get('/products'),
      api.get('/categories'),
    ]).then(([productsRes, categoriesRes]) => {
      setProducts(productsRes.data)
      setCategories(categoriesRes.data)
    }).finally(() => setLoading(false))
  }, [])

  const totalPages = Math.ceil(products.length / products_per_page)
  const paginated = products.slice(
    (currentPage - 1) * products_per_page,
    currentPage * products_per_page
  )

  const handleToggle = (product) => {
    const updated = { ...product, is_available: product.is_available ? 0 : 1 }
    setProducts(prev => prev.map(p => p.id === product.id ? updated : p))
    api.patch(`/products/${product.id}`, {
      is_available: updated.is_available
    })
      .then(() => toast({ message: `${product.name} is now ${updated.is_available ? 'available' : 'unavailable'}`, type: 'success' }))
      .catch(() => {
        setProducts(prev => prev.map(p => p.id === product.id ? product : p))
        toast({ message: 'Failed to update availability', type: 'error' })
      })
  }

  const handleAdd = (newProduct) => {
    // console.log("New product:",newProduct)
    setProducts(prev => [...prev, newProduct])
    setAddOpen(false)
    setCurrentPage(1)
    toast({ message: 'Product added!', type: 'success' })
  }

  const handleEdit = (updated) => {
    setProducts(prev => prev.map(p => p.id === updated.id ? updated : p))
    setEditProduct(null)
    toast({ message: 'Product updated!', type: 'success' })
  }

  const handleDelete = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id))
    setDeleteProduct(null)
    setCurrentPage(1)
    toast({ message: 'Product deleted!', type: 'success' })
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 w-[80%] mx-auto">

      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-gray-800 text-lg">Product Management</h3>
          <p className="text-gray-400 text-sm">{products.length} products total</p>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 mb-3 px-4 py-2.5 bg-primary-orange hover:bg-primary-orange-dark text-white font-semibold rounded-xl text-sm transition-all cursor-pointer"
        >
          <Plus size={16} />
          Add Product
        </button>
      </div>

      {loading ? (
        <p className="text-gray-400 text-sm text-center py-10">Loading products...</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs text-gray-400 font-medium pb-3 pl-2">Name</th>
                  <th className="text-left text-xs text-gray-400 font-medium pb-3">Description</th>
                  <th className="text-left text-xs text-gray-400 font-medium pb-3">Category</th>
                  <th className="text-left text-xs text-gray-400 font-medium pb-3">Price</th>
                  <th className="text-left text-xs text-gray-400 font-medium pb-3">Created At</th>
                  <th className="text-left text-xs text-gray-400 font-medium pb-3">Available</th>
                  <th className="text-right text-xs text-gray-400 font-medium pb-3 pr-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginated.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">

                    <td className="py-3 pl-2">
                      <span className="text-sm font-medium text-gray-800">{p.name}</span>
                    </td>

                    <td className="py-3">
                      <span className="text-xs text-gray-400 line-clamp-1 max-w-[150px]">
                        {p.description ?? '—'}
                      </span>
                    </td>

                    <td className="py-3">
                      <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 font-medium"
                        style={{ backgroundColor: p.category.color }}>
                        {p.category?.name ?? '—'}
                      </span>
                    </td>

                    <td className="py-3">
                      <span className="text-sm font-medium text-gray-700">{p.price} DH</span>
                    </td>

                    <td className="py-3">
                      <span className="text-xs text-gray-400">
                        {new Date(p.created_at).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'short', day: 'numeric'
                        })}
                      </span>
                    </td>

                    <td className="py-3">
                      <button
                        onClick={() => handleToggle(p)}
                        className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer
                          ${p.is_available ? 'bg-green-400' : 'bg-gray-200'}`}
                      >
                        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all
                          ${p.is_available ? 'left-5' : 'left-0.5'}`}
                        />
                      </button>
                    </td>

                    <td className="py-3 pr-2">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setEditProduct(p)}
                          className="w-8 h-8 cursor-pointer rounded-lg bg-gray-50 hover:bg-blue-50 hover:text-blue-500 text-gray-400 flex items-center justify-center transition-colors"
                        ><Pencil size={14} /></button>

                        <button
                          onClick={() => setDeleteProduct(p)}
                          className="w-8 h-8 cursor-pointer rounded-lg bg-gray-50 hover:bg-red-50 hover:text-red-400 text-gray-400 flex items-center justify-center transition-colors"
                        ><Trash2 size={14} /></button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400">
                Showing {(currentPage - 1) * products_per_page + 1}–{Math.min(currentPage * products_per_page, products.length)} of {products.length} products
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

      {addOpen && <AddProductModal categories={categories} onAdd={handleAdd} onClose={() => setAddOpen(false)} />}
      {editProduct && <EditProductModal categories={categories} product={editProduct} onEdit={handleEdit} onClose={() => setEditProduct(null)} />}
      {deleteProduct && <DeleteProductModal product={deleteProduct} onDelete={handleDelete} onClose={() => setDeleteProduct(null)} />}

    </div>
  )
}

export default ProductsSettings