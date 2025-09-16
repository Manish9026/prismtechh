import { useEffect, useState } from 'react'
import NeonCard from '@/components/NeonCard'
import Section from '@/components/Section'
import { motion } from 'framer-motion'

export default function Projects() {
  const [allProjects, setAll] = useState<Array<{ 
    _id?: string; 
    title: string; 
    description: string; 
    category: 'Web App'|'CMS'|'Cybersecurity'|'Cloud'; 
    image?: string;
    link?: string;
    clientName?: string;
    timeline?: string;
    status: string;
    featured: boolean;
  }>>([])
  useEffect(()=>{ (async()=>{ try { const r = await fetch('/api/projects'); if (r.ok) setAll(await r.json()) } catch {} })() }, [])
  const [filter, setFilter] = useState<'All' | 'Web App' | 'CMS' | 'Cybersecurity' | 'Cloud'>('All')
  const [statusFilter, setStatusFilter] = useState<'All' | 'Draft' | 'In Progress' | 'Completed' | 'Archived'>('All')
  
  const shown = allProjects.filter(p => {
    const categoryMatch = filter === 'All' ? true : p.category === filter
    const statusMatch = statusFilter === 'All' ? true : p.status === statusFilter
    return categoryMatch && statusMatch
  })

  return (
    <main>
      <Section title="Our Work">
        <div className="space-y-4 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm text-white/60">Category:</span>
            {(['All','Web App','CMS','Cybersecurity','Cloud'] as const).map(c => (
              <button key={c} onClick={() => setFilter(c)} className={`px-3 py-1.5 rounded-md text-sm ${filter===c? 'bg-prism-gradient text-black shadow-neon' : 'glass text-white/80 hover:text-white'}`}>{c}</button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm text-white/60">Status:</span>
            {(['All','Draft','In Progress','Completed','Archived'] as const).map(s => (
              <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 rounded-md text-sm ${statusFilter===s? 'bg-cyan-500/20 border border-cyan-400 text-cyan-400' : 'glass text-white/80 hover:text-white'}`}>{s}</button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-white/60">
            Showing {shown.length} of {allProjects.length} projects
          </div>
          <div className="text-sm text-white/60">
            {allProjects.filter(p => p.featured).length} featured
          </div>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {shown.map((p: any, i: number) => (
            <motion.div
              key={`${p._id||p.title}-${i}`}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
            >
              <div className="block group">
                <NeonCard tone="prism">
                  <div className="p-4">
                    <div className="relative aspect-video rounded-lg overflow-hidden mb-3">
                      {p.image ? (
                        <img src={`/uploads/${p.image}`} alt={p.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="absolute inset-0 bg-prism-gradient group-hover:shadow-neon transition" />
                      )}
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition" />
                      {p.featured && (
                        <div className="absolute top-2 right-2 px-2 py-1 rounded bg-yellow-500/20 border border-yellow-400 text-yellow-400 text-xs">
                          Featured
                        </div>
                      )}
                      <div className="absolute top-2 left-2 px-2 py-1 rounded bg-purple-500/20 border border-purple-400 text-purple-400 text-xs">
                        {p.status}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">{p.title}</h3>
                        <span className="text-xs text-cyan-400">{p.category}</span>
                      </div>
                      
                      {p.clientName && (
                        <p className="text-xs text-white/60">Client: {p.clientName}</p>
                      )}
                      
                      {p.timeline && (
                        <p className="text-xs text-green-400">Timeline: {p.timeline}</p>
                      )}
                      
                      <p className="text-white/70 text-sm line-clamp-2">{p.description || p.desc}</p>
                      
                      {p.link && (
                        <a 
                          href={p.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-cyan-400 underline hover:text-cyan-300 transition-colors"
                        >
                          View Project →
                        </a>
                      )}
                    </div>
                  </div>
                </NeonCard>
              </div>
            </motion.div>
          ))}
        </div>
        {shown.length === 0 && (
          <div className="text-white/60 text-sm mt-4">No projects available for this category.</div>
        )}
      </Section>
    </main>
  )
}


