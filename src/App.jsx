import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import MealPlanner from './pages/MealPlanner'
import ShoppingLists from './pages/ShoppingLists'
import PriceCompare from './pages/PriceCompare'
import StoreNavigator from './pages/StoreNavigator'
import Deals from './pages/Deals'
import SpendingTracker from './pages/SpendingTracker'
import SmartReplenishment from './pages/SmartReplenishment'
import Profile from './pages/Profile'
import Pricing from './pages/Pricing'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/meals" element={<MealPlanner />} />
        <Route path="/lists" element={<ShoppingLists />} />
        <Route path="/compare" element={<PriceCompare />} />
        <Route path="/navigate" element={<StoreNavigator />} />
        <Route path="/deals" element={<Deals />} />
        <Route path="/spending" element={<SpendingTracker />} />
        <Route path="/replenish" element={<SmartReplenishment />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/pricing" element={<Pricing />} />
      </Route>
    </Routes>
  )
}
