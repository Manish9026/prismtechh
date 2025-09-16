import NeonCard from '@/components/NeonCard'
import Section from '@/components/Section'
import { useEffect, useState } from 'react'
import Divider from '@/components/Divider'
import { motion } from 'framer-motion'

export default function About() {
  const [about, setAbout] = useState<{ mission?: string; vision?: string; values?: string[] }>({})
  const [team, setTeam] = useState<Array<{ _id: string; name: string; role: string; bio?: string; photo?: string }>>([])
  useEffect(()=>{ (async()=>{ try { const s = await fetch('/api/settings').then(r=>r.ok?r.json():null); if (s?.about) setAbout(s.about) } catch {} })() }, [])
  useEffect(()=>{ (async()=>{ try { const r = await fetch('/api/team'); if(r.ok) setTeam(await r.json()) } catch {} })() }, [])
  return (
    <main>
      <Section title="Who We Are">
        <Divider />
        <div className="grid md:grid-cols-3 gap-6">
          <NeonCard>
            <div className="p-6">
              <h3 className="text-xl font-semibold">Mission</h3>
              <p className="text-white/70 mt-2">{about.mission || 'Engineer futuristic, secure, and blazing-fast digital experiences.'}</p>
            </div>
          </NeonCard>
          <NeonCard>
            <div className="p-6 rounded-xl bg-[radial-gradient(600px_300px_at_50%_0%,rgba(139,92,246,.2),transparent_60%)]">
              <h3 className="text-xl font-semibold">Vision</h3>
              <p className="text-white/70 mt-2">{about.vision || 'A holographic web: immersive, intelligent, and accessible to everyone.'}</p>
            </div>
          </NeonCard>
          <NeonCard>
            <div className="p-6">
              <h3 className="text-xl font-semibold">Values</h3>
              <div className="mt-3 grid grid-cols-3 gap-3 text-sm text-white/80">
                {(about.values && about.values.length>0 ? about.values : ['Innovation','Security','Excellence']).map(v=> (
                  <div key={v} className="glass rounded-lg p-3 text-center">{v}</div>
                ))}
              </div>
            </div>
          </NeonCard>
        </div>
      </Section>

      <Section title="Our Team">
        {team.length === 0 ? (
          <div className="text-white/60 text-sm">Team is managed in the CMS. Add members to display here.</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {team.map((m, i) => (
              <motion.div
                key={m._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ delay: i * 0.1, duration: 0.6, ease: "easeOut" }}
                className="group"
              >
                <NeonCard tone="prism" className="h-full">
                  <div className="p-6 h-full flex flex-col items-center text-center transition-all duration-500 hover:scale-[1.05] hover:shadow-2xl hover:shadow-purple-500/20">
                    {/* Profile Image Section */}
                    <div className="relative mb-6">
                      <div className="w-24 h-24 rounded-2xl bg-black/60 p-[3px] glow-border overflow-hidden group-hover:scale-110 transition-transform duration-500">
                        {m.photo ? (
                          <img 
                            src={`/uploads/${m.photo}`} 
                            alt={m.name} 
                            className="w-full h-full object-cover rounded-[13px] group-hover:brightness-110 transition-all duration-500" 
                          />
                        ) : (
                          <div className="w-full h-full rounded-[13px] bg-gradient-to-br from-purple-500/30 via-blue-500/30 to-cyan-500/30 flex items-center justify-center text-2xl font-bold text-white/80 group-hover:from-purple-500/50 group-hover:via-blue-500/50 group-hover:to-cyan-500/50 transition-all duration-500">
                            {m.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </div>
                        )}
                      </div>
                      {/* Status Indicator */}
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 border-2 border-black/80 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 flex flex-col">
                      <h3 className="text-lg font-bold mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-cyan-400 transition-all duration-500">
                        {m.name}
                      </h3>
                      <p className="text-sm text-purple-400/80 font-medium mb-3 group-hover:text-purple-300 transition-colors duration-500">
                        {m.role}
                      </p>
                      {m.bio && (
                        <p className="text-xs text-white/60 leading-relaxed group-hover:text-white/80 transition-colors duration-500">
                          {m.bio}
                        </p>
                      )}
                    </div>

                    {/* Hover Effect Overlay */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  </div>
                </NeonCard>
              </motion.div>
            ))}
          </div>
        )}
      </Section>

      <Section title="Our Journey">
        <div className="relative pl-6 md:pl-10">
          <div className="absolute left-2 md:left-4 top-0 bottom-0 w-[2px] bg-white/10">
            <div className="absolute inset-x-[-6px] top-0 h-3 bg-prism-gradient blur-sm opacity-70" />
          </div>
          <ul className="space-y-8">
            {[].map((_: any, idx: number) => (
              <li key={idx} className="relative">
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="absolute -left-[9px] md:-left-[7px] top-1.5 w-3 h-3 rounded-full"
                  style={{ background: 'conic-gradient(from 0deg, #8b5cf6, #22d3ee, #34d399, #fde047, #f472b6, #8b5cf6)' }}
                />
                <div className="ml-6 md:ml-10">
                  <div className="text-sm text-white/60">Year</div>
                  <div className="glass rounded-lg p-4 mt-1 text-white/60">Add timeline items in CMS.</div>
                </div>
              </li>
            ))}
          </ul>
          <div className="text-white/60 text-sm mt-4">Timeline is managed in CMS (About Manager).</div>
        </div>
      </Section>
    </main>
  )
}


