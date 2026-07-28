'use client'

import { motion } from 'framer-motion'
import { stagger, rise, inView } from './motion'

const CONTENT = {
  eyebrow: 'Trilha de conteúdo',
  heading: 'Uma trilha guiada por quem vive de vender.',
  subtitle:
    'Aulas gravadas por um especialista em vendas — no ritmo da sua equipe, sempre que ela precisar.',
  modules: [
    { n: '01', title: 'Fundamentos da venda consultiva', desc: 'Descubra a real necessidade antes de falar de preço.', status: 'Disponível' },
    { n: '02', title: 'Quebra de objeções na prática', desc: 'Respostas prontas pras objeções que mais travam a venda.', status: 'Disponível' },
    { n: '03', title: 'Follow-up que fecha', desc: 'Cadência e mensagens que trazem o cliente de volta.', status: 'Disponível' },
    { n: '04', title: 'Negociação e ancoragem de preço', desc: 'Conduza o desconto sem destruir a sua margem.', status: 'Em breve' },
    { n: '05', title: 'Fechamento sem pressão', desc: 'Leve o cliente à decisão sem parecer insistente.', status: 'Em breve' },
    { n: '06', title: 'Pós-venda e recompra', desc: 'Transforme cada cliente em recorrência e indicação.', status: 'Em breve' },
  ] as { n: string; title: string; desc: string; status: 'Disponível' | 'Em breve' }[],
}

export function ContentTrack() {
  return (
    <section id="trilha" aria-labelledby="trilha-title" className="bg-[#f4f7fe] py-24">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div {...inView} className="max-w-2xl">
          <p className="eyebrow text-brand">{CONTENT.eyebrow}</p>
          <h2
            id="trilha-title"
            className="mt-4 text-3xl font-bold leading-tight tracking-[-0.02em] sm:text-4xl md:text-[2.6rem]"
          >
            {CONTENT.heading}
          </h2>
          <p className="mt-5 text-[17px] leading-relaxed text-muted-foreground">{CONTENT.subtitle}</p>
        </motion.div>

        <motion.ul
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {CONTENT.modules.map((m) => {
            const available = m.status === 'Disponível'
            return (
              <motion.li
                key={m.n}
                variants={rise}
                whileHover={{ y: -4 }}
                className="rounded-3xl border border-border bg-white p-7 shadow-soft transition-shadow hover:shadow-card"
              >
                <div className="flex items-center justify-between">
                  <span className="text-gradient text-3xl font-extrabold tracking-tight tnum" aria-hidden>
                    {m.n}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      available ? 'bg-brand-soft text-brand' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {m.status}
                  </span>
                </div>
                <h3 className="mt-5 text-[17px] font-semibold tracking-tight">
                  <span className="sr-only">Módulo {m.n}: </span>
                  {m.title}
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">{m.desc}</p>
              </motion.li>
            )
          })}
        </motion.ul>
      </div>
    </section>
  )
}
