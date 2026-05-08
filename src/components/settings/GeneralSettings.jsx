import React, { useEffect, useRef, useState } from 'react'
import api from '../../lib/axios'
import { useToast } from '../../context/ToastContext'
import { Camera, Save } from 'lucide-react'
import FloatingInput from '../../config/FloatingInput'

const payment_options = ['cash', 'card', 'ewallet', 'giftcards']
const currencies      = ['DH', 'USD', 'EUR', 'GBP', 'SAR']

const GeneralSettings = () => {
  const { toast } = useToast()

  const [form, setForm]       = useState({
    restaurant_name:    '',
    restaurant_email:   '',
    restaurant_phone:   '',
    restaurant_address: '',
    restaurant_logo:    '',
    tax_rate:           '10',
    currency:           'DH',
    default_payment:    'cash',
    prep_time:          '30',
    opening_time:       '08:00',
    closing_time:       '23:00',
    receipt_header:     '',
    receipt_footer:     '',
    show_tax_receipt:   'true',
  })
  // const [logoFile, setLogoFile]   = useState(null)
  // const [logoPreview, setLogoPreview] = useState(null)
  const [loading, setLoading]     = useState(true)
  const [saving, setSaving]       = useState(false)
  const [errors, setErrors]       = useState({})

  useEffect(() => {
    api.get('/settings')
      .then((res) => {
        setForm((prev) => ({ ...prev, ...res.data }))
      })
      .finally(() => setLoading(false))
  }, [])


  // const handleLogoChange = (e) => {
  //   const file = e.target.files[0]
  //   if (!file) return
  //   setLogoFile(file)
  //   setLogoPreview(URL.createObjectURL(file))
  //   toast({ message: 'Logo selected — save to apply', type: 'warning' })
  // }

  const handleSubmit = async () => {
    setSaving(true)
    setErrors({})

    const data = new FormData()
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null && value !== undefined) data.append(key, value)
    })
    // if (logoFile) data.append('restaurant_logo', logoFile)
    // data.append('_method', 'PUT')

    try {
      const res = await api.post('/settings', data)
      setForm(prev => ({ ...prev, ...res.data }))
      toast({ message: 'Settings saved successfully!', type: 'success' })
    } catch (err) {
      setErrors(err.response?.data?.errors ?? {})
      toast({ message: 'Failed to save settings', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="text-gray-400 text-sm text-center py-10">Loading settings...</p>

  return (
    <div className="flex flex-col gap-6 w-full">

      <Section title="Restaurant Info">
        {/* <div className="flex items-center gap-4 mb-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center">
              {logoPreview
                ? <img src={logoPreview} className="w-full h-full object-cover" />
                : <span className="text-2xl">🍽️</span>}
            </div>
            <button
              onClick={() => logoRef.current.click()}
              className="absolute -bottom-2 -right-2 w-7 h-7 bg-primary-orange rounded-xl flex items-center justify-center shadow-sm hover:bg-primary-orange-dark transition-colors cursor-pointer"
            >
              <Camera size={13} className="text-white" />
            </button>
            <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Restaurant Logo</p>
            <p className="text-xs text-gray-400">Click the camera to change</p>
          </div>
        </div> */}

        <FloatingInput id="restaurant_name"    label="Restaurant Name"    value={form.restaurant_name}    error={errors.restaurant_name}    onChange={e => setForm(p => ({ ...p, restaurant_name: e.target.value }))} />
        <FloatingInput id="restaurant_email"   label="Email"   type="email" value={form.restaurant_email}   error={errors.restaurant_email}   onChange={e => setForm(p => ({ ...p, restaurant_email: e.target.value }))} />
        <FloatingInput id="restaurant_phone"   label="Phone Number"       value={form.restaurant_phone}   error={errors.restaurant_phone}   onChange={e => setForm(p => ({ ...p, restaurant_phone: e.target.value }))} />
        <FloatingInput id="restaurant_address" label="Address"            value={form.restaurant_address} error={errors.restaurant_address} onChange={e => setForm(p => ({ ...p, restaurant_address: e.target.value }))} />
      </Section>

      <Section title="Financial">
        <FloatingInput id="tax_rate" label="Tax Rate (%)" type="number" value={form.tax_rate} error={errors.tax_rate} onChange={e => setForm(p => ({ ...p, tax_rate: e.target.value }))} />

        <SelectField label="Currency" id="currency" value={form.currency} onChange={e => setForm(p => ({ ...p, currency: e.target.value }))}>
          {currencies.map(c => <option key={c} value={c}>{c}</option>)}
        </SelectField>

        <SelectField label="Default Payment Method" id="default_payment" value={form.default_payment} onChange={e => setForm(p => ({ ...p, default_payment: e.target.value }))}>
          {payment_options.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
        </SelectField>
      </Section>

      <Section title="Operations">
        <FloatingInput id="prep_time"     label="Default Prep Time (minutes)" type="number" value={form.prep_time}     error={errors.prep_time}     onChange={e => setForm(p => ({ ...p, prep_time: e.target.value }))} />
        <FloatingInput id="opening_time"  label="Opening Time"  type="time"   value={form.opening_time}  error={errors.opening_time}  onChange={e => setForm(p => ({ ...p, opening_time: e.target.value }))} />
        <FloatingInput id="closing_time"  label="Closing Time"  type="time"   value={form.closing_time}  error={errors.closing_time}  onChange={e => setForm(p => ({ ...p, closing_time: e.target.value }))} />
      </Section>

      <Section title="Receipt">
        <FloatingInput id="receipt_header" label="Receipt Header" value={form.receipt_header} error={errors.receipt_header} onChange={e => setForm(p => ({ ...p, receipt_header: e.target.value }))} />
        <FloatingInput id="receipt_footer" label="Receipt Footer" value={form.receipt_footer} error={errors.receipt_footer} onChange={e => setForm(p => ({ ...p, receipt_footer: e.target.value }))} />

        <div className="flex items-center justify-between px-1">
          <span className="text-sm text-gray-600">Show tax on receipt</span>
          <button
            onClick={() => setForm(p => ({ ...p, show_tax_receipt: p.show_tax_receipt === 'true' ? 'false' : 'true' }))}
            className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer
              ${form.show_tax_receipt === 'true' ? 'bg-green-400' : 'bg-gray-200'}`}
          >
            <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all
              ${form.show_tax_receipt === 'true' ? 'left-5' : 'left-0.5'}`}
            />
          </button>
        </div>
      </Section>

      <button
        onClick={handleSubmit}
        disabled={saving}
        className="flex items-center gap-2 px-6 py-3 bg-primary-orange hover:bg-primary-orange-dark disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition-all cursor-pointer w-fit"
      >
        <Save size={15} />
        {saving ? 'Saving...' : 'Save Changes'}
      </button>

    </div>
  )
}

const Section = ({ title, children }) => (
  <div className="bg-white rounded-2xl border border-gray-100 p-6">
    <h4 className="font-bold text-gray-800 mb-4 pb-3 border-b border-gray-100">{title}</h4>
    <div className="flex flex-col gap-1">{children}</div>
  </div>
)

const SelectField = ({ label, id, value, onChange, children }) => (
  <div className="mb-4">
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={onChange}
        className="peer block w-full rounded-lg border border-gray-300 bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-gray-900 focus:border-primary-orange focus:outline-none focus:ring-0"
      >
        {children}
      </select>
      <label htmlFor={id}
        className="absolute start-2 top-2 z-10 origin-[0] -translate-y-4 scale-75 bg-white px-2 text-sm text-gray-500">
        {label}
      </label>
    </div>
  </div>
)

export default GeneralSettings