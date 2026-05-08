import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import AdminHome from '../components/home/AdminHome'
import CashierHome from '../components/home/CashierHome'
import ChefHome from '../components/home/ChefHome'
import DriverHome from '../components/home/DriverHome'

const Home = () => {
  const { user } = useContext(AuthContext)
  const role = user?.role?.label

  return (
    <div className="py-5 px-6 bg-[#F8F9FA] min-h-screen">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="font-abeezee text-[30px] text-primary-black font-bold">
            Good {getGreeting()}, {user?.name?.split(' ')[0]} 👋
          </h2>
          <p className="font-abeezee text-small-gray text-[15px]">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {role === 'Admin'   && <AdminHome />}
      {role === 'Cashier' && <CashierHome />}
      {role === 'Chef'    && <ChefHome />}
      {role === 'Driver'  && <DriverHome />}
      {role === 'Client'  && <ClientHome user={user} />}
    </div>
  )
}

const ClientHome = ({ user }) => (
  <div className="max-w-lg mx-auto mt-10">
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
      <div className="w-16 h-16 rounded-full bg-primary-orange-pale flex items-center justify-center mx-auto mb-5">
        <img src="/chef.svg" alt="NexResto" className="w-9" />
      </div>
      <h3 className="text-xl font-semibold text-primary-black mb-2">
        Welcome to NexResto, {user?.name?.split(' ')[0]}!
      </h3>
      <p className="text-small-gray text-sm leading-relaxed mb-6">
        Your account has been created. An administrator will assign you a role to give you access to the system's features.
      </p>
      <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-left">
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 flex-shrink-0" />
        <p className="text-sm text-gray-600">
          Your current role is <span className="font-semibold text-primary-black">Client</span>. Contact your manager to get full access.
        </p>
      </div>
    </div>
  </div>
)

const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Morning'
  if (hour < 18) return 'Afternoon'
  return 'Evening'
}

export default Home