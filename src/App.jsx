import React, { useContext } from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Pos from './pages/Pos'
import Kds from './pages/Kds'
import LandingPage from './pages/LandingPage'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import SideBar from './components/SideBar'
import Home from './pages/Home'
import Settings from './pages/Settings'
import ProductChosen from './context/ProductChosen'
import Deliveries from './pages/Deliveries'
import NotFound from './pages/NotFound'

const sideBar_routes = [
  { path: '/home', element: <Home />, roles: null },
  { path: '/pos', element: <Pos />, roles: ['Admin', 'Cashier'] },
  { path: '/kds', element: <Kds />, roles: ['Admin', 'Chef'] },
  { path: '/deliveries', element: <Deliveries />, roles: ['Admin', 'Driver'] },
  { path: '/settings', element: <Settings />, roles: null },
]

const AppLayout = ({ children }) => {
  const { isMobileSize } = useContext(ProductChosen)
  return (
    <div className="flex">
      <SideBar />
      <div className='flex-1 min-h-screen bg-bacground-gray' style={{ marginBottom: isMobileSize ? '55px':'0px' }} >
        {isMobileSize && <div className='mb-15'><Navbar /></div>}
        {children}
      </div>
    </div>
  )
}

const AuthLayout = ({ children }) => (
  <>
    <Navbar />
    <div className="min-h-screen bg-bacground-gray p-3">
      {children}
    </div>
  </>
)

const App = () => (
  <Routes>
    <Route path='/login' element={<AuthLayout><Login /></AuthLayout>} />
    <Route path='/register' element={<AuthLayout><Register /></AuthLayout>} />
    <Route path='/' element={<LandingPage />} />

    {sideBar_routes.map(({ path, element, roles }) => (
      <Route key={path} path={path} element={
        <ProtectedRoute allowedRoles={roles}>
          <AppLayout>{element}</AppLayout>
        </ProtectedRoute>
      } />
    ))}

    <Route path='*' element={<NotFound />} />
  </Routes>
)

export default App