import type { ButtonHTMLAttributes } from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { as?: 'a' | 'button'; href?: string }

export default function HoloButton({ as = 'button', href, className = '', children, ...rest }: Props) {
  const base = `relative inline-flex items-center justify-center px-5 py-3 rounded-lg font-semibold 
    text-black shadow-neon transition-transform active:scale-95`;

  const inner = `absolute inset-0 rounded-lg p-[1px] 
    before:content-[''] before:absolute before:inset-0 before:rounded-lg before:bg-[conic-gradient(from_0deg,#8b5cf6,#22d3ee,#34d399,#fde047,#f472b6,#8b5cf6)] before:opacity-80 
    after:content-[''] after:absolute after:inset-[2px] after:rounded-[10px] after:bg-white/80`;

  if (as === 'a' && href) {
    return (
      <a href={href} className={`${base} ${className}`}>
        <span className={inner} aria-hidden />
        <span className="relative z-10 mix-blend-multiply">{children}</span>
      </a>
    )
  }

  return (
    <button className={`${base} ${className}`} {...rest}>
      <span className={inner} aria-hidden />
      <span className="relative z-10 mix-blend-multiply">{children}</span>
    </button>
  )
}


