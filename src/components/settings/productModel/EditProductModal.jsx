import React, { useState } from 'react'
import api from '../../../lib/axios'
import { X } from 'lucide-react'
import FloatingInput from '../../../config/FloatingInput'

const EditProductModal = ({ product, categories, onEdit, onClose }) => {
    const [form, setForm] = useState({ name: product.name, description: product.description ?? '', price: product.price, category_id: product.category_id, is_available: product.is_available })
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)

    const handleSubmit = async () => {
        setLoading(true)
        setErrors({})
        try {
            const res = await api.put(`/products/${product.id}`, form)
            onEdit(res.data)
        } catch (err) {
            setErrors(err.response?.data?.errors ?? {})
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">

                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                        <h4 className="font-bold text-gray-800">Edit Product</h4>
                        <button onClick={onClose} className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer">
                            <X size={15} className="text-gray-500" />
                        </button>
                    </div>

                    <div className="px-6 py-5 flex flex-col gap-1">

                        <FloatingInput
                            id="name"
                            label="Product Name"
                            value={form.name}
                            error={errors.name}
                            onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                        />

                        <div className="mb-4">
                            <div className="relative">
                                <textarea
                                    id="description"
                                    rows={3}
                                    value={form.description}
                                    onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                                    className={`peer block w-full rounded-lg border bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-gray-900
        focus:outline-none focus:ring-0 resize-none transition-all
        ${errors.description ? 'border-red-400' : 'border-gray-300 focus:border-primary-orange'}`}
                                    placeholder=" "
                                />
                                <label htmlFor="description"
                                    className="absolute start-2 top-2 z-10 origin-[0] -translate-y-4 scale-75 bg-white px-2 text-sm text-gray-500 duration-300
        peer-placeholder-shown:top-4 peer-placeholder-shown:-translate-y-0 peer-placeholder-shown:scale-100
        peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-primary-orange">
                                    Description
                                </label>
                            </div>
                            {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description[0]}</p>}
                        </div>

                        <FloatingInput
                            id="price"
                            label="Price (DH)"
                            type="number"
                            value={form.price}
                            error={errors.price}
                            onChange={e => setForm(p => ({ ...p, price: e.target.value }))}
                        />

                        <div className="mb-3">
                            <div className="relative">
                                <select
                                    id="category"
                                    value={form.category_id}
                                    onChange={e => setForm(p => ({ ...p, category_id: parseInt(e.target.value) }))}
                                    className="peer block w-full rounded-lg border border-gray-300 bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-gray-900
                    focus:border-primary-orange focus:outline-none focus:ring-0"
                                >
                                    {categories.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                                <label htmlFor="category"
                                    className="absolute start-2 top-2 z-10 origin-[0] -translate-y-4 scale-75 bg-white px-2 text-sm text-gray-500">
                                    Category
                                </label>
                            </div>
                            {errors.category_id && <p className="text-red-400 text-xs mt-1">{errors.category_id[0]}</p>}
                        </div>

                        <div className="flex items-center justify-between px-1 mb-2">
                            <span className="text-sm text-gray-600">Available</span>
                            <button
                                onClick={() => setForm(p => ({ ...p, is_available: p.is_available ? 0 : 1 }))}
                                className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer
                  ${form.is_available ? 'bg-green-400' : 'bg-gray-200'}`}
                            >
                                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all
                  ${form.is_available ? 'left-5' : 'left-0.5'}`}
                                />
                            </button>
                        </div>

                    </div>

                    <div className="flex gap-2 px-6 pb-6">
                        <button onClick={onClose}
                            className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-sm transition-all cursor-pointer">
                            Cancel
                        </button>
                        <button onClick={handleSubmit} disabled={loading}
                            className="flex-1 py-2.5 bg-primary-orange hover:bg-primary-orange-dark disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition-all cursor-pointer">
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>

                </div>
            </div>
        </>
    )
}

export default EditProductModal