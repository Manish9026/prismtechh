import { useEffect, useState, Suspense, lazy } from 'react'
import { useAuth } from './AuthContext'
import { apiFetch } from './api'

type About = { mission?: string; vision?: string; values?: string[] }
type Settings = { about?: About }

export default function AboutManager(){
  const { token } = useAuth()
  const [about, setAbout] = useState<About>({ mission:'', vision:'', values:[] })
  const [msg, setMsg] = useState('')

  useEffect(()=>{ (async()=>{ const s = await apiFetch<Settings>('/settings'); setAbout(s.about || { mission:'', vision:'', values:[] }) })() }, [])

  async function save(){ await apiFetch('/settings', { method:'PUT', token: token||undefined, body: { about } }); setMsg('Saved'); setTimeout(()=>setMsg(''),1500) }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-orbitron">About Manager</h1>
      {msg && <div className="text-green-400 text-sm">{msg}</div>}

      <div className="glass-dark rounded-xl p-4 grid gap-3">
        <input value={about.mission||''} onChange={(e)=>setAbout(a=>({ ...a, mission:e.target.value }))} placeholder="Mission" className="px-3 py-2 rounded bg-black/40 border border-white/10" />
        <input value={about.vision||''} onChange={(e)=>setAbout(a=>({ ...a, vision:e.target.value }))} placeholder="Vision" className="px-3 py-2 rounded bg-black/40 border border-white/10" />
        <input value={(about.values||[]).join(', ')} onChange={(e)=>setAbout(a=>({ ...a, values:e.target.value.split(',').map(x=>x.trim()).filter(Boolean) }))} placeholder="Values (comma separated)" className="px-3 py-2 rounded bg-black/40 border border-white/10" />
      </div>
      <button onClick={save} className="px-4 py-2 rounded bg-prism-gradient text-black font-semibold">Save</button>

      <div className="h-px bg-white/10 my-4" />
      <h2 className="text-xl font-semibold">Team</h2>
      <p className="text-white/60 text-sm -mt-1">Add/edit team members shown on the About page.</p>
      <Suspense fallback={<div>Loading team...</div>}>
        <EmbedTeamManager />
      </Suspense>
    </div>
  )
}

const TeamManager = lazy(()=>import('./TeamManager'))
function EmbedTeamManager(){
  return <TeamManager />
}


