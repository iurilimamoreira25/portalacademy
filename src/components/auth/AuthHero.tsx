'use client'

import { type ReactNode, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Sparkles, type LucideIcon } from 'lucide-react'

interface Feature {
  icon: LucideIcon
  title: string
  description: string
}

interface AuthHeroProps {
  eyebrow: string
  children: ReactNode
  features: Feature[]
}

export function AuthHero({ eyebrow, children, features }: AuthHeroProps) {
  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 60, damping: 20 })
  const sy = useSpring(my, { stiffness: 60, damping: 20 })
  const blobX = useTransform(sx, (v) => v * 40)
  const blobY = useTransform(sy, (v) => v * 40)

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      className="relative hidden overflow-hidden bg-[#f4f7fe] lg:flex lg:flex-col lg:justify-between lg:p-14 lg:py-16"
    >
      {/* Ambient mesh */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_70%_60%_at_40%_30%,black,transparent)]" />
        <motion.div style={{ x: blobX, y: blobY }} className="absolute -left-24 top-10 h-96 w-96 rounded-full bg-gradient-to-br from-brand/40 to-brand-2/30 blur-[100px]" />
        <motion.div style={{ x: blobY, y: blobX }} className="absolute -bottom-16 right-0 h-96 w-96 rounded-full bg-gradient-to-br from-brand-3/35 to-cyan/25 blur-[100px]" />
      </div>

      <div className="relative">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand to-brand-3 text-white shadow-glow">
            <Sparkles className="h-4 w-4" strokeWidth={2} />
          </span>
          <span className="text-[13px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{eyebrow}</span>
        </div>
      </div>

      <div className="relative max-w-lg">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-[2.9rem] font-extrabold leading-[1.05] tracking-[-0.03em] text-balance text-foreground"
        >
          {children}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-5 max-w-md text-[15px] leading-relaxed text-muted-foreground"
        >
          Cada sessão gera um cliente simulado com objeções próprias — sua equipe treina as conversas
          difíceis antes que elas aconteçam de verdade.
        </motion.p>
      </div>

      <div className="relative grid gap-4">
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-start gap-3.5"
          >
            <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-border bg-white text-brand shadow-soft">
              <feature.icon className="h-[18px] w-[18px]" strokeWidth={1.9} />
            </span>
            <div>
              <p className="text-[14px] font-semibold text-foreground">{feature.title}</p>
              <p className="mt-0.5 text-[13px] leading-snug text-muted-foreground">{feature.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
