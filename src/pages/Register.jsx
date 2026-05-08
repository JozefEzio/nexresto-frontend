import { Eye, EyeClosed } from 'lucide-react'
import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import FloatingInput from '../config/FloatingInput'

const Register = () => {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const { handleRegister } = useContext(AuthContext)
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirm_password: '',
  })

  const [errorData, setErrorData] = useState({})

  const handleInput = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validateForm = () => {
    const errors = {}

    if (!formData.fullName.trim()) errors.fullName = 'Full name is required'

    if (!formData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Invalid email address'
    }

    if (!formData.password.trim()) {
      errors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
    }

    if (!formData.confirm_password.trim()) {
      errors.confirm_password = 'Please confirm your password'
    } else if (formData.confirm_password !== formData.password) {
      errors.confirm_password = 'Passwords do not match'
    }

    setErrorData(errors)
    return Object.keys(errors).length === 0
  }

  const handleForm = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setLoading(true)
    try {
      const data = await handleRegister(
        formData.fullName,
        formData.email,
        formData.password,
        formData.confirm_password
      )
      toast({ message: data.message || 'Account created successfully!', type: 'success' })
      navigate('/home')
    } catch (error) {
      toast({ message: error ?? 'Something went wrong, please try again.', type: 'error' })
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4 mt-15">
      <div className="bg-white w-full max-w-md px-8 py-10 rounded-2xl shadow-sm border border-gray-100">
        <form onSubmit={handleForm} noValidate>
          <h2 className="text-2xl font-semibold mb-1">Sign up</h2>
          <p className="text-small-gray mb-6 text-sm">
            Create an account to get started.
          </p>

          {/* Full Name */}
          <div className="mb-4">
            <FloatingInput id="full-name" onChange={handleInput} name="fullName" label="Full Name" value={formData.fullName} autoComplete="name" />
            {errorData.fullName && <small className="text-red-500 text-[11px]">{errorData.fullName}</small>}
          </div>

          {/* Email */}
          <div className="mb-4">
            <FloatingInput id="email-address" onChange={handleInput} name="email" type="email" label="Email address" value={formData.email} autoComplete="email" />
            {errorData.email && <small className="text-red-500 text-[11px]">{errorData.email}</small>}
          </div>

          {/* Password */}
          <div className="mb-4">
            <FloatingInput id="password" onChange={handleInput} name="password" type={isVisible ? 'text' : 'password'} label="Password" value={formData.password} autoComplete="new-password">
              <button
                type="button"
                aria-label={isVisible ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary-orange cursor-pointer z-20"
                onClick={() => setIsVisible((v) => !v)}
              >
                {isVisible ? <EyeClosed size={18} /> : <Eye size={18} />}
              </button>
            </FloatingInput>
            {errorData.password && <small className="text-red-500 text-[11px]">{errorData.password}</small>}
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <FloatingInput id="confirm_password" onChange={handleInput} name="confirm_password" type="password" label="Confirm Password" value={formData.confirm_password} autoComplete="new-password" />
            {errorData.confirm_password && <small className="text-red-500 text-[11px]">{errorData.confirm_password}</small>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full p-2.5 rounded-lg font-abeezee text-white transition-all
              ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary-orange hover:bg-orange-600 cursor-pointer'}`}
          >
            {loading ? 'Creating account...' : 'Sign up'}
          </button>

          <div className="flex items-center gap-2 my-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-small-gray text-sm">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <p className="text-small-gray text-center text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline underline-offset-2">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Register