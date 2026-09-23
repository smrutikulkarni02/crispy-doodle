import { useState } from 'react'
import { MapPin, Navigation, ChevronRight, Check, ShoppingCart, Clock } from 'lucide-react'
import { stores, storeMap } from '../data/mockData'

const aisleColors = [
  'bg-emerald-100 border-emerald-300 text-emerald-800',
  'bg-amber-100 border-amber-300 text-amber-800',
  'bg-rose-100 border-rose-300 text-rose-800',
  'bg-sky-100 border-sky-300 text-sky-800',
  'bg-orange-100 border-orange-300 text-orange-800',
  'bg-violet-100 border-violet-300 text-violet-800',
  'bg-blue-100 border-blue-300 text-blue-800',
  'bg-slate-100 border-slate-300 text-slate-800',
]

const shoppingRouteItems = [
  { name: 'Organic Bananas', aisle: 'Produce', found: true },
  { name: 'Baby Spinach', aisle: 'Produce', found: true },
  { name: 'Avocados', aisle: 'Produce', found: false },
  { name: 'Chicken Breast', aisle: 'Aisle 2 - Meat & Seafood', found: false },
  { name: 'Whole Wheat Bread', aisle: 'Aisle 1 - Bread & Bakery', found: false },
  { name: 'Pasta', aisle: 'Aisle 5 - Pantry & Pasta', found: false },
  { name: 'Pasta Sauce', aisle: 'Aisle 5 - Pantry & Pasta', found: false },
  { name: 'Whole Milk', aisle: 'Aisle 6 - Dairy', found: false },
  { name: 'Large Eggs', aisle: 'Aisle 6 - Dairy', found: false },
  { name: 'Cheddar Cheese', aisle: 'Aisle 6 - Dairy', found: false },
]

export default function StoreNavigator() {
  const [selectedStore, setSelectedStore] = useState(2)
  const [routeItems, setRouteItems] = useState(shoppingRouteItems)
  const [activeAisle, setActiveAisle] = useState(null)
  const store = stores.find(s => s.id === selectedStore)

  const toggleFound = (index) => {
    setRouteItems(prev => prev.map((item, i) =>
      i === index ? { ...item, found: !item.found } : item
    ))
  }

  const foundCount = routeItems.filter(i => i.found).length
  const progress = (foundCount / routeItems.length) * 100

  return (
    <div className="bg-surface-alt min-h-full">
      <div className="bg-white px-5 pt-12 pb-4 border-b border-border">
        <h1 className="text-2xl font-bold text-text">Store Navigator</h1>
        <p className="text-text-secondary text-sm mt-1">Find items fast with optimized routes</p>

        <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
          {stores.slice(0, 4).map(s => (
            <button
              key={s.id}
              onClick={() => setSelectedStore(s.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border whitespace-nowrap transition-all ${
                selectedStore === s.id
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-white text-text-secondary border-border'
              }`}
            >
              {s.logo} {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-5 py-4">
        <div className="bg-white rounded-2xl p-4 border border-border shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <Navigation size={16} className="text-primary" />
              <span className="font-semibold text-sm">Shopping Progress</span>
            </div>
            <span className="text-primary font-bold text-sm">{foundCount}/{routeItems.length}</span>
          </div>
          <div className="bg-gray-100 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-primary to-teal-400 rounded-full h-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center gap-1 mt-2">
            <Clock size={12} className="text-text-muted" />
            <span className="text-xs text-text-muted">Est. {Math.max(5, routeItems.length - foundCount) * 2} min remaining</span>
          </div>
        </div>
      </div>

      {/* Store Map */}
      <div className="px-5 mb-4">
        <h2 className="font-bold text-sm mb-3 flex items-center gap-2">
          <MapPin size={16} className="text-primary" />
          {store?.name} — Store Layout
        </h2>
        <div className="grid grid-cols-3 gap-2">
          {storeMap.aisles.map((aisle, i) => (
            <button
              key={aisle.id}
              onClick={() => setActiveAisle(activeAisle === aisle.id ? null : aisle.id)}
              className={`p-3 rounded-xl border-2 text-left transition-all ${aisleColors[i]} ${
                activeAisle === aisle.id ? 'ring-2 ring-primary ring-offset-1 scale-[1.02]' : ''
              }`}
            >
              <p className="font-bold text-xs leading-tight">{aisle.name.split(' - ')[0]}</p>
              <p className="text-[10px] mt-0.5 opacity-75 leading-tight">{aisle.name.split(' - ')[1] || aisle.name}</p>
              {aisle.items.length > 0 && (
                <p className="text-[9px] mt-1.5 opacity-60">{aisle.items.length} items</p>
              )}
            </button>
          ))}
        </div>

        {activeAisle && (
          <div className="mt-3 bg-white rounded-xl p-3 border border-border">
            <p className="font-semibold text-sm mb-2">
              {storeMap.aisles.find(a => a.id === activeAisle)?.name}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {storeMap.aisles.find(a => a.id === activeAisle)?.items.map(item => (
                <span key={item} className="bg-surface-alt text-text-secondary text-xs px-2.5 py-1 rounded-full border border-border">
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Optimized Route */}
      <div className="px-5 pb-6">
        <h2 className="font-bold text-sm mb-3 flex items-center gap-2">
          <ShoppingCart size={16} className="text-primary" />
          Optimized Shopping Route
        </h2>
        <div className="space-y-1">
          {routeItems.map((item, index) => {
            const isLast = index === routeItems.length - 1
            return (
              <div key={index} className="flex items-start gap-3">
                {/* Timeline */}
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => toggleFound(index)}
                    className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all ${
                      item.found
                        ? 'bg-primary border-primary'
                        : 'bg-white border-gray-300 hover:border-primary'
                    }`}
                  >
                    {item.found && <Check size={14} className="text-white" />}
                    {!item.found && <span className="text-xs font-bold text-gray-400">{index + 1}</span>}
                  </button>
                  {!isLast && (
                    <div className={`w-0.5 h-8 ${item.found ? 'bg-primary' : 'bg-gray-200'}`} />
                  )}
                </div>

                {/* Item Info */}
                <div className={`flex-1 pb-3 ${item.found ? 'opacity-50' : ''}`}>
                  <p className={`font-medium text-sm ${item.found ? 'line-through text-text-muted' : ''}`}>
                    {item.name}
                  </p>
                  <p className="text-xs text-text-muted flex items-center gap-1">
                    <MapPin size={10} />
                    {item.aisle}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Location Alert Banner */}
      <div className="px-5 pb-6">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <MapPin size={16} className="text-blue-600" />
            <span className="font-semibold text-sm text-blue-900">Location Alert</span>
          </div>
          <p className="text-blue-700 text-xs">
            Your next item <span className="font-semibold">Avocados</span> is in the Produce section — straight ahead!
          </p>
        </div>
      </div>
    </div>
  )
}
