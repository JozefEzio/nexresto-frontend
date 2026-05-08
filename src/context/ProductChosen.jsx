import React, { createContext, useEffect, useState } from 'react'

export const ProductChosen = createContext()
export const ProductChosenProvider = ({ children }) => {
    const [productsChosen, setProductChosen] = useState([])
    const [isActive, setIsActive] = useState(null)
    const [isMobileSize, setIsMobileSize] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    const onAdd = (product) => {
        setProductChosen(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(
                    item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                )
            }
            return [...prev, { ...product, quantity: 1 }]
        });

    }
    const onRemove = (id) => {
        setProductChosen(prev =>
            prev.map(item => item.id === id ? { ...item, quantity: Math.max(0, item.quantity - 1) } : item)
                .filter(item => item.quantity > 0)
        );
    };
    const onRecallOrder = (recalledItems) => {
        setProductChosen(recalledItems)
    }
    useEffect(() => {
        const handleResize = () => {
            setIsMobileSize(window.innerWidth < 768);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return <ProductChosen.Provider value={{ productsChosen, setProductChosen, onAdd, onRemove, onRecallOrder, isActive, setIsActive, isMobileSize, setIsMobileSize, isOpen, setIsOpen }}  >{children}</ProductChosen.Provider>
}

export default ProductChosen