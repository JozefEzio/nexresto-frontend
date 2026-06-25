import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import {
  ShoppingBag, ChefHat, BikeIcon, BarChart3,
  Users, Settings, ArrowRight, CheckCircle,
  Zap, Shield, Smartphone
} from 'lucide-react'

const FEATURES = [
  {
    icon: <ShoppingBag size={22} />,
    title: 'Point of Sale',
    desc: 'Fast, intuitive order taking with smart cart, payment methods, and instant kitchen dispatch.',
    color: '#FAC1D9', iconColor: '#c0557a',
  },
  {
    icon: <ChefHat size={22} />,
    title: 'Kitchen Display System',
    desc: 'Real-time order queue with one-click status updates. No more paper tickets.',
    color: '#C2DBE9', iconColor: '#1a5fa8',
  },
  {
    icon: <BikeIcon size={22} />,
    title: 'Delivery Management',
    desc: 'Assign drivers, track status from pickup to doorstep, with customer info at a glance.',
    color: '#C2E9DD', iconColor: '#16873f',
  },
  {
    icon: <BarChart3 size={22} />,
    title: 'Analytics Dashboard',
    desc: 'Revenue charts, top products, and order insights to make data-driven decisions.',
    color: '#C9CAEF', iconColor: '#5657b5',
  },
  {
    icon: <Users size={22} />,
    title: 'Role-Based Access',
    desc: 'Admin, Cashier, Chef, and Driver roles — each with a tailored view and permissions.',
    color: '#E4CDED', iconColor: '#7c3aed',
  },
  {
    icon: <Settings size={22} />,
    title: 'Full Customization',
    desc: 'Configure menu, categories, tax rate, currency, receipt text, and restaurant info.',
    color: '#FFF1E6', iconColor: '#CC5500',
  },
]

const PERKS = [
  { icon: <Zap size={16} />, text: 'Auto-refreshing KDS & delivery boards' },
  { icon: <Smartphone size={16} />, text: 'Mobile-first responsive design' },
  { icon: <Shield size={16} />, text: 'Secure token-based authentication' },
  { icon: <CheckCircle size={16} />, text: 'Demo data included — ready in minutes' },
]

const LandingPage = () => {
  const { isAuth, loading } = useContext(AuthContext)
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!loading && isAuth) {
      navigate('/home', { replace: true })
      return
    }else{
      navigate('/login')
    }
    const t = setTimeout(() => setVisible(true), 50)
    return () => clearTimeout(t)
  }, [isAuth, loading, navigate])

  if (loading) return null
  console.log("isAuth", isAuth)
  // return (
  //   <div className="min-h-screen bg-[#F8F9FA]">

  //     <section
  //       className={`flex flex-col items-center justify-center text-center px-6 pt-20 pb-16 transition-all duration-700
  //         ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
  //     >
  //       <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 text-[#FF6B00] text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
  //         <ChefHat size={16} />
  //         Restaurant Management System
  //       </div>

  //       <h1 className="font-abeezee text-4xl md:text-6xl font-bold text-[#1A1A1A] leading-tight mb-5 max-w-3xl">
  //         Run your restaurant
  //         <span className="text-[#FF6B00]"> smarter.</span>
  //       </h1>

  //       <p className="text-gray-500 text-lg max-w-xl mb-8 leading-relaxed">
  //         NexResto is an all-in-one platform for modern restaurants — from order-taking to kitchen management, delivery tracking, and analytics.
  //       </p>

  //       <div className="flex items-center gap-3 flex-wrap justify-center">
  //         <Link
  //           to="/login"
  //           className="flex items-center gap-2 px-7 py-3 bg-[#FF6B00] hover:bg-[#CC5500] text-white font-bold rounded-2xl text-sm transition-all shadow-lg shadow-orange-200 hover:shadow-orange-300"
  //         >
  //           Get Started <ArrowRight size={16} />
  //         </Link>
  //         <Link
  //           to="/register"
  //           className="flex items-center gap-2 px-7 py-3 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-2xl text-sm border border-gray-200 transition-all"
  //         >
  //           Create Account
  //         </Link>
  //       </div>

  //       <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-10">
  //         {PERKS.map((p, i) => (
  //           <div key={i} className="flex items-center gap-1.5 text-sm text-gray-500">
  //             <span className="text-[#FF6B00]">{p.icon}</span>
  //             {p.text}
  //           </div>
  //         ))}
  //       </div>
  //     </section>

  //     <section className="px-6 pb-20 max-w-6xl mx-auto">
  //       <div className="text-center mb-10">
  //         <h2 className="font-abeezee text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-2">
  //           Everything your team needs
  //         </h2>
  //         <p className="text-gray-500 text-base">Built for every role in your restaurant.</p>
  //       </div>

  //       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
  //         {FEATURES.map((f, i) => (
  //           <div
  //             key={i}
  //             className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-all group"
  //           >
  //             <div
  //               className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
  //               style={{ backgroundColor: f.color, color: f.iconColor }}
  //             >
  //               {f.icon}
  //             </div>
  //             <h3 className="font-bold text-gray-800 mb-1 text-base">{f.title}</h3>
  //             <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
  //           </div>
  //         ))}
  //       </div>
  //     </section>

  //     <section className="px-6 pb-20 max-w-3xl mx-auto">
  //       <div className="bg-[#1A1A1A] rounded-3xl p-10 text-center text-white">
  //         <h2 className="font-abeezee text-2xl md:text-3xl font-bold mb-3">
  //           Ready to get started?
  //         </h2>
  //         <p className="text-gray-400 mb-7 text-sm leading-relaxed">
  //           Set up takes under 5 minutes. Demo data is included so you can explore everything right away.
  //         </p>
  //         <Link
  //           to="/login"
  //           className="inline-flex items-center gap-2 px-8 py-3 bg-[#FF6B00] hover:bg-[#CC5500] text-white font-bold rounded-2xl text-sm transition-all"
  //         >
  //           Sign In <ArrowRight size={16} />
  //         </Link>
  //       </div>
  //     </section>

  //     <footer className="border-t border-gray-100 py-6 text-center text-xs text-gray-400">
  //       NexResto © {new Date().getFullYear()} · All rights reserved
  //     </footer>

  //   </div>
  // )
}

export default LandingPage