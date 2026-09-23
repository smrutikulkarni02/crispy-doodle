import { useState } from 'react'
import { Plus, Check, Trash2, ShoppingCart, ChevronDown, ChevronUp, Search, SlidersHorizontal } from 'lucide-react'
import { groceryItems, categories, stores } from '../data/mockData'

const initialList = [
  { id: 1, itemId: 1, quantity: 1, checked: false },
  { id: 2, itemId: 2, quantity: 1, checked: false },
  { id: 3, itemId: 3, quantity: 2, checked: true },
  { id: 4, itemId: 5, quantity: 1, checked: false },
  { id: 5, itemId: 7, quantity: 2, checked: false },
  { id: 6, itemId: 8, quantity: 1, checked: true },
  { id: 7, itemId: 6, quantity: 1, checked: false },
  { id: 8, itemId: 12, quantity: 1, checked: false },
  { id: 9, itemId: 16, quantity: 3, checked: false },
  { id: 10, itemId: 4, quantity: 1, checked: true },
]

export default function ShoppingLists() {
  const [list, setList] = useState(initialList)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStore, setSelectedStore] = useState(1)
  const [showCompleted, setShowCompleted] = useState(true)
  const [showAddItem, setShowAddItem] = useState(false)

  const toggleItem = (id) => {
    setList(prev => prev.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    ))
  }

  const removeItem = (id) => {
    setList(prev => prev.filter(item => item.id !== id))
  }

  const addItem = (itemId) => {
    const newItem = { id: Date.now(), itemId, quantity: 1, checked: false }
    setList(prev => [...prev, newItem])
    setShowAddItem(false)
    setSearchQuery('')
  }

  const unchecked = list.filter(i => !i.checked)
  const checked = list.filter(i => i.checked)
  const store = stores.find(s => s.id === selectedStore)

  const totalCost = list.reduce((sum, item) => {
    const grocery = groceryItems.find(g => g.id === item.itemId)
    return sum + (grocery ? grocery.prices[selectedStore] * item.quantity : 0)
  }, 0)

  const filteredItems = groceryItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    !list.some(l => l.itemId === item.id)
  )

  return (
    <div className="bg-surface-alt min-h-full">
      <div className="bg-white px-5 pt-12 pb-4 border-b border-border">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-text">Shopping List</h1>
            <p className="text-text-secondary text-sm mt-1">
              {unchecked.length} items remaining
            </p>
          </div>
          <button
            onClick={() => setShowAddItem(true)}
            className="bg-primary text-white p-2.5 rounded-xl shadow-sm"
          >
            <Plus size={20} />
          </button>
        </div>

        {/* Store Selector */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
          {stores.map(s => (
            <button
              key={s.id}
              onClick={() => setSelectedStore(s.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border whitespace-nowrap transition-all ${
                selectedStore === s.id
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-text-secondary border-border hover:border-primary/30'
              }`}
            >
              <span>{s.logo}</span>
              {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* Add Item Modal */}
      {showAddItem && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end">
          <div className="bg-white w-full max-w-md mx-auto rounded-t-2xl p-5 max-h-[70vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Add Item</h2>
              <button onClick={() => { setShowAddItem(false); setSearchQuery('') }} className="text-text-muted">
                &times;
              </button>
            </div>
            <div className="relative mb-3">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                autoFocus
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search items..."
                className="w-full pl-9 pr-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div className="overflow-y-auto flex-1">
              {filteredItems.map(item => {
                const cat = categories.find(c => c.id === item.category)
                return (
                  <button
                    key={item.id}
                    onClick={() => addItem(item.id)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-surface-alt rounded-xl transition-colors"
                  >
                    <span className="text-lg">{cat?.icon}</span>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-text-muted">{cat?.name}</p>
                    </div>
                    <span className="text-primary font-semibold text-sm">
                      ${item.prices[selectedStore]?.toFixed(2)}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Shopping List Items */}
      <div className="px-5 py-4">
        {/* Unchecked Items */}
        <div className="space-y-2">
          {unchecked.map(item => {
            const grocery = groceryItems.find(g => g.id === item.itemId)
            const cat = categories.find(c => c.id === grocery?.category)
            const inStock = grocery?.inStock[selectedStore]
            return (
              <div key={item.id} className="bg-white rounded-xl p-3 flex items-center gap-3 border border-border shadow-sm">
                <button
                  onClick={() => toggleItem(item.id)}
                  className="w-6 h-6 rounded-full border-2 border-border flex-shrink-0 hover:border-primary transition-colors"
                />
                <span className="text-lg flex-shrink-0">{cat?.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{grocery?.name}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-text-muted">{grocery?.aisle}</span>
                    {!inStock && (
                      <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-medium">
                        Out of stock
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-semibold text-sm">${(grocery?.prices[selectedStore] * item.quantity).toFixed(2)}</p>
                  <p className="text-[10px] text-text-muted">x{item.quantity}</p>
                </div>
                <button onClick={() => removeItem(item.id)} className="text-text-muted hover:text-danger p-1">
                  <Trash2 size={14} />
                </button>
              </div>
            )
          })}
        </div>

        {/* Completed Items */}
        {checked.length > 0 && (
          <div className="mt-4">
            <button
              onClick={() => setShowCompleted(!showCompleted)}
              className="flex items-center gap-2 text-text-muted text-sm font-medium mb-2"
            >
              {showCompleted ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              Completed ({checked.length})
            </button>
            {showCompleted && (
              <div className="space-y-2 opacity-60">
                {checked.map(item => {
                  const grocery = groceryItems.find(g => g.id === item.itemId)
                  const cat = categories.find(c => c.id === grocery?.category)
                  return (
                    <div key={item.id} className="bg-white rounded-xl p-3 flex items-center gap-3 border border-border">
                      <button
                        onClick={() => toggleItem(item.id)}
                        className="w-6 h-6 rounded-full bg-primary flex-shrink-0 flex items-center justify-center"
                      >
                        <Check size={14} className="text-white" />
                      </button>
                      <span className="text-lg flex-shrink-0">{cat?.icon}</span>
                      <p className="flex-1 font-medium text-sm line-through text-text-muted truncate">{grocery?.name}</p>
                      <button onClick={() => removeItem(item.id)} className="text-text-muted hover:text-danger p-1">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Summary Footer */}
      <div className="px-5 pb-6">
        <div className="bg-white rounded-2xl p-4 border border-border shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-text-secondary text-sm">Estimated Total at {store?.name}</span>
            <span className="text-xl font-bold text-primary">${totalCost.toFixed(2)}</span>
          </div>
          <button className="w-full bg-primary text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 mt-2 hover:bg-primary-dark transition-colors">
            <ShoppingCart size={18} />
            Start Shopping Trip
          </button>
        </div>
      </div>
    </div>
  )
}
