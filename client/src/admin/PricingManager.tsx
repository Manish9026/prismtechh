import { useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import { apiFetch } from './api'

type PricingTier = {
  _id: string
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
  order?: number
}

const CURRENCIES = ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD']
const BILLING_PERIODS = ['monthly', 'yearly', 'one-time', 'custom']
const COLORS = [
  '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899',
  '#06b6d4', '#84cc16', '#f97316', '#6366f1', '#14b8a6', '#a855f7'
]
const ICONS = ['💼', '🚀', '⭐', '💎', '🔥', '🎯', '⚡', '🌟', '💫', '🎨', '🛡️', '🔧']

export default function PricingManager() {
  const { token } = useAuth()
  const [items, setItems] = useState<PricingTier[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // Form state
  const [form, setForm] = useState<Partial<PricingTier>>({
    name: '',
    description: '',
    price: 0,
    currency: 'USD',
    billingPeriod: 'monthly',
    features: [],
    popular: false,
    featured: false,
    color: '#8b5cf6',
    icon: '💼',
    buttonText: 'Get Started',
    buttonLink: '',
    limitations: [],
    addOns: [],
    order: 0
  })
  
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newFeature, setNewFeature] = useState('')
  const [newLimitation, setNewLimitation] = useState('')
  const [newAddOn, setNewAddOn] = useState({ name: '', price: 0, description: '' })

  async function load() {
    setLoading(true)
    try {
      const data = await apiFetch<PricingTier[]>('/pricing')
      setItems(data)
    } catch (e: any) {
      setError(e.message || 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    try {
      if (!form.name || form.name.trim().length < 2) {
        setError('Name must be at least 2 characters')
        return
      }
      if (form.price < 0) {
        setError('Price must be non-negative')
        return
      }
      
      if (editingId) {
        await apiFetch(`/pricing/${editingId}`, { 
          method: 'PUT', 
          token: token || undefined, 
          body: form 
        })
        setSuccess('Pricing tier updated successfully!')
      } else {
        await apiFetch('/pricing', { 
          method: 'POST', 
          token: token || undefined, 
          body: form 
        })
        setSuccess('Pricing tier created successfully!')
      }
      
      resetForm()
      await load()
      setTimeout(() => setSuccess(''), 3000)
    } catch (e: any) {
      setError(e.message || 'Save failed')
    }
  }

  function resetForm() {
    setForm({
      name: '',
      description: '',
      price: 0,
      currency: 'USD',
      billingPeriod: 'monthly',
      features: [],
      popular: false,
      featured: false,
      color: '#8b5cf6',
      icon: '💼',
      buttonText: 'Get Started',
      buttonLink: '',
      limitations: [],
      addOns: [],
      order: 0
    })
    setEditingId(null)
    setNewFeature('')
    setNewLimitation('')
    setNewAddOn({ name: '', price: 0, description: '' })
  }

  function edit(tier: PricingTier) {
    setEditingId(tier._id)
    setForm({
      name: tier.name,
      description: tier.description,
      price: tier.price,
      currency: tier.currency,
      billingPeriod: tier.billingPeriod,
      features: tier.features || [],
      popular: tier.popular,
      featured: tier.featured,
      color: tier.color,
      icon: tier.icon,
      buttonText: tier.buttonText,
      buttonLink: tier.buttonLink,
      limitations: tier.limitations || [],
      addOns: tier.addOns || [],
      order: tier.order
    })
  }

  async function remove(id: string) {
    if (!confirm('Delete this pricing tier?')) return
    try {
      await apiFetch(`/pricing/${id}`, { method: 'DELETE', token: token || undefined })
      setSuccess('Pricing tier deleted successfully!')
      await load()
    } catch (e: any) {
      setError(e.message || 'Delete failed')
    }
  }

  function addFeature() {
    if (!newFeature.trim()) return
    setForm(f => ({
      ...f,
      features: [...(f.features || []), { text: newFeature.trim(), included: true, highlight: false }]
    }))
    setNewFeature('')
  }

  function removeFeature(index: number) {
    setForm(f => ({
      ...f,
      features: f.features?.filter((_, i) => i !== index) || []
    }))
  }

  function toggleFeatureIncluded(index: number) {
    setForm(f => ({
      ...f,
      features: f.features?.map((feature, i) => 
        i === index ? { ...feature, included: !feature.included } : feature
      ) || []
    }))
  }

  function toggleFeatureHighlight(index: number) {
    setForm(f => ({
      ...f,
      features: f.features?.map((feature, i) => 
        i === index ? { ...feature, highlight: !feature.highlight } : feature
      ) || []
    }))
  }

  function addLimitation() {
    if (!newLimitation.trim()) return
    setForm(f => ({
      ...f,
      limitations: [...(f.limitations || []), newLimitation.trim()]
    }))
    setNewLimitation('')
  }

  function removeLimitation(index: number) {
    setForm(f => ({
      ...f,
      limitations: f.limitations?.filter((_, i) => i !== index) || []
    }))
  }

  function addAddOn() {
    if (!newAddOn.name.trim() || newAddOn.price < 0) return
    setForm(f => ({
      ...f,
      addOns: [...(f.addOns || []), { ...newAddOn, name: newAddOn.name.trim() }]
    }))
    setNewAddOn({ name: '', price: 0, description: '' })
  }

  function removeAddOn(index: number) {
    setForm(f => ({
      ...f,
      addOns: f.addOns?.filter((_, i) => i !== index) || []
    }))
  }

  function move(id: string, dir: number) {
    setItems(prev => reorder(prev, id, dir))
  }

  async function saveOrder() {
    try {
      const body = items.map((tier, idx) => ({ id: tier._id, order: idx }))
      await apiFetch('/pricing/reorder/bulk', { 
        method: 'PUT', 
        token: token || undefined, 
        body 
      })
      setSuccess('Pricing order saved successfully!')
    } catch (e: any) {
      setError(e.message || 'Save order failed')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-orbitron">Pricing Manager</h1>
        <div className="flex items-center gap-2 text-sm text-white/60">
          <span>Total: {items.length}</span>
          <span>•</span>
          <span>Featured: {items.filter(t => t.featured).length}</span>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="p-3 rounded-lg bg-green-500/20 border border-green-500/30 text-green-400">
          {success}
        </div>
      )}
      {error && (
        <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400">
          {error}
        </div>
      )}

      {/* Pricing Form */}
      <form onSubmit={save} className="glass-dark rounded-xl p-6 space-y-6">
        <h3 className="text-lg font-semibold">
          {editingId ? 'Edit Pricing Tier' : 'Create New Pricing Tier'}
        </h3>
        
        <div className="grid gap-4 md:grid-cols-2">
          {/* Basic Info */}
          <input
            value={form.name || ''}
            onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="Tier Name *"
            required
            className="px-3 py-2 rounded bg-black/40 border border-white/10 focus:border-cyan-400 focus:outline-none"
          />
          
          <input
            value={form.description || ''}
            onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
            placeholder="Description"
            className="px-3 py-2 rounded bg-black/40 border border-white/10 focus:border-cyan-400 focus:outline-none"
          />

          {/* Pricing */}
          <div className="flex gap-2">
            <input
              type="number"
              value={form.price || 0}
              onChange={(e) => setForm(f => ({ ...f, price: parseFloat(e.target.value) || 0 }))}
              placeholder="Price"
              min="0"
              step="0.01"
              disabled={form.billingPeriod === 'custom'}
              className={`flex-1 px-3 py-2 rounded bg-black/40 border border-white/10 focus:border-cyan-400 focus:outline-none ${form.billingPeriod==='custom' ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
            <select
              value={form.currency || 'USD'}
              onChange={(e) => setForm(f => ({ ...f, currency: e.target.value }))}
              disabled={form.billingPeriod === 'custom'}
              className={`px-3 py-2 rounded bg-black/40 border border-white/10 focus:border-cyan-400 focus:outline-none ${form.billingPeriod==='custom' ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {CURRENCIES.map(currency => (
                <option key={currency} value={currency}>{currency}</option>
              ))}
            </select>
          </div>

          <select
            value={form.billingPeriod || 'monthly'}
            onChange={(e) => setForm(f => ({ ...f, billingPeriod: e.target.value as any }))}
            className="px-3 py-2 rounded bg-black/40 border border-white/10 focus:border-cyan-400 focus:outline-none"
          >
            {BILLING_PERIODS.map(period => (
              <option key={period} value={period}>{period.charAt(0).toUpperCase() + period.slice(1)}</option>
            ))}
          </select>

          {/* Visual Customization */}
          <div className="flex gap-2">
            <input
              type="color"
              value={form.color || '#8b5cf6'}
              onChange={(e) => setForm(f => ({ ...f, color: e.target.value }))}
              className="w-12 h-10 rounded border border-white/10"
              title="Card Color"
            />
            <select
              value={form.icon || '💼'}
              onChange={(e) => setForm(f => ({ ...f, icon: e.target.value }))}
              className="flex-1 px-3 py-2 rounded bg-black/40 border border-white/10 focus:border-cyan-400 focus:outline-none"
            >
              {ICONS.map(icon => (
                <option key={icon} value={icon}>{icon}</option>
              ))}
            </select>
          </div>

          {/* Button Customization */}
          <input
            value={form.buttonText || 'Get Started'}
            onChange={(e) => setForm(f => ({ ...f, buttonText: e.target.value }))}
            placeholder="Button Text"
            className="px-3 py-2 rounded bg-black/40 border border-white/10 focus:border-cyan-400 focus:outline-none"
          />
          
          <input
            value={form.buttonLink || ''}
            onChange={(e) => setForm(f => ({ ...f, buttonLink: e.target.value }))}
            placeholder="Button Link (optional)"
            className="px-3 py-2 rounded bg-black/40 border border-white/10 focus:border-cyan-400 focus:outline-none"
          />

          {/* Toggles */}
          <div className="md:col-span-2 flex items-center gap-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.popular || false}
                onChange={(e) => setForm(f => ({ ...f, popular: e.target.checked }))}
                className="w-4 h-4 text-cyan-400 bg-black/40 border-white/10 rounded focus:ring-cyan-400"
              />
              <span className="text-sm">Popular</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.featured || false}
                onChange={(e) => setForm(f => ({ ...f, featured: e.target.checked }))}
                className="w-4 h-4 text-cyan-400 bg-black/40 border-white/10 rounded focus:ring-cyan-400"
              />
              <span className="text-sm">Featured</span>
            </label>
          </div>
        </div>

        {/* Features Management */}
        <div className="space-y-3">
          <h4 className="text-md font-semibold">Features</h4>
          <div className="flex gap-2">
            <input
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              placeholder="Add feature"
              className="flex-1 px-3 py-2 rounded bg-black/40 border border-white/10 focus:border-cyan-400 focus:outline-none"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
            />
            <button
              type="button"
              onClick={addFeature}
              className="px-4 py-2 rounded bg-cyan-500/20 border border-cyan-400 text-cyan-400 hover:bg-cyan-500/30"
            >
              Add
            </button>
          </div>
          <div className="space-y-2">
            {form.features?.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 p-2 rounded bg-black/20">
                <input
                  type="checkbox"
                  checked={feature.included}
                  onChange={() => toggleFeatureIncluded(index)}
                  className="w-4 h-4"
                />
                <input
                  value={feature.text}
                  onChange={(e) => setForm(f => ({
                    ...f,
                    features: f.features?.map((feat, i) => 
                      i === index ? { ...feat, text: e.target.value } : feat
                    ) || []
                  }))}
                  className="flex-1 px-2 py-1 rounded bg-black/40 border border-white/10 text-sm"
                />
                <button
                  type="button"
                  onClick={() => toggleFeatureHighlight(index)}
                  className={`px-2 py-1 rounded text-xs ${
                    feature.highlight 
                      ? 'bg-yellow-500/20 text-yellow-400' 
                      : 'bg-white/10 text-white/60'
                  }`}
                >
                  Highlight
                </button>
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="px-2 py-1 rounded bg-red-500/20 text-red-400 text-xs hover:bg-red-500/30"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Limitations Management */}
        <div className="space-y-3">
          <h4 className="text-md font-semibold">Limitations</h4>
          <div className="flex gap-2">
            <input
              value={newLimitation}
              onChange={(e) => setNewLimitation(e.target.value)}
              placeholder="Add limitation"
              className="flex-1 px-3 py-2 rounded bg-black/40 border border-white/10 focus:border-cyan-400 focus:outline-none"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLimitation())}
            />
            <button
              type="button"
              onClick={addLimitation}
              className="px-4 py-2 rounded bg-orange-500/20 border border-orange-400 text-orange-400 hover:bg-orange-500/30"
            >
              Add
            </button>
          </div>
          <div className="space-y-2">
            {form.limitations?.map((limitation, index) => (
              <div key={index} className="flex items-center gap-2 p-2 rounded bg-black/20">
                <span className="text-orange-400">⚠️</span>
                <input
                  value={limitation}
                  onChange={(e) => setForm(f => ({
                    ...f,
                    limitations: f.limitations?.map((lim, i) => 
                      i === index ? e.target.value : lim
                    ) || []
                  }))}
                  className="flex-1 px-2 py-1 rounded bg-black/40 border border-white/10 text-sm"
                />
                <button
                  type="button"
                  onClick={() => removeLimitation(index)}
                  className="px-2 py-1 rounded bg-red-500/20 text-red-400 text-xs hover:bg-red-500/30"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Add-ons Management */}
        <div className="space-y-3">
          <h4 className="text-md font-semibold">Add-ons</h4>
          <div className="grid gap-2 md:grid-cols-3">
            <input
              value={newAddOn.name}
              onChange={(e) => setNewAddOn(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Add-on name"
              className="px-3 py-2 rounded bg-black/40 border border-white/10 focus:border-cyan-400 focus:outline-none"
            />
            <input
              type="number"
              value={newAddOn.price}
              onChange={(e) => setNewAddOn(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
              placeholder="Price"
              min="0"
              step="0.01"
              className="px-3 py-2 rounded bg-black/40 border border-white/10 focus:border-cyan-400 focus:outline-none"
            />
            <div className="flex gap-2">
              <input
                value={newAddOn.description}
                onChange={(e) => setNewAddOn(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Description"
                className="flex-1 px-3 py-2 rounded bg-black/40 border border-white/10 focus:border-cyan-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={addAddOn}
                className="px-4 py-2 rounded bg-green-500/20 border border-green-400 text-green-400 hover:bg-green-500/30"
              >
                Add
              </button>
            </div>
          </div>
          <div className="space-y-2">
            {form.addOns?.map((addOn, index) => (
              <div key={index} className="flex items-center gap-2 p-2 rounded bg-black/20">
                <span className="text-green-400">➕</span>
                <input
                  value={addOn.name}
                  onChange={(e) => setForm(f => ({
                    ...f,
                    addOns: f.addOns?.map((ao, i) => 
                      i === index ? { ...ao, name: e.target.value } : ao
                    ) || []
                  }))}
                  className="flex-1 px-2 py-1 rounded bg-black/40 border border-white/10 text-sm"
                />
                <input
                  type="number"
                  value={addOn.price}
                  onChange={(e) => setForm(f => ({
                    ...f,
                    addOns: f.addOns?.map((ao, i) => 
                      i === index ? { ...ao, price: parseFloat(e.target.value) || 0 } : ao
                    ) || []
                  }))}
                  className="w-20 px-2 py-1 rounded bg-black/40 border border-white/10 text-sm"
                />
                <input
                  value={addOn.description}
                  onChange={(e) => setForm(f => ({
                    ...f,
                    addOns: f.addOns?.map((ao, i) => 
                      i === index ? { ...ao, description: e.target.value } : ao
                    ) || []
                  }))}
                  className="flex-1 px-2 py-1 rounded bg-black/40 border border-white/10 text-sm"
                />
                <button
                  type="button"
                  onClick={() => removeAddOn(index)}
                  className="px-2 py-1 rounded bg-red-500/20 text-red-400 text-xs hover:bg-red-500/30"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="px-6 py-2 rounded bg-prism-gradient text-black font-semibold hover:opacity-90"
          >
            {editingId ? 'Update Pricing Tier' : 'Create Pricing Tier'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-2 rounded border border-white/20 hover:bg-white/10"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Pricing Tiers Display */}
      {loading ? (
        <div className="text-center py-8">Loading pricing tiers...</div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-white/60">
              Total: {items.length} | Featured: {items.filter(t => t.featured).length} | Popular: {items.filter(t => t.popular).length}
            </div>
            <button
              onClick={saveOrder}
              className="px-4 py-2 rounded bg-prism-gradient text-black font-semibold text-sm"
            >
              Save Order
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((tier, idx) => (
              <div key={tier._id} className="glass-dark rounded-xl p-4 card-hover">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{tier.icon}</span>
                      <h4 className="font-semibold text-lg">{tier.name}</h4>
                    </div>
                    <div className="flex gap-1">
                      {tier.popular && (
                        <span className="px-2 py-1 rounded bg-yellow-500/20 border border-yellow-400 text-yellow-400 text-xs">
                          Popular
                        </span>
                      )}
                      {tier.featured && (
                        <span className="px-2 py-1 rounded bg-purple-500/20 border border-purple-400 text-purple-400 text-xs">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>

                  {tier.description && (
                    <p className="text-sm text-white/70">{tier.description}</p>
                  )}

                  <div className="text-center">
                    {tier.billingPeriod === 'custom' ? (
                      <>
                        <div className="text-xl font-semibold" style={{ color: tier.color }}>Custom Pricing</div>
                        <div className="text-sm text-white/60">Tailored to your needs</div>
                      </>
                    ) : (
                      <>
                        <div className="text-3xl font-bold" style={{ color: tier.color }}>
                          {tier.currency} {tier.price}
                        </div>
                        <div className="text-sm text-white/60 capitalize">{tier.billingPeriod}</div>
                      </>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm font-medium">Features:</div>
                    {tier.features?.slice(0, 3).map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <span className={feature.included ? 'text-green-400' : 'text-red-400'}>
                          {feature.included ? '✓' : '✗'}
                        </span>
                        <span className={feature.highlight ? 'text-yellow-400 font-medium' : 'text-white/70'}>
                          {feature.text}
                        </span>
                      </div>
                    ))}
                    {tier.features && tier.features.length > 3 && (
                      <div className="text-xs text-white/50">
                        +{tier.features.length - 3} more features
                      </div>
                    )}
                  </div>

                  {tier.limitations && tier.limitations.length > 0 && (
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-orange-400">Limitations:</div>
                      {tier.limitations.slice(0, 2).map((limitation, i) => (
                        <div key={i} className="text-xs text-orange-300">⚠️ {limitation}</div>
                      ))}
                    </div>
                  )}

                  {tier.addOns && tier.addOns.length > 0 && (
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-green-400">Add-ons:</div>
                      {tier.addOns.slice(0, 2).map((addOn, i) => (
                        <div key={i} className="text-xs text-green-300">➕ {addOn.name} - {tier.currency} {addOn.price}</div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex gap-1">
                      <button
                        onClick={() => edit(tier)}
                        className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => remove(tier._id)}
                        className="px-2 py-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 text-xs"
                      >
                        Delete
                      </button>
                    </div>
                    
                    <div className="flex gap-1">
                      <button
                        onClick={() => move(tier._id, -1)}
                        className="px-1 py-1 rounded bg-white/10 hover:bg-white/20 text-xs"
                        title="Move up"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => move(tier._id, 1)}
                        className="px-1 py-1 rounded bg-white/10 hover:bg-white/20 text-xs"
                        title="Move down"
                      >
                        ↓
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {items.length === 0 && !loading && (
            <div className="text-center py-8 text-white/60">
              No pricing tiers found. Create your first pricing tier above.
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function reorder(list: PricingTier[], id: string, dir: number): PricingTier[] {
  const idx = list.findIndex(x => x._id === id)
  if (idx < 0) return list
  const to = idx + dir
  if (to < 0 || to >= list.length) return list
  const copy = list.slice()
  const [item] = copy.splice(idx, 1)
  copy.splice(to, 0, item)
  return copy
}