import { useState } from 'react'
import { Search, ArrowUpDown, TrendingDown, MapPin, ShoppingCart, Check } from 'lucide-react'
import { groceryItems, stores, categories } from '../data/mockData'

export default function PriceCompare() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)
  const [addedToList, setAddedToList] = useState(new Set())

  const filteredItems = groceryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCat = !selectedCategory || item.category === selectedCategory
    return matchesSearch && matchesCat
  })

  const getBestPrice = (item) => {
    const prices = Object.entries(item.prices)
    return prices.reduce((best, [storeId, price]) =>
      price < best.price ? { storeId: Number(storeId), price } : best,
      { storeId: Number(prices[0][0]), price: prices[0][1] }
    )
  }

  const getWorstPrice = (item) => {
    return Math.max(...Object.values(item.prices))
  }

  const toggleAddToList = (itemId, storeId) => {
    const key = `${itemId}-${storeId}`
    setAddedToList(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  return (
    <div className="bg-surface-alt min-h-full">
      <div className="bg-white px-5 pt-12 pb-4 border-b border-border">
        <h1 className="text-2xl font-bold text-text">Price Compare</h1>
        <p className="text-text-secondary text-sm mt-1">Find the best prices across stores</p>

        <div className="relative mt-4">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search items to compare..."
            className="w-full pl-9 pr-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-surface-alt"
          />
        </div>

        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border whitespace-nowrap ${
              !selectedCategory ? 'bg-primary text-white border-primary' : 'text-text-secondary border-border'
            }`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border whitespace-nowrap ${
                selectedCategory === cat.id ? 'bg-primary text-white border-primary' : 'text-text-secondary border-border'
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Item List */}
      <div className="px-5 py-4 space-y-3">
        {filteredItems.map(item => {
          const best = getBestPrice(item)
          const worst = getWorstPrice(item)
          const savings = (worst - best.price).toFixed(2)
          const bestStore = stores.find(s => s.id === best.storeId)
          const cat = categories.find(c => c.id === item.category)
          const isExpanded = selectedItem === item.id

          return (
            <div key={item.id} className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
              <button
                onClick={() => setSelectedItem(isExpanded ? null : item.id)}
                className="w-full p-4 flex items-center gap-3"
              >
                <span className="text-2xl">{cat?.icon}</span>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-sm">{item.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-primary font-bold text-sm">${best.price.toFixed(2)}</span>
                    <span className="text-xs text-text-muted">at {bestStore?.name}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Save ${savings}
                  </span>
                  <ArrowUpDown size={14} className="text-text-muted mt-1" />
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-border px-4 pb-4">
                  <p className="text-xs font-semibold text-text-secondary mt-3 mb-2">Price at each store</p>
                  <div className="space-y-2">
                    {stores.map(store => {
                      const price = item.prices[store.id]
                      const isBest = store.id === best.storeId
                      const inStock = item.inStock[store.id]
                      const isAdded = addedToList.has(`${item.id}-${store.id}`)

                      return (
                        <div
                          key={store.id}
                          className={`flex items-center gap-3 p-2.5 rounded-xl border ${
                            isBest ? 'border-primary bg-primary-light/50' : 'border-border'
                          }`}
                        >
                          <span className="text-base">{store.logo}</span>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{store.name}</span>
                              {isBest && (
                                <span className="bg-primary text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                                  BEST
                                </span>
                              )}
                            </div>
                            {!inStock && (
                              <span className="text-[10px] text-red-500 font-medium">Out of stock</span>
                            )}
                          </div>
                          <span className={`font-bold text-sm ${isBest ? 'text-primary' : 'text-text'}`}>
                            ${price.toFixed(2)}
                          </span>
                          <button
                            onClick={(e) => { e.stopPropagation(); toggleAddToList(item.id, store.id) }}
                            className={`p-1.5 rounded-lg border transition-colors ${
                              isAdded
                                ? 'bg-primary border-primary text-white'
                                : 'border-border text-text-muted hover:border-primary hover:text-primary'
                            }`}
                          >
                            {isAdded ? <Check size={14} /> : <ShoppingCart size={14} />}
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Savings Summary */}
      <div className="px-5 pb-6">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown size={18} />
            <span className="font-semibold text-sm">Smart Shopping Tip</span>
          </div>
          <p className="text-emerald-100 text-xs leading-relaxed">
            Shopping at Aldi for pantry staples and Costco for bulk items could save you up to
            <span className="font-bold text-white"> $23.50/week</span> compared to single-store shopping.
          </p>
        </div>
      </div>
    </div>
  )
}
