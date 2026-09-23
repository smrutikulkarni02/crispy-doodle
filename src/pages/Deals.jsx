import { useState } from 'react'
import { Tag, Clock, Bell, BellOff, Filter, Percent, ShoppingCart, Star } from 'lucide-react'
import { deals, stores } from '../data/mockData'

const extraDeals = [
  { id: 7, store: 'Walmart', item: 'Great Value Water (24 pk)', discount: '2 for $5', originalPrice: 3.98, salePrice: 2.50, expires: '5 days', tag: 'Bundle Deal' },
  { id: 8, store: 'Aldi', item: 'Whole Wheat Bread', discount: '$0.50 OFF', originalPrice: 1.89, salePrice: 1.39, expires: '2 days', tag: 'Fresh Deal' },
  { id: 9, store: 'Costco', item: 'Rotisserie Chicken', discount: 'MEMBER', originalPrice: 4.99, salePrice: 4.99, expires: 'Ongoing', tag: 'Member Price' },
  { id: 10, store: 'Target', item: 'Good & Gather Granola', discount: '25% OFF', originalPrice: 4.29, salePrice: 3.22, expires: '3 days', tag: 'Circle Deal' },
  { id: 11, store: 'Publix', item: 'Boar\'s Head Turkey', discount: '$3 OFF', originalPrice: 10.99, salePrice: 7.99, expires: '1 day', tag: 'Deli Special' },
]

const allDeals = [...deals, ...extraDeals]

const tagColors = {
  'Weekly Deal': 'bg-blue-100 text-blue-700',
  'BOGO': 'bg-red-100 text-red-700',
  'Fresh Deal': 'bg-green-100 text-green-700',
  'Member Deal': 'bg-purple-100 text-purple-700',
  'Circle Deal': 'bg-pink-100 text-pink-700',
  'Deli Special': 'bg-orange-100 text-orange-700',
  'Bundle Deal': 'bg-cyan-100 text-cyan-700',
  'Member Price': 'bg-violet-100 text-violet-700',
}

export default function Deals() {
  const [selectedStore, setSelectedStore] = useState(null)
  const [alertsEnabled, setAlertsEnabled] = useState(new Set([1, 3, 5]))

  const filteredDeals = selectedStore
    ? allDeals.filter(d => d.store === selectedStore)
    : allDeals

  const toggleAlert = (dealId) => {
    setAlertsEnabled(prev => {
      const next = new Set(prev)
      if (next.has(dealId)) next.delete(dealId)
      else next.add(dealId)
      return next
    })
  }

  const totalSavings = allDeals.reduce((sum, d) => sum + (d.originalPrice - d.salePrice), 0)

  return (
    <div className="bg-surface-alt min-h-full">
      <div className="bg-white px-5 pt-12 pb-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text">Deals & Coupons</h1>
            <p className="text-text-secondary text-sm mt-1">{allDeals.length} active deals near you</p>
          </div>
          <div className="bg-accent-light p-2.5 rounded-xl">
            <Percent size={20} className="text-accent" />
          </div>
        </div>

        {/* Savings Banner */}
        <div className="mt-4 bg-gradient-to-r from-primary to-teal-500 rounded-xl p-3 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-200 text-[10px] font-medium uppercase tracking-wide">Potential Savings</p>
              <p className="text-2xl font-bold">${totalSavings.toFixed(2)}</p>
            </div>
            <Tag size={32} className="text-white/30" />
          </div>
        </div>

        {/* Store Filter */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedStore(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border whitespace-nowrap ${
              !selectedStore ? 'bg-primary text-white border-primary' : 'text-text-secondary border-border'
            }`}
          >
            All Stores
          </button>
          {stores.map(s => (
            <button
              key={s.id}
              onClick={() => setSelectedStore(s.name)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border whitespace-nowrap ${
                selectedStore === s.name ? 'bg-primary text-white border-primary' : 'text-text-secondary border-border'
              }`}
            >
              {s.logo} {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* Deals List */}
      <div className="px-5 py-4 space-y-3">
        {filteredDeals.map(deal => {
          const savings = (deal.originalPrice - deal.salePrice).toFixed(2)
          const hasAlert = alertsEnabled.has(deal.id)

          return (
            <div key={deal.id} className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${tagColors[deal.tag] || 'bg-gray-100 text-gray-700'}`}>
                      {deal.tag}
                    </span>
                    <span className="text-text-muted text-xs">{deal.store}</span>
                  </div>
                  <button
                    onClick={() => toggleAlert(deal.id)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      hasAlert ? 'text-accent bg-accent-light' : 'text-text-muted hover:bg-surface-alt'
                    }`}
                  >
                    {hasAlert ? <Bell size={14} /> : <BellOff size={14} />}
                  </button>
                </div>

                <h3 className="font-semibold text-sm">{deal.item}</h3>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-danger/10 text-danger text-sm font-bold px-2.5 py-0.5 rounded-lg">
                      {deal.discount}
                    </span>
                    <div>
                      <span className="text-primary font-bold">${deal.salePrice.toFixed(2)}</span>
                      <span className="text-text-muted text-xs line-through ml-1">${deal.originalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                  <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-lg">
                    Save ${savings}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                  <div className="flex items-center gap-1">
                    <Clock size={12} className="text-text-muted" />
                    <span className="text-text-muted text-xs">Expires in {deal.expires}</span>
                  </div>
                  <button className="flex items-center gap-1 text-primary text-xs font-semibold">
                    <ShoppingCart size={12} />
                    Add to list
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Alert Settings */}
      <div className="px-5 pb-6">
        <div className="bg-white rounded-2xl p-4 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Bell size={16} className="text-primary" />
            <span className="font-semibold text-sm">Deal Alerts</span>
          </div>
          <p className="text-text-muted text-xs">
            You have alerts enabled for {alertsEnabled.size} deals. We'll notify you when prices drop further or deals are about to expire.
          </p>
        </div>
      </div>
    </div>
  )
}
