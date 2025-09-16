import { useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import { apiFetch } from './api'

type Service = { _id: string; title: string; description: string; icon?: string; featured: boolean; order?: number }

const ICON_CHOICES = ['⚙️','🛡️','☁️','🤖','🧩','🚀','🧠','🗄️','📦','🛰️']

export default function ServicesManager() {
  const { token } = useAuth()
  const [items, setItems] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [validation, setValidation] = useState<string>('')

  const [form, setForm] = useState<Partial<Service>>({ title: '', description: '', icon: '', featured: false, order: 0 })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [filter, setFilter] = useState<'All' | 'Featured' | 'Not Featured'>('All')

  async function load() {
    setLoading(true)
    try {
      const data = await apiFetch<Service[]>('/services')
      setItems(data)
    } catch (e: any) {
      setError(e.message || 'Failed to load')
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setValidation('')
    setError('')
    
    try {
      if (!form.title || form.title.trim().length < 3) { 
        setValidation('Title must be at least 3 characters.'); 
        return 
      }
      if (!form.description || form.description.trim().length < 10) { 
        setValidation('Description must be at least 10 characters.'); 
        return 
      }
      
      if (editingId) {
        await apiFetch(`/services/${editingId}`, { method: 'PUT', token: token || undefined, body: form })
        setValidation('Service updated successfully!')
      } else {
        await apiFetch('/services', { method: 'POST', token: token || undefined, body: form })
        setValidation('Service created successfully!')
      }
      
      setForm({ title: '', description: '', icon: '', featured: false, order: 0 })
      setEditingId(null)
      await load()
      
      // Clear success message after 3 seconds
      setTimeout(() => setValidation(''), 3000)
    } catch (e: any) {
      setError(e.message || 'Save failed')
    }
  }

  async function edit(item: Service) {
    setEditingId(item._id)
    setForm({ title: item.title, description: item.description, icon: item.icon, featured: item.featured, order: item.order })
  }

  async function remove(id: string) {
    if (!confirm('Delete this service?')) return
    try {
      await apiFetch(`/services/${id}`, { method: 'DELETE', token: token || undefined })
      await load()
    } catch (e: any) {
      setError(e.message || 'Delete failed')
    }
  }

  function move(idx: number, dir: number){
    setItems(prev => {
      const next = [...prev]
      const to = idx + dir
      if (to < 0 || to >= next.length) return prev
      const [spliced] = next.splice(idx,1)
      next.splice(to,0,spliced)
      return next
    })
  }

  async function saveOrder(){
    try {
      const body = items.map((s, idx) => ({ id: s._id, order: idx }))
      await apiFetch('/services/reorder/bulk', { method: 'PUT', token: token || undefined, body })
      await load()
    } catch (e: any) {
      setError(e.message || 'Reorder failed')
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-orbitron">Services</h1>

      <form onSubmit={save} className="glass-dark rounded-xl p-4 grid gap-3 md:grid-cols-2">
        <input value={form.title||''} onChange={(e)=>setForm(f=>({...f,title:e.target.value}))} placeholder="Title" className="px-3 py-2 rounded bg-black/40 border border-white/10" />
        <input value={form.icon||''} onChange={(e)=>setForm(f=>({...f,icon:e.target.value}))} placeholder="Icon (optional)" className="px-3 py-2 rounded bg-black/40 border border-white/10" />
        <input type="number" value={form.order||0} onChange={(e)=>setForm(f=>({...f,order:parseInt(e.target.value,10)}))} placeholder="Order" className="px-3 py-2 rounded bg-black/40 border border-white/10" />
        <div className="flex items-center gap-2">
          <input type="checkbox" checked={form.featured||false} onChange={(e)=>setForm(f=>({...f,featured:e.target.checked}))} className="w-4 h-4" />
          <label className="text-sm">Featured on homepage</label>
        </div>
        <textarea value={form.description||''} onChange={(e)=>setForm(f=>({...f,description:e.target.value}))} placeholder="Description" className="md:col-span-2 px-3 py-2 rounded bg-black/40 border border-white/10" />
        <div className="md:col-span-2">
          <div className="text-xs text-white/60 mb-2">Quick icon picker</div>
          <div className="flex flex-wrap gap-2">
            {ICON_CHOICES.map(ic => (
              <button type="button" key={ic} onClick={()=>setForm(f=>({...f, icon: ic}))} className={`px-3 py-2 rounded border ${form.icon===ic? 'border-cyan-400 bg-white/10' : 'border-white/10 bg-black/40'}`}>
                {ic}
              </button>
            ))}
          </div>
        </div>
        <div className="md:col-span-2 flex gap-3">
          <button 
            type="submit"
            className="px-4 py-2 rounded bg-prism-gradient text-black font-semibold hover:opacity-90"
          >
            {editingId? 'Update' : 'Create'}
          </button>
          {editingId && <button type="button" onClick={()=>{ setEditingId(null); setForm({ title:'', description:'', icon:'', featured:false, order:0 }) }} className="px-4 py-2 rounded border border-white/20">Cancel</button>}
        </div>
      </form>

      {validation && (
        <div className={`text-sm p-3 rounded ${
          validation.includes('successfully') 
            ? 'bg-green-500/20 border border-green-400 text-green-400' 
            : 'bg-yellow-500/20 border border-yellow-400 text-yellow-400'
        }`}>
          {validation}
        </div>
      )}
      {error && <div className="text-red-400 text-sm">{error}</div>}

      {/* Filters */}
      <div className="glass-dark rounded-xl p-4">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-white/60">Filter:</span>
          {(['All', 'Featured', 'Not Featured'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded text-sm ${
                filter === f 
                  ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-400' 
                  : 'bg-white/10 border border-white/20 hover:bg-white/20'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? <div>Loading...</div> : (
        <>
          <div className="flex justify-between items-center">
            <div className="text-sm text-white/60">
              Total: {items.length} | Featured: {items.filter(s => s.featured).length}
            </div>
            <button onClick={saveOrder} className="px-4 py-2 rounded bg-white/10 hover:bg-white/20 border border-white/10">Save Order</button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.filter(s => {
              if (filter === 'All') return true
              if (filter === 'Featured') return s.featured
              if (filter === 'Not Featured') return !s.featured
              return true
            }).map((s, idx) => (
              <div key={s._id} className="glass-dark rounded-xl p-4 card-hover">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="text-lg font-semibold flex items-center gap-2">
                        {s.icon && <span className="text-xl">{s.icon}</span>}
                        <span>{s.title}</span>
                        {s.featured && (
                          <span className="px-2 py-1 rounded bg-yellow-500/20 border border-yellow-400 text-yellow-400 text-xs">
                            Featured
                          </span>
                        )}
                      </div>
                      <div className="text-white/70 text-sm">{s.description}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <button onClick={()=>move(idx, -1)} disabled={idx===0} className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-xs">↑</button>
                      <button onClick={()=>move(idx, 1)} disabled={idx===items.length-1} className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-xs">↓</button>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={async () => {
                          try {
                            await apiFetch(`/services/${s._id}`, { 
                              method: 'PUT', 
                              token: token || undefined, 
                              body: { featured: !s.featured } 
                            })
                            await load()
                          } catch (e: any) {
                            setError(e.message || 'Update failed')
                          }
                        }}
                        className={`px-3 py-1 rounded text-sm ${
                          s.featured 
                            ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' 
                            : 'bg-white/10 hover:bg-white/20'
                        }`}
                      >
                        {s.featured ? 'Unfeature' : 'Feature'}
                      </button>
                      <button onClick={()=>edit(s)} className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-sm">Edit</button>
                      <button onClick={()=>remove(s._id)} className="px-3 py-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 text-sm">Delete</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}


