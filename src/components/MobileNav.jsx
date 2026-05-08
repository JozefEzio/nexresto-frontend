import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { role_colors } from '../config/Colors'
import { LogOut } from 'lucide-react'

const MobileNav = ({ links, user, logout, avatar_url }) => {
    const { pathname } = useLocation()
    const [profileOpen, setProfileOpen] = useState(false)

    return (
        <>
            {profileOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
                    onClick={() => setProfileOpen(false)}
                />
            )}

            <div className={`fixed bottom-[64px] left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl
                transition-transform duration-300 ease-in-out
                ${profileOpen ? 'translate-y-0' : 'translate-y-full'}`}>
                <div className="flex flex-col items-center px-6 pt-5 pb-6 gap-3">
                    <div className="w-10 h-1 rounded-full bg-gray-200 mb-1" />
                    <img
                        src={avatar_url}
                        alt="User"
                        className="w-20 h-20 rounded-full object-cover border-2 border-gray-100"
                    />
                    <p className="text-primary-black text-lg font-semibold capitalize">{user?.name}</p>
                    <span className={`text-sm px-3 py-0.5 rounded-full font-medium
                        ${role_colors[user.role?.label] ?? 'bg-gray-100 text-gray-500'}`}>
                        {user.role.label}
                    </span>
                    <p className="text-small-gray text-sm">{user?.email}</p>
                    <button
                        onClick={logout}
                        className="mt-2 flex items-center gap-2 w-full justify-center bg-[#f13a3a] cursor-pointer hover:bg-red-600 text-white py-3 rounded-xl font-semibold transition-all"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </div>

            <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 h-16
                flex items-center justify-around px-2 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
                {links.map((l, i) => {
                    const isActive = pathname === l.path
                    return (
                        <Link
                            key={i}
                            to={l.path}
                            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all
                                ${isActive
                                    ? 'text-primary-orange'
                                    : 'text-gray-400 hover:text-primary-orange'}`}
                        >
                            <span className={`transition-transform ${isActive ? 'scale-110' : ''}`}>
                                {React.cloneElement(l.icon, { size: 22 })}
                            </span>
                            <span className="text-[10px] font-medium">{l.name}</span>
                            {isActive && (
                                <span className="w-1 h-1 rounded-full bg-primary-orange mt-0.5" />
                            )}
                        </Link>
                    )
                })}

                <button
                    onClick={() => setProfileOpen(p => !p)}
                    className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all text-gray-400 hover:text-primary-orange"
                >
                    <img
                        src={avatar_url}
                        alt="User"
                        className="w-6 h-6 rounded-full object-cover border border-gray-200"
                    />
                    <span className="text-[10px] font-medium">Profile</span>
                </button>
            </nav>
        </>
    )
}

export default MobileNav