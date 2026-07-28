'use client'

import { motion } from 'framer-motion'
import { stagger, rise, inView } from './motion'

// Números ilustrativos/editáveis — ajuste conforme dados reais.
const CONTENT = {
  eyebrow: 'Resultados',
  heading: 'O que muda quando a prática vira rotina.',
  stats: [
    { value: '+38%', label: 'na taxa de conversão média das equipes que treinam' },
    { value: '92/100', label: 'nota média de atendimento após 4 semanas' },
    { value: '< 5s', label: 'para receber a avaliação completa da conversa' },
  ],
}

export function Stats() {
  return (
    <section id="stats" aria-labelledby="stats-title" className="bg-[#f4f7fe] py-24">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div {...inView} className="max-w-2xl">
          <p className="eyebrow text-brand">{CONTENT.eyebrow}</p>
          <h2
            id="stats-title"
            className="mt-4 text-3xl font-bold leading-tight tracking-[-0.02em] sm:text-4xl md:text-[2.6rem]"
          >
            {CONTENT.heading}
          </h2>
        </motion.div>

        <motion.dl
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="mt-14 grid gap-10 sm:grid-cols-3"
        >
          {CONTENT.stats.map((s) => (
            <motion.div key={s.value} variants={rise} className="border-t border-border pt-6">
              <dt className="text-gradient text-5xl font-extrabold tracking-tight tnum sm:text-6xl">
                {s.value}
              </dt>
              <dd className="mt-4 max-w-[16rem] text-[15px] leading-relaxed text-muted-foreground">
                {s.label}
              </dd>
            </motion.div>
          ))}
        </motion.dl>
      </div>
    </section>
  )
}
