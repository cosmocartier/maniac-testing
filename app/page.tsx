"use client"

import { useState, useEffect, Suspense, memo } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ScrollStackSection } from "@/components/optimized-scroll-stack-section"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import LoadingScreen from "@/components/loading-screen"
import { PerformanceMonitor } from "@/components/performance-monitor"
import { OptimizedImage } from "@/components/optimized-image"
import RevealOnView from "@/components/reveal-on-view"
import { useLanguage } from "@/lib/language-context"
import { TopNavigation } from "@/components/top-navigation"
import { SiteFooter } from "@/components/site-footer"

// Memoized navigation component
const Navigation = memo(function Navigation({
  mobileMenuOpen,
  setMobileMenuOpen,
  user,
}: {
  mobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
  user: any
}) {
  const { t } = useLanguage()

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/0 bg-black/80 backdrop-blur-lg">
      <div className="container mx-auto px-8 lg:px-12">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <Suspense fallback={<div className="h-9 w-auto object-contain" />}>
              <OptimizedImage
                src="/images/new-brand-logo.png"
                alt="Mirror X"
                width={140}
                height={36}
                className="h-9 w-auto object-contain"
                priority
                quality={90}
              />
            </Suspense>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-12">
            <div className="w-24 flex justify-center">
              <Link href="/features">
                <div className="text-sm font-medium text-gray-300 transition-colors hover:text-white cursor-pointer tracking-caps">
                  {t("nav.features")}
                </div>
              </Link>
            </div>
            <div className="w-32 flex justify-center">
              <Link href="/community">
                <div className="text-sm font-medium text-gray-300 transition-colors hover:text-white cursor-pointer tracking-caps">
                  {t("nav.community")}
                </div>
              </Link>
            </div>
            <div className="w-20 flex justify-center">
              <Link href="/pricing">
                <div className="text-sm font-medium text-gray-300 transition-colors hover:text-white cursor-pointer tracking-caps">
                  {t("nav.pricing")}
                </div>
              </Link>
            </div>
            <div className="w-12 flex justify-center">
              <Link href="/faq">
                <div className="text-sm font-medium text-gray-300 transition-colors hover:text-white cursor-pointer tracking-caps">
                  {t("nav.faq")}
                </div>
              </Link>
            </div>
          </nav>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center gap-6">
            <div className="text-sm font-medium text-gray-300 hover:text-white px-4 py-3 tracking-caps">
              {t("nav.language")}
            </div>
            {user ? (
              <div className="text-sm font-medium text-gray-300 hover:text-white px-4 py-3 tracking-caps">
                {t("nav.account")}
              </div>
            ) : (
              <Suspense fallback={<div className="h-9 w-auto object-contain" />}>
                <>
                  <Link href="/auth/signin">
                    <div className="text-sm font-medium text-gray-300 hover:text-white px-4 py-3 tracking-caps">
                      {t("nav.signin")}
                    </div>
                  </Link>
                  <Link href="/auth/signup">
                    <Button className="rounded-full bg-white text-black hover:bg-gray-200 text-sm font-medium px-8 py-3 tracking-caps">
                      {t("nav.signup")}
                    </Button>
                  </Link>
                </>
              </Suspense>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-4 lg:hidden">
            <div className="text-sm font-medium text-gray-300 hover:text-white px-4 py-3 tracking-caps">
              {t("nav.language")}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="hover:bg-transparent active:bg-transparent focus:bg-transparent lg:hover:bg-accent lg:hover:text-accent-foreground lg:active:bg-accent/90"
            >
              {mobileMenuOpen ? <div className="size-6">X</div> : <div className="size-6">Menu</div>}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden border-t border-white/10 py-6"
          >
            <div className="flex flex-col gap-6">
              <Link
                href="/features"
                className="py-3 text-sm font-medium text-gray-300 tracking-caps"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("nav.features")}
              </Link>
              <Link
                href="/community"
                className="py-3 text-sm font-medium text-gray-300 tracking-caps"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("nav.community")}
              </Link>
              <Link
                href="/pricing"
                className="py-3 text-sm font-medium text-gray-300 tracking-caps"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("nav.pricing")}
              </Link>
              <Link
                href="/faq"
                className="py-3 text-sm font-medium text-gray-300 tracking-caps"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("nav.faq")}
              </Link>
              <div className="flex flex-col gap-4 pt-4 border-t border-white/10">
                {user ? (
                  <div className="text-sm font-medium text-gray-300 hover:text-white px-4 py-3 tracking-caps">
                    {t("nav.account")}
                  </div>
                ) : (
                  <>
                    <Link href="/auth/signin">
                      <Button
                        variant="ghost"
                        onClick={() => setMobileMenuOpen(false)}
                        className="justify-start text-gray-300 tracking-caps"
                      >
                        {t("nav.signIn")}
                      </Button>
                    </Link>
                    <Link href="/auth/signup">
                      <Button
                        onClick={() => setMobileMenuOpen(false)}
                        className="rounded-full bg-white text-black hover:bg-gray-200 tracking-caps"
                      >
                        {t("nav.joinPlatform")}
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </header>
  )
})

// Memoized hero section
const HeroSection = memo(function HeroSection({ user }: { user: any }) {
  const [showContent, setShowContent] = useState(false)
  const [backgroundOpacity, setBackgroundOpacity] = useState(1)
  const [showStackedText, setShowStackedText] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const { t } = useLanguage()
  const componentNames = t("hero.components.names")
  const hoverMessages = t("hero.components.messages")

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true)
      setBackgroundOpacity(0.4)
      setTimeout(() => {
        setShowStackedText(true)
      }, 500)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <RevealOnView as="section" className="relative min-h-screen bg-black overflow-hidden" intensity="hero">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out sm:bg-[url('/images/bg-simulation.png')] bg-[url('/images/bg-mobile.png')]"
        style={{
          opacity: backgroundOpacity,
          transform: showContent ? "scale(1.05)" : "scale(1)",
        }}
      />
      {/* Dark overlay to maintain text readability */}
      <div className="absolute inset-0 z-0 bg-black/00" />

      {/* Content Container */}
      <div className="relative z-20 container mx-auto px-4 sm:px-8 lg:px-12 pt-24 sm:pt-32 pb-20">
        <div className="grid lg:grid-cols-1 gap-16 lg:gap-20 items-center min-h-[calc(100vh-8rem)]">
          {/* Left Column - Main Content */}
          <div className="absolute left-8 top-1/2 transform -translate-y-1/2 space-y-1">
            {componentNames.map((name: string, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, filter: "blur(10px)" }}
                animate={{
                  opacity: showStackedText ? 1 : 0,
                  filter: showStackedText ? "blur(0px)" : "blur(10px)",
                }}
                transition={{
                  duration: 0.6,
                  delay: showStackedText ? index * 0.1 : 0,
                  ease: "easeOut",
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`text-xs sm:text-sm lg:text-base font-thin tracking-[0.2em] sm:tracking-[0.3em] lg:tracking-[0.4em] uppercase cursor-pointer transition-colors duration-300 ${
                  hoveredIndex === null ? "text-white" : hoveredIndex === index ? "text-lime-400" : "text-zinc-400"
                }`}
              >
                {name}
              </motion.div>
            ))}
          </div>

          {/* Hover text that appears from bottom right */}
          <AnimatePresence>
            {hoveredIndex !== null && (
              <motion.div
                initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                exit={{ opacity: 0, filter: "blur(10px)", y: 20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="fixed bottom-33 right-8 z-30 text-lime-400 text-md uppercase font-bold tracking-wide max-w-xs"
              >
                {hoverMessages[hoveredIndex]}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </RevealOnView>
  )
})

// Memoized company logos section
const CompanyLogosSection = memo(function CompanyLogosSection() {
  const { t } = useLanguage()
  const companyLogos = [
    { src: "/images/company-logos/logo-1.png", alt: "Partner 1" },
    { src: "/images/company-logos/logo-2.png", alt: "Partner 2" },
    { src: "/images/company-logos/logo-3.png", alt: "Partner 3" },
    { src: "/images/company-logos/logo-4.png", alt: "Partner 4" },
    { src: "/images/company-logos/logo-5.png", alt: "Partner 5" },
  ]

  const duplicatedLogos = [...companyLogos, ...companyLogos]

  return (
    <RevealOnView
      as="section"
      className="relative w-full bg-black overflow-hidden pt-20 sm:pt-24 lg:pt-32"
      intensity="soft"
    >
      {/* Trusted Companies Text */}
      <div className="text-center pb-4 sm:pb-0 lg:pb-0">
        <h2 className="text-xs sm:text-sm lg:text-base font-thin tracking-[0.2em] sm:tracking-[0.3em] lg:tracking-[0.4em] text-white uppercase">
          {t("companies.trusted")}
        </h2>
      </div>

      {/* Logo Animation Container */}
      <div className="relative w-full h-[230px]">
        {/* Left shadow gradient */}
        <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-black to-transparent z-10" />

        {/* Right shadow gradient */}
        <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-black to-transparent z-10" />

        {/* Scrolling logos container */}
        <div className="flex items-center h-full">
          <motion.div
            className="flex items-center gap-16"
            animate={{
              x: [100, -50 * (companyLogos.length + 1)],
            }}
            transition={{
              duration: 20,
              ease: "linear",
              repeat: Number.POSITIVE_INFINITY,
            }}
            style={{
              width: `${(60 + 200) * duplicatedLogos.length}px`,
            }}
          >
            {duplicatedLogos.map((logo, index) => (
              <div
                key={index}
                className="flex-shrink-0 flex items-center justify-center"
                style={{ width: "160px", height: "160px" }}
              >
                <OptimizedImage
                  src={logo.src || "/placeholder.svg"}
                  alt={logo.alt}
                  width={160}
                  height={160}
                  className="w-full h-full object-contain opacity-70 grayscale"
                  style={{
                    filter: "grayscale(100%) brightness(0.8)",
                  }}
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </RevealOnView>
  )
})

// Memoized rotating text section
const RotatingTextSection = memo(function RotatingTextSection() {
  const { t } = useLanguage()

  return (
    <RevealOnView as="section" className="relative py-20 lg:py-32 bg-black overflow-hidden" intensity="hero">
      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-8 lg:px-12">
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-8">
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light text-white leading-tight tracking-enhanced">
            {'"'}
            {t("hero.feels")} <span className="text-lime-300">{t("hero.cheating")}</span>
            {'."'}
          </h2>
          <Button
            size="lg"
            className="rounded-full bg-white text-black hover:bg-gray-200 text-base font-medium px-8 py-4 h-auto tracking-caps"
          >
            {t("hero.agree")}
          </Button>
        </div>
      </div>
    </RevealOnView>
  )
})

const AnimatedTextCycle = memo(function AnimatedTextCycle() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const texts = ["STRATEGIC", "INTELLIGENCE", "SOFTWARE"]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % texts.length)
    }, 1500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-1">
      {texts.map((text, index) => (
        <div
          key={text}
          className={`text-4xl sm:text-4xl md:text-4xl lg:text-9xl xl:text-9xl 2xl:text-8xl font-light transition-colors duration-500 tracking-[0.05em] ${
            index === currentIndex ? "text-white" : "text-zinc-500"
          }`}
        >
          {text}
        </div>
      ))}
    </div>
  )
})

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <PerformanceMonitor />

      <AnimatePresence>
        <LoadingScreen isLoading={isLoading} />
      </AnimatePresence>

      {!isLoading && (
        <>
          <TopNavigation mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} user={user} />

          <HeroSection user={user} />

          {/* Company Logos Section */}
          <CompanyLogosSection />

          {/* Scroll Stack Section */}
          <RevealOnView intensity="soft">
            <Suspense fallback={<div className="h-screen bg-black" />}>
              <ScrollStackSection />
            </Suspense>
          </RevealOnView>

          {/* Rotating Text Section */}
          <RotatingTextSection />

          <SiteFooter />

          {/* Add bottom padding to prevent content from being hidden behind fixed footer */}
          <div className="h-16" />
        </>
      )}
    </>
  )
}
