import api from '../../../lib/axios';
import { X } from 'lucide-react';
import React, { useState } from 'react'
import FloatingInput from '../../../config/FloatingInput';
import { categoriesStyle } from '../../../config/categoryStyles';
import * as Icons from 'lucide-react'


const EditCategoryModal = ({ category, onEdit, categories, onClose }) => {
    const [form, setForm] = useState({ name: category.name, icon: category.icon, color: category.color });
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [hexInput, setHexInput] = useState('F2904A')
    const [colorError, setColorError] = useState('')


    const random_colors = [
        '#FFD1DC', 'E9EDC9', 'FAD2E1', 'FFEBEE',
        'E8F5E9', 'E0F2F1', 'E3F2FD', 'B7E4C7',
        'FFFDE7', 'F3E5F5'
    ]

    const handleSubmit = async () => {
        setLoading(true)
        setErrors({})
        try {
            const res = await api.put(`/categories/${category.id}`, form)
            onEdit(res.data)
        } catch (err) {
            setErrors(err.response?.data?.errors ?? {})
        } finally {
            setLoading(false)
        }
    }

    const applyColor = (hex) => {
        setHexInput(hex.toUpperCase())
        setForm(p => ({ ...p, color: '#' + hex }))
        setColorError('')
    }

    const handleHexChange = (e) => {
        const val = e.target.value.replace(/[^0-9a-fA-F]/g, '').toUpperCase()
        setHexInput(val)
        if (val.length === 6) {
            setColorError('')
            setForm(p => ({ ...p, color: '#' + val }))
        } else if (val.length > 0) {
            setColorError('Enter a valid 6-digit hex color (e.g. FF5733)')
        } else {
            setColorError('')
        }
    }

    const handleHexPaste = (e) => {
        e.preventDefault()
        const pasted = e.clipboardData.getData('text').trim().replace(/^#/, '').replace(/[^0-9a-fA-F]/g, '')
        if (/^[0-9a-fA-F]{6}$/.test(pasted)) {
            applyColor(pasted)
        } else {
            setColorError('Only hex colors are allowed (e.g. #F2904A). RGB, HSL, and named colors are not supported.')
        }
    }
    return (
        <>
            <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">

                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                        <h4 className="font-bold text-gray-800">Edit Category</h4>
                        <button onClick={onClose} className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center cursor-pointer">
                            <X size={15} className="text-gray-500" />
                        </button>
                    </div>

                    <div className="px-6 py-5">

                        <FloatingInput
                            id="name"
                            label="Category Name"
                            value={form.name}
                            error={errors.name}
                            onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                        />

                        <p className="text-sm text-gray-500 mb-2">Choose Color</p>
                        <div className="flex items-center gap-3 mb-1">
                            <div
                                className="w-10 h-10 rounded-xl border-2 border-gray-200 cursor-pointer overflow-hidden relative flex-shrink-0"
                                style={{ background: form.color }}>
                                <input
                                    type="color"
                                    value={form.color}
                                    onChange={e => {
                                        const hex = e.target.value.replace('#', '')
                                        applyColor(hex)
                                    }}
                                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                                />
                            </div>

                            <div className={`flex items-center flex-1 border-2 rounded-xl overflow-hidden transition-colors
                                ${colorError
                                    ? 'border-red-400'
                                    : 'border-gray-300 focus-within:border-[#F07B26]'
                                }`}
                            >
                                <span className="pl-3 pr-1 text-gray-400 text-sm font-mono select-none">#</span>
                                <input
                                    type="text"
                                    maxLength={6}
                                    value={hexInput}
                                    placeholder="f97316"
                                    onChange={handleHexChange}
                                    onPaste={handleHexPaste}
                                    className="flex-1 py-2.5 pr-3 text-sm font-mono text-gray-800 bg-white outline-none tracking-wide"
                                />
                            </div>
                        </div>

                        {colorError && (
                            <p className="text-red-400 text-xs mt-1 mb-2">⚠ {colorError}</p>
                        )}

                        <div className="flex gap-1.5 flex-wrap mt-2 mb-4">
                            {random_colors.map(hex => (
                                <button
                                    key={hex}
                                    onClick={() => applyColor(hex)}
                                    style={{ background: '#' + hex }}
                                    className={`w-6 h-6 rounded-md border-2 transition-transform hover:scale-110 cursor-pointer
                                        ${form.color.replace('#', '').toLowerCase() === hex
                                            ? 'border-gray-800 scale-110'
                                            : 'border-transparent'
                                        }`}
                                />
                            ))}
                        </div>

                        <p className="text-sm text-gray-500 mb-3">Choose Icon</p>
                        <div className="grid grid-cols-6 gap-2 max-h-[200px] overflow-y-auto pr-1">
                            {Object.values(categoriesStyle).map(iconName => {
                                const Icon = Icons[iconName.icon]
                                const iconInCategories = categories.find(c => c.icon === iconName.icon) && form.icon !== iconName.icon ? true : false
                                if (!Icon) return null
                                return (
                                    <button
                                        key={iconName.icon}
                                        disabled={iconInCategories}
                                        onClick={() => setForm(p => ({ ...p, icon: iconName.icon }))}
                                        style={form.icon === iconName.icon ? { background: form.color } : {}}
                                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all
                                            ${form.icon === iconName.icon
                                                ? 'text-white shadow-sm'
                                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}
                                            ${iconInCategories ? 'opacity-30 grayscale cursor-not-allowed' : 'cursor-pointer'}
                                        `}
                                    >
                                        <Icon size={18} />
                                    </button>
                                )
                            })}
                        </div>
                        {errors.icon && <p className="text-red-400 text-xs mt-1">{errors.icon[0]}</p>}

                        <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
                            <span>Selected:</span>
                            <div
                                className="w-7 h-7 rounded-lg flex items-center justify-center"
                                style={{ background: form.color + '20' }}
                            >
                                {(() => {
                                    const Icon = Icons[form.icon]
                                    return Icon
                                        ? <Icon size={15} style={{ color: form.color }} />
                                        : null
                                })()}
                            </div>
                            <span className="text-gray-400 text-xs">{form.icon}</span>
                            <span
                                className="text-xs font-mono px-1.5 py-0.5 rounded-md"
                                style={{ background: form.color + '20', color: form.color }}
                            >
                                #{hexInput}
                            </span>
                        </div>

                    </div>

                    <div className="flex gap-2 px-6 pb-6">
                        <button onClick={onClose}
                            className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-sm cursor-pointer">
                            Cancel
                        </button>
                        <button onClick={handleSubmit} disabled={loading}
                            className="flex-1 py-2.5 bg-primary-orange hover:bg-primary-orange-dark disabled:opacity-50 text-white font-semibold rounded-xl text-sm cursor-pointer">
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>

                </div>
            </div>
        </>
    )
}

export default EditCategoryModal