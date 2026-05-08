import React from 'react'
import { useNavigate } from 'react-router-dom'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background-gray flex items-center justify-center p-4">
      <div className="bg-background-card rounded-2xl shadow-sm border border-gray-200 p-12 max-w-md w-full text-center">

        {/* 404 number */}
        <h1 className="text-8xl font-bold text-primary-orange mb-2">404</h1>

        {/* Divider */}
        <div className="w-12 h-0.5 bg-gray-300 mx-auto mb-6" />

        <h2 className="text-xl font-semibold text-primary-black mb-3">
          Page Not Found
        </h2>
        <p className="text-small-gray text-sm leading-relaxed mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2.5 rounded-lg bg-primary-orange text-white text-sm font-semibold hover:bg-primary-orange-dark transition-colors cursor-pointer"
          >
            Go Home
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 rounded-lg bg-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-300 transition-colors cursor-pointer"
          >
            Go Back
          </button>
        </div>

      </div>
    </div>
  )
}

export default NotFound
