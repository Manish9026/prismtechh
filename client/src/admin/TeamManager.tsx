import { useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import { apiFetch, uploadFile } from './api'

type Member = { _id: string; name: string; role: string; bio?: string; photo?: string; order?: number }

export default function TeamManager() {
  const { token } = useAuth()
  const [items, setItems] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [validation, setValidation] = useState('')

  const [form, setForm] = useState<Partial<Member>>({ name: '', role: '' })
  const [file, setFile] = useState<File | null>(null)
  const [removePhoto, setRemovePhoto] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  async function load(){
    setLoading(true)
    try { setItems(await apiFetch<Member[]>('/team')) } catch(e:any){ setError(e.message||'Failed to load') } finally { setLoading(false) }
  }
  useEffect(()=>{ load() }, [])

  async function save(e: React.FormEvent){
    e.preventDefault()
    try {
      if (!form.name || form.name.trim().length < 2) { setValidation('Name must be at least 2 characters.'); return }
      if (!form.role || form.role.trim().length < 2) { setValidation('Role must be at least 2 characters.'); return }
      if (form.bio && form.bio.length > 500) { setValidation('Bio must be 500 characters or less.'); return }
      let payload: any = { ...form }
      if (file) {
        const up = await uploadFile('/uploads', file, token || undefined)
        payload.photo = up.filename
      }
      if (!file && removePhoto) {
        payload.photo = ''
      }
      if (editingId) await apiFetch(`/team/${editingId}`, { method:'PUT', token: token||undefined, body: payload })
      else await apiFetch('/team', { method:'POST', token: token||undefined, body: payload })
      reset()
      await load()
    } catch(e:any){ setError(e.message||'Save failed') }
  }

  function edit(m: Member){
    setEditingId(m._id)
    setForm({ name: m.name, role: m.role, bio: m.bio })
    setRemovePhoto(false)
  }
  function reset(){ setEditingId(null); setForm({ name:'', role:'' }); setFile(null); setRemovePhoto(false); setValidation('') }

  function move(from: number, to: number){
    if (to < 0 || to >= items.length) return
    setItems(prev => arrayMove(prev, from, to))
  }

  async function saveOrder(){
    try {
      const payload = items.map((m, idx) => ({ id: m._id, order: idx }))
      await apiFetch('/team/reorder/bulk', { method: 'PUT', token: token || undefined, body: payload })
    } catch (e) {
      // no-op UI error toast could be added
    }
  }

  async function remove(id: string){
    if(!confirm('Delete this member?')) return
    try { await apiFetch(`/team/${id}`, { method:'DELETE', token: token||undefined }); await load() } catch(e:any){ setError(e.message||'Delete failed') }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-orbitron">Team</h1>

      <form onSubmit={save} className="glass-dark rounded-xl p-4 grid gap-3 md:grid-cols-2">
        <input value={form.name||''} onChange={(e)=>setForm(f=>({...f,name:e.target.value}))} placeholder="Name" className="px-3 py-2 rounded bg-black/40 border border-white/10" />
        <input value={form.role||''} onChange={(e)=>setForm(f=>({...f,role:e.target.value}))} placeholder="Role" className="px-3 py-2 rounded bg-black/40 border border-white/10" />
        <textarea value={form.bio||''} onChange={(e)=>setForm(f=>({...f,bio:e.target.value}))} placeholder="Short Bio" className="md:col-span-2 px-3 py-2 rounded bg-black/40 border border-white/10" />
        <input type="file" onChange={(e)=>setFile(e.target.files?.[0]||null)} accept="image/*" className="px-3 py-2 rounded bg-black/40 border border-white/10" />
        {editingId && (
          <div className="md:col-span-2">
            <label className="text-sm flex items-center gap-2">
              <input type="checkbox" checked={removePhoto} onChange={(e)=>setRemovePhoto(e.target.checked)} /> Remove current photo
            </label>
          </div>
        )}
        <div className="md:col-span-2 flex gap-3">
          <button className="px-4 py-2 rounded bg-prism-gradient text-black font-semibold" disabled={!form.name || !form.role}>{editingId? 'Update' : 'Create'}</button>
          {editingId && <button type="button" onClick={reset} className="px-4 py-2 rounded border border-white/20">Cancel</button>}
        </div>
      </form>

      {validation && <div className="text-yellow-300 text-sm">{validation}</div>}
      {error && <div className="text-red-400 text-sm">{error}</div>}
      {loading ? <div>Loading...</div> : (
        <div className="space-y-3">
          <div className="text-sm text-white/60">Drag order with buttons, then click "Save Order".</div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((m, idx) => (
              <div key={m._id} className="glass-dark rounded-xl p-4 card-hover">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-xl bg-black/40 border border-white/10 overflow-hidden">
                    {m.photo && <img src={`/uploads/${m.photo}`} alt={m.name} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1">
                    <div className="text-lg font-semibold">{m.name}</div>
                    <div className="text-white/70 text-sm">{m.role}</div>
                    {m.bio && <div className="text-white/60 text-xs mt-1 line-clamp-2">{m.bio}</div>}
                    <div className="flex gap-2 mt-2">
                      <button onClick={()=>edit(m)} className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-sm">Edit</button>
                      <button onClick={()=>remove(m._id)} className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-sm">Delete</button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <button disabled={idx===0} onClick={()=>move(idx, idx-1)} className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-xs">↑</button>
                    <button disabled={idx===items.length-1} onClick={()=>move(idx, idx+1)} className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-xs">↓</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div>
            <button onClick={saveOrder} className="px-4 py-2 rounded bg-prism-gradient text-black font-semibold">Save Order</button>
          </div>
        </div>
      )}
    </div>
  )
}

function arrayMove<T>(arr: T[], from: number, to: number): T[] {
  const copy = arr.slice();
  const item = copy.splice(from, 1)[0];
  copy.splice(to, 0, item);
  return copy;
}



