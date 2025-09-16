import { useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import { apiFetch, uploadFile } from './api'

type CTA = { label: string; href: string }
type Testimonial = { name: string; role?: string; quote: string; photo?: string }
type Settings = { home?: { headline?: string; tagline?: string; background?: string; ctas?: CTA[] }, testimonials?: Testimonial[] }

export default function HomeManager() {
  const { token } = useAuth()
  const [home, setHome] = useState<Settings['home']>({ headline: '', tagline: '', background: '', ctas: [] })
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [msg, setMsg] = useState('')

  useEffect(()=>{ (async()=>{ const s = await apiFetch<Settings>('/settings'); setHome(s.home || { headline:'', tagline:'', ctas:[] }); setTestimonials(s.testimonials || []) })() }, [])

  function updateCTA(i: number, v: Partial<CTA>) {
    setHome(h => ({ ...(h||{}), ctas: (h?.ctas||[]).map((c,idx)=> idx===i? { ...c, ...v }: c) }))
  }
  function addCTA(){ setHome(h=> ({ ...(h||{}), ctas:[...(h?.ctas||[]), { label:'', href:'#' }] })) }
  function removeCTA(i:number){ setHome(h=> ({ ...(h||{}), ctas:(h?.ctas||[]).filter((_,idx)=>idx!==i) })) }
  function moveCTA(i:number, dir:number){ setHome(h=>{ const c=[...(h?.ctas||[])]; const t=i+dir; if(t<0||t>=c.length) return h; const [x]=c.splice(i,1); c.splice(t,0,x); return { ...(h||{}), ctas:c } }) }

  async function uploadBackground(file: File){ const u = await uploadFile('/uploads', file, token||undefined); setHome(h=>({ ...(h||{}), background: u.filename })) }

  async function save(){ await apiFetch('/settings', { method:'PUT', token: token||undefined, body: { home, testimonials } }); setMsg('Saved'); setTimeout(()=>setMsg(''),1500) }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-orbitron">Home Manager</h1>
      {msg && <div className="text-green-400 text-sm">{msg}</div>}
      <div className="glass-dark rounded-xl p-4 grid gap-3">
        <input value={home?.headline||''} onChange={(e)=>setHome(h=>({ ...(h||{}), headline:e.target.value }))} placeholder="Headline" className="px-3 py-2 rounded bg-black/40 border border-white/10" />
        <input value={home?.tagline||''} onChange={(e)=>setHome(h=>({ ...(h||{}), tagline:e.target.value }))} placeholder="Tagline" className="px-3 py-2 rounded bg-black/40 border border-white/10" />
        <div>
          <label className="text-sm">Background</label>
          <div className="flex items-center gap-3 mt-1">
            <input type="file" onChange={(e)=>{ const f=e.target.files?.[0]; if(f) uploadBackground(f) }} />
            {home?.background && <img src={`/uploads/${home.background}`} className="h-10 rounded" />}
          </div>
        </div>
      </div>
      <div className="glass-dark rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between"><h2 className="font-semibold">CTAs</h2><button onClick={addCTA} className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-sm">Add CTA</button></div>
        {(home?.ctas||[]).map((c,i)=>(
          <div key={i} className="grid md:grid-cols-2 gap-2">
            <input value={c.label} onChange={(e)=>updateCTA(i,{ label:e.target.value })} placeholder="Label" className="px-3 py-2 rounded bg-black/40 border border-white/10" />
            <input value={c.href} onChange={(e)=>updateCTA(i,{ href:e.target.value })} placeholder="Href" className="px-3 py-2 rounded bg-black/40 border border-white/10" />
            <div className="flex items-center gap-2">
              <button onClick={()=>moveCTA(i,-1)} disabled={i===0} className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-xs">↑</button>
              <button onClick={()=>moveCTA(i,1)} disabled={i===(home?.ctas?.length||0)-1} className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-xs">↓</button>
              <button onClick={()=>removeCTA(i)} className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-sm">Remove</button>
            </div>
          </div>
        ))}
      </div>

      {/* Live hero preview */}
      <div className="glass-dark rounded-xl p-4">
        <div className="text-sm text-white/60 mb-2">Hero Preview</div>
        <div className="rounded-2xl overflow-hidden border border-white/10 relative" style={{ backgroundImage: home?.background? `url(/uploads/${home.background})` : undefined, backgroundSize:'cover', backgroundPosition:'center' }}>
          <div className="p-8 backdrop-blur-sm bg-black/40">
            <div className="text-2xl font-orbitron mb-2">{home?.headline || 'Your headline here'}</div>
            <div className="text-white/70 mb-4">{home?.tagline || 'Your tagline here'}</div>
            <div className="flex flex-wrap gap-2">
              {(home?.ctas||[]).map((c,i)=> <span key={i} className="px-3 py-1 rounded bg-prism-gradient text-black text-sm">{c.label || 'CTA'}</span>)}
            </div>
          </div>
        </div>
      </div>

      <div className="glass-dark rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between"><h2 className="font-semibold">Testimonials</h2><button onClick={()=>setTestimonials(t=>[...t,{ name:'', role:'', quote:'', photo:'' }])} className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-sm">Add</button></div>
        {testimonials.map((t,i)=>(
          <div key={i} className="grid md:grid-cols-4 gap-2 items-start">
            <input value={t.name} onChange={(e)=>setTestimonials(ts=>ts.map((x,idx)=> idx===i? {...x,name:e.target.value}:x))} placeholder="Name" className="px-3 py-2 rounded bg-black/40 border border-white/10" />
            <input value={t.role||''} onChange={(e)=>setTestimonials(ts=>ts.map((x,idx)=> idx===i? {...x,role:e.target.value}:x))} placeholder="Role" className="px-3 py-2 rounded bg-black/40 border border-white/10" />
            <input value={t.photo||''} onChange={(e)=>setTestimonials(ts=>ts.map((x,idx)=> idx===i? {...x,photo:e.target.value}:x))} placeholder="Photo URL (optional)" className="px-3 py-2 rounded bg-black/40 border border-white/10" />
            <textarea value={t.quote} onChange={(e)=>setTestimonials(ts=>ts.map((x,idx)=> idx===i? {...x,quote:e.target.value}:x))} placeholder="Quote" className="md:col-span-4 px-3 py-2 rounded bg-black/40 border border-white/10" />
            <div className="md:col-span-4"><button onClick={()=>setTestimonials(ts=>ts.filter((_,idx)=>idx!==i))} className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-sm">Remove</button></div>
          </div>
        ))}
      </div>
      <button onClick={save} className="px-4 py-2 rounded bg-prism-gradient text-black font-semibold">Save</button>
    </div>
  )
}


