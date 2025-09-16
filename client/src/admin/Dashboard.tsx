import { useEffect, useState } from 'react'

type Stats = {
  stats: { visits: number; services: number; projects: number; messages: number; pricing: number },
  recent: { messages: any[]; projects: any[]; services: any[] },
  timeseries?: { messagesPerDay?: { _id: string; count: number }[] },
  breakdowns?: { projectCategories?: { _id: string; count: number }[] }
}

export default function Dashboard(){
  const [data, setData] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(()=>{ (async()=>{
    try { const r = await fetch('/api/admin/stats', { credentials: 'include' }); if(r.ok) setData(await r.json()) }
    finally { setLoading(false) }
  })() }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-orbitron">Dashboard</h1>
      {loading ? <div>Loading...</div> : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label:'Visits', value: data?.stats.visits ?? 0 },
              { label:'Projects', value: data?.stats.projects ?? 0 },
              { label:'Services', value: data?.stats.services ?? 0 },
              { label:'Messages', value: data?.stats.messages ?? 0 },
            ].map((c)=>(
              <div key={c.label} className="rounded-xl p-[1px] shadow-neon card-hover" style={{ background:'linear-gradient(135deg,var(--royal-purple),var(--prism-blue))'}}>
                <div className="glass-dark rounded-xl p-4 border border-white/10">
                  <div className="text-sm text-muted">{c.label}</div>
                  <div className="text-3xl font-orbitron mt-1" style={{ color: 'var(--crystal-white)' }}>{c.value}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-4">
            <div className="glass-dark rounded-xl p-4">
              <h2 className="font-semibold mb-3">Recent Activity</h2>
              <ul className="space-y-2 text-sm">
                {(data?.recent.projects||[]).map((p:any)=> <li key={p._id}>Updated project: {p.title}</li>)}
                {(data?.recent.services||[]).map((s:any)=> <li key={s._id}>Updated service: {s.title}</li>)}
                {(data?.recent.messages||[]).map((m:any)=> <li key={m._id}>Message from {m.email}</li>)}
              </ul>
            </div>
            <div className="glass-dark rounded-xl p-4">
              <h2 className="font-semibold mb-3">Messages (last 14 days)</h2>
              <BarChart data={data?.timeseries?.messagesPerDay||[]} />
            </div>
          </div>

          <div className="glass-dark rounded-xl p-4">
            <h2 className="font-semibold mb-3">Project categories</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
              {(data?.breakdowns?.projectCategories||[]).map((c:any)=> (
                <div key={c._id} className="rounded-xl p-[1px] shadow-neon card-hover" style={{ background:'linear-gradient(135deg,var(--prism-blue),var(--royal-purple))'}}>
                  <div className="glass-dark rounded-xl p-3 flex items-center justify-between border border-white/10">
                    <div className="text-white/80">{c._id||'Uncategorized'}</div>
                    <div className="text-2xl font-orbitron">{c.count}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function BarChart({ data }: { data: { _id: string; count: number }[] }){
  const max = Math.max(1, ...data.map(d=>d.count))
  const colors = ['var(--viz-cyan)','var(--viz-yellow)','var(--viz-pink)','var(--viz-green)']
  return (
    <div className="flex items-end gap-1 h-32">
      {data.map((d, i) => (
        <div
          key={d._id}
          className="flex-1 rounded-sm"
          style={{ height: `${(d.count/max)*100}%`, background: colors[i % colors.length] }}
          title={`${d._id}: ${d.count}`}
        />
      ))}
    </div>
  )
}


