import { useState } from 'react'
import { Check, X, Crown, Sparkles, Star, Users, Shield } from 'lucide-react'
import { pricingPlans } from '../data/mockData'

export default function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState('plus')
  const [annual, setAnnual] = useState(false)

  return (
    <div className="bg-surface-alt min-h-full">
      <div className="bg-white px-5 pt-12 pb-6 border-b border-border text-center">
        <div className="w-14 h-14 bg-gradient-to-br from-primary to-teal-400 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
          <Crown size={28} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-text">Choose Your Plan</h1>
        <p className="text-text-secondary text-sm mt-1">Save smarter with premium features</p>

        {/* Annual/Monthly Toggle */}
        <div className="flex items-center justify-center gap-3 mt-4">
          <span className={`text-sm font-medium ${!annual ? 'text-text' : 'text-text-muted'}`}>Monthly</span>
          <button
            onClick={() => setAnnual(!annual)}
            className={`w-12 h-6 rounded-full transition-colors relative ${annual ? 'bg-primary' : 'bg-gray-200'}`}
          >
            <div className={`w-5 h-5 bg-white rounded-full shadow-sm absolute top-0.5 transition-transform ${
              annual ? 'translate-x-6.5' : 'translate-x-0.5'
            }`} />
          </button>
          <span className={`text-sm font-medium ${annual ? 'text-text' : 'text-text-muted'}`}>
            Annual
            <span className="bg-green-100 text-green-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-1">
              Save 20%
            </span>
          </span>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="px-5 py-5 space-y-4">
        {pricingPlans.map(plan => {
          const isSelected = selectedPlan === plan.id
          const monthlyPrice = annual ? (plan.price * 0.8) : plan.price
          const annualPrice = monthlyPrice * 12

          return (
            <button
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`w-full text-left rounded-2xl border-2 overflow-hidden transition-all ${
                isSelected
                  ? 'border-primary shadow-lg shadow-primary/10'
                  : 'border-border hover:border-primary/30'
              } ${plan.popular ? 'relative' : ''}`}
            >
              {plan.popular && (
                <div className="bg-primary text-white text-center py-1.5 text-xs font-bold flex items-center justify-center gap-1">
                  <Star size={12} />
                  MOST POPULAR — Validated by 62% of users
                </div>
              )}

              <div className="bg-white p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold">{plan.name}</h3>
                    <p className="text-text-muted text-xs mt-0.5">{plan.description}</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    isSelected ? 'border-primary bg-primary' : 'border-border'
                  }`}>
                    {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                  </div>
                </div>

                <div className="flex items-end gap-1 mb-4">
                  {plan.price === 0 ? (
                    <span className="text-3xl font-bold text-text">Free</span>
                  ) : (
                    <>
                      <span className="text-3xl font-bold text-text">${monthlyPrice.toFixed(0)}</span>
                      <span className="text-text-muted text-sm mb-1">/month</span>
                    </>
                  )}
                  {annual && plan.price > 0 && (
                    <span className="text-xs text-text-muted ml-2 mb-1">
                      (${annualPrice.toFixed(0)}/yr)
                    </span>
                  )}
                </div>

                <div className="space-y-2.5">
                  {plan.features.map(feature => (
                    <div key={feature} className="flex items-start gap-2.5">
                      <div className="w-5 h-5 bg-primary-light rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check size={12} className="text-primary" />
                      </div>
                      <span className="text-sm text-text">{feature}</span>
                    </div>
                  ))}
                  {plan.notIncluded.map(feature => (
                    <div key={feature} className="flex items-start gap-2.5 opacity-40">
                      <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <X size={12} className="text-gray-400" />
                      </div>
                      <span className="text-sm text-text-muted">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* CTA */}
      <div className="px-5 pb-4">
        <button className="w-full bg-primary text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-primary/25 flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors">
          <Sparkles size={18} />
          {selectedPlan === 'free' ? 'Get Started Free' : `Start ${pricingPlans.find(p => p.id === selectedPlan)?.name} Plan`}
        </button>
        <p className="text-center text-text-muted text-xs mt-3">
          Cancel anytime. No hidden fees.
        </p>
      </div>

      {/* Trust Badges */}
      <div className="px-5 pb-6">
        <div className="flex justify-center gap-6">
          {[
            { icon: Shield, label: 'Secure' },
            { icon: Users, label: '10K+ Users' },
            { icon: Star, label: '4.8 Rating' },
          ].map(badge => (
            <div key={badge.label} className="flex flex-col items-center gap-1">
              <badge.icon size={18} className="text-text-muted" />
              <span className="text-[10px] text-text-muted font-medium">{badge.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Data Validation Note */}
      <div className="px-5 pb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <p className="text-blue-800 text-xs leading-relaxed">
            <span className="font-semibold">Pricing validated by real data:</span> Our $5/month plan was confirmed by 62% of willing payers across 83 customer interviews.
            The $10/month Pro tier was identified by 9 respondents who manage multiple stores weekly.
          </p>
        </div>
      </div>
    </div>
  )
}
