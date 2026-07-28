'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { stagger, rise, inView, focusRing } from './motion'

const CONTENT = {
  eyebrow: 'Treinamento ao vivo',
  heading: 'Uma sessão ao vivo, dedicada à sua equipe.',
  subtitle:
    'Não é uma live aberta genérica. O especialista entra em vídeo chamada só com o time da sua empresa e treina nos desafios e no contexto reais de vocês.',
  steps: [
    { n: '01', title: 'A empresa agenda uma data', desc: 'Vocês escolhem o melhor horário para reunir o time.' },
    { n: '02', title: 'O especialista entra ao vivo', desc: 'Vídeo chamada dedicada, só com os vendedores da sua empresa.' },
    { n: '03', title: 'A equipe treina no contexto real', desc: 'Casos e objeções do dia a dia de vocês, com feedback na hora.' },
  ],
  cta: { label: 'Agendar sessão para minha equipe', href: '#contato' },
}

export function LiveTraining() {
  return (
    <section id="aovivo" aria-labelledby="aovivo-title" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div {...inView} className="max-w-2xl">
          <p className="eyebrow text-brand">{CONTENT.eyebrow}</p>
          <h2
            id="aovivo-title"
            className="mt-4 text-3xl font-bold leading-tight tracking-[-0.02em] sm:text-4xl md:text-[2.6rem]"
          >
            {CONTENT.heading}
          </h2>
          <p className="mt-5 text-[17px] leading-relaxed text-muted-foreground">{CONTENT.subtitle}</p>
        </motion.div>

        <motion.ol
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="mt-14 grid gap-6 md:grid-cols-3"
        >
          {CONTENT.steps.map((s) => (
            <motion.li
              key={s.n}
              variants={rise}
              className="rounded-3xl border border-border bg-white p-7 shadow-soft"
            >
              <span className="text-gradient text-3xl font-extrabold tracking-tight tnum" aria-hidden>
                {s.n}
              </span>
              <h3 className="mt-4 text-[17px] font-semibold tracking-tight">{s.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">{s.desc}</p>
            </motion.li>
          ))}
        </motion.ol>

        <motion.div {...inView} className="mt-12 flex justify-center">
          <a
            href={CONTENT.cta.href}
            className={`group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-[15px] font-semibold text-white shadow-glow transition-transform hover:-translate-y-0.5 ${focusRing}`}
          >
            {CONTENT.cta.label}
            <ArrowRight className="h-[18px] w-[18px] transition-transform group-hover:translate-x-0.5" strokeWidth={2} aria-hidden />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
