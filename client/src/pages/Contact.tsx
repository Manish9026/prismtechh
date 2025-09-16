import Section from '@/components/Section'
import { useEffect, useState } from 'react'

export default function Contact() {
  const [mapUrl, setMapUrl] = useState<string | undefined>(undefined)
  const [contact, setContact] = useState<{ email?: string; phone?: string; address?: string } | undefined>(undefined)
  useEffect(()=>{ (async()=>{ try { const s = await fetch('/api/settings').then(r=>r.ok?r.json():null); if (s?.contact) { setMapUrl(s.contact.mapEmbedUrl); setContact({ email: s.contact.email, phone: s.contact.phone, address: s.contact.address }) } } catch {} })() }, [])
  return (
    <main>
      <Section title="Contact">
        <div className="grid md:grid-cols-2 gap-8">
        <form className="glass glow-border rounded-xl p-6 space-y-4">
          <div>
            <label className="text-sm text-white/70">Name</label>
            <input className="mt-1 w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white outline-none focus:border-white/30" placeholder="Your name" />
          </div>
          <div>
            <label className="text-sm text-white/70">Email</label>
            <input type="email" className="mt-1 w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white outline-none focus:border-white/30" placeholder="you@company.com" />
          </div>
          <div>
            <label className="text-sm text-white/70">Message</label>
            <textarea rows={5} className="mt-1 w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white outline-none focus:border-white/30" placeholder="How can we help?" />
          </div>
          <button className="px-5 py-3 rounded-lg text-black font-semibold bg-prism-gradient shadow-neon">Send Message</button>
        </form>
        <div className="space-y-4">
          <div className="glass glow-border rounded-xl p-6">
            <h3 className="font-semibold">Contact Info</h3>
            <p className="text-white/70 text-sm mt-2">Email: {contact?.email || 'hello@prism.tech'}</p>
            <p className="text-white/70 text-sm">Phone: {contact?.phone || '+1 (555) 123-4567'}</p>
            <p className="text-white/70 text-sm">Location: {contact?.address || 'Remote / Global'}</p>
          </div>
          <div className="glass glow-border rounded-xl p-2">
            <iframe title="map" className="w-full h-64 rounded-lg" src={mapUrl || 'https://www.openstreetmap.org/export/embed.html?bbox=77.55%2C12.9%2C77.65%2C13.0&layer=mapnik'} />
          </div>
        </div>
        </div>
      </Section>
    </main>
  )
}


