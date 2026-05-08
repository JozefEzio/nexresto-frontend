import React, { useState } from 'react'
import api from '../../../lib/axios'
import { Trash2, X } from 'lucide-react'

const DeleteProductModal = ({ product, onDelete, onClose }) => {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    try {
      await api.delete(`/products/${product.id}`)
      onDelete(product.id)
    } catch (err) {
      toast({ message: err.response?.data?.message ?? 'Failed to delete product', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h4 className="font-bold text-gray-800">Delete Product</h4>
            <button onClick={onClose} className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer">
              <X size={15} className="text-gray-500" />
            </button>
          </div>

          <div className="flex flex-col items-center gap-3 py-6">
            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
              <Trash2 size={24} className="text-red-400" />
            </div>
            <p className="text-gray-700 text-sm text-center">
              Are you sure you want to delete <span className="font-semibold">{product.name}</span>?
              <br />
              <span className="text-gray-400">This action cannot be undone.</span>
            </p>
          </div>

          {/* Footer */}
          <div className="flex gap-2 px-6 pb-6">
            <button onClick={onClose}
              className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-sm transition-all cursor-pointer">
              Cancel
            </button>
            <button onClick={handleDelete} disabled={loading}
              className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition-all cursor-pointer">
              {loading ? 'Deleting...' : 'Yes, Delete'}
            </button>
          </div>

        </div>
      </div>
    </>
  )
}

export default DeleteProductModal