import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import type { ReactElement } from 'react'

export default function RequireAuth({ children }: { children: ReactElement }) {
  const { token } = useAuth()
  if (!token) return <Navigate to="/admin/login" replace />
  return children
}


