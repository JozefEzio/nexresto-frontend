import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import { ProductChosenProvider } from './context/ProductChosen.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ProductChosenProvider>
      <ToastProvider>
        <AuthProvider>
          <StrictMode>
            <App />
          </StrictMode>
        </AuthProvider>
      </ToastProvider>
    </ProductChosenProvider>
  </BrowserRouter>
)
