import React, { useState } from 'react'
import api from '../../lib/axios'
import { Eye, EyeClosed, Lock } from 'lucide-react'
import { useToast } from '../../context/ToastContext'


const PasswordSettings = () => {
  const [form, setForm] = useState({ current_password: '', password: '', password_confirmation: '' })
  const [isVisible, setIsVisible] = useState({ current: false, new: false })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const { toast } = useToast()


  const handleSubmit = async () => {
    setLoading(true)
    setErrors({})
    try {
      await api.patch('/user/passwordUpdate', form)
      setForm({ current_password: '', password: '', password_confirmation: '' })
      toast({ message: 'Password updated successfully!', type: 'success' })

    } catch (err) {
      setErrors(err.response?.data?.errors ?? {})
      toast({
        message: Object.values(err.response?.data?.errors ?? {})?.[0]?.[0] ?? 'Something went wrong, please try again.',
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 w-full">
      <h3 className="font-bold text-gray-800 text-lg mb-6">Change Password</h3>

      <div className="flex flex-col gap-4 max-w-[80%]">
        <div>
          <div className="relative">
            <input
              type={isVisible.current ? 'text' : 'password'}
              id="Current_Password"
              className="peer block w-full rounded-lg border border-gray-300 bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-gray-900
                focus:border-primary-orange focus:outline-none focus:ring-0"
              placeholder=" "
              name='password'
              value={form.current_password}
              onChange={e => setForm(p => ({ ...p, current_password: e.target.value }))}
            />

            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary-orange peer-focus:text-primary-orange cursor-pointer"
              onClick={() => setIsVisible(p => ({ ...p, current: !p.current }))}
            >
              {isVisible.current ? (<EyeClosed size={18} />) : (<Eye size={18} />)}
            </button>

            <label
              htmlFor="Current_Password"
              className="absolute start-2 top-2 z-10 origin-[0] -translate-y-4 scale-75 bg-white px-2 text-sm text-gray-500 duration-300
                  peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100
                  peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-primary-orange">
              Current Password
            </label>
          </div>
          {errors.current_password && <p className="text-red-400 text-xs mt-1">{errors.current_password[0]}</p>}
        </div>
        <div>
          <div className="relative">
            <input
              type={isVisible.new ? 'text' : 'password'}
              id="New_Password"
              className="peer block w-full rounded-lg border border-gray-300 bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-gray-900
                focus:border-primary-orange focus:outline-none focus:ring-0"
              placeholder=" "
              name='password'
              value={form.password}
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
            />

            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary-orange peer-focus:text-primary-orange cursor-pointer"
              onClick={() => setIsVisible(p => ({ ...p, new: !p.new }))}
            >
              {isVisible.new ? (<EyeClosed size={18} />) : (<Eye size={18} />)}
            </button>

            <label
              htmlFor="New_Password"
              className="absolute start-2 top-2 z-10 origin-[0] -translate-y-4 scale-75 bg-white px-2 text-sm text-gray-500 duration-300
            peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100
            peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-primary-orange">
              New Password
            </label>
          </div>
          {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password[0]}</p>}
        </div>
        <div>
          <div className="relative">
            <input
              type='password'
              id="password"
              className="peer block w-full rounded-lg border border-gray-300 bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-gray-900
                focus:border-primary-orange focus:outline-none focus:ring-0"
              placeholder=" "
              name='password'
              value={form.password_confirmation}
              onChange={e => setForm(p => ({ ...p, password_confirmation: e.target.value }))}
            />

            <label
              htmlFor="password"
              className="absolute start-2 top-2 z-10 origin-[0] -translate-y-4 scale-75 bg-white px-2 text-sm text-gray-500 duration-300
                  peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100
                  peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-primary-orange">
              Confirm Password
            </label>
          </div>
          {errors.password_confirmation && <p className="text-red-400 text-xs mt-1">{errors.password_confirmation[0]}</p>}
        </div>

        <div className="flex items-center gap-3 mt-2">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center cursor-pointer gap-2 px-6 py-2.5 bg-primary-orange hover:bg-primary-orange-dark disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition-all"
          >
            <Lock size={15} />
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PasswordSettings