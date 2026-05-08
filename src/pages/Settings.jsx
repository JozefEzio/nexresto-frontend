import { ClipboardList, Lock, Package, Settings2, User, Users } from 'lucide-react'
import React, { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import ProfileSettings from '../components/settings/ProfileSettings'
import PasswordSettings from '../components/settings/PasswordSettings'
import GeneralSettings from '../components/settings/GeneralSettings'
import UserManagement from '../components/settings/UserManagement'
import ProductsSettings from '../components/settings/ProductsSettings'
import CategoriesSettings from '../components/settings/CategoriesSettings'

const Settings = () => {
  const { user } = useContext(AuthContext)
  const [tabChosen, setTabChosen] = useState('profile')

  const allTabs = [
    { id: 'profile',    label: 'Profile',          icon: <User size={15} />,         minRole: 'all'   },
    { id: 'password',   label: 'Password',          icon: <Lock size={15} />,         minRole: 'all'   },
    { id: 'users',      label: 'User Management',   icon: <Users size={15} />,        minRole: 'Admin' },
    { id: 'products',   label: 'Products',          icon: <Package size={15} />,      minRole: 'Admin' },
    { id: 'categories', label: 'Categories',        icon: <ClipboardList size={15} />, minRole: 'Admin' },
    { id: 'general',    label: 'General Settings',  icon: <Settings2 size={15} />,    minRole: 'Admin' },
  ]

  const tabs = allTabs.filter((tab) => tab.minRole === 'all' || tab.minRole === user.role.label)

  return (
    <div className="py-5 px-4 md:px-6 bg-[#F8F9FA] min-h-screen">
      <h2 className="font-abeezee text-2xl md:text-[30px] text-primary-black font-bold">Settings</h2>
      <p className="font-abeezee text-small-gray text-[15px] mb-6">Manage your account and preferences</p>

      <div className="flex flex-col lg:flex-row gap-5">

        {/* Sidebar tab list */}
        <aside className="lg:w-56 flex-shrink-0">
          {/* Mobile: horizontal scrollable pills */}
          <div className="flex lg:hidden gap-2 overflow-x-auto pb-2 no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setTabChosen(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all cursor-pointer flex-shrink-0
                  ${tabChosen === tab.id
                    ? 'bg-[#FF6B00] text-white shadow-sm'
                    : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300'}`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Desktop: vertical sidebar */}
          <nav className="hidden lg:flex flex-col gap-1 bg-white rounded-2xl border border-gray-100 p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setTabChosen(tab.id)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium text-left transition-all cursor-pointer w-full
                  ${tabChosen === tab.id
                    ? 'bg-orange-50 text-[#FF6B00]'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}
              >
                <span className={tabChosen === tab.id ? 'text-[#FF6B00]' : 'text-gray-400'}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content panel */}
        <div className="flex-1 min-w-0">
          {tabChosen === 'profile'    && <ProfileSettings />}
          {tabChosen === 'password'   && <PasswordSettings />}
          {tabChosen === 'users'      && <UserManagement />}
          {tabChosen === 'products'   && <ProductsSettings />}
          {tabChosen === 'categories' && <CategoriesSettings />}
          {tabChosen === 'general'    && <GeneralSettings />}
        </div>

      </div>
    </div>
  )
}

export default Settings