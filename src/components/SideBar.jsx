import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { CalendarRange, ChefHat, Cog, House, LogOut, Menu, X, User, BikeIcon } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { role_colors } from '../config/Colors'
import ProductChosen from '../context/ProductChosen'
import MobileNav from './MobileNav'



const SideBar = () => {
    const { user, logout } = useContext(AuthContext)
    const { pathname } = useLocation();
    const [collapsed, setCollapsed] = useState(false)
    const { isMobileSize } = useContext(ProductChosen);

    const [min, setMin] = useState();
    const [hour, setHour] = useState();
    const [today, setToday] = useState();

    const avatar_url = user.avatar_url ? user.avatar_url : '/avatar-default.png';

    const links = [
        { name: 'Home', path: '/home', icon: <House size={20} /> },
        ...(user.role.label === 'Admin' || user.role.label === 'Cashier' ? [{
            name: 'POS', path: '/pos', icon: <CalendarRange size={20} />
        }] : []),
        ...(user.role.label === 'Admin' || user.role.label === 'Chef' ? [{
            name: 'KDS', path: '/kds', icon: <ChefHat size={20} />
        }] : []),
        ...(user.role.label === 'Admin' || user.role.label === 'Driver' ? [{
            name: 'Deliveries', path: '/deliveries', icon: <BikeIcon size={20} />
        }] : []),
        { name: 'Settings', path: '/settings', icon: <Cog size={20} /> },
    ]
    const updateTime = () => {
        const date = new Date()
        setToday(date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }))
        setHour(String(date.getHours()).padStart(2, '0'))
        setMin(String(date.getMinutes()).padStart(2, '0'))
    }

    useEffect(() => {
        updateTime()
        const interval = setInterval(updateTime, 1000)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        setCollapsed(window.innerWidth < 768)
        const handleResize = () => setCollapsed(window.innerWidth < 768)
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    if (isMobileSize) {
        return <MobileNav links={links} user={user} logout={logout} avatar_url={avatar_url} />
    }

    return (
        <div className={`relative p-3 bg-white h-screen sticky top-0 flex flex-col border-r border-gray-100
            transition-all duration-300 ease-in-out
            ${collapsed ? 'w-[90px]' : 'w-[200px]'}`}>
            <button
                onClick={() => setCollapsed(p => !p)}
                className="absolute -right-3 top-6 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:border-primary-orange hover:text-primary-orange transition-all cursor-pointer z-10"
            >
                {collapsed ? <Menu size={12} /> : <X size={12} />}
            </button>

            <div className="flex items-center gap-1 justify-center">
                <img src="/chef.svg" alt="" className='w-[45px] flex-shrink-0' />
                {!collapsed && <h2 className='font-abeezee text-[20px] text-primary-black'>NexResto</h2>}
            </div>

            <div className="flex flex-col justify-between py-4 flex-1 overflow-hidden">
                <div>
                    <div className={`flex flex-col items-center ${collapsed ? 'mb-4' : 'mb-6'}`}>
                        <img src={avatar_url} alt="User"
                            className={`rounded-full object-cover border-2 border-gray-100 flex-shrink-0 transition-all
                                ${collapsed ? 'w-[55px] h-[55px]' : 'w-[100px] h-[100px]'}`}
                        />
                        {!collapsed && (
                            <>
                                <p className="text-primary-black capitalize text-lg font-semibold mt-2 text-center truncate w-full">
                                    {user?.name}
                                </p>
                                <span className={`text-sm px-2 py-0.5 rounded-full font-medium mt-1
                                    ${role_colors[user.role?.label] ?? 'bg-gray-100 text-gray-500'}`}>
                                    {user.role.label}
                                </span>
                                <div className="mt-2 text-center">
                                    <p className="text-primary-black font-medium">{today}</p>
                                    <p className="text-small-gray">{hour}:{min}</p>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="mt-5">
                        <ul className="space-y-2">
                            {links.map((l, i) => {
                                const isActive = pathname === l.path
                                return (
                                    <li key={i}>
                                        <Link to={l.path} title={collapsed ? l.name : ''}
                                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all
                                                ${isActive ? 'bg-gray-200 font-semibold' : 'text-gray-500 hover:bg-gray-50 hover:text-primary-orange'}
                                                ${collapsed ? 'justify-center' : ''}`}
                                        >
                                            <span className="flex-shrink-0">{l.icon}</span>
                                            {!collapsed && <span className="font-abeezee text-sm whitespace-nowrap">{l.name}</span>}
                                            {collapsed && isActive && (
                                                <span className="absolute right-2 w-1.5 h-1.5 rounded-full bg-primary-orange" />
                                            )}
                                        </Link>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </div>

                <div className='pb-4'>
                    <button onClick={logout}
                        className={`flex items-center justify-center w-full gap-2 bg-[#f13a3a] hover:bg-red-600 text-white p-3 rounded-2xl cursor-pointer transition-all`}
                    >
                        <LogOut size={20} />
                        {!collapsed && <span className="text-sm font-semibold">Logout</span>}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SideBar