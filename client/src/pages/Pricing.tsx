import NeonCard from '@/components/NeonCard'
import Section from '@/components/Section'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

type PricingTier = {
  _id?: string
  name: string
  description?: string
  price: number
  currency: string
  billingPeriod: 'monthly' | 'yearly' | 'one-time' | 'custom'
  features: Array<{
    text: string
    included: boolean
    highlight?: boolean
  }>
  popular?: boolean
  featured?: boolean
  color?: string
  icon?: string
  buttonText?: string
  buttonLink?: string
  limitations?: string[]
  addOns?: Array<{
    name: string
    price: number
    description: string
  }>
}

export default function Pricing() {
  const [tiers, setTiers] = useState<PricingTier[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTier, setSelectedTier] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch('/api/pricing')
        if (r.ok) {
          const data = await r.json()
          setTiers(data)
        }
      } catch (error) {
        console.error('Failed to load pricing:', error)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  if (loading) {
    return (
      <main>
        <Section title="Pricing">
          <div className="text-center py-8 text-white/60">Loading pricing plans...</div>
        </Section>
      </main>
    )
  }

  return (
    <main>
      <Section title="Choose Your Plan" className="pb-16">
        <div className="text-center mb-8">
          <p className="text-white/70 max-w-2xl mx-auto">
            Select the perfect plan for your needs. All plans include our core features with flexible options to scale.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier._id || tier.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={`relative ${tier.popular ? 'md:scale-105' : ''}`}
            >
              {/* Popular Badge */}
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="px-4 py-1 rounded-full bg-prism-gradient text-black font-semibold text-sm shadow-neon">
                    Most Popular
                  </div>
                </div>
              )}

              {/* Featured Badge */}
              {tier.featured && (
                <div className="absolute -top-3 right-4 z-10">
                  <div className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400 text-purple-400 text-xs">
                    Featured
                  </div>
                </div>
              )}

              <NeonCard 
                className={`h-full ${tier.popular ? 'border-2' : ''}`}
                style={tier.popular ? { borderColor: tier.color || '#8b5cf6' } : {}}
              >
                <div className="p-6 h-full flex flex-col">
                  {/* Header */}
                  <div className="text-center mb-6">
                    <div className="flex items-center justify-center gap-3 mb-3">
                      {tier.icon && <span className="text-3xl">{tier.icon}</span>}
                      <h3 className="text-2xl font-bold">{tier.name}</h3>
                    </div>
                    
                    {tier.description && (
                      <p className="text-white/70 text-sm mb-4">{tier.description}</p>
                    )}

                    <div className="mb-4">
                      {tier.billingPeriod === 'custom' ? (
                        <div>
                          <div 
                            className="text-2xl font-semibold"
                            style={{ color: tier.color || '#8b5cf6' }}
                          >
                            Custom Pricing
                          </div>
                          <div className="text-sm text-white/60">Tailored to your needs</div>
                        </div>
                      ) : (
                        <div>
                          <div 
                            className="text-4xl font-bold font-orbitron"
                            style={{ color: tier.color || '#8b5cf6' }}
                          >
                            {tier.currency} {tier.price}
                          </div>
                          <div className="text-sm text-white/60 capitalize">
                            {tier.billingPeriod === 'monthly' ? 'per month' : 
                             tier.billingPeriod === 'yearly' ? 'per year' :
                             tier.billingPeriod === 'one-time' ? 'one-time payment' :
                             'custom billing'}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex-1 space-y-3 mb-6">
                    <h4 className="font-semibold text-white/90">What's included:</h4>
                    <ul className="space-y-2">
                      {tier.features?.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <span className={`mt-0.5 ${feature.included ? 'text-green-400' : 'text-red-400'}`}>
                            {feature.included ? '✓' : '✗'}
                          </span>
                          <span className={`${feature.highlight ? 'text-yellow-400 font-medium' : 'text-white/80'}`}>
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Limitations */}
                  {tier.limitations && tier.limitations.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-semibold text-orange-400 mb-2">Limitations:</h4>
                      <ul className="space-y-1">
                        {tier.limitations.map((limitation, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-orange-300">
                            <span>⚠️</span>
                            <span>{limitation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Add-ons */}
                  {tier.addOns && tier.addOns.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-semibold text-green-400 mb-2">Available Add-ons:</h4>
                      <ul className="space-y-1">
                        {tier.addOns.map((addOn, i) => (
                          <li key={i} className="flex items-center justify-between text-sm text-green-300">
                            <span>➕ {addOn.name}</span>
                            <span className="font-medium">{tier.currency} {addOn.price}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* CTA Button */}
                  <div className="mt-auto">
                    {tier.buttonLink ? (
                      <a
                        href={tier.buttonLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full px-4 py-3 rounded-lg font-semibold text-center transition-all duration-300 hover:scale-105"
                        style={{
                          background: tier.popular 
                            ? 'linear-gradient(135deg, #8b5cf6, #22d3ee, #34d399, #fde047, #f472b6)'
                            : `linear-gradient(135deg, ${tier.color || '#8b5cf6'}, ${tier.color || '#8b5cf6'}dd)`,
                          color: tier.popular ? '#000' : '#fff',
                          boxShadow: tier.popular ? '0 0 20px rgba(139, 92, 246, 0.5)' : 'none'
                        }}
                      >
                        {tier.buttonText || 'Get Started'}
                      </a>
                    ) : (
                      <button
                        onClick={() => setSelectedTier(selectedTier === tier._id ? null : tier._id || tier.name)}
                        className="w-full px-4 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                        style={{
                          background: tier.popular 
                            ? 'linear-gradient(135deg, #8b5cf6, #22d3ee, #34d399, #fde047, #f472b6)'
                            : `linear-gradient(135deg, ${tier.color || '#8b5cf6'}, ${tier.color || '#8b5cf6'}dd)`,
                          color: tier.popular ? '#000' : '#fff',
                          boxShadow: tier.popular ? '0 0 20px rgba(139, 92, 246, 0.5)' : 'none'
                        }}
                      >
                        {tier.buttonText || 'Get Started'}
                      </button>
                    )}
                  </div>
                </div>
              </NeonCard>
            </motion.div>
          ))}
        </div>

        {tiers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-white/60 text-lg mb-4">No pricing plans available</div>
            <p className="text-white/40 text-sm">
              Pricing plans are being configured. Please check back later.
            </p>
          </div>
        )}

        {/* Contact Section */}
        <div className="mt-16 text-center">
          <div className="glass-dark rounded-xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Need a Custom Solution?</h3>
            <p className="text-white/70 mb-6">
              We offer tailored pricing for enterprise clients and custom projects. 
              Get in touch to discuss your specific requirements.
            </p>
            <a
              href="/contact"
              className="inline-block px-6 py-3 rounded-lg bg-prism-gradient text-black font-semibold hover:opacity-90 transition-opacity"
            >
              Contact Us
            </a>
          </div>
        </div>
      </Section>
    </main>
  )
}