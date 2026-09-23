import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  User, Settings, Heart, CreditCard, Bell, Shield, ChevronRight,
  LogOut, Star, Crown, MapPin, Leaf, AlertTriangle
} from 'lucide-react'

const dietaryPreferences = [
  { id: 'vegetarian', label: 'Vegetarian', icon: '🥬' },
  { id: 'vegan', label: 'Vegan', icon: '🌱' },
  { id: 'glutenFree', label: 'Gluten-Free', icon: '🌾' },
  { id: 'dairyFree', label: 'Dairy-Free', icon: '🥛' },
  { id: 'keto', label: 'Keto', icon: '🥑' },
  { id: 'lowSodium', label: 'Low Sodium', icon: '🧂' },
]

const allergies = [
  { id: 'nuts', label: 'Tree Nuts', icon: '🥜' },
  { id: 'peanuts', label: 'Peanuts', icon: '🫘' },
  { id: 'shellfish', label: 'Shellfish', icon: '🦐' },
  { id: 'soy', label: 'Soy', icon: '🫛' },
  { id: 'eggs', label: 'Eggs', icon: '🥚' },
  { id: 'wheat', label: 'Wheat', icon: '🌾' },
]

export default function Profile() {
  const [selectedDiet, setSelectedDiet] = useState(new Set(['glutenFree']))
  const [selectedAllergies, setSelectedAllergies] = useState(new Set(['nuts']))
  const [paymentMethod, setPaymentMethod] = useState('standard')
  const [notifications, setNotifications] = useState({
    deals: true,
    stockAlerts: true,
    restock: true,
    budget: false,
  })

  const toggleDiet = (id) => {
    setSelectedDiet(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleAllergy = (id) => {
    setSelectedAllergies(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="bg-surface-alt min-h-full">
      {/* Header */}
      <div className="bg-white px-5 pt-12 pb-6 border-b border-border">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-teal-400 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            P
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-text">Prioritizing Paul</h1>
            <p className="text-text-secondary text-sm">paul@example.com</p>
            <div className="flex items-center gap-1 mt-1">
              <Crown size={12} className="text-accent" />
              <span className="text-accent text-xs font-semibold">Plus Member — $5/mo</span>
            </div>
          </div>
          <Settings size={20} className="text-text-muted" />
        </div>
      </div>

      {/* Plan Upgrade */}
      <div className="px-5 py-4">
        <Link to="/pricing">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Star size={16} />
                  <span className="font-semibold text-sm">Upgrade to Pro</span>
                </div>
                <p className="text-indigo-200 text-xs">Multi-store carts, WIC/EBT, and more</p>
              </div>
              <ChevronRight size={20} className="text-white/60" />
            </div>
          </div>
        </Link>
      </div>

      {/* Dietary Preferences */}
      <div className="px-5 mb-4">
        <div className="bg-white rounded-2xl p-4 border border-border shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Leaf size={16} className="text-primary" />
            <h2 className="font-bold text-sm">Dietary Preferences</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {dietaryPreferences.map(pref => (
              <button
                key={pref.id}
                onClick={() => toggleDiet(pref.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
                  selectedDiet.has(pref.id)
                    ? 'bg-primary-light border-primary text-primary'
                    : 'border-border text-text-secondary hover:border-primary/30'
                }`}
              >
                <span>{pref.icon}</span>
                {pref.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Allergies */}
      <div className="px-5 mb-4">
        <div className="bg-white rounded-2xl p-4 border border-border shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={16} className="text-danger" />
            <h2 className="font-bold text-sm">Allergies</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {allergies.map(allergy => (
              <button
                key={allergy.id}
                onClick={() => toggleAllergy(allergy.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
                  selectedAllergies.has(allergy.id)
                    ? 'bg-red-50 border-danger text-danger'
                    : 'border-border text-text-secondary hover:border-danger/30'
                }`}
              >
                <span>{allergy.icon}</span>
                {allergy.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Payment & Benefits */}
      <div className="px-5 mb-4">
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard size={16} className="text-secondary" />
              <h2 className="font-bold text-sm">Payment & Benefits</h2>
            </div>
            <div className="space-y-2">
              {[
                { id: 'standard', label: 'Credit/Debit Card', desc: '•••• 4242', icon: '💳' },
                { id: 'ebt', label: 'EBT/SNAP', desc: 'Connect your benefits card', icon: '🏛️' },
                { id: 'wic', label: 'WIC Benefits', desc: 'Link your WIC account', icon: '👶' },
              ].map(method => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                    paymentMethod === method.id
                      ? 'border-primary bg-primary-light/50'
                      : 'border-border hover:border-primary/30'
                  }`}
                >
                  <span className="text-lg">{method.icon}</span>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium">{method.label}</p>
                    <p className="text-xs text-text-muted">{method.desc}</p>
                  </div>
                  {paymentMethod === method.id && (
                    <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="px-5 mb-4">
        <div className="bg-white rounded-2xl p-4 border border-border shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Bell size={16} className="text-accent" />
            <h2 className="font-bold text-sm">Notification Settings</h2>
          </div>
          <div className="space-y-3">
            {[
              { key: 'deals', label: 'Deal Alerts', desc: 'Price drops & new deals' },
              { key: 'stockAlerts', label: 'Stock Alerts', desc: 'Item availability updates' },
              { key: 'restock', label: 'Restock Reminders', desc: 'Weekly replenishment' },
              { key: 'budget', label: 'Budget Warnings', desc: 'Nearing budget limit' },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-text-muted">{item.desc}</p>
                </div>
                <button
                  onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    notifications[item.key] ? 'bg-primary' : 'bg-gray-200'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow-sm absolute top-0.5 transition-transform ${
                    notifications[item.key] ? 'translate-x-5.5' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Preferred Stores */}
      <div className="px-5 mb-4">
        <div className="bg-white rounded-2xl p-4 border border-border shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <MapPin size={16} className="text-primary" />
            <h2 className="font-bold text-sm">Preferred Stores</h2>
          </div>
          <div className="space-y-2">
            {[
              { name: 'Publix', address: '1234 University Blvd, Orlando', distance: '0.8 mi' },
              { name: 'Aldi', address: '567 Colonial Dr, Orlando', distance: '1.2 mi' },
              { name: 'Walmart', address: '890 Semoran Blvd, Orlando', distance: '2.1 mi' },
            ].map((store, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl border border-border">
                <div className="w-8 h-8 bg-surface-alt rounded-lg flex items-center justify-center text-sm">
                  {i === 0 ? '🟢' : i === 1 ? '🅰️' : '🏪'}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{store.name}</p>
                  <p className="text-[10px] text-text-muted">{store.address}</p>
                </div>
                <span className="text-xs text-text-muted">{store.distance}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="px-5 pb-6">
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          {[
            { icon: Shield, label: 'Privacy & Security', color: 'text-blue-600' },
            { icon: Star, label: 'Rate PlanCart', color: 'text-amber-500' },
            { icon: Heart, label: 'Invite Friends', color: 'text-pink-500' },
            { icon: LogOut, label: 'Sign Out', color: 'text-red-500' },
          ].map((item, i, arr) => (
            <button key={item.label} className={`w-full flex items-center gap-3 px-4 py-3.5 ${i < arr.length - 1 ? 'border-b border-border' : ''}`}>
              <item.icon size={18} className={item.color} />
              <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
              <ChevronRight size={16} className="text-text-muted" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
