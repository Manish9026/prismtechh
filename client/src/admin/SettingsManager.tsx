import { useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import { apiFetch, uploadFile } from './api'

type Settings = {
  logo?: string; favicon?: string; theme?: 'prism-dark';
  seo?: { title?: string; description?: string; keywords?: string[] };
  social?: { linkedin?: string; github?: string; twitter?: string };
  home?: { headline?: string; tagline?: string; ctas?: { label: string; href: string }[] };
  about?: { mission?: string; vision?: string; values?: string[] };
  contact?: { email?: string; phone?: string; address?: string; mapEmbedUrl?: string };
}

export default function SettingsManager() {
  const { token } = useAuth()
  const [s, setS] = useState<Settings>({})
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')
  const [errors, setErrors] = useState<string>('')

  useEffect(()=>{ (async()=>{ setLoading(true); try { setS(await apiFetch<Settings>('/settings')) } finally { setLoading(false) } })() }, [])

  async function uploadLogo(file: File){ const u = await uploadFile('/uploads', file, token||undefined); setS(v=>({ ...v, logo: u.filename })) }
  async function uploadFavicon(file: File){ const u = await uploadFile('/uploads', file, token||undefined); setS(v=>({ ...v, favicon: u.filename })) }

  function isValidUrl(u?: string){ if(!u) return true; try { const x = new URL(u); return ['http:','https:'].includes(x.protocol) } catch { return false } }
  async function save(){
    setErrors('')
    if (!isValidUrl(s.social?.linkedin) || !isValidUrl(s.social?.github) || !isValidUrl(s.social?.twitter)) { setErrors('Please enter valid URLs (http/https) for social links.'); return }
    await apiFetch('/settings', { method:'PUT', token: token||undefined, body: s }); setMsg('Saved'); setTimeout(()=>setMsg(''), 1500)
  }

  if (loading) return <div>Loading...</div>
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-orbitron">Settings</h1>
      {msg && <div className="text-green-400 text-sm">{msg}</div>}

      <div className="glass-dark rounded-xl p-4 grid gap-3 md:grid-cols-2">
        <div className="md:col-span-2 flex items-center gap-3">
          <span className="text-sm text-white/70">Theme</span>
          <button type="button" onClick={()=>setS(v=>({ ...v, theme: 'prism-dark' }))} className={`px-3 py-1 rounded border ${s.theme==='prism-dark'? 'border-cyan-400 bg-white/10' : 'border-white/10 bg-black/40'}`}>Prism Dark</button>
        </div>
        <div>
          <label className="text-sm">Logo</label>
          <div className="flex items-center gap-3 mt-1">
            <input type="file" onChange={(e)=>{ const f=e.target.files?.[0]; if(f) uploadLogo(f) }} />
            {s.logo && <img src={`/uploads/${s.logo}`} className="h-10" />}
          </div>
        </div>
        <div>
          <label className="text-sm">Favicon</label>
          <div className="flex items-center gap-3 mt-1">
            <input type="file" onChange={(e)=>{ const f=e.target.files?.[0]; if(f) uploadFavicon(f) }} />
            {s.favicon && <img src={`/uploads/${s.favicon}`} className="h-8" />}
          </div>
        </div>
        <input value={s.seo?.title||''} onChange={(e)=>setS(v=>({ ...v, seo: { ...(v.seo||{}), title: e.target.value } }))} placeholder="SEO Title" className="px-3 py-2 rounded bg-black/40 border border-white/10" />
        <input value={s.seo?.description||''} onChange={(e)=>setS(v=>({ ...v, seo: { ...(v.seo||{}), description: e.target.value } }))} placeholder="SEO Description" className="px-3 py-2 rounded bg-black/40 border border-white/10" />
        <input value={(s.seo?.keywords||[]).join(', ')} onChange={(e)=>setS(v=>({ ...v, seo: { ...(v.seo||{}), keywords: e.target.value.split(',').map(x=>x.trim()).filter(Boolean) } }))} placeholder="SEO Keywords (comma separated)" className="px-3 py-2 rounded bg-black/40 border border-white/10 md:col-span-2" />
        <input value={s.social?.linkedin||''} onChange={(e)=>setS(v=>({ ...v, social: { ...(v.social||{}), linkedin: e.target.value } }))} placeholder="LinkedIn URL" className="px-3 py-2 rounded bg-black/40 border border-white/10" />
        <input value={s.social?.github||''} onChange={(e)=>setS(v=>({ ...v, social: { ...(v.social||{}), github: e.target.value } }))} placeholder="GitHub URL" className="px-3 py-2 rounded bg-black/40 border border-white/10" />
        <input value={s.social?.twitter||''} onChange={(e)=>setS(v=>({ ...v, social: { ...(v.social||{}), twitter: e.target.value } }))} placeholder="Twitter URL" className="px-3 py-2 rounded bg-black/40 border border-white/10" />
      </div>

      {/* Contact & Map */}
      <div className="glass-dark rounded-xl p-4 grid gap-3 md:grid-cols-2">
        <input value={s.contact?.email||''} onChange={(e)=>setS(v=>({ ...v, contact: { ...(v.contact||{}), email: e.target.value } }))} placeholder="Contact Email" className="px-3 py-2 rounded bg-black/40 border border-white/10" />
        <input value={s.contact?.phone||''} onChange={(e)=>setS(v=>({ ...v, contact: { ...(v.contact||{}), phone: e.target.value } }))} placeholder="Contact Phone" className="px-3 py-2 rounded bg-black/40 border border-white/10" />
        <input value={s.contact?.address||''} onChange={(e)=>setS(v=>({ ...v, contact: { ...(v.contact||{}), address: e.target.value } }))} placeholder="Address" className="px-3 py-2 rounded bg-black/40 border border-white/10 md:col-span-2" />
        <input value={s.contact?.mapEmbedUrl||''} onChange={(e)=>setS(v=>({ ...v, contact: { ...(v.contact||{}), mapEmbedUrl: e.target.value } }))} placeholder="Map Embed URL (OpenStreetMap/Google Maps iframe src)" className="px-3 py-2 rounded bg-black/40 border border-white/10 md:col-span-2" />
        <div className="md:col-span-2">
          <div className="text-xs text-white/50 mb-2">Preview</div>
          <div className="glass glow-border rounded-xl p-2">
            <iframe title="map-preview" className="w-full h-56 rounded-lg" src={s.contact?.mapEmbedUrl || 'about:blank'} />
          </div>
        </div>
      </div>

      {/* Live SEO preview */}
      <div className="glass-dark rounded-xl p-4">
        <div className="text-sm text-white/60 mb-2">SEO Preview</div>
        <div className="bg-black/30 rounded-lg p-3 border border-white/10">
          <div className="text-blue-300">{s.seo?.title || 'Your page title here'}</div>
          <div className="text-green-300 text-xs">https://www.prism.tech/</div>
          <div className="text-white/70 text-sm mt-1">{s.seo?.description || 'Your description will appear here.'}</div>
        </div>
      </div>

      <div className="glass-dark rounded-xl p-4 grid gap-3 md:grid-cols-2">
        <input value={s.home?.headline||''} onChange={(e)=>setS(v=>({ ...v, home: { ...(v.home||{}), headline: e.target.value } }))} placeholder="Home Headline" className="px-3 py-2 rounded bg-black/40 border border-white/10 md:col-span-2" />
        <input value={s.home?.tagline||''} onChange={(e)=>setS(v=>({ ...v, home: { ...(v.home||{}), tagline: e.target.value } }))} placeholder="Home Tagline" className="px-3 py-2 rounded bg-black/40 border border-white/10 md:col-span-2" />
      </div>

      <div className="glass-dark rounded-xl p-4 grid gap-3 md:grid-cols-3">
        <input value={s.about?.mission||''} onChange={(e)=>setS(v=>({ ...v, about: { ...(v.about||{}), mission: e.target.value } }))} placeholder="About Mission" className="px-3 py-2 rounded bg-black/40 border border-white/10" />
        <input value={s.about?.vision||''} onChange={(e)=>setS(v=>({ ...v, about: { ...(v.about||{}), vision: e.target.value } }))} placeholder="About Vision" className="px-3 py-2 rounded bg-black/40 border border-white/10" />
        <input value={(s.about?.values||[]).join(', ')} onChange={(e)=>setS(v=>({ ...v, about: { ...(v.about||{}), values: e.target.value.split(',').map(x=>x.trim()).filter(Boolean) } }))} placeholder="Values (comma separated)" className="px-3 py-2 rounded bg-black/40 border border-white/10" />
      </div>

      {errors && <div className="text-yellow-300 text-sm">{errors}</div>}
      <button onClick={save} className="px-4 py-2 rounded bg-prism-gradient text-black font-semibold">Save Settings</button>
    </div>
  )
}


