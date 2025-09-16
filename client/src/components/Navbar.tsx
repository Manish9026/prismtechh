import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `px-2 py-1 nav-underline ${isActive ? 'text-white active' : 'text-white/80 hover:text-white'} transition-colors`

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="relative z-20">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-prism-gradient shadow-neon logo-rotate" />
          <span className="text-white font-orbitron text-lg tracking-widest">PRISM TECH</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <NavLink to="/about" className={navLinkClass}>About</NavLink>
          <NavLink to="/services" className={navLinkClass}>Services</NavLink>
          <NavLink to="/projects" className={navLinkClass}>Projects</NavLink>
          <NavLink to="/pricing" className={navLinkClass}>Pricing</NavLink>
          <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
        </nav>
        <button onClick={() => setOpen(!open)} className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-md glass glow-border">
          <span className="sr-only">Menu</span>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 6H20M4 12H20M4 18H20" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
      </div>
      {open && (
        <div className="md:hidden px-6 pb-4">
          <div className="glass glow-border rounded-lg p-4 flex flex-col gap-2 text-sm">
            <NavLink onClick={() => setOpen(false)} to="/about" className={navLinkClass}>About</NavLink>
            <NavLink onClick={() => setOpen(false)} to="/services" className={navLinkClass}>Services</NavLink>
            <NavLink onClick={() => setOpen(false)} to="/projects" className={navLinkClass}>Projects</NavLink>
            <NavLink onClick={() => setOpen(false)} to="/pricing" className={navLinkClass}>Pricing</NavLink>
            <NavLink onClick={() => setOpen(false)} to="/contact" className={navLinkClass}>Contact</NavLink>
          </div>
        </div>
      )}
    </header>
  )
}


