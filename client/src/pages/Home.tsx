import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import HoloButton from '@/components/HoloButton'
import Particles from '@/components/Particles'
import Section from '@/components/Section'
import NeonCard from '@/components/NeonCard'
import Testimonials from '@/components/Testimonials'

type Project = {
  _id: string
  title: string
  description: string
  category: string
  image?: string
  link?: string
  clientName?: string
  timeline?: string
  status: string
  featured: boolean
}

type Service = {
  _id: string
  title: string
  description: string
  icon?: string
  featured: boolean
}


const url="https://prismtech-1.onrender.com";
export default function Home() {
  const [headline, setHeadline] = useState<string>('')
  const [tagline, setTagline] = useState<string>('')
  const [ctas, setCtas] = useState<Array<{ label: string; href: string }>>([])
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([])
  const [featuredServices, setFeaturedServices] = useState<Service[]>([])

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${url}/api/settings`)
        if (!res.ok) return
        const s = await res.json()
        if (s?.home?.headline) setHeadline(s.home.headline)
        if (s?.home?.tagline) setTagline(s.home.tagline)
        if (Array.isArray(s?.home?.ctas)) setCtas(s.home.ctas)
      } catch {}
    })()
  }, [])

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${url}/api/projects/featured`)
        if (!res.ok) return
        const projects = await res.json()
        setFeaturedProjects(projects.slice(0, 3)) // Show only first 3
      } catch {}
    })()
  }, [])

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${url}/api/services/featured`)
        if (!res.ok) return
        const services = await res.json()
        setFeaturedServices(services.slice(0, 3)) // Show only first 3
      } catch {}
    })()
  }, [])
  return (
    <main className="relative z-10">
      <Particles />
      <Section className="pt-10 pb-24">
        <div className="grid md:grid-cols-2 items-center gap-10">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-bold leading-tight font-orbitron"
            >
              {headline}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="mt-4 text-white/70 max-w-xl"
            >
              {tagline}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.8 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              {ctas.slice(0,2).map((c, i) => (
                <HoloButton key={i} as="a" href={c.href}>{c.label}</HoloButton>
              ))}
            </motion.div>
          </div>
          <motion.div
            initial={{ rotateY: 30, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            className="relative aspect-square max-w-md mx-auto"
          >
            <div className="absolute inset-0 rounded-2xl glass glow-border" />
            <div className="absolute inset-0 rounded-2xl bg-prism-radial mix-blend-screen opacity-70" />
            <div className="absolute inset-[10%] rounded-xl bg-black/60 backdrop-blur-md flex items-center justify-center">
              <motion.div
                className="w-24 h-24 rounded-md"
                style={{ background: 'conic-gradient(from 0deg, #8b5cf6, #22d3ee, #34d399, #fde047, #f472b6, #8b5cf6)' }}
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 12, ease: 'linear' }}
              />
            </div>
          </motion.div>
        </div>
      </Section>

      <Section title="Featured Services" className="pb-16">
        <div className="grid md:grid-cols-3 gap-8">
          {featuredServices.length > 0 ? (
            featuredServices.map((service, i) => (
              <motion.div
                key={service._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ delay: i * 0.1, duration: 0.6, ease: "easeOut" }}
                className="group"
              >
                <NeonCard tone="prism" className="h-full">
                  <div className="p-6 h-full flex flex-col transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl hover:shadow-purple-500/20">
                    {/* Icon Section */}
                    <div className="flex items-center justify-center mb-4">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden group-hover:scale-110 transition-transform duration-500">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-cyan-500/20 group-hover:from-purple-500/40 group-hover:via-blue-500/40 group-hover:to-cyan-500/40 transition-all duration-500" />
                        <div className="absolute inset-0 rounded-xl ring-1 ring-white/20 group-hover:ring-white/40 group-hover:shadow-lg group-hover:shadow-purple-500/30 transition-all duration-500" />
                        <div className="absolute inset-0 flex items-center justify-center text-xl group-hover:text-2xl transition-all duration-500">
                          {service.icon || '🚀'}
                        </div>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 flex flex-col text-center">
                      <h3 className="text-lg font-bold mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-cyan-400 transition-all duration-500">
                        {service.title}
                      </h3>
                      <p className="text-white/70 text-sm leading-relaxed flex-1 group-hover:text-white/90 transition-colors duration-500">
                        {service.description}
                      </p>
                    </div>

                    {/* Featured Badge */}
                    <div className="mt-4 flex justify-center">
                      <span className="px-2 py-1 text-xs font-semibold bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 rounded-full border border-yellow-500/30">
                        Featured
                      </span>
                    </div>

                    {/* Hover Effect Overlay */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  </div>
                </NeonCard>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-white/60">
              <p>No featured services yet. Add some services and mark them as featured in the admin panel.</p>
            </div>
          )}
        </div>
        <div className="mt-8"><HoloButton as="a" href="/services">View all services</HoloButton></div>
      </Section>

      <Section title="Featured Projects" className="pb-24">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProjects.length > 0 ? (
            featuredProjects.map(project => (
              <NeonCard key={project._id} className="group">
                <div className="p-4">
                  <div className="aspect-video rounded-lg bg-black/40 border border-white/10 mb-3 overflow-hidden">
                    {project.image ? (
                      <img 
                        src={`/uploads/${project.image}`} 
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/40">
                        <div className="w-12 h-12 rounded bg-prism-gradient opacity-50" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">{project.title}</h3>
                      <span className="text-xs text-cyan-400">{project.category}</span>
                    </div>
                    {project.clientName && (
                      <p className="text-xs text-white/60">Client: {project.clientName}</p>
                    )}
                    <p className="text-white/70 text-sm line-clamp-2">{project.description}</p>
                    {project.link && (
                      <a 
                        href={project.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-cyan-400 underline hover:text-cyan-300"
                      >
                        View Project →
                      </a>
                    )}
                  </div>
                </div>
              </NeonCard>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-white/60">
              <p>No featured projects yet. Add some projects and mark them as featured in the admin panel.</p>
            </div>
          )}
        </div>
        <div className="mt-6"><HoloButton as="a" href="/projects">See all projects</HoloButton></div>
      </Section>

      <Section title="Testimonials" className="pb-24">
        <Testimonials />
      </Section>
    </main>
  )
}

//


