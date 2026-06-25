import React, { useContext, useRef, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import api from '../../lib/axios'
import { Camera, Save } from 'lucide-react'
import { useToast } from '../../context/ToastContext'
import { role_colors } from '../../config/Colors'


const ProfileSettings = () => {
  const { user, setUser } = useContext(AuthContext)
  const { toast } = useToast()
  const [form, setForm] = useState({ name: user.name, email: user.email })
  const [avatar, setAvatar] = useState(null)       // File object
  const [preview, setPreview] = useState(user.avatar_url)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})


  // const roleStyle = {
  //   Admin: 'bg-purple-50 text-purple-500',
  //   Cashier: 'bg-blue-50 text-blue-500',
  //   Chef: 'bg-orange-50 text-orange-500',
  //   Driver: 'bg-green-50 text-green-500',
  // }

  const fileRef = useRef()

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setAvatar(file)
    setPreview(URL.createObjectURL(file))
    toast({ message: 'Avatar selected — save to apply changes', type: 'warning' })

  }

  const handleSubmit = async () => {
    setLoading(true)
    setErrors({})

    const data = new FormData()
    data.append('name', form.name)
    data.append('email', form.email)
    data.append('_method', 'PUT')

    if (avatar) data.append('avatar', avatar)
      console.log(avatar)

    try {
      const res = await api.post('/user', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setUser(res.data)
      setForm({ name: res.data.name, email: res.data.email })
      setAvatar(null)
      setPreview(res.data.avatar_url + '?t=' + Date.now())

      toast({ message: 'Profile updated successfully!', type: 'success' })
    } catch (err) {
      const serverErrors = err.response?.data?.errors ?? {}
      const firstError = Object.values(serverErrors)?.[0]?.[0]
      setErrors(serverErrors)
      toast({
        message: firstError ?? 'Something went wrong, please try again.',
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 w-full">
      <h3 className="font-bold text-gray-800 text-lg mb-6">Profile Information</h3>

      <div className="flex items-center gap-5 mb-8">
        <div className="relative">
          <img
            src={preview}
            alt="avatar"
            className="w-30 h-30 rounded-2xl object-cover border-2 border-gray-100"
          />
          <button
            onClick={() => fileRef.current.click()}
            className="absolute -bottom-2 -right-2 w-7 h-7 bg-primary-orange rounded-xl cursor-pointer flex items-center justify-center shadow-sm hover:bg-primary-orange-dark transition-colors"
          >
            <Camera size={13} className="text-white" />
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>
        <div>
          <p className="font-semibold text-gray-800">{user.name}</p>
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${role_colors[user.role?.label] ?? 'bg-gray-100 text-gray-500'}`}>
            {user.role?.label}
          </span>
          <p className="text-xs text-gray-400 mt-1">Click the camera to change avatar</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="mb-3">
          <div className="relative">
            <input
              type="text"
              id="name"
              className="peer block w-full rounded-lg border border-gray-300 bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-gray-900
                focus:border-primary-orange focus:outline-none focus:ring-0"
              placeholder=" "
              name="name"
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
            />
            <label
              htmlFor="name"
              className="absolute start-2 top-2 z-10 origin-[0] -translate-y-4 scale-75 bg-white px-2 text-sm text-gray-500 duration-300
                  peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100
                  peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-primary-orange">
              Full Name
            </label>
          </div>
          {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name[0]}</p>}
        </div>
        <div className="mb-3">
          <div className="relative">
            <input
              type="text"
              id="email-address"
              className="peer block w-full rounded-lg border border-gray-300 bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-gray-900
                focus:border-primary-orange focus:outline-none focus:ring-0"
              placeholder=" "
              name='email'
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
            />
            <label
              htmlFor="email-address"
              className="absolute start-2 top-2 z-10 origin-[0] -translate-y-4 scale-75 bg-white px-2 text-sm text-gray-500 duration-300
                  peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100
                  peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-primary-orange">
              Email address
            </label>
          </div>
          {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email[0]}</p>}
        </div>
        <div className="mb-3">
          <div className="relative">
            <input
              id="role"
              className="peer block w-full rounded-lg border border-gray-300 bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-gray-400 bg-gray-50
                focus:border-primary-orange focus:outline-none focus:ring-0 block cursor-not-allowed"
              placeholder=" "
              disabled
              value={user.role?.label}
            />
            <label
              htmlFor="role"
              className="absolute start-2 top-2 z-10 origin-[0] -translate-y-4 scale-75 bg-white px-2 text-sm text-gray-500 duration-300
                  peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100
                  peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-primary-orange">
              Role
            </label>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-6">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center cursor-pointer gap-2 px-6 py-2.5 bg-primary-orange hover:bg-primary-orange-dark disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition-all"
        >
          <Save size={15} />
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}

export default ProfileSettings