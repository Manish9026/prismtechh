import { useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import { apiFetch } from './api'

type Msg = { _id: string; name: string; email: string; message: string; status: 'unread'|'read'; createdAt?: string }

export default function MessagesManager() {
  const { token } = useAuth()
  const [items, setItems] = useState<Msg[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [status, setStatus] = useState<'all'|'read'|'unread'>('all')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [selected, setSelected] = useState<Record<string, boolean>>({})

  async function load(){
    setLoading(true)
    try {
      const qs = new URLSearchParams()
      if (status !== 'all') qs.set('status', status)
      if (start) qs.set('start', start)
      if (end) qs.set('end', end)
      qs.set('page', String(page))
      qs.set('pageSize', String(pageSize))
      const res = await apiFetch<{ items: Msg[]; total: number; page: number; pageSize: number }>(`/messages?${qs.toString()}`, { method:'GET', token: token||undefined })
      setItems(res.items)
      setTotal(res.total)
    }
    catch(e:any){ setError(e.message||'Failed to load') }
    finally { setLoading(false) }
  }
  useEffect(()=>{ load() }, [status, start, end, page, pageSize])

  async function markRead(id: string){
    try { await apiFetch(`/messages/${id}/read`, { method:'PUT', token: token||undefined }); await load() } catch {}
  }

  function toggleSelect(id: string){ setSelected(s => ({ ...s, [id]: !s[id] })) }
  function clearSelection(){ setSelected({}) }
  function selectedIds(){ return Object.entries(selected).filter(([,v])=>v).map(([k])=>k) }
  async function bulkStatus(newStatus: 'read'|'unread'){
    const ids = selectedIds(); if(!ids.length) return
    await apiFetch('/messages/bulk/status', { method:'PUT', token: token||undefined, body: { ids, status: newStatus } })
    clearSelection(); await load()
  }
  async function bulkDelete(){
    const ids = selectedIds(); if(!ids.length || !confirm('Delete selected messages?')) return
    await apiFetch('/messages/bulk', { method:'DELETE', token: token||undefined, body: { ids } })
    clearSelection(); await load()
  }

  function exportCSV(){
    const headers = ['Name','Email','Status','Created At','Message']
    const rows = items.map(m=> [m.name, m.email, m.status, m.createdAt||'', m.message.replace(/\n/g,' ')])
    const csv = [headers.join(','), ...rows.map(r=> r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'messages.csv'; a.click(); URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-orbitron">Contact Messages</h1>
      <div className="glass-dark rounded-xl p-3 flex flex-wrap gap-2 items-end">
        <div className="flex flex-col">
          <label className="text-xs text-white/60">Status</label>
          <select value={status} onChange={(e)=>{ setPage(1); setStatus(e.target.value as any) }} className="px-3 py-2 rounded bg-black/40 border border-white/10">
            <option value="all">All</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-xs text-white/60">Start</label>
          <input type="date" value={start} onChange={(e)=>{ setPage(1); setStart(e.target.value) }} className="px-3 py-2 rounded bg-black/40 border border-white/10" />
        </div>
        <div className="flex flex-col">
          <label className="text-xs text-white/60">End</label>
          <input type="date" value={end} onChange={(e)=>{ setPage(1); setEnd(e.target.value) }} className="px-3 py-2 rounded bg-black/40 border border-white/10" />
        </div>
        <div className="flex flex-col">
          <label className="text-xs text-white/60">Page size</label>
          <select value={pageSize} onChange={(e)=>{ setPage(1); setPageSize(Number(e.target.value)) }} className="px-3 py-2 rounded bg-black/40 border border-white/10">
            {[10,20,50,100].map(n=> <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div className="ml-auto flex gap-2">
          <button onClick={()=>bulkStatus('read')} className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-sm">Mark read</button>
          <button onClick={()=>bulkStatus('unread')} className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-sm">Mark unread</button>
          <button onClick={bulkDelete} className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-sm">Delete</button>
          <button onClick={exportCSV} className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-sm">Export CSV</button>
        </div>
      </div>
      {error && <div className="text-red-400 text-sm">{error}</div>}
      {loading ? <div>Loading...</div> : (
        <div className="space-y-3">
          {items.map(m => (
            <div key={m._id} className="glass-dark rounded-xl p-4 card-hover">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <input type="checkbox" checked={!!selected[m._id]} onChange={()=>toggleSelect(m._id)} className="mt-1" />
                  <div>
                    <div className="font-semibold">{m.name} <span className="text-white/60 text-sm">({m.email})</span></div>
                    <div className="text-white/80 mt-1 whitespace-pre-wrap">{m.message}</div>
                    <div className="text-xs text-white/50 mt-2">{m.createdAt ? new Date(m.createdAt).toLocaleString() : ''}</div>
                  </div>
                </div>
                <div className="text-right min-w-[120px]">
                  <div className={`text-xs mb-2 ${m.status==='unread'?'text-amber-300':'text-green-300'}`}>{m.status.toUpperCase()}</div>
                  {m.status==='unread' && <button onClick={()=>markRead(m._id)} className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-sm">Mark read</button>}
                </div>
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between">
            <div className="text-white/60 text-sm">Total: {total}</div>
            <div className="flex items-center gap-2">
              <button onClick={()=>setPage(p=>Math.max(1,p-1))} className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-sm">Prev</button>
              <span className="text-sm">Page {page}</span>
              <button onClick={()=>setPage(p=>p+1)} disabled={page*pageSize >= total} className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-sm">Next</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


