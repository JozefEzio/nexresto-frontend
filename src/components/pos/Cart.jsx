import React, { useContext, useState } from 'react'
import TopSection from './cart/TopSection'
import BottomSection from './cart/bottomSection'
import ProductChosen from '../../context/ProductChosen'
const Cart = () => {
  const [notes, setNotes] = useState({})
    const { setProductChosen } = useContext(ProductChosen)

  const onClearCart = () => {
    setProductChosen([])
  }
  return (
    <div className="flex flex-col h-full">
      <div className='h-[350px] overflow-y-auto'>
        <TopSection
          notes={notes}
          setNotes={setNotes}
        />
      </div>
      <BottomSection onClearCart={onClearCart} notes={notes} />
    </div>
  )
}

export default Cart