import { NavLink, Outlet } from 'react-router-dom'
import { Home, UtensilsCrossed, ShoppingCart, BarChart3, User } from 'lucide-react'

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/meals', icon: UtensilsCrossed, label: 'Meals' },
  { to: '/lists', icon: ShoppingCart, label: 'Lists' },
  { to: '/spending', icon: BarChart3, label: 'Spending' },
  { to: '/profile', icon: User, label: 'Profile' },
]

export default function Layout() {
  return (
    <div className="max-w-md mx-auto bg-white min-h-dvh relative flex flex-col shadow-xl">
      <div className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </div>
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-border z-50">
        <div className="flex justify-around items-center h-16 px-2">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
                  isActive
                    ? 'text-primary'
                    : 'text-text-muted hover:text-text-secondary'
                }`
              }
            >
              <Icon size={22} strokeWidth={isActive => isActive ? 2.5 : 1.5} />
              <span className="text-[11px] font-medium">{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
