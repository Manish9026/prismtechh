import { useEffect, useMemo, useState } from 'react'
import NeonCard from '@/components/NeonCard'
import { AnimatePresence, motion } from 'framer-motion'

type Testimonial = { name: string; role?: string; quote: string; photo?: string }

export default function Testimonials({ items }: { items?: Testimonial[] }) {
  const [remote, setRemote] = useState<Testimonial[] | null>(null)
  useEffect(()=>{ (async()=>{ if(items) return; try { const r = await fetch('/api/settings'); if(!r.ok) return; const s = await r.json(); if (Array.isArray(s?.testimonials)) setRemote(s.testimonials) } catch {} })() }, [items])
  const testimonials = useMemo<Testimonial[]>(() => remote ?? items ?? [], [items, remote])

  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (!testimonials.length) return
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % testimonials.length)
    }, 4000)
    return () => clearInterval(id)
  }, [testimonials.length])

  return (
    <div className="relative">
      {!testimonials.length && (
        <div className="text-white/60 text-sm">No testimonials yet.</div>
      )}
      <div className="hidden md:grid md:grid-cols-3 gap-6">
        {testimonials.slice(0,3).map((t, i) => (
          <NeonCard key={i}><div className="p-6">
            <Header name={t.name} role={t.role} photo={t.photo} />
            <p className="text-white/80 mt-2">“{t.quote}”</p>
            <Stars />
          </div></NeonCard>
        ))}
      </div>

      <div className="md:hidden relative h-56">
        {testimonials.length > 0 && (
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0"
              >
                <NeonCard>
                  <div className="p-6">
                    <Header name={testimonials[index].name} role={testimonials[index].role} photo={testimonials[index].photo} />
                    <p className="text-white/80 mt-2">“{testimonials[index].quote}”</p>
                    <Stars />
                  </div>
                </NeonCard>
              </motion.div>
            </AnimatePresence>
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setIndex(i)} aria-label={`Go to slide ${i+1}`} className={`w-2.5 h-2.5 rounded-full ${i===index ? 'bg-prism-gradient' : 'bg-white/20'}`} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function Header({ name, role, photo }: { name: string; role?: string; photo?: string }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <div className="w-10 h-10 rounded-md overflow-hidden bg-prism-gradient shadow-neon">
        {photo && <img src={`/uploads/${photo}`} alt={name} className="w-full h-full object-cover" />}
      </div>
      <div>
        <p className="font-semibold">{name}</p>
        {role && <p className="text-xs text-white/60">{role}</p>}
      </div>
    </div>
  )
}

function Stars() {
  return <div className="mt-3 text-yellow-300">★★★★★</div>
}


