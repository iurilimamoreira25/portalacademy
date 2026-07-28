'use client'

import { MotionConfig } from 'framer-motion'
import { AnnouncementBar } from '@/components/landing/AnnouncementBar'
import { Nav } from '@/components/landing/Nav'
import { Hero } from '@/components/landing/Hero'
import { SimulationBadges } from '@/components/landing/SimulationBadges'
import { Stats } from '@/components/landing/Stats'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { ContentTrack } from '@/components/landing/ContentTrack'
import { LiveTraining } from '@/components/landing/LiveTraining'
import { Audiences } from '@/components/landing/Audiences'
import { FinalCTA } from '@/components/landing/FinalCTA'
import { Footer } from '@/components/landing/Footer'

export default function Home() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen overflow-x-hidden bg-white text-foreground">
        <AnnouncementBar />
        <Nav />
        <main>
          <Hero />
          <SimulationBadges />
          <Stats />
          <HowItWorks />
          <ContentTrack />
          <LiveTraining />
          <Audiences />
          <FinalCTA />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  )
}
