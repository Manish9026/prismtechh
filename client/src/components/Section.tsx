import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'

export default function Section({ id, title, subtitle, children, className = '' }: { id?: string, title?: string, subtitle?: string, children: ReactNode, className?: string }) {
  const ref = useRef<HTMLElement | null>(null)
  useEffect(()=>{
    const el = ref.current
    if(!el) return
    el.classList.add('reveal')
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{ if (e.isIntersecting) el.classList.add('in-view') })
    }, { threshold: 0.12 })
    io.observe(el)
    return ()=> io.disconnect()
  },[])
  return (
    <section ref={ref as any} id={id} className={`max-w-7xl mx-auto px-6 py-12 ${className}`}>
      {(title || subtitle) && (
        <div className="mb-8">
          {title && <h2 className="text-3xl md:text-4xl font-orbitron">{title}</h2>}
          {subtitle && <p className="text-white/70 mt-2">{subtitle}</p>}
        </div>
      )}
      {children}
    </section>
  )
}


