import { Eye, EyeClosed } from 'lucide-react'
import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

const Login = () => {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const { handleLogin } = useContext(AuthContext)
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [errorData, setErrorData] = useState({ email: '', password: '' })
  const navigate = useNavigate()

  const handleInput = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validateForm = () => {
    const errors = {}
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
    setErrorData(errors)
    return Object.keys(errors).length === 0
  }

  const handleForm = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setLoading(true)
    try {
      const data = await handleLogin(formData.email, formData.password, rememberMe)
      toast({ message: data.message || 'Logged in successfully!', type: 'success' })
      navigate('/home')
    } catch (err) {
      toast({ message: err ?? 'Something went wrong, please try again.', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4 mt-15">
      <div className="bg-white w-full max-w-md px-8 py-14 rounded-2xl shadow-sm border border-gray-100">
        <form onSubmit={handleForm} noValidate>
          <h2 className="text-2xl font-semibold mb-1">Sign in</h2>
          <p className="text-small-gray mb-6 text-sm">
            Please login to continue to your account.
          </p>

          {/* Email */}
          <div className="mb-5">
            <div className="relative">
              <input
                type="email"
                id="email-address"
                className="peer block w-full rounded-lg border border-gray-300 bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-gray-900 focus:border-primary-orange focus:outline-none focus:ring-0"
                placeholder=" "
                name="email"
                value={formData.email}
                onChange={handleInput}
                aria-label="Email address"
                autoComplete="email"
              />
              <label
                htmlFor="email-address"
                className="absolute start-2 top-2 z-10 origin-[0] -translate-y-4 scale-75 bg-white px-2 text-sm text-gray-500 duration-300
                  peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100
                  peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-primary-orange"
              >
                Email address
              </label>
            </div>
            {errorData.email && <small className="text-red-500 text-[11px]">{errorData.email}</small>}
          </div>

          {/* Password */}
          <div className="mb-6">
            <div className="relative">
              <input
                type={isVisible ? 'text' : 'password'}
                id="password"
                className="peer block w-full rounded-lg border border-gray-300 bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-gray-900 focus:border-primary-orange focus:outline-none focus:ring-0"
                placeholder=" "
                name="password"
                value={formData.password}
                onChange={handleInput}
                aria-label="Password"
                autoComplete="current-password"
              />
              <button
                type="button"
                aria-label={isVisible ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary-orange cursor-pointer"
                onClick={() => setIsVisible((v) => !v)}
              >
                {isVisible ? <EyeClosed size={18} /> : <Eye size={18} />}
              </button>
              <label
                htmlFor="password"
                className="absolute start-2 top-2 z-10 origin-[0] -translate-y-4 scale-75 bg-white px-2 text-sm text-gray-500 duration-300
                  peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100
                  peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-primary-orange"
              >
                Password
              </label>
            </div>
            {errorData.password && <small className="text-red-500 text-[11px]">{errorData.password}</small>}
          </div>

          {/* Remember Me */}
          <div className="flex items-center gap-2 mb-5">
            <input
              type="checkbox"
              id="remember-me"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 accent-primary-orange cursor-pointer"
            />
            <label htmlFor="remember-me" className="text-sm text-gray-600 cursor-pointer select-none">
              Keep me signed in
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full p-2.5 rounded-lg font-abeezee text-white transition-all
              ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary-orange hover:bg-orange-600 cursor-pointer'}`}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

          <div className="flex items-center gap-2 my-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-small-gray text-sm">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <p className="text-small-gray text-center text-sm">
            Need an account?{' '}
            <Link to="/register" className="text-blue-600 hover:underline underline-offset-2">
              Create one
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login
