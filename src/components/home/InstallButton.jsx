import React, { useState } from 'react'
import { Download, CheckCircle, X, Smartphone } from 'lucide-react'
import { usePWAInstall } from '../../hooks/usePWAInstall'

const InstallButton = () => {
    const { install, canInstall, isInstalled } = usePWAInstall()
    const [showGuide, setShowGuide] = useState(false)

    if (isInstalled) return (
        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-500 rounded-xl text-sm font-medium">
            <CheckCircle size={16} />
            App Installed
        </div>
    )

    return (
        <>
            {/* Button — always visible */}
            <button
                onClick={canInstall ? install : () => setShowGuide(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary-orange hover:bg-primary-orange-dark text-white rounded-xl text-sm font-semibold transition-all cursor-pointer"
            >
                <Download size={16} />
                Install App
            </button>

            {/* Manual install guide popup */}
            {showGuide && (
                <>
                    <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setShowGuide(false)} />
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm">

                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                                <h4 className="font-bold text-gray-800">Install NexResto</h4>
                                <button onClick={() => setShowGuide(false)}
                                    className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center cursor-pointer">
                                    <X size={15} className="text-gray-500" />
                                </button>
                            </div>

                            <div className="px-6 py-5 flex flex-col gap-4">
                                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl">
                                    <Smartphone size={20} className="text-primary-orange flex-shrink-0" />
                                    <p className="text-sm text-gray-700">Install this app on your device for quick access</p>
                                </div>

                                {/* Chrome */}
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 mb-2">Chrome / Edge</p>
                                    <div className="flex flex-col gap-1.5">
                                        {['Open the browser menu (⋮)', 'Click "Install app" or "Add to Home Screen"', 'Click Install'].map((step, i) => (
                                            <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                                                <span className="w-5 h-5 rounded-full bg-primary-orange text-white text-xs flex items-center justify-center flex-shrink-0 font-bold">{i + 1}</span>
                                                {step}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Safari */}
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 mb-2">Safari (iOS)</p>
                                    <div className="flex flex-col gap-1.5">
                                        {['Tap the Share button (□↑)', 'Scroll down and tap "Add to Home Screen"', 'Tap Add'].map((step, i) => (
                                            <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                                                <span className="w-5 h-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center flex-shrink-0 font-bold">{i + 1}</span>
                                                {step}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="px-6 pb-6">
                                <button onClick={() => setShowGuide(false)}
                                    className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-sm cursor-pointer">
                                    Got it
                                </button>
                            </div>

                        </div>
                    </div>
                </>
            )}
        </>
    )
}

export default InstallButton