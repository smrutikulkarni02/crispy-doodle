import { useState } from 'react'
import { BarChart3, TrendingDown, TrendingUp, DollarSign, Target, Calendar } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Tooltip, CartesianGrid, Legend } from 'recharts'
import { spendingHistory, spendingByCategory } from '../data/mockData'

const monthlySpending = [
  { month: 'Apr', amount: 498 },
  { month: 'May', amount: 534 },
  { month: 'Jun', amount: 467 },
  { month: 'Jul', amount: 512 },
  { month: 'Aug', amount: 489 },
  { month: 'Sep', amount: 445 },
]

export default function SpendingTracker() {
  const [timeRange, setTimeRange] = useState('weekly')
  const [budget, setBudget] = useState(150)

  const totalSpent = spendingHistory.reduce((sum, w) => sum + w.amount, 0)
  const avgWeekly = totalSpent / spendingHistory.length
  const totalBudget = budget * spendingHistory.length
  const totalSaved = totalBudget - totalSpent
  const weeklyChange = ((spendingHistory[spendingHistory.length - 1].amount - spendingHistory[spendingHistory.length - 2].amount) / spendingHistory[spendingHistory.length - 2].amount * 100)

  return (
    <div className="bg-surface-alt min-h-full">
      <div className="bg-white px-5 pt-12 pb-4 border-b border-border">
        <h1 className="text-2xl font-bold text-text">Spending Tracker</h1>
        <p className="text-text-secondary text-sm mt-1">Track and optimize your grocery spending</p>
      </div>

      {/* Summary Cards */}
      <div className="px-5 py-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl p-4 border border-border shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-primary-light rounded-lg flex items-center justify-center">
                <DollarSign size={16} className="text-primary" />
              </div>
            </div>
            <p className="text-2xl font-bold text-text">${avgWeekly.toFixed(0)}</p>
            <p className="text-xs text-text-muted mt-0.5">Avg. Weekly Spend</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-border shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingDown size={16} className="text-green-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-green-600">${totalSaved.toFixed(0)}</p>
            <p className="text-xs text-text-muted mt-0.5">Total Saved</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-border shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Target size={16} className="text-blue-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-text">${budget}</p>
            <p className="text-xs text-text-muted mt-0.5">Weekly Budget</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-border shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${weeklyChange > 0 ? 'bg-red-100' : 'bg-green-100'}`}>
                {weeklyChange > 0 ? <TrendingUp size={16} className="text-red-600" /> : <TrendingDown size={16} className="text-green-600" />}
              </div>
            </div>
            <p className={`text-2xl font-bold ${weeklyChange > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {weeklyChange > 0 ? '+' : ''}{weeklyChange.toFixed(1)}%
            </p>
            <p className="text-xs text-text-muted mt-0.5">vs Last Week</p>
          </div>
        </div>
      </div>

      {/* Weekly Spending Chart */}
      <div className="px-5 mb-4">
        <div className="bg-white rounded-2xl p-4 border border-border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-sm">Weekly Spending</h2>
            <div className="flex bg-surface-alt rounded-lg p-0.5">
              {['weekly', 'monthly'].map(range => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 rounded-md text-xs font-semibold capitalize transition-colors ${
                    timeRange === range ? 'bg-white text-text shadow-sm' : 'text-text-muted'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              {timeRange === 'weekly' ? (
                <BarChart data={spendingHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                    formatter={(value) => [`$${value}`, 'Spent']}
                  />
                  <Bar dataKey="amount" fill="#059669" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="budget" fill="#e2e8f0" radius={[6, 6, 0, 0]} />
                </BarChart>
              ) : (
                <LineChart data={monthlySpending}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                    formatter={(value) => [`$${value}`, 'Total']}
                  />
                  <Line type="monotone" dataKey="amount" stroke="#059669" strokeWidth={2.5} dot={{ fill: '#059669', r: 4 }} />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Spending by Category */}
      <div className="px-5 mb-4">
        <div className="bg-white rounded-2xl p-4 border border-border shadow-sm">
          <h2 className="font-bold text-sm mb-4">Spending by Category</h2>
          <div className="flex items-center gap-4">
            <div className="w-32 h-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={spendingByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={55}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {spendingByCategory.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2">
              {spendingByCategory.map(cat => (
                <div key={cat.name} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-xs text-text-secondary flex-1">{cat.name}</span>
                  <span className="text-xs font-semibold">{cat.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Budget Adjustment */}
      <div className="px-5 pb-6">
        <div className="bg-white rounded-2xl p-4 border border-border shadow-sm">
          <h2 className="font-bold text-sm mb-3">Adjust Weekly Budget</h2>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="50"
              max="300"
              step="10"
              value={budget}
              onChange={e => setBudget(Number(e.target.value))}
              className="flex-1 accent-primary"
            />
            <span className="font-bold text-primary min-w-[60px] text-right">${budget}/wk</span>
          </div>
          <p className="text-xs text-text-muted mt-2">
            Monthly estimate: <span className="font-semibold text-text">${(budget * 4.33).toFixed(0)}</span>
          </p>
        </div>
      </div>

      {/* Insights */}
      <div className="px-5 pb-6">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4">
          <h3 className="font-semibold text-sm text-blue-900 mb-2">Spending Insights</h3>
          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-xs text-blue-800">
              <span className="mt-0.5">💡</span>
              <span>Your produce spending is 15% above average. Consider shopping at Aldi for produce to save ~$8/week.</span>
            </li>
            <li className="flex items-start gap-2 text-xs text-blue-800">
              <span className="mt-0.5">📉</span>
              <span>Great job! You've reduced snack spending by 22% over the past month.</span>
            </li>
            <li className="flex items-start gap-2 text-xs text-blue-800">
              <span className="mt-0.5">🎯</span>
              <span>You've stayed under budget 6 out of the last 8 weeks. Keep it up!</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
