"use client"

import Header from "@/components/header"
import HeroContent from "@/components/hero-content"
import PulsingCircle from "@/components/pulsing-circle"
import ShaderBackground from "@/components/shader-background"
import ReviewsSection from "@/components/reviews-section"

export default function ShaderShowcase() {
  return (
    <div className="min-h-screen">
      <div className="h-screen relative">
        <ShaderBackground>
          <Header />
          <HeroContent />
          <PulsingCircle />
        </ShaderBackground>
      </div>

      <div className="bg-black">
        <ReviewsSection />
      </div>
    </div>
  )
}
