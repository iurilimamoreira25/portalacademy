import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Portal Temper Academy',
  description: 'Plataforma de treinamento comercial com IA para vendedores da Portal Temper',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${inter.className} bg-[#080808] text-white min-h-screen antialiased`}>
        <AuthProvider>
          {children}
          <Toaster position="top-right" theme="dark" />
        </AuthProvider>
      </body>
    </html>
  )
}
