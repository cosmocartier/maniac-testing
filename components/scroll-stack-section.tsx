"use client"

import type React from "react"
import { useEffect, useRef, useState, useMemo, memo, useCallback } from "react"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

interface StackCard {
  id: string
  code: string
  title: string
  description: string
  visual: React.ReactNode
}

const stackCards: StackCard[] = [
  {
    id: "strategic-analysis",
    code: "PHASE 1",
    title: "BUILD THE CLONE",
    description: "CRAFT YOUR SUPERCHARGED AI CLONE",
    visual: (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="relative w-32 h-32"></div>
      </div>
    ),
  },
  {
    id: "competitive-intelligence",
    code: "PHASE 2",
    title: "REALITY SIMULATION",
    description: "RUN 1M+ STRATEGIC SCEANRIOS IN SECONDS",
    visual: (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="relative w-32 h-32"></div>
      </div>
    ),
  },
  {
    id: "cyber-regulation",
    code: "PHASE 3",
    title: "REWRITE THE FUTURE",
    description: "UNLEASH OUTCOMES NO HUMAN COULD PREDICT",
    visual: (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="space-y-4">
          <div className="flex items-center justify-center"></div>
          <div className="flex items-center justify-center"></div>
        </div>
      </div>
    ),
  },
]

export const ScrollStackSection = memo(function ScrollStackSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  // Optimized scroll with spring physics for smoother animation
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  // Add spring physics for smoother scroll response
  const smoothScrollProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  // Throttled scroll progress calculation with useCallback for performance
  const updateActiveIndex = useCallback(
    (latest: number) => {
      const cardIndex = Math.min(Math.floor(latest * stackCards.length), stackCards.length - 1)
      if (cardIndex !== activeIndex) {
        setActiveIndex(cardIndex)
      }
    },
    [activeIndex],
  )

  // Optimized scroll listener with throttling
  useEffect(() => {
    let ticking = false

    const unsubscribe = smoothScrollProgress.on("change", (latest) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateActiveIndex(latest)
          ticking = false
        })
        ticking = true
      }
    })

    return () => unsubscribe()
  }, [smoothScrollProgress, updateActiveIndex])

  // Memoize cards to prevent unnecessary re-renders
  const memoizedCards = useMemo(
    () =>
      stackCards.map((card, index) => (
        <StackCard
          key={card.id}
          card={card}
          index={index}
          activeIndex={activeIndex}
          totalCards={stackCards.length}
          scrollYProgress={smoothScrollProgress}
        />
      )),
    [activeIndex, smoothScrollProgress],
  )

  return (
    <section
      ref={containerRef}
      className="relative bg-black"
      style={{
        // GPU acceleration for better performance
        willChange: "transform",
        transform: "translateZ(0)",
      }}
    >
      {/* Stacked Cards */}
      <div className="relative z-10">{memoizedCards}</div>
    </section>
  )
})

interface StackCardProps {
  card: StackCard
  index: number
  activeIndex: number
  totalCards: number
  scrollYProgress: any
}

const StackCard = memo(function StackCard({ card, index, activeIndex, totalCards, scrollYProgress }: StackCardProps) {
  // Optimized transform calculations with memoization
  const cardProgress = useMemo(
    () => useTransform(scrollYProgress, [index / totalCards, (index + 1) / totalCards], [0, 1]),
    [scrollYProgress, index, totalCards],
  )

  // Hardware-accelerated transforms
  const y = useTransform(cardProgress, [0, 1], [0, -100])
  const scale = useTransform(cardProgress, [0, 1], [1, 0.95])

  // Z-index calculation for proper stacking - later cards should be on top
  const zIndex = index + 1

  return (
    <motion.div
      id={`stack-card-${index}`}
      className="sticky top-20 h-screen flex items-center justify-center"
      style={{
        y,
        scale,
        zIndex,
        // GPU acceleration
        willChange: "transform",
        transform: "translateZ(0)",
      }}
    >
      <div className="w-full max-w-[98vw] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="relative overflow-hidden shadow-2xl">
          {/* Main Card Content with Vault Styling */}
          <div className="relative group">
            {/* Corner Indicators - Precisely positioned at each corner */}
            <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-white/30 z-30"></div>
            <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-white/30 z-30"></div>
            <div className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-white/30 z-30"></div>
            <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-white/30 z-30"></div>

            {/* Glassmorphism Card - Matching vault component styling */}
            <div
              className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-none relative shadow-[0_8px_32px_rgba(255,255,255,0.1)] hover:shadow-[0_8px_40px_rgba(255,255,255,0.15)] transition-all duration-300"
              style={{
                // GPU acceleration for glassmorphism effects
                willChange: "transform, filter",
                transform: "translateZ(0)",
              }}
            >
              <div className="relative z-10 bg-black/40 backdrop-blur-sm">
                {/* Subtle Dot Pattern Background */}
                <div className="absolute inset-0 z-10">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.03)_1px,transparent_0)] bg-[size:20px_20px]" />
                </div>

                {/* Minimal Curved Lines */}
                <svg
                  className="absolute inset-0 w-full h-full opacity-5 z-10"
                  viewBox="0 0 1200 800"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: "#6B7280", stopOpacity: 0.1 }} />
                      <stop offset="100%" style={{ stopColor: "#374151", stopOpacity: 0.02 }} />
                    </linearGradient>
                  </defs>
                  <path
                    d="M600,100 Q800,200 1000,300 T1200,500"
                    stroke={`url(#gradient-${index})`}
                    strokeWidth="0.5"
                    fill="none"
                  />
                </svg>

                <div className="relative z-20 grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 lg:gap-20 items-center min-h-[60vh] sm:min-h-[65vh] md:min-h-[70vh] lg:min-h-[80vh] p-4 sm:p-6 md:p-8 lg:p-12 xl:p-20">
                  {/* Left Column - Content */}
                  <div className="space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8 text-center lg:text-left">
                    <div className="space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6">
                      {/* Fluid typography for code label */}
                      <div
                        className="font-mono text-gray-400 tracking-caps"
                        style={{
                          fontSize: "clamp(0.6875rem, 0.5rem + 0.75vw, 0.875rem)", // 11px to 14px
                          letterSpacing: "clamp(0.05em, 0.025em + 0.1vw, 0.1em)", // Responsive letter spacing
                        }}
                      >
                        / {card.code}
                      </div>

                      {/* Fluid typography for main title */}
                      <h2
                        className="font-light leading-tight text-white tracking-enhanced"
                        style={{
                          fontSize: "clamp(1.5rem, 0.25rem + 5vw, 3.5rem)", // 24px to 56px
                          lineHeight: "clamp(1.75rem, 0.375rem + 5.5vw, 4rem)", // Proportional line height
                          letterSpacing: "clamp(-0.02em, -0.01em + -0.005vw, -0.025em)", // Tighter spacing on larger sizes
                          wordSpacing: "clamp(0.1em, 0.05em + 0.025vw, 0.15em)", // Responsive word spacing
                        }}
                      >
                        {card.title}
                      </h2>

                      {/* Fluid typography for description */}
                      <p
                        className="text-gray-300 leading-relaxed max-w-none lg:max-w-lg mx-auto lg:mx-0"
                        style={{
                          fontSize: "clamp(0.875rem, 0.75rem + 0.625vw, 1.25rem)", // 14px to 20px
                          lineHeight: "clamp(1.375rem, 1.125rem + 1vw, 1.875rem)", // Proportional line height
                          letterSpacing: "clamp(0.01em, 0.005em + 0.0125vw, 0.025em)", // Subtle letter spacing
                          maxWidth: "clamp(18rem, 12rem + 25vw, 28rem)", // Responsive max width
                        }}
                      >
                        {card.description}
                      </p>
                    </div>

                    <div className="pt-3 sm:pt-4 md:pt-5 lg:pt-6">
                      <Link href="/auth/signup">
                        <Button
                          size="lg"
                          className="rounded-none bg-white text-black hover:bg-gray-200 font-medium transition-all duration-300 hover:scale-105 tracking-caps w-full sm:w-auto"
                          style={{
                            // Fluid typography for button text
                            fontSize: "clamp(0.8125rem, 0.75rem + 0.3125vw, 1rem)", // 13px to 16px
                            padding: "clamp(0.5rem, 0.375rem + 0.625vw, 1rem) clamp(1rem, 0.75rem + 1.25vw, 2rem)", // Responsive padding
                            letterSpacing: "clamp(0.025em, 0.0125em + 0.0625vw, 0.05em)", // Responsive letter spacing
                            // GPU acceleration for hover effects
                            willChange: "transform",
                            transform: "translateZ(0)",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "clamp(0.8125rem, 0.75rem + 0.3125vw, 1rem)", // Ensure span inherits fluid sizing
                            }}
                          >
                            Discover how we help you
                          </span>
                          <ArrowRight
                            className="ml-2 sm:ml-3"
                            style={{
                              width: "clamp(0.875rem, 0.75rem + 0.625vw, 1.125rem)", // 14px to 18px
                              height: "clamp(0.875rem, 0.75rem + 0.625vw, 1.125rem)", // 14px to 18px
                            }}
                          />
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Right Column - Visual */}
                  <div className="relative flex items-center justify-center order-first lg:order-last">
                    <div
                      className="relative z-10"
                      style={{
                        // GPU acceleration for visual elements
                        willChange: "transform",
                        transform: "translateZ(0)",
                        width: "clamp(8rem, 6rem + 10vw, 16rem)", // Responsive visual container
                        height: "clamp(8rem, 6rem + 10vw, 16rem)", // Responsive visual container
                      }}
                    >
                      {card.visual}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
})
