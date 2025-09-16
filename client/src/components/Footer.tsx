import HoloButton from '@/components/HoloButton'
import { useEffect, useState } from 'react'

type Settings = { logo?: string; social?: { linkedin?: string; github?: string; twitter?: string } }

export default function Footer() {
  const [settings, setSettings] = useState<Settings>({})
  useEffect(()=>{ (async()=>{ try { const r = await fetch('/api/settings'); if(r.ok) setSettings(await r.json()) } catch {} })() }, [])
  return (
    <footer className="relative border-t border-white/10 bg-black/20 overflow-hidden">
      {/* Holographic divider */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[140%] h-48 bg-prism-gradient opacity-25 blur-3xl" />
      <div className="absolute -top-[1px] inset-x-0 h-[2px] bg-prism-gradient animate-pulse" />

      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col gap-8 text-white/60">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              {settings.logo ? (
                <img src={`/uploads/${settings.logo}`} className="h-8 w-8 rounded-md object-contain bg-black/40" />
              ) : (
                <div className="w-8 h-8 rounded-md bg-prism-gradient shadow-neon" />
              )}
              <span className="text-white font-orbitron text-base tracking-widest">PRISM TECH</span>
            </div>
            <p className="text-sm text-white/70">Sleek, secure, neon-grade digital experiences.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/about" className="hover:text-white">About</a></li>
              <li><a href="/services" className="hover:text-white">Services</a></li>
              <li><a href="/projects" className="hover:text-white">Projects</a></li>
              <li><a href="/pricing" className="hover:text-white">Pricing</a></li>
              <li><a href="/contact" className="hover:text-white">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>Email: <a href="mailto:hello@prism.tech" className="hover:text-white">hello@prism.tech</a></li>
              <li>Phone: <a href="tel:+15551234567" className="hover:text-white">+1 (555) 123-4567</a></li>
              <li>Location: Remote / Global</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Subscribe</h4>
            <SubscribeForm />
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© 2025 Prism Tech. All rights reserved.</p>
          <div className="flex items-center gap-5">
          <a aria-label="LinkedIn" className="hover:text-white transition drop-shadow-[0_0_6px_rgba(34,211,238,0.7)]" href={settings.social?.linkedin || 'https://www.linkedin.com/'} target="_blank" rel="noreferrer">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V24h-4V8zm7.5 0h3.8v2.2h.05c.53-1 1.83-2.2 3.77-2.2 4.03 0 4.78 2.65 4.78 6.1V24h-4v-7.2c0-1.72-.03-3.93-2.4-3.93-2.4 0-2.77 1.87-2.77 3.8V24h-4V8z"/></svg>
          </a>
          <a aria-label="GitHub" className="hover:text-white transition drop-shadow-[0_0_6px_rgba(139,92,246,0.7)]" href={settings.social?.github || 'https://github.com/'} target="_blank" rel="noreferrer">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.11.8-.25.8-.56v-2.17c-3.26.71-3.95-1.4-3.95-1.4-.53-1.34-1.28-1.7-1.28-1.7-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.02 1.75 2.67 1.25 3.32.96.1-.75.4-1.25.73-1.54-2.6-.3-5.34-1.3-5.34-5.78 0-1.27.46-2.31 1.2-3.12-.12-.3-.52-1.5.1-3.12 0 0 .98-.32 3.2 1.19a11.1 11.1 0 0 1 5.82 0c2.22-1.51 3.2-1.19 3.2-1.19.62 1.62.22 2.82.11 3.12.75.81 1.2 1.85 1.2 3.12 0 4.49-2.75 5.47-5.36 5.76.41.36.78 1.07.78 2.16v3.2c0 .31.21.68.81.56A11.5 11.5 0 0 0 12 .5Z"/></svg>
          </a>
          <a aria-label="Twitter" className="hover:text-white transition drop-shadow-[0_0_6px_rgba(244,114,182,0.7)]" href={settings.social?.twitter || 'https://twitter.com/'} target="_blank" rel="noreferrer">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M19.633 7.997c.013.175.013.35.013.526 0 5.359-4.078 11.54-11.54 11.54-2.295 0-4.427-.675-6.223-1.84.324.038.635.05.972.05a8.17 8.17 0 0 0 5.07-1.747 4.085 4.085 0 0 1-3.814-2.83c.25.038.5.063.762.063.362 0 .724-.05 1.062-.138a4.077 4.077 0 0 1-3.27-4v-.05c.55.3 1.187.487 1.862.512a4.072 4.072 0 0 1-1.818-3.392c0-.75.2-1.425.55-2.02a11.58 11.58 0 0 0 8.4 4.262 4.596 4.596 0 0 1-.1-.937 4.074 4.074 0 0 1 7.05-2.783 8.035 8.035 0 0 0 2.587-.986 4.085 4.085 0 0 1-1.793 2.257 8.149 8.149 0 0 0 2.35-.625 8.76 8.76 0 0 1-2.037 2.112Z"/></svg>
          </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

//
function SubscribeForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    try {
      setStatus('loading')
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setStatus('success')
        setEmail('')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <form onSubmit={submit} className="w-full space-y-2">
      <div className="flex max-w-sm">
        <input type="email" required placeholder="Your email for updates" value={email} onChange={(e)=>setEmail(e.target.value)}
          className="flex-1 px-4 py-3 rounded-l-lg bg-black/40 border border-white/10 text-white outline-none focus:border-white/30" />
        <HoloButton type="submit" className="rounded-l-none">{status==='loading' ? 'Subscribing...' : 'Subscribe'}</HoloButton>
      </div>
      {status==='success' && <span className="text-green-400 text-sm block">Subscribed! Check your inbox.</span>}
      {status==='error' && <span className="text-red-400 text-sm block">Something went wrong. Try again.</span>}
    </form>
  )
}


