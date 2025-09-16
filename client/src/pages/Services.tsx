import NeonCard from '@/components/NeonCard'
import Section from '@/components/Section'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function Services() {
  const [items, setItems] = useState<Array<{ _id?: string; title: string; description: string }>>([])
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch('/api/services')
        if (r.ok) setItems(await r.json())
      } catch {}
    })()
  }, [])
  return (
    <main>
      <Section title="Our Services">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((s, i) => (
            <motion.div
              key={(s as any)._id || s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: "easeOut" }}
              className="group"
            >
              <NeonCard tone="prism" className="h-full">
                <div className="p-8 h-full flex flex-col transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl hover:shadow-purple-500/20">
                  {/* Icon Section */}
                  <div className="flex items-center justify-center mb-6">
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden group-hover:scale-110 transition-transform duration-500">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-cyan-500/20 group-hover:from-purple-500/40 group-hover:via-blue-500/40 group-hover:to-cyan-500/40 transition-all duration-500" />
                      <div className="absolute inset-0 rounded-2xl ring-1 ring-white/20 group-hover:ring-white/40 group-hover:shadow-lg group-hover:shadow-purple-500/30 transition-all duration-500" />
                      <div className="absolute inset-0 flex items-center justify-center text-2xl group-hover:text-3xl transition-all duration-500">
                        {(s as any).icon || '🚀'}
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="flex-1 flex flex-col">
                    <h3 className="text-xl font-bold mb-3 text-center group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-cyan-400 transition-all duration-500">
                      {s.title}
                    </h3>
                    <p className="text-white/70 text-center leading-relaxed flex-1 group-hover:text-white/90 transition-colors duration-500">
                      {(s as any).description || (s as any).desc}
                    </p>
                  </div>

                  {/* Featured Badge */}
                  {(s as any).featured && (
                    <div className="mt-4 flex justify-center">
                      <span className="px-3 py-1 text-xs font-semibold bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 rounded-full border border-yellow-500/30">
                        Featured
                      </span>
                    </div>
                  )}

                  {/* Hover Effect Overlay */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </div>
              </NeonCard>
            </motion.div>
          ))}
        </div>
        {items.length === 0 && (
          <div className="text-white/60 text-sm mt-4">No services published yet.</div>
        )}
      </Section>
    </main>
  )
}


