import Link from 'next/link'
import { Sparkles } from 'lucide-react'

const CONTENT = {
  brand: 'Portal Academy',
  tagline: 'Treinamento comercial com IA.',
  groups: [
    {
      title: 'Produto',
      links: [
        { label: 'Recursos', href: '#simula' },
        { label: 'Como funciona', href: '#como' },
        { label: 'Quem usa', href: '#publico' },
      ],
    },
    {
      title: 'Conta',
      links: [
        { label: 'Entrar', href: '/login' },
        { label: 'Criar conta', href: '/register' },
      ],
    },
    {
      title: 'Contato',
      links: [{ label: 'Falar com a gente', href: 'mailto:contato@portalacademy.com.br' }],
    },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-white">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-brand to-brand-3 text-white">
                <Sparkles className="h-4 w-4" strokeWidth={2} aria-hidden />
              </span>
              <span className="text-[15px] font-semibold tracking-tight">{CONTENT.brand}</span>
            </div>
            <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-muted-foreground">
              {CONTENT.tagline}
            </p>
          </div>

          {CONTENT.groups.map((g) => (
            <div key={g.title}>
              <h3 className="text-[13px] font-semibold text-foreground">{g.title}</h3>
              <ul className="mt-4 space-y-3">
                {g.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-[14px] text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-border pt-6 text-[13px] text-muted-foreground">
          © {new Date().getFullYear()} {CONTENT.brand}. {CONTENT.tagline}
        </div>
      </div>
    </footer>
  )
}
