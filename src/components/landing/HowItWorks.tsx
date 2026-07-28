'use client'

import { motion } from 'framer-motion'
import { stagger, rise, inView } from './motion'

const CONTENT = {
  eyebrow: 'Como funciona',
  heading: 'Três passos. Nenhuma teoria.',
  steps: [
    {
      n: '01',
      title: 'Escolha o cenário',
      body: 'Selecione o tipo de cliente e o contexto do atendimento — ou deixe a IA sortear um desafio novo.',
    },
    {
      n: '02',
      title: 'Converse de verdade',
      body: 'O cliente simulado reage às suas respostas, com objeções, humor e orçamento próprios.',
    },
    {
      n: '03',
      title: 'Receba a avaliação',
      body: 'Dez critérios pontuados em segundos, com o que manter e o que ajustar na próxima conversa.',
    },
  ],
}

export function HowItWorks() {
  return (
    <section id="como" aria-labelledby="como-title" className="mx-auto max-w-6xl px-6 py-24">
      <motion.div {...inView} className="max-w-2xl">
        <p className="eyebrow text-brand">{CONTENT.eyebrow}</p>
        <h2
          id="como-title"
          className="mt-4 text-3xl font-bold leading-tight tracking-[-0.02em] sm:text-4xl md:text-[2.6rem]"
        >
          {CONTENT.heading}
        </h2>
      </motion.div>

      <motion.ol
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
        className="mt-14 space-y-0"
      >
        {CONTENT.steps.map((s) => (
          <motion.li
            key={s.n}
            variants={rise}
            className="flex flex-col gap-3 border-t border-border py-10 first:border-t-0 first:pt-0 sm:flex-row sm:gap-10"
          >
            <span
              className="text-gradient shrink-0 text-5xl font-extrabold leading-none tracking-tight tnum sm:w-28 sm:text-6xl"
              aria-hidden
            >
              {s.n}
            </span>
            <div>
              <h3 className="text-xl font-semibold tracking-tight">{s.title}</h3>
              <p className="mt-2.5 max-w-xl text-[15px] leading-relaxed text-muted-foreground">{s.body}</p>
            </div>
          </motion.li>
        ))}
      </motion.ol>
    </section>
  )
}
