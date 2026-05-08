import { CreditCardIcon, GiftIcon, SmartphoneIcon, WalletIcon, UtensilsIcon, BikeIcon } from 'lucide-react'
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../../context/AuthContext'
import { useToast } from '../../../context/ToastContext'
import ProductChosen from '../../../context/ProductChosen'
import api from '../../../lib/axios'

const PAYMENT_METHODS = [
  { id: 'cash',      label: 'Cash',        icon: <WalletIcon size={14} /> },
  { id: 'card',      label: 'Credit Card', icon: <CreditCardIcon size={14} /> },
  { id: 'ewallet',   label: 'E-Wallet',    icon: <SmartphoneIcon size={14} /> },
  { id: 'giftcards', label: 'Gift Cards',  icon: <GiftIcon size={14} /> },
]

/** Generate a collision-resistant order number using timestamp + random suffix */
const generateOrderNumber = () => {
  const ts = Date.now() % 100000           // last 5 digits of timestamp
  const rand = Math.floor(Math.random() * 90) + 10  // 2-digit random
  return Number(`${ts}${rand}`)
}

const TAX_RATE = 0.10  // 10% — set here until dynamic settings are wired in

const BottomSection = ({ onClearCart, notes }) => {
  const { user } = useContext(AuthContext)
  const { productsChosen } = useContext(ProductChosen)
  const { toast } = useToast()

  const [selectedPayment, setSelectedPayment] = useState('cash')
  const [orderType, setOrderType] = useState('on-site')
  const [delivery, setDelivery] = useState({ customer_name: '', address: '', phone: '' })
  const [drivers, setDrivers] = useState([])
  const [selectedDriver, setSelectedDriver] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get('/users')
      .then((res) => {
        const onlyDrivers = res.data.filter((u) => u.role?.label === 'Driver')
        setDrivers(onlyDrivers)
        if (onlyDrivers.length > 0) setSelectedDriver(onlyDrivers[0].id)
      })
  }, [])

  const subtotal = productsChosen.reduce((s, p) => s + p.price * p.quantity, 0)
  const tax      = +(subtotal * TAX_RATE).toFixed(2)
  const total    = +(tax + subtotal).toFixed(2)

  const handlePlaceOrder = async () => {
    if (!productsChosen.length) return

    const order = {
      user_id: user.id,
      order_number: generateOrderNumber(),
      total_price: total.toFixed(2),
      status: 'new',
      type: orderType,
      payment_status: selectedPayment === 'cash' ? 'pending' : 'paid',
      payment_method: selectedPayment,
      estimated_time: new Date(Date.now() + 30 * 60000).toISOString().slice(0, 19).replace('T', ' '),
      items: productsChosen.map((p) => ({
        product_id: p.id,
        quantity: p.quantity,
        price: p.price,
        notes: notes[p.id] || '',
      })),
    }

    if (orderType === 'delivery') {
      order.delivery = {
        customer_name: delivery.customer_name,
        address: delivery.address,
        phone: delivery.phone,
        user_id: selectedDriver,
        status: 'pending',
      }
    }

    setLoading(true)
    try {
      await api.post('/orders', order)
      onClearCart()
      setDelivery({ customer_name: '', address: '', phone: '' })
      setSelectedDriver(drivers[0]?.id ?? '')
      toast({ message: 'Order placed successfully!', type: 'success' })
    } catch (error) {
      toast({
        message: error.response?.data?.message ?? 'Something went wrong, please try again.',
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl py-10 px-5">
      {/* Order type toggle */}
      <div className="flex gap-2 bg-gray-100 p-1 rounded-xl mb-4">
        <button onClick={() => setOrderType('on-site')}
          className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg font-medium transition-all cursor-pointer
            ${orderType === 'on-site' ? 'bg-white text-primary-orange shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
          <UtensilsIcon size={13} /> <span className="text-sm">On-site</span>
        </button>
        <button onClick={() => setOrderType('delivery')}
          className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg font-medium transition-all cursor-pointer
            ${orderType === 'delivery' ? 'bg-white text-primary-orange shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
          <BikeIcon size={13} /> <span className="text-sm">Delivery</span>
        </button>
      </div>

      {/* Delivery fields */}
      {orderType === 'delivery' && (
        <div className="flex flex-col gap-2 mb-4">
          <input type="text" placeholder="Customer name" value={delivery.customer_name}
            onChange={(e) => setDelivery((prev) => ({ ...prev, customer_name: e.target.value }))}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-orange-300 placeholder-gray-300 text-sm" />
          <input type="text" placeholder="Address" value={delivery.address}
            onChange={(e) => setDelivery((prev) => ({ ...prev, address: e.target.value }))}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-orange-300 placeholder-gray-300 text-sm" />
          <input type="tel" placeholder="Phone" value={delivery.phone}
            onChange={(e) => setDelivery((prev) => ({ ...prev, phone: e.target.value }))}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-orange-300 placeholder-gray-300 text-sm" />
          <div className="relative">
            <select value={selectedDriver} onChange={(e) => setSelectedDriver(parseInt(e.target.value))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-orange-300 text-sm text-gray-600 bg-white cursor-pointer appearance-none">
              <option value="" disabled>Select a driver</option>
              {drivers.length === 0
                ? <option disabled>No drivers available</option>
                : drivers.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">▾</span>
          </div>
          {drivers.length === 0 && (
            <p className="text-xs text-red-400">⚠ No drivers available — add one in Settings → User Management</p>
          )}
        </div>
      )}

      {/* Totals */}
      <div className="mt-3 flex flex-col">
        <p className="flex items-center justify-between text-small-gray text-sm mb-2">
          <span>Subtotal:</span><span>{subtotal.toFixed(2)} DH</span>
        </p>
        <p className="flex items-center justify-between text-small-gray text-sm mb-2">
          <span>Tax ({(TAX_RATE * 100).toFixed(0)}%):</span><span>{tax.toFixed(2)} DH</span>
        </p>
        <hr className="border-t-2 border-dotted border-gray-400" />
        <div className="mt-3 flex items-center justify-between text-3xl mb-6">
          <h1>Total</h1><h1>{total.toFixed(2)} DH</h1>
        </div>

        {/* Payment method */}
        <p className="text-gray-400 mb-2 text-sm">Payment Method</p>
        <div className="grid grid-cols-4 gap-1">
          {PAYMENT_METHODS.map((m) => (
            <button key={m.id} onClick={() => setSelectedPayment(m.id)}
              className={`flex flex-col items-center gap-1 px-1 py-2 rounded-xl text-sm border transition-all cursor-pointer
                ${selectedPayment === m.id ? 'border-primary-orange-light text-primary-orange bg-orange-50' : 'border-gray-100 text-gray-500 bg-gray-50 hover:border-gray-200'}`}>
              {m.icon}<span className="text-[10px] text-center">{m.label}</span>
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-3">
          <button onClick={handlePlaceOrder} disabled={!productsChosen.length || loading}
            className="cursor-pointer flex-1 py-3 bg-primary-orange-light hover:bg-primary-orange disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold rounded-2xl transition-all text-sm">
            {loading ? 'Placing...' : 'Place Order'}
          </button>
          <button onClick={onClearCart} disabled={!productsChosen.length}
            className="cursor-pointer flex-1 py-3 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 text-gray-700 font-bold rounded-2xl transition-all text-sm">
            Clear
          </button>
        </div>
      </div>
    </div>
  )
}

export default BottomSection