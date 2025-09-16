import { ReactNode, useMemo } from 'react'

type Tone = 'violet' | 'cyan' | 'emerald' | 'amber' | 'fuchsia' | 'prism'

export default function NeonCard({ children, className = '', tone = 'violet' }: { children: ReactNode, className?: string, tone?: Tone }) {
  const gradient = useMemo(() => toneToGradient(tone), [tone])
  return (
    <div className={`relative rounded-xl p-[1px] card-hover ${className}`} style={{ background: gradient }}>
      <div className="rounded-xl h-full w-full glass-dark">
        {children}
      </div>
    </div>
  )
}

function toneToGradient(tone: Tone): string {
  switch (tone) {
    case 'prism':
      return 'linear-gradient(135deg, #8b5cf6, #22d3ee, #34d399, #fde047, #f472b6)'
    case 'violet':
      return 'linear-gradient(135deg, #8b5cf6, #6366f1)'
    case 'cyan':
      return 'linear-gradient(135deg, #22d3ee, #06b6d4)'
    case 'emerald':
      return 'linear-gradient(135deg, #34d399, #10b981)'
    case 'amber':
      return 'linear-gradient(135deg, #f59e0b, #fde047)'
    case 'fuchsia':
      return 'linear-gradient(135deg, #f472b6, #db2777)'
    default:
      return 'linear-gradient(135deg, #8b5cf6, #6366f1)'
  }
}


