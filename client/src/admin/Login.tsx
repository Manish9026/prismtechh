import { useState } from 'react'
import type { FormEvent } from 'react'
import { useAuth } from './AuthContext'
import { apiFetch } from './api'

export default function Login() {
  const { setToken } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e: FormEvent) {
    e.preventDefault()
    setErr(''); setLoading(true)
    try {
      const res = await apiFetch<{ token: string }>("/auth/login", { method: 'POST', body: { email, password } })
      setToken(res.token)
      window.location.href = '/admin'
    } catch (e: any) {
      setErr('Invalid credentials')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <form onSubmit={submit} className="glass-dark glow-border rounded-xl p-6 w-full max-w-sm space-y-3">
        <h1 className="text-xl font-semibold">Admin Login</h1>
        <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white outline-none focus:border-white/30" />
        <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white outline-none focus:border-white/30" />
        {err && <div className="text-red-400 text-sm">{err}</div>}
        <button disabled={loading} className="px-4 py-3 w-full rounded-lg bg-prism-gradient text-black font-semibold">{loading ? 'Signing in...' : 'Sign in'}</button>
      </form>
    </div>
  )
}


