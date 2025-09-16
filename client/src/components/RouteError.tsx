import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom'

export default function RouteError(){
  const error = useRouteError()
  const status = isRouteErrorResponse(error) ? error.status : 500
  const message = isRouteErrorResponse(error) ? (error.statusText || 'Unexpected Error') : (error as any)?.message || 'Something went wrong'
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="relative w-full max-w-xl glass glow-border rounded-2xl p-8 text-center">
        <div className="absolute -inset-[1px] rounded-2xl pointer-events-none" style={{ background: 'conic-gradient(from 0deg, rgba(139,92,246,.25), rgba(34,211,238,.25), rgba(52,211,153,.25), rgba(253,224,71,.25), rgba(244,114,182,.25), rgba(139,92,246,.25))' }} />
        <div className="relative">
          <div className="text-6xl font-bold font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-300 to-emerald-300 drop-shadow-[0_0_20px_rgba(168,85,247,.35)]">
            {status}
          </div>
          <div className="mt-2 text-white/80">
            {message}
          </div>
          <div className="mt-6">
            <Link to="/" className="inline-block px-4 py-2 rounded-lg text-black font-semibold bg-prism-gradient shadow-neon">Go Home</Link>
          </div>
        </div>
      </div>
    </div>
  )
}


