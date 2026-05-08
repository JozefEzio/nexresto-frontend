import React, { useState } from 'react'
import api from '../../../lib/axios'
import { X } from 'lucide-react'
import FloatingInput from '../../../config/FloatingInput'

const EditUserModal = ({ user, roles, onEdit, onClose }) => {
    const [form, setForm] = useState({ name: user.name, email: user.email, role_id: user.role_id })
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)

    const handleSubmit = async () => {
        setLoading(true)
        setErrors({})
        try {
            const res = await api.post(`/users/${user.id}`, {
                ...form, _method: 'PUT'
            })
            onEdit(res.data.user)
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
                        <h4 className="font-bold text-gray-800">Update User</h4>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer"
                        >
                            <X size={15} className="text-gray-500" />
                        </button>
                    </div>

                    <div className="px-6 py-5 flex flex-col gap-2">
                        <FloatingInput
                            id="name"
                            label="Full Name"
                            value={form.name}
                            error={errors.name}
                            onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                        <FloatingInput
                            id="email"
                            type='email'
                            label="Email Address"
                            value={form.email}
                            error={errors.email}
                            onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />

                        <div className="mb-3">
                            <div className="relative">
                                <select
                                    id="role"
                                    className="peer block w-full rounded-lg border border-gray-300 bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-gray-900
                    focus:border-primary-orange focus:outline-none focus:ring-0"
                                    value={form.role_id}
                                    onChange={e => setForm(p => ({ ...p, role_id: parseInt(e.target.value) }))}
                                >
                                    {roles.map(r => (
                                        <option key={r.id} value={r.id}>{r.label}</option>
                                    ))}
                                </select>
                                <label htmlFor="role"
                                    className="absolute start-2 top-2 z-10 origin-[0] -translate-y-4 scale-75 bg-white px-2 text-sm text-gray-500">
                                    Role
                                </label>
                            </div>
                            {errors.role_id && <p className="text-red-400 text-xs mt-1">{errors.role_id[0]}</p>}
                        </div>

                    </div>
                    <div className="flex gap-2 px-6 pb-6">
                        <button
                            onClick={onClose}
                            className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-sm transition-all cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="flex-1 py-2.5 bg-primary-orange hover:bg-primary-orange-dark disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition-all cursor-pointer"
                        >
                            {loading ? 'updating...' : 'Update User'}
                        </button>
                    </div>

                </div>
            </div>
        </>
    )
}

export default EditUserModal