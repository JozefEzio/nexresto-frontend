import React, { useState } from 'react'
import api from '../../../lib/axios'
import { X } from 'lucide-react'

const ResetPasswordModal = ({ user, onSuccess, onClose }) => {
    const [form, setForm] = useState({ password: '', password_confirmation: '' })
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)

    const handleSubmit = async () => {
        setLoading(true)
        setErrors({})
        try {
            await api.patch(`/users/${user.id}`, {password: form.password, password_confirmation: form.password_confirmation})
            onSuccess()
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
                        <h4 className="font-bold text-gray-800">Reset password for {user.name}</h4>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer"
                        >
                            <X size={15} className="text-gray-500" />
                        </button>
                    </div>

                    <div className="px-6 py-5 flex flex-col gap-2">

                        <div className="mb-3">
                            <div className="relative">
                                <input
                                    type="password"
                                    id="password"
                                    className={`peer block w-full rounded-lg border bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-gray-900
                    focus:outline-none focus:ring-0
                    ${errors.password ? 'border-red-400 focus:border-red-400' : 'border-gray-300 focus:border-primary-orange'}`}
                                    placeholder=" "
                                    value={form.password}
                                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                                />
                                <label htmlFor="password"
                                    className="absolute start-2 top-2 z-10 origin-[0] -translate-y-4 scale-75 bg-white px-2 text-sm text-gray-500 duration-300
                    peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100
                    peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-primary-orange">
                                    Password
                                </label>
                            </div>
                            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password[0]}</p>}
                        </div>

                        <div className="mb-3">
                            <div className="relative">
                                <input
                                    type="password"
                                    id="password_confirmation"
                                    className={`peer block w-full rounded-lg border bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-gray-900
                    focus:outline-none focus:ring-0
                    ${errors.password_confirmation ? 'border-red-400 focus:border-red-400' : 'border-gray-300 focus:border-primary-orange'}`}
                                    placeholder=" "
                                    value={form.password_confirmation}
                                    onChange={e => setForm(p => ({ ...p, password_confirmation: e.target.value }))}
                                />
                                <label htmlFor="password_confirmation"
                                    className="absolute start-2 top-2 z-10 origin-[0] -translate-y-4 scale-75 bg-white px-2 text-sm text-gray-500 duration-300
                    peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100
                    peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-primary-orange">
                                    Confirm Password
                                </label>
                            </div>
                            {errors.password_confirmation && <p className="text-red-400 text-xs mt-1">{errors.password_confirmation[0]}</p>}
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
                            {loading ? 'updating...' : 'Reset Password'}
                        </button>
                    </div>

                </div>
            </div>
        </>
    )
}

export default ResetPasswordModal