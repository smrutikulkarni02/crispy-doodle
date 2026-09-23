import { useState } from 'react'
import { ChevronLeft, ChevronRight, Clock, Flame, ShoppingCart, Plus, Sparkles } from 'lucide-react'
import { meals, mealRecipes } from '../data/mockData'

const days = Object.keys(meals)
const mealTypes = ['breakfast', 'lunch', 'dinner']
const mealIcons = { breakfast: '🌅', lunch: '☀️', dinner: '🌙' }
const mealColors = {
  breakfast: 'bg-amber-50 border-amber-200',
  lunch: 'bg-green-50 border-green-200',
  dinner: 'bg-indigo-50 border-indigo-200',
}

export default function MealPlanner() {
  const [selectedDay, setSelectedDay] = useState(0)
  const [expandedMeal, setExpandedMeal] = useState(null)
  const day = days[selectedDay]
  const dayMeals = meals[day]

  return (
    <div className="bg-surface-alt min-h-full">
      <div className="bg-white px-5 pt-12 pb-4 border-b border-border">
        <h1 className="text-2xl font-bold text-text">Meal Planner</h1>
        <p className="text-text-secondary text-sm mt-1">Plan your weekly meals and auto-generate shopping lists</p>
      </div>

      {/* Day Selector */}
      <div className="bg-white px-3 py-3 border-b border-border">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setSelectedDay(d => Math.max(0, d - 1))}
            className="p-1.5 rounded-lg hover:bg-surface-alt"
          >
            <ChevronLeft size={18} className="text-text-muted" />
          </button>
          <div className="flex-1 flex gap-1 overflow-x-auto">
            {days.map((d, i) => (
              <button
                key={d}
                onClick={() => setSelectedDay(i)}
                className={`flex-1 min-w-[44px] py-2 rounded-xl text-xs font-semibold transition-all ${
                  i === selectedDay
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-text-secondary hover:bg-surface-alt'
                }`}
              >
                {d.slice(0, 3)}
              </button>
            ))}
          </div>
          <button
            onClick={() => setSelectedDay(d => Math.min(6, d + 1))}
            className="p-1.5 rounded-lg hover:bg-surface-alt"
          >
            <ChevronRight size={18} className="text-text-muted" />
          </button>
        </div>
      </div>

      {/* Meals for Selected Day */}
      <div className="px-5 py-4 space-y-3">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-bold">{day}</h2>
          <button className="flex items-center gap-1.5 text-primary text-sm font-semibold bg-primary-light px-3 py-1.5 rounded-full">
            <Sparkles size={14} />
            AI Suggest
          </button>
        </div>

        {mealTypes.map(type => {
          const mealName = dayMeals[type]
          const recipe = mealRecipes[mealName]
          const isExpanded = expandedMeal === `${day}-${type}`

          return (
            <div
              key={type}
              className={`border rounded-2xl overflow-hidden transition-all ${mealColors[type]}`}
            >
              <button
                onClick={() => setExpandedMeal(isExpanded ? null : `${day}-${type}`)}
                className="w-full flex items-center gap-3 p-4"
              >
                <div className="text-2xl">{mealIcons[type]}</div>
                <div className="flex-1 text-left">
                  <p className="text-xs text-text-muted capitalize font-medium">{type}</p>
                  <p className="font-semibold text-text">{mealName}</p>
                </div>
                {recipe && (
                  <div className="flex items-center gap-3 text-text-muted">
                    <span className="flex items-center gap-1 text-xs">
                      <Clock size={12} /> {recipe.time}
                    </span>
                    <span className="flex items-center gap-1 text-xs">
                      <Flame size={12} /> {recipe.calories}
                    </span>
                  </div>
                )}
              </button>

              {isExpanded && recipe && (
                <div className="px-4 pb-4 border-t border-white/50">
                  <p className="text-xs font-semibold text-text-secondary mt-3 mb-2">Ingredients</p>
                  <div className="flex flex-wrap gap-1.5">
                    {recipe.ingredients.map(ing => (
                      <span key={ing} className="bg-white text-text-secondary text-xs px-2.5 py-1 rounded-full border font-medium">
                        {ing}
                      </span>
                    ))}
                  </div>
                  <button className="mt-3 flex items-center gap-1.5 text-primary text-sm font-semibold">
                    <ShoppingCart size={14} />
                    Add ingredients to list
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Generate List Button */}
      <div className="px-5 pb-6">
        <button className="w-full bg-primary text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/25 hover:bg-primary-dark transition-colors">
          <ShoppingCart size={18} />
          Generate Shopping List for {day}
        </button>
      </div>

      {/* Weekly Nutrition Summary */}
      <div className="px-5 pb-6">
        <div className="bg-white rounded-2xl p-4 border border-border">
          <h3 className="font-bold text-sm mb-3">Weekly Nutrition Overview</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Avg Calories', value: '1,240', unit: '/day', color: 'text-orange-600' },
              { label: 'Meals Planned', value: '21', unit: '/21', color: 'text-primary' },
              { label: 'Est. Cost', value: '$89', unit: '/week', color: 'text-blue-600' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-[10px] text-text-muted font-medium">{stat.unit}</p>
                <p className="text-[11px] text-text-secondary mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
