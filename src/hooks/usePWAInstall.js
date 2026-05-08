import { useEffect, useState } from 'react'

export const usePWAInstall = () => {
    const [prompt, setPrompt] = useState(null)
    const [isInstalled, setIsInstalled] = useState(false)

    useEffect(() => {
        // register service worker
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
        }

        // check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true)
        }

        // capture install prompt
        const handler = (e) => {
            e.preventDefault()
            setPrompt(e)
        }

        window.addEventListener('beforeinstallprompt', handler)
        window.addEventListener('appinstalled', () => setIsInstalled(true))

        return () => window.removeEventListener('beforeinstallprompt', handler)
    }, [])

    const install = async() => {
        if (!prompt) return
        prompt.prompt()
        const { outcome } = await prompt.userChoice
        if (outcome === 'accepted') setIsInstalled(true)
        setPrompt(null)
    }

    return { install, canInstall: !!prompt, isInstalled }
}