import React, { createContext, useContext, useState, useCallback } from 'react'
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react'

const ToastContext = createContext()

export const useToast = () => useContext(ToastContext)




export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const icons = {
    success: <CheckCircle size={18} className="text-green-500" />,
    error: <XCircle size={18} className="text-red-400" />,
    warning: <AlertCircle size={18} className="text-orange-400" />,
  }

  const styles = {
    success: 'border-l-4 border-green-400',
    error: 'border-l-4 border-red-400',
    warning: 'border-l-4 border-orange-400',
  }
  const toast = useCallback(({ message, type = 'success', duration = 3000 }) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, duration)
  }, [])

  const remove = (id) => setToasts(prev => prev.filter(t => t.id !== id))

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-2">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`flex items-center gap-3 bg-white shadow-lg rounded-xl px-4 py-3 min-w-[280px] max-w-[360px]
              animate-slide-in ${styles[t.type]}`}
          >
            {icons[t.type]}
            <p className="text-sm text-gray-700 flex-1">{t.message}</p>
            <button
              onClick={() => remove(t.id)}
              className="text-gray-300 hover:text-gray-500 transition-colors cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}