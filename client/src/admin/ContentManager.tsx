import { Link } from 'react-router-dom'

const items: Array<{ label: string; desc: string; href: string }> = [
  { label: 'Home', desc: 'Hero, tagline, CTAs, testimonials, background', href: '/admin/home' },
  { label: 'About', desc: 'Mission, vision, values, team, timeline', href: '/admin/about' },
  { label: 'Services', desc: 'Service cards: title, description, icon, order', href: '/admin/services' },
  { label: 'Projects', desc: 'Images, categories, links, order', href: '/admin/projects' },
  { label: 'Pricing', desc: 'Tiers, price, features, popularity', href: '/admin/pricing' },
  { label: 'Team', desc: 'Members, roles, bios, photos, order', href: '/admin/team' },
  { label: 'Messages', desc: 'Inbox with filters, bulk actions, export', href: '/admin/messages' },
  { label: 'Settings', desc: 'Logo, favicon, SEO, social, theme', href: '/admin/settings' },
]

export default function ContentManager(){
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-orbitron">Content Manager</h1>
        <div className="text-white/60 text-sm">Manage content page by page</div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(i => (
          <Link to={i.href} key={i.href} className="rounded-xl p-[1px] card-hover" style={{ background:'linear-gradient(135deg,var(--royal-purple),var(--prism-blue))'}}>
            <div className="glass-dark rounded-xl p-4 h-full border border-white/10">
              <div className="text-lg font-semibold">{i.label}</div>
              <div className="text-white/70 text-sm mt-1">{i.desc}</div>
              <div className="mt-3 text-xs text-white/60">Open →</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}


