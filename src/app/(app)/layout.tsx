'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Sidebar } from '@/components/Sidebar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) router.push('/login')
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f8fc]">
        <div className="h-5 w-5 animate-spin rounded-full border-[1.5px] border-brand/25 border-t-brand" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="flex min-h-screen bg-[#f6f8fc]">
      <Sidebar />
      <main className="ml-[248px] min-h-screen flex-1 overflow-auto">{children}</main>
    </div>
  )
}
