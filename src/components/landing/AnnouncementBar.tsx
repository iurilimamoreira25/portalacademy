'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { ease, focusRing } from './motion'

const CONTENT = {
  lead: '🚀 Em breve: conteúdo exclusivo de treinamento pra sua equipe fechar mais vendas',
  tail: ' com cada cliente',
}

export function AnnouncementBar() {
  const [show, setShow] = useState(true)
  if (!show) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease }}
      className="w-full bg-gradient-to-r from-brand to-brand-3"
    >
      <div className="relative mx-auto flex max-w-6xl items-center justify-center px-10 py-2.5">
        <p className="text-center text-[13px] font-medium text-white sm:text-sm">
          {CONTENT.lead}
          <span className="hidden sm:inline">{CONTENT.tail}</span>.
        </p>
        <button
          onClick={() => setShow(false)}
          aria-label="Fechar aviso"
          className={`absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-white/70 transition-colors hover:bg-white/15 hover:text-white ${focusRing} focus-visible:ring-white focus-visible:ring-offset-brand`}
        >
          <X className="h-4 w-4" strokeWidth={2} aria-hidden />
        </button>
      </div>
    </motion.div>
  )
}
