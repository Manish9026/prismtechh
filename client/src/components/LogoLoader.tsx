import { useEffect, useState } from 'react'

type Settings = { logo?: string }

export default function LogoLoader(){
  const [logo, setLogo] = useState<string | null>(null)
  useEffect(()=>{ (async()=>{
    try {
      const r = await fetch('/api/settings', { credentials: 'include' })
      if (r.ok) { const s: Settings = await r.json(); if (s?.logo) setLogo(s.logo) }
    } catch {}
  })() }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-black/60 w-screen h-full">
      <div className="relative">
        <div className="absolute inset-0 rounded-full blur-xl" style={{ background:'linear-gradient(135deg,var(--royal-purple),var(--prism-blue))', opacity:.25 }} />
        {logo ? (
          <img src={`/uploads/${logo}`} alt="Prism Tech" className="relative h-12 w-auto drop-shadow-md" />
        ) : (
          <div className="relative w-12 h-12 rounded-lg bg-prism-gradient logo-rotate" />
        )}
      </div>
      <div className="font-orbitron tracking-widest text-white/90">PRISM TECH</div>
    </div>
  )
}


