import { createContext, useContext, useEffect, useMemo, useState } from 'react'

type AuthState = { token: string | null, setToken: (t: string | null) => void }

const Ctx = createContext<AuthState>({ token: null, setToken: () => {} })

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('adm_t') )
  useEffect(() => {
    if (token) localStorage.setItem('adm_t', token); else localStorage.removeItem('adm_t')
  }, [token])
  const value = useMemo(() => ({ token, setToken }), [token])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useAuth() { return useContext(Ctx) }


