import React, { useContext, useState } from 'react'
import Categories from '../components/pos/Categories'
import Products from '../components/pos/Products'
import Cart from '../components/pos/Cart'
import { History, ShoppingCart, UtensilsCrossed } from 'lucide-react'
import RecentOrdersSidebar from '../components/pos/RecentOrdersSidebar'
import ProductChosen from '../context/ProductChosen'

const Pos = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('products')
  const { isMobileSize, productsChosen } = useContext(ProductChosen)

  const tabs = [
    { id: 'products', label: 'Menu', icon: <UtensilsCrossed size={22} /> },
    { id: 'cart', label: 'Cart', icon: <ShoppingCart size={22} /> },
  ]

  const otherTab = tabs.find((t) => t.id !== activeTab)
  const cartCount = productsChosen?.reduce((sum, i) => sum + i.quantity, 0) ?? 0
  const showBadge = otherTab?.id === 'cart' && cartCount > 0

  return (
    <>
      {/* Desktop layout */}
      <div className="hidden md:flex flex-wrap py-5 px-6 gap-8 items-start bg-[#F8F9FA] min-h-screen">
        <div className="flex-1 flex flex-col gap-5">
          <div className="flex justify-end">
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex items-center gap-2 px-4 py-2 cursor-pointer bg-white border border-gray-200 hover:border-gray-300 rounded-xl text-sm text-gray-600 font-medium transition-all"
            >
              <History size={16} />
              Recent Orders
            </button>
          </div>
          <Categories />
          <Products />
        </div>
        <div className="sticky top-5">
          <Cart />
        </div>
      </div>

      {/* Mobile layout */}
      <div className="flex md:hidden flex-col bg-[#F8F9FA] min-h-screen">
        <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 sticky top-0 z-10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-600 font-medium transition-all active:scale-95"
          >
            <History size={14} />
            Recent Orders
          </button>

          {otherTab && (
            <button
              key={otherTab.id}
              onClick={() => setActiveTab(activeTab === 'products' ? 'cart' : 'products')}
              className="flex flex-col items-center justify-center py-1 gap-0.5 relative transition-all cursor-pointer hover:text-[#FF6B35]"
            >
              <span className="relative">
                {otherTab.icon}
                {showBadge && (
                  <span className="absolute -top-1.5 -right-2 min-w-[18px] h-[18px] px-1 bg-[#FF6B35] text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                    {cartCount}
                  </span>
                )}
              </span>
              <span className="text-[11px] font-medium">{otherTab.label}</span>
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto pb-24">
          {activeTab === 'products' ? (
            <div className="flex flex-col gap-4 px-3 pt-4">
              <Categories />
              <Products />
            </div>
          ) : (
            <div className="px-3 pt-4">
              <Cart />
            </div>
          )}
        </div>
      </div>

      <RecentOrdersSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  )
}

export default Pos