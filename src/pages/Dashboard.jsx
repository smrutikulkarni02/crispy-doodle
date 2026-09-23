import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  UtensilsCrossed, ShoppingCart, ArrowRightLeft, MapPin,
  Tag, BarChart3, RefreshCw, Sparkles, ChevronRight, TrendingDown,
  Bell, Clock
} from 'lucide-react'
import { deals, spendingHistory, replenishmentSuggestions } from '../data/mockData'

const quickActions = [
  { to: '/meals', icon: UtensilsCrossed, label: 'Meal Plan', color: 'bg-emerald-100 text-emerald-700' },
  { to: '/lists', icon: ShoppingCart, label: 'My Lists', color: 'bg-blue-100 text-blue-700' },
  { to: '/compare', icon: ArrowRightLeft, label: 'Compare', color: 'bg-purple-100 text-purple-700' },
  { to: '/navigate', icon: MapPin, label: 'Navigate', color: 'bg-orange-100 text-orange-700' },
  { to: '/deals', icon: Tag, label: 'Deals', color: 'bg-pink-100 text-pink-700' },
  { to: '/spending', icon: BarChart3, label: 'Spending', color: 'bg-cyan-100 text-cyan-700' },
  { to: '/replenish', icon: RefreshCw, label: 'Restock', color: 'bg-amber-100 text-amber-700' },
  { to: '/pricing', icon: Sparkles, label: 'Upgrade', color: 'bg-indigo-100 text-indigo-700' },
]

export default function Dashboard() {
  const totalSpent = spendingHistory[spendingHistory.length - 1].amount
  const budget = spendingHistory[spendingHistory.length - 1].budget
  const saved = budget - totalSpent
  const topDeals = deals.slice(0, 3)
  const topRestock = replenishmentSuggestions.slice(0, 3)

  return (
    <div className="bg-surface-alt min-h-full">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-primary-dark text-white px-5 pt-12 pb-8 rounded-b-3xl">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-emerald-200 text-sm font-medium">Good morning</p>
            <h1 className="text-2xl font-bold mt-1">Plan, Shop & Save</h1>
          </div>
          <button className="relative p-2 bg-white/15 rounded-full">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-400 rounded-full border-2 border-primary-dark"></span>
          </button>
        </div>

        {/* Weekly Summary Card */}
        <div className="bg-white/15 backdrop-blur rounded-2xl p-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-emerald-100 text-sm font-medium">This Week's Spending</span>
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">Week 8</span>
          </div>
          <div className="flex items-end gap-3">
            <span className="text-3xl font-bold">${totalSpent.toFixed(2)}</span>
            <span className="text-emerald-200 text-sm mb-1">/ ${budget} budget</span>
          </div>
          <div className="mt-3 bg-white/20 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-white rounded-full h-full transition-all"
              style={{ width: `${Math.min((totalSpent / budget) * 100, 100)}%` }}
            />
          </div>
          <div className="flex items-center gap-1 mt-2">
            <TrendingDown size={14} className="text-emerald-200" />
            <span className="text-emerald-200 text-xs font-medium">
              ${saved.toFixed(2)} under budget
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="px-5 -mt-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="grid grid-cols-4 gap-3">
            {quickActions.map(({ to, icon: Icon, label, color }) => (
              <Link key={to} to={to} className="flex flex-col items-center gap-1.5">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
                  <Icon size={22} />
                </div>
                <span className="text-[11px] font-medium text-text-secondary">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Smart Restock Alert */}
      <div className="px-5 mt-5">
        <Link to="/replenish" className="block">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <RefreshCw size={18} className="text-amber-600" />
                <h3 className="font-semibold text-sm text-amber-900">Smart Restock</h3>
              </div>
              <ChevronRight size={16} className="text-amber-400" />
            </div>
            <p className="text-amber-700 text-xs mb-3">Based on your purchase history, you may need:</p>
            <div className="flex gap-2 flex-wrap">
              {topRestock.map((item, i) => (
                <span key={i} className="bg-white text-amber-800 text-xs px-2.5 py-1 rounded-full border border-amber-200 font-medium">
                  {item.item.split(' (')[0]}
                </span>
              ))}
            </div>
          </div>
        </Link>
      </div>

      {/* Today's Top Deals */}
      <div className="px-5 mt-5">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold">Today's Deals</h2>
          <Link to="/deals" className="text-primary text-sm font-semibold flex items-center gap-0.5">
            See all <ChevronRight size={14} />
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide">
          {topDeals.map(deal => (
            <div key={deal.id} className="min-w-[200px] bg-white rounded-xl p-3 shadow-sm border border-border flex-shrink-0">
              <div className="flex items-center gap-1.5 mb-2">
                <span className="bg-danger/10 text-danger text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {deal.discount}
                </span>
                <span className="text-text-muted text-[10px]">{deal.store}</span>
              </div>
              <p className="font-semibold text-sm text-text leading-tight">{deal.item}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-primary font-bold">${deal.salePrice.toFixed(2)}</span>
                <span className="text-text-muted text-xs line-through">${deal.originalPrice.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-1 mt-1.5">
                <Clock size={10} className="text-text-muted" />
                <span className="text-text-muted text-[10px]">Expires in {deal.expires}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Today's Meal Preview */}
      <div className="px-5 mt-5 mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold">Today's Meals</h2>
          <Link to="/meals" className="text-primary text-sm font-semibold flex items-center gap-0.5">
            Full plan <ChevronRight size={14} />
          </Link>
        </div>
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-border">
          {['breakfast', 'lunch', 'dinner'].map((meal, i) => (
            <div key={meal} className={`flex items-center gap-3 px-4 py-3 ${i < 2 ? 'border-b border-border' : ''}`}>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${
                meal === 'breakfast' ? 'bg-amber-100' : meal === 'lunch' ? 'bg-green-100' : 'bg-indigo-100'
              }`}>
                {meal === 'breakfast' ? '🌅' : meal === 'lunch' ? '☀️' : '🌙'}
              </div>
              <div className="flex-1">
                <p className="text-xs text-text-muted capitalize font-medium">{meal}</p>
                <p className="font-semibold text-sm">
                  {meal === 'breakfast' ? 'Oatmeal with Berries' : meal === 'lunch' ? 'Grilled Chicken Salad' : 'Pasta with Marinara'}
                </p>
              </div>
              <ChevronRight size={16} className="text-text-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
