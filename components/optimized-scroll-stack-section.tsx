"use client"

import type React from "react"
import { useEffect, useRef, useState, useMemo, memo } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useLanguage } from "@/lib/language-context"

interface StackCard {
  id: string
  code: string
  title: string
  description: string
  visual: React.ReactNode
}

export const ScrollStackSection = memo(function ScrollStackSection() {
  const { t } = useLanguage()

  const stackCards: StackCard[] = useMemo(
    () => [
      {
        id: "strategic-analysis",
        code: t("scrollStack.phase1"),
        title: t("scrollStack.buildClone"),
        description: t("scrollStack.craftClone"),
        visual: (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="relative w-80 h-60">
              <Image
                src="/images/holographic-data-grid.png"
                alt="Holographic data grid representing AI clone building technology"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        ),
      },
      {
        id: "competitive-intelligence",
        code: t("scrollStack.phase2"),
        title: t("scrollStack.realitySimulation"),
        description: t("scrollStack.runScenarios"),
        visual: (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="relative w-80 h-60">
              <Image
                src="/images/circuit-board-3d.png"
                alt="3D Circuit Board representing reality simulation technology"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        ),
      },
      {
        id: "cyber-regulation",
        code: t("scrollStack.phase3"),
        title: t("scrollStack.rewriteFuture"),
        description: t("scrollStack.unleashOutcomes"),
        visual: (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="relative w-80 h-60">
              <Image
                src="/images/crystal-cube-energy.png"
                alt="Crystal cube with energy streams representing future outcome manipulation"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        ),
      },
    ],
    [t],
  )

  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const cardProgress = useMemo(() => {
    return scrollYProgress
  }, [scrollYProgress])

  useEffect(() => {
    const unsubscribe = cardProgress.on("change", (latest) => {
      const cardIndex = Math.min(Math.floor(latest * stackCards.length), stackCards.length - 1)
      if (cardIndex !== activeIndex) {
        setActiveIndex(cardIndex)
      }
    })

    return () => unsubscribe()
  }, [cardProgress, activeIndex])

  return (
    <section ref={containerRef} className="relative bg-black">
      <div className="relative z-10">
        {stackCards.map((card, index) => (
          <StackCard
            key={card.id}
            card={card}
            index={index}
            activeIndex={activeIndex}
            totalCards={stackCards.length}
            scrollYProgress={scrollYProgress}
          />
        ))}
      </div>
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
  const { t } = useLanguage()

  const cardProgress = useTransform(scrollYProgress, [index / totalCards, (index + 1) / totalCards], [0, 1])

  const y = useTransform(cardProgress, [0, 1], [0, -100])
  const scale = useTransform(cardProgress, [0, 1], [1, 0.95])

  const zIndex = index + 1

  return (
    <motion.div
      id={`stack-card-${index}`}
      className="sticky top-20 h-screen flex items-center justify-center"
      style={{
        y,
        scale,
        zIndex,
      }}
    >
      <div className="w-full max-w-[95vw] sm:max-w-[90vw] lg:max-w-[98vw] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="relative overflow-hidden shadow-2xl">
          <div className="relative group">
            <div className="bg-black relative transition-all duration-300">
              <div className="absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 border-white z-30"></div>
              <div className="absolute top-0 right-0 w-2 h-2 border-r-2 border-t-2 border-white z-30"></div>
              <div className="absolute bottom-0 left-0 w-2 h-2 border-l-2 border-b-2 border-white z-30"></div>
              <div className="absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 border-white z-30"></div>

              <div className="relative z-10">
                <div className="absolute inset-0 z-10">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.03)_1px,transparent_0)] bg-[size:20px_20px]" />
                </div>

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

                <div className="relative z-20 grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center min-h-[70vh] sm:min-h-[80vh] p-6 sm:p-8 lg:p-20">
                  <div className="space-y-6 sm:space-y-8">
                    <div className="space-y-4 sm:space-y-6">
                      <div className="text-xs sm:text-sm font-mono text-gray-400 tracking-caps">/ {card.code}</div>
                      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light leading-tight text-white tracking-enhanced break-words">
                        {card.title}
                      </h2>
                      <p className="text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed max-w-full lg:max-w-lg break-words">
                        {card.description}
                      </p>
                    </div>

                    <div className="pt-4 sm:pt-6">
                      <Link href="/auth/signup">
                        <Button
                          size="lg"
                          className="rounded-full bg-white text-black hover:bg-gray-200 text-sm sm:text-base font-medium px-6 sm:px-10 py-3 sm:py-5 h-auto transition-all duration-300 tracking-caps"
                        >
                          {t("scrollStack.discoverMore")}
                          <ArrowRight className="ml-2 sm:ml-3 w-3 sm:w-4 h-3 sm:h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>

                  <div className="relative flex items-center justify-center">
                    <div className="relative z-10">{card.visual}</div>
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
