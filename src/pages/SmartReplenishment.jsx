import { useState } from 'react'
import { RefreshCw, ShoppingCart, Check, Clock, TrendingUp, Sparkles, Plus } from 'lucide-react'
import { replenishmentSuggestions, stores } from '../data/mockData'

export default function SmartReplenishment() {
  const [addedItems, setAddedItems] = useState(new Set())
  const [selectedStore, setSelectedStore] = useState(1)

  const toggleItem = (index) => {
    setAddedItems(prev => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  const addAll = () => {
    setAddedItems(new Set(replenishmentSuggestions.map((_, i) => i)))
  }

  return (
    <div className="bg-surface-alt min-h-full">
      <div className="bg-white px-5 pt-12 pb-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text">Smart Restock</h1>
            <p className="text-text-secondary text-sm mt-1">Auto-suggestions based on your buying patterns</p>
          </div>
          <div className="bg-amber-100 p-2.5 rounded-xl">
            <RefreshCw size={20} className="text-amber-600" />
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="px-5 py-4">
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={16} className="text-amber-600" />
            <span className="font-semibold text-sm text-amber-900">How Smart Restock Works</span>
          </div>
          <p className="text-amber-700 text-xs leading-relaxed">
            We analyze your purchase history to predict what you'll need and when.
            Items are ranked by confidence — higher confidence means you buy this item regularly on a predictable schedule.
          </p>
        </div>
      </div>

      {/* Store Selector */}
      <div className="px-5 mb-3">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {stores.map(s => (
            <button
              key={s.id}
              onClick={() => setSelectedStore(s.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border whitespace-nowrap ${
                selectedStore === s.id
                  ? 'bg-primary text-white border-primary'
                  : 'text-text-secondary border-border'
              }`}
            >
              {s.logo} {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* Suggestions List */}
      <div className="px-5 space-y-2">
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-bold text-sm">{replenishmentSuggestions.length} Items Predicted</h2>
          <button
            onClick={addAll}
            className="text-primary text-xs font-semibold flex items-center gap-1"
          >
            <Plus size={12} />
            Add All to List
          </button>
        </div>

        {replenishmentSuggestions.map((item, index) => {
          const isAdded = addedItems.has(index)
          const confidenceColor = item.confidence >= 90
            ? 'text-green-600 bg-green-100'
            : item.confidence >= 75
              ? 'text-amber-600 bg-amber-100'
              : 'text-orange-600 bg-orange-100'

          return (
            <div key={index} className="bg-white rounded-2xl p-4 border border-border shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-sm">{item.item}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${confidenceColor}`}>
                      {item.confidence}%
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-text-muted">
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {item.lastBought}
                    </span>
                    <span className="flex items-center gap-1">
                      <RefreshCw size={11} />
                      {item.frequency}
                    </span>
                  </div>

                  {/* Confidence Bar */}
                  <div className="mt-2.5">
                    <div className="bg-gray-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`rounded-full h-full transition-all ${
                          item.confidence >= 90 ? 'bg-green-500' :
                          item.confidence >= 75 ? 'bg-amber-500' : 'bg-orange-500'
                        }`}
                        style={{ width: `${item.confidence}%` }}
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => toggleItem(index)}
                  className={`flex-shrink-0 p-2.5 rounded-xl border-2 transition-all ${
                    isAdded
                      ? 'bg-primary border-primary text-white'
                      : 'border-border text-text-muted hover:border-primary hover:text-primary'
                  }`}
                >
                  {isAdded ? <Check size={18} /> : <ShoppingCart size={18} />}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Add to List Button */}
      {addedItems.size > 0 && (
        <div className="px-5 py-6">
          <button className="w-full bg-primary text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/25">
            <ShoppingCart size={18} />
            Add {addedItems.size} Items to Shopping List
          </button>
        </div>
      )}

      {/* Purchase Patterns */}
      <div className="px-5 pb-6">
        <div className="bg-white rounded-2xl p-4 border border-border shadow-sm">
          <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
            <TrendingUp size={16} className="text-primary" />
            Your Purchase Patterns
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <p className="text-xl font-bold text-primary">18</p>
              <p className="text-[10px] text-text-muted mt-0.5">Items tracked</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-amber-600">85%</p>
              <p className="text-[10px] text-text-muted mt-0.5">Avg accuracy</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-blue-600">12 wk</p>
              <p className="text-[10px] text-text-muted mt-0.5">History</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
