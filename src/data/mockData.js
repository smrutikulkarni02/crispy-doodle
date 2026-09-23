export const stores = [
  { id: 1, name: 'Walmart', logo: '🏪', color: '#0071dc' },
  { id: 2, name: 'Publix', logo: '🟢', color: '#3b8132' },
  { id: 3, name: 'Aldi', logo: '🅰️', color: '#00005f' },
  { id: 4, name: 'Costco', logo: '🏬', color: '#e31837' },
  { id: 5, name: 'Target', logo: '🎯', color: '#cc0000' },
]

export const categories = [
  { id: 1, name: 'Fruits & Vegetables', icon: '🥬', color: '#16a34a' },
  { id: 2, name: 'Dairy & Eggs', icon: '🥛', color: '#0284c7' },
  { id: 3, name: 'Meat & Seafood', icon: '🥩', color: '#dc2626' },
  { id: 4, name: 'Bakery', icon: '🍞', color: '#d97706' },
  { id: 5, name: 'Pantry', icon: '🥫', color: '#7c3aed' },
  { id: 6, name: 'Frozen', icon: '🧊', color: '#0891b2' },
  { id: 7, name: 'Snacks', icon: '🍿', color: '#ea580c' },
  { id: 8, name: 'Beverages', icon: '🥤', color: '#2563eb' },
]

export const groceryItems = [
  { id: 1, name: 'Organic Bananas', category: 1, unit: 'bunch', prices: { 1: 1.29, 2: 1.49, 3: 0.99, 4: 1.19, 5: 1.39 }, aisle: 'Produce', inStock: { 1: true, 2: true, 3: true, 4: true, 5: true } },
  { id: 2, name: 'Whole Milk (1 gal)', category: 2, unit: 'gal', prices: { 1: 3.48, 2: 4.29, 3: 2.99, 4: 3.69, 5: 3.89 }, aisle: 'Dairy - Aisle 7', inStock: { 1: true, 2: true, 3: true, 4: true, 5: false } },
  { id: 3, name: 'Chicken Breast (1 lb)', category: 3, unit: 'lb', prices: { 1: 3.97, 2: 5.49, 3: 3.49, 4: 3.29, 5: 4.99 }, aisle: 'Meat - Aisle 2', inStock: { 1: true, 2: true, 3: false, 4: true, 5: true } },
  { id: 4, name: 'Whole Wheat Bread', category: 4, unit: 'loaf', prices: { 1: 2.98, 2: 3.79, 3: 1.89, 4: 3.49, 5: 3.29 }, aisle: 'Bakery - Aisle 4', inStock: { 1: true, 2: true, 3: true, 4: true, 5: true } },
  { id: 5, name: 'Large Eggs (12 ct)', category: 2, unit: 'dozen', prices: { 1: 3.24, 2: 3.99, 3: 2.69, 4: 4.49, 5: 3.49 }, aisle: 'Dairy - Aisle 7', inStock: { 1: true, 2: true, 3: true, 4: true, 5: true } },
  { id: 6, name: 'Baby Spinach (5 oz)', category: 1, unit: 'bag', prices: { 1: 2.97, 2: 3.49, 3: 1.99, 4: 3.99, 5: 3.19 }, aisle: 'Produce', inStock: { 1: true, 2: false, 3: true, 4: true, 5: true } },
  { id: 7, name: 'Pasta (16 oz)', category: 5, unit: 'box', prices: { 1: 1.28, 2: 1.79, 3: 0.95, 4: 1.49, 5: 1.69 }, aisle: 'Pantry - Aisle 5', inStock: { 1: true, 2: true, 3: true, 4: true, 5: true } },
  { id: 8, name: 'Pasta Sauce (24 oz)', category: 5, unit: 'jar', prices: { 1: 2.47, 2: 3.29, 3: 1.89, 4: 2.99, 5: 2.79 }, aisle: 'Pantry - Aisle 5', inStock: { 1: true, 2: true, 3: true, 4: true, 5: true } },
  { id: 9, name: 'Greek Yogurt (32 oz)', category: 2, unit: 'tub', prices: { 1: 4.97, 2: 5.49, 3: 3.99, 4: 5.99, 5: 5.29 }, aisle: 'Dairy - Aisle 7', inStock: { 1: true, 2: true, 3: true, 4: true, 5: true } },
  { id: 10, name: 'Frozen Broccoli (12 oz)', category: 6, unit: 'bag', prices: { 1: 1.48, 2: 1.99, 3: 1.19, 4: 1.79, 5: 1.89 }, aisle: 'Frozen - Aisle 10', inStock: { 1: true, 2: true, 3: true, 4: false, 5: true } },
  { id: 11, name: 'Brown Rice (2 lb)', category: 5, unit: 'bag', prices: { 1: 2.48, 2: 3.19, 3: 2.09, 4: 3.49, 5: 2.99 }, aisle: 'Pantry - Aisle 5', inStock: { 1: true, 2: true, 3: true, 4: true, 5: true } },
  { id: 12, name: 'Cheddar Cheese (8 oz)', category: 2, unit: 'block', prices: { 1: 3.24, 2: 4.19, 3: 2.49, 4: 6.99, 5: 3.79 }, aisle: 'Dairy - Aisle 7', inStock: { 1: true, 2: true, 3: true, 4: true, 5: true } },
  { id: 13, name: 'Orange Juice (52 oz)', category: 8, unit: 'bottle', prices: { 1: 3.98, 2: 4.49, 3: 2.99, 4: 4.99, 5: 4.29 }, aisle: 'Beverages - Aisle 8', inStock: { 1: true, 2: true, 3: true, 4: true, 5: true } },
  { id: 14, name: 'Tortilla Chips', category: 7, unit: 'bag', prices: { 1: 3.48, 2: 3.99, 3: 2.29, 4: 4.49, 5: 3.79 }, aisle: 'Snacks - Aisle 6', inStock: { 1: true, 2: true, 3: true, 4: true, 5: true } },
  { id: 15, name: 'Ground Beef (1 lb)', category: 3, unit: 'lb', prices: { 1: 5.47, 2: 6.99, 3: 4.99, 4: 5.49, 5: 6.29 }, aisle: 'Meat - Aisle 2', inStock: { 1: true, 2: true, 3: true, 4: true, 5: true } },
  { id: 16, name: 'Avocados (each)', category: 1, unit: 'each', prices: { 1: 0.98, 2: 1.49, 3: 0.79, 4: 1.29, 5: 1.19 }, aisle: 'Produce', inStock: { 1: true, 2: true, 3: true, 4: true, 5: true } },
  { id: 17, name: 'Salmon Fillet (1 lb)', category: 3, unit: 'lb', prices: { 1: 8.97, 2: 10.99, 3: 7.99, 4: 9.99, 5: 9.49 }, aisle: 'Seafood - Aisle 2', inStock: { 1: true, 2: true, 3: false, 4: true, 5: true } },
  { id: 18, name: 'Almond Butter', category: 5, unit: 'jar', prices: { 1: 5.97, 2: 7.49, 3: 4.99, 4: 8.99, 5: 6.79 }, aisle: 'Pantry - Aisle 5', inStock: { 1: true, 2: true, 3: true, 4: true, 5: true } },
]

export const deals = [
  { id: 1, store: 'Walmart', item: 'Chicken Breast Family Pack', discount: '30% OFF', originalPrice: 12.97, salePrice: 9.08, expires: '2 days', tag: 'Weekly Deal' },
  { id: 2, store: 'Publix', item: 'Buy 1 Get 1: Pasta Sauce', discount: 'BOGO', originalPrice: 3.29, salePrice: 1.65, expires: '4 days', tag: 'BOGO' },
  { id: 3, store: 'Aldi', item: 'Organic Strawberries', discount: '$1 OFF', originalPrice: 3.49, salePrice: 2.49, expires: '3 days', tag: 'Fresh Deal' },
  { id: 4, store: 'Costco', item: 'Kirkland Olive Oil 2L', discount: '$4 OFF', originalPrice: 16.99, salePrice: 12.99, expires: '5 days', tag: 'Member Deal' },
  { id: 5, store: 'Target', item: 'Oatmeal Variety Pack', discount: '20% OFF', originalPrice: 6.99, salePrice: 5.59, expires: '1 day', tag: 'Circle Deal' },
  { id: 6, store: 'Publix', item: 'Deli Turkey (1 lb)', discount: '$2 OFF', originalPrice: 8.99, salePrice: 6.99, expires: '3 days', tag: 'Deli Special' },
]

export const meals = {
  Monday: { breakfast: 'Oatmeal with Berries', lunch: 'Grilled Chicken Salad', dinner: 'Pasta with Marinara' },
  Tuesday: { breakfast: 'Greek Yogurt Parfait', lunch: 'Turkey Sandwich', dinner: 'Salmon with Rice' },
  Wednesday: { breakfast: 'Avocado Toast', lunch: 'Chicken Wrap', dinner: 'Beef Stir Fry' },
  Thursday: { breakfast: 'Smoothie Bowl', lunch: 'Quinoa Bowl', dinner: 'Baked Chicken Thighs' },
  Friday: { breakfast: 'Eggs & Toast', lunch: 'Soup & Salad', dinner: 'Homemade Pizza' },
  Saturday: { breakfast: 'Pancakes', lunch: 'Fish Tacos', dinner: 'Grilled Steak' },
  Sunday: { breakfast: 'French Toast', lunch: 'Leftovers', dinner: 'Slow Cooker Chili' },
}

export const mealRecipes = {
  'Oatmeal with Berries': { time: '10 min', calories: 290, ingredients: ['Oats', 'Blueberries', 'Banana', 'Honey', 'Almond Milk'] },
  'Grilled Chicken Salad': { time: '20 min', calories: 380, ingredients: ['Chicken Breast', 'Baby Spinach', 'Tomatoes', 'Cucumber', 'Olive Oil'] },
  'Pasta with Marinara': { time: '25 min', calories: 520, ingredients: ['Pasta', 'Pasta Sauce', 'Garlic', 'Parmesan', 'Basil'] },
  'Greek Yogurt Parfait': { time: '5 min', calories: 250, ingredients: ['Greek Yogurt', 'Granola', 'Strawberries', 'Honey'] },
  'Turkey Sandwich': { time: '10 min', calories: 420, ingredients: ['Whole Wheat Bread', 'Deli Turkey', 'Lettuce', 'Tomato', 'Mustard'] },
  'Salmon with Rice': { time: '30 min', calories: 560, ingredients: ['Salmon Fillet', 'Brown Rice', 'Broccoli', 'Lemon', 'Soy Sauce'] },
  'Avocado Toast': { time: '10 min', calories: 320, ingredients: ['Whole Wheat Bread', 'Avocados', 'Large Eggs', 'Salt', 'Red Pepper Flakes'] },
  'Chicken Wrap': { time: '15 min', calories: 450, ingredients: ['Chicken Breast', 'Tortilla', 'Lettuce', 'Cheddar Cheese', 'Ranch'] },
  'Beef Stir Fry': { time: '25 min', calories: 580, ingredients: ['Ground Beef', 'Brown Rice', 'Bell Pepper', 'Soy Sauce', 'Garlic'] },
}

export const spendingHistory = [
  { week: 'Week 1', amount: 127.45, budget: 150 },
  { week: 'Week 2', amount: 98.30, budget: 150 },
  { week: 'Week 3', amount: 142.80, budget: 150 },
  { week: 'Week 4', amount: 115.60, budget: 150 },
  { week: 'Week 5', amount: 89.25, budget: 150 },
  { week: 'Week 6', amount: 134.90, budget: 150 },
  { week: 'Week 7', amount: 108.75, budget: 150 },
  { week: 'Week 8', amount: 121.40, budget: 150 },
]

export const spendingByCategory = [
  { name: 'Produce', value: 28, color: '#16a34a' },
  { name: 'Dairy', value: 18, color: '#0284c7' },
  { name: 'Meat', value: 24, color: '#dc2626' },
  { name: 'Pantry', value: 15, color: '#7c3aed' },
  { name: 'Snacks', value: 8, color: '#ea580c' },
  { name: 'Beverages', value: 7, color: '#2563eb' },
]

export const storeMap = {
  aisles: [
    { id: 'produce', name: 'Produce', position: { x: 0, y: 0 }, items: ['Bananas', 'Spinach', 'Avocados', 'Tomatoes', 'Berries'] },
    { id: 'aisle-1', name: 'Aisle 1 - Bread & Bakery', position: { x: 1, y: 0 }, items: ['Whole Wheat Bread', 'Bagels', 'Muffins'] },
    { id: 'aisle-2', name: 'Aisle 2 - Meat & Seafood', position: { x: 2, y: 0 }, items: ['Chicken Breast', 'Ground Beef', 'Salmon'] },
    { id: 'aisle-3', name: 'Aisle 3 - Frozen Foods', position: { x: 0, y: 1 }, items: ['Frozen Broccoli', 'Frozen Pizza', 'Ice Cream'] },
    { id: 'aisle-4', name: 'Aisle 4 - Snacks & Beverages', position: { x: 1, y: 1 }, items: ['Tortilla Chips', 'Orange Juice', 'Soda'] },
    { id: 'aisle-5', name: 'Aisle 5 - Pantry & Pasta', position: { x: 2, y: 1 }, items: ['Pasta', 'Pasta Sauce', 'Rice', 'Almond Butter'] },
    { id: 'aisle-6', name: 'Aisle 6 - Dairy', position: { x: 0, y: 2 }, items: ['Milk', 'Eggs', 'Cheese', 'Yogurt'] },
    { id: 'checkout', name: 'Checkout', position: { x: 2, y: 2 }, items: [] },
  ],
}

export const replenishmentSuggestions = [
  { item: 'Whole Milk (1 gal)', lastBought: '7 days ago', frequency: 'Weekly', confidence: 95 },
  { item: 'Large Eggs (12 ct)', lastBought: '6 days ago', frequency: 'Weekly', confidence: 92 },
  { item: 'Organic Bananas', lastBought: '5 days ago', frequency: 'Weekly', confidence: 88 },
  { item: 'Whole Wheat Bread', lastBought: '8 days ago', frequency: 'Weekly', confidence: 85 },
  { item: 'Baby Spinach (5 oz)', lastBought: '6 days ago', frequency: 'Weekly', confidence: 82 },
  { item: 'Chicken Breast (1 lb)', lastBought: '10 days ago', frequency: 'Bi-weekly', confidence: 78 },
  { item: 'Greek Yogurt (32 oz)', lastBought: '12 days ago', frequency: 'Bi-weekly', confidence: 75 },
  { item: 'Pasta (16 oz)', lastBought: '18 days ago', frequency: 'Monthly', confidence: 65 },
]

export const pricingPlans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    description: 'Get started with basic grocery planning',
    features: [
      'Basic shopping lists',
      'Manual meal planning',
      'Price comparison (3 stores)',
      'Weekly deal alerts',
      'Basic spending tracking',
    ],
    notIncluded: [
      'Smart replenishment',
      'Multi-store cart',
      'In-store navigation',
      'WIC/EBT support',
      'Advanced analytics',
    ],
  },
  {
    id: 'plus',
    name: 'Plus',
    price: 5,
    description: 'For smart shoppers who want to save more',
    popular: true,
    features: [
      'Everything in Free',
      'Unlimited store comparisons',
      'Smart replenishment suggestions',
      'In-store navigation & aisle maps',
      'Advanced spending analytics',
      'Meal plan auto-list generation',
      'Real-time stock alerts',
      'Priority customer support',
    ],
    notIncluded: [
      'Multi-store cart consolidation',
      'WIC/EBT integration',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 10,
    description: 'For power shoppers managing multiple stores',
    features: [
      'Everything in Plus',
      'Multi-store cart consolidation',
      'WIC/EBT benefit integration',
      'Unified checkout across stores',
      'Family sharing (up to 5)',
      'Nutrition & diet optimization',
      'Curbside pickup integration',
      'Exclusive member deals',
    ],
    notIncluded: [],
  },
]
