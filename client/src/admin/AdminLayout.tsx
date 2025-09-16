import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { useState, Suspense } from 'react'
import LogoLoader from '../components/LogoLoader'

export default function AdminLayout() {
  const { setToken } = useAuth()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)

  const navItems: Array<[string,string]> = [
    ['Dashboard','/admin'],
    ['Home','/admin/home'],
    ['About','/admin/about'],
    ['Services','/admin/services'],
    ['Projects','/admin/projects'],
    ['Pricing','/admin/pricing'],
    ['Messages','/admin/messages'],
    ['Settings','/admin/settings'],
  ]

  return (
    <div className={`min-h-screen bg-base text-white grid ${collapsed? 'md:grid-cols-[72px_1fr]' : 'md:grid-cols-[240px_1fr]'} transition-[grid-template-columns] duration-300`}>
      {/* Sidebar */}
      <aside className="border-r border-white/10 p-4 bg-black/30 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <Link to="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-prism-gradient shadow-neon" />
            {!collapsed && <span className="font-orbitron tracking-widest text-sm">PRISM TECH</span>}
          </Link>
          <button onClick={()=>setCollapsed(v=>!v)} className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-xs">{collapsed? '›' : '‹'}</button>
        </div>
        <nav className="flex flex-col gap-1 text-sm">
          {navItems.map(([label, href]) => (
            <NavLink key={href} to={href} className={({isActive})=>`group flex items-center gap-3 px-3 py-2 rounded-md border ${isActive?'border-cyan-400 bg-white/5 shadow-neon':'border-white/5 hover:bg-white/5'}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-white/30 group-hover:bg-cyan-400" />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
          <button onClick={()=>{ setToken(null); navigate('/admin/login') }} className="mt-4 text-left px-3 py-2 rounded-md hover:bg-white/5 border border-white/5">Logout</button>
        </nav>
      </aside>

      {/* Main */}
      <main className="p-6 space-y-4">
        {/* Top navbar */}
        <div className="glass-dark rounded-xl px-4 py-3 flex items-center gap-3 border border-white/10">
          <div className="relative flex-1">
            <input placeholder="Search..." className="w-full px-3 py-2 rounded bg-black/40 border border-cyan-500/40 focus:border-cyan-400 outline-none" />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-white/50">⌘K</div>
          </div>
          <button className="px-3 py-2 rounded bg-white/10 hover:bg-white/20 border border-white/10">🔔</button>
          <div className="h-8 w-8 rounded-full bg-prism-gradient" />
          <div className="hidden sm:block text-sm text-white/70">Admin</div>
        </div>

        <Suspense fallback={<LogoLoader />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  )
}


