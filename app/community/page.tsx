"use client"

import { useState, useEffect, Suspense, memo } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Menu, X, Atom, Zap, Target, Brain, Cpu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { UserAccountDropdown } from "@/components/user-account-dropdown"
import DecryptedText from "@/components/decrypted-text"
import { OptimizedImage } from "@/components/optimized-image"
import { LogoSkeleton, ButtonSkeleton } from "@/components/lazy-components"

const Navigation = memo(function Navigation({
  mobileMenuOpen,
  setMobileMenuOpen,
  user,
}: {
  mobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
  user: any
}) {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/0 bg-black/80 backdrop-blur-lg">
      <div className="container mx-auto px-8 lg:px-12">
        <div className="flex h-20 items-center justify-between">
          {/* Logo - Added Link to navigate back to landing page */}
          <div className="flex items-center gap-4">
            <Suspense fallback={<LogoSkeleton />}>
              <Link href="/">
                <OptimizedImage
                  src="/images/new-brand-logo.png"
                  alt="Mirror X"
                  width={140}
                  height={36}
                  className="h-9 w-auto object-contain cursor-pointer"
                  priority
                  quality={90}
                />
              </Link>
            </Suspense>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-12">
            <div className="w-24 flex justify-center">
              <DecryptedText
                text="FEATURES"
                className="text-sm font-medium text-gray-300 transition-colors hover:text-white cursor-pointer tracking-caps"
                encryptedClassName="text-sm font-medium text-gray-500 transition-colors tracking-caps"
                speed={35}
                sequential={true}
                maxIterations={10}
                animateOn="hover"
              />
            </div>
            <div className="w-32 flex justify-center">
              <DecryptedText
                text="COMMUNITY"
                className="text-sm font-medium text-gray-300 transition-colors hover:text-white cursor-pointer tracking-caps"
                encryptedClassName="text-sm font-medium text-gray-500 transition-colors tracking-caps"
                speed={40}
                sequential={true}
                maxIterations={10}
                animateOn="hover"
              />
            </div>
            <div className="w-20 flex justify-center">
              <Link href="/pricing">
                <DecryptedText
                  text="PRICING"
                  className="text-sm font-medium text-gray-300 transition-colors hover:text-white cursor-pointer tracking-caps"
                  encryptedClassName="text-sm font-medium text-gray-500 transition-colors tracking-caps"
                  speed={35}
                  sequential={true}
                  maxIterations={10}
                  animateOn="hover"
                />
              </Link>
            </div>
            <div className="w-12 flex justify-center">
              <DecryptedText
                text="FAQ"
                className="text-sm font-medium text-gray-300 transition-colors hover:text-white cursor-pointer tracking-caps"
                encryptedClassName="text-sm font-medium text-gray-500 transition-colors tracking-caps"
                speed={30}
                sequential={true}
                maxIterations={10}
                animateOn="hover"
              />
            </div>
          </nav>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center gap-6">
            {user ? (
              <UserAccountDropdown />
            ) : (
              <Suspense fallback={<ButtonSkeleton />}>
                <>
                  <Link href="/auth/signin">
                    <span className="text-sm font-medium text-gray-300 hover:text-white px-4 py-3 tracking-caps">
                      SIGN IN
                    </span>
                  </Link>
                  <Link href="/auth/signup">
                    <Button className="rounded-full bg-white text-black hover:bg-gray-200 text-sm font-medium px-8 py-3 tracking-caps">
                      JOIN THE PLATFORM →
                    </Button>
                  </Link>
                </>
              </Suspense>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-4 lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="hover:bg-transparent active:bg-transparent focus:bg-transparent lg:hover:bg-accent lg:hover:text-accent-foreground lg:active:bg-accent/90"
            >
              {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
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
                href="#features"
                className="py-3 text-sm font-medium text-gray-300 tracking-caps"
                onClick={() => setMobileMenuOpen(false)}
              >
                FEATURES
              </Link>
              <Link
                href="#community"
                className="py-3 text-sm font-medium text-gray-300 tracking-caps"
                onClick={() => setMobileMenuOpen(false)}
              >
                COMMUNITY
              </Link>
              <Link
                href="/pricing"
                className="py-3 text-sm font-medium text-gray-300 tracking-caps"
                onClick={() => setMobileMenuOpen(false)}
              >
                PRICING
              </Link>
              <Link
                href="#faq"
                className="py-3 text-sm font-medium text-gray-300 tracking-caps"
                onClick={() => setMobileMenuOpen(false)}
              >
                FAQ
              </Link>
              <div className="flex flex-col gap-4 pt-4 border-t border-white/10">
                {user ? (
                  <UserAccountDropdown />
                ) : (
                  <>
                    <Link href="/auth/signin">
                      <Button
                        variant="ghost"
                        onClick={() => setMobileMenuOpen(false)}
                        className="justify-start text-gray-300 tracking-caps"
                      >
                        SIGN IN
                      </Button>
                    </Link>
                    <Link href="/auth/signup">
                      <Button
                        onClick={() => setMobileMenuOpen(false)}
                        className="rounded-none bg-white text-black hover:bg-gray-200 tracking-caps"
                      >
                        JOIN THE PLATFORM →
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

const AnimatedTextCycle = memo(function AnimatedTextCycle() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const texts = ["PARTNERSHIPS", "PRESS INQUIRIES", "LAW ENFORCEMENT"]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % texts.length)
    }, 1500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-2">
      {texts.map((text, index) => (
        <div
          key={text}
          className={`text-3xl font-light transition-colors duration-500 ${
            index === currentIndex ? "text-white" : "text-zinc-500"
          }`}
        >
          {text}
        </div>
      ))}
    </div>
  )
})

export default function WaitingListPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [selectedInquiry, setSelectedInquiry] = useState("Partnerships")
  const { user } = useAuth()

  const sections = [
    {
      id: "neural-architecture",
      icon: Atom,
      title: "NEURAL MAPPING",
      description:
        "Advanced Al algorithms analyze your cognitive patterns, decision-making processes, and unique thought structures to create a comprehensive neural blueprint.",
    },
    {
      id: "cognitive-processing",
      icon: Zap,
      title: "INTELLIGENCE SYNTHESIS",
      description:
        "Our proprietary technology synthesizes your mental models, combining machine learning with quantum processing to replicate your intellectual capabilities.",
    },
    {
      id: "precision-targeting",
      icon: Target,
      title: "BEHAVIORAL MODELING",
      description:
        "Deep learning networks study your behavioral patterns, communication style, and strategic thinking to ensure authentic representation.",
    },
    {
      id: "intelligence-core",
      icon: Brain,
      title: "CLONE OPTIMIZATION",
      description:
        "The intelligence clone undergoes rigorous testing and optimization, fine-tuning its responses to match your unique perspective and expertise.",
    },
    {
      id: "quantum-computing",
      icon: Cpu,
      title: "QUANTUM COMPUTING",
      description:
        "Next-generation computing power that processes complex scenarios and delivers insights at unprecedented speeds.",
    },
  ]

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
      })
    }
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black">
        <div className="fixed top-0 z-50 w-full border-b border-white/0 bg-black/80 backdrop-blur-lg h-20" />
        <div className="pt-32">
          <div className="container mx-auto px-8 lg:px-12">
            <div className="text-center">
              <div className="h-8 bg-zinc-800 rounded w-64 mx-auto mb-8" />
              <div className="h-16 bg-zinc-800 rounded w-96 mx-auto" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black relative">
      <Navigation mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} user={user} />

      <div className="fixed left-1 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-3">
        {sections.map((section, index) => {
          return (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className="w-8 h-8 rounded-full bg-zinc-800/80 backdrop-blur-lg flex items-center justify-center hover:bg-zinc-700/90 transition-colors duration-200"
              title={section.title}
            >
              <span className="text-xs font-medium text-zinc-300">/{index + 1}</span>
            </button>
          )
        })}
      </div>

      <section className="pt-32 pb-20 px-8 lg:px-12">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-12"
          >
            <div className="space-y-8">
              <div className="text-xs sm:text-sm font-medium tracking-caps uppercase text-zinc-400">
                JOIN THE FUTURE
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white leading-tight tracking-caps">
                SUPERCHARGED INTELLIGENCE CLONES
              </h1>
              <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                Be among the first to experience the next generation of AI-powered intelligence clones.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="space-y-32 px-8 lg:px-12 pb-32">
        {sections.map((section, index) => {
          const IconComponent = section.icon
          return (
            <section key={section.id} id={section.id} className="container mx-auto max-w-6xl">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className={`grid lg:grid-cols-2 gap-16 items-center ${index % 2 === 1 ? "lg:grid-flow-col-dense" : ""}`}
              >
                <div className={`space-y-8 ${index % 2 === 1 ? "lg:col-start-2" : ""}`}>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-zinc-800/50 flex items-center justify-center">
                      <IconComponent className="w-8 h-8 text-zinc-400" />
                    </div>
                    <div className="text-xs font-medium tracking-caps text-zinc-500">
                      STEP {String(index + 1).padStart(2, "0")}
                    </div>
                  </div>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-white leading-tight tracking-caps">
                    {section.title}
                  </h2>
                  <p className="text-lg text-zinc-400 leading-relaxed">{section.description}</p>
                </div>
                <div className={`${index % 2 === 1 ? "lg:col-start-1" : ""}`}>
                  <div className="aspect-square bg-transparent rounded-full flex items-center justify-center">
                    {index === 0 ? (
                      <OptimizedImage
                        src="/images/step01-visual.png"
                        alt="Step 01 Visual"
                        width={512}
                        height={512}
                        className="w-3/4 h-3/4 md:w-2/3 md:h-2/3 lg:w-3/4 lg:h-3/4 object-contain"
                        sizes="(max-width: 640px) 60vw, (max-width: 1024px) 40vw, 25vw"
                        priority
                      />
                    ) : (
                      <IconComponent className="w-24 h-24 text-zinc-700" />
                    )}
                  </div>
                </div>
              </motion.div>
            </section>
          )
        })}
      </div>

      <div className="relative mx-8 lg:mx-12 mb-32">
        {/* Corner Pointers */}
        <div className="absolute -top-4 -left-4 w-2 h-2 border-l-2 border-t-2 border-zinc-200"></div>
        <div className="absolute -top-4 -right-4 w-2 h-2 border-r-2 border-t-2 border-zinc-200"></div>
        <div className="absolute -bottom-4 -left-4 w-2 h-2 border-l-2 border-b-2 border-zinc-200"></div>
        <div className="absolute -bottom-4 -right-4 w-2 h-2 border-r-2 border-b-2 border-zinc-200"></div>

        <div className="flex flex-col lg:flex-row min-h-[720px] relative">
          {/* Left Column - Dark Block */}
          <div className="flex-1 bg-zinc-0 relative p-12 flex flex-col justify-between">
            {/* Top Left - Get in Touch with Curved Arrow */}
            <div className="flex items-center gap-4">
              <span className="text-white text-xl font-light">Get in Touch</span>
              <img src="/images/curved-arrow.png" alt="Curved Arrow" className="w-4 h-4 object-contain" />
            </div>

            {/* Bottom Left - Animated Text */}
            <div className="space-y-4">
              <AnimatedTextCycle />
            </div>
          </div>

          {/* Separator Line */}
          <div className="w-px bg-zinc-0 hidden lg:block"></div>

          {/* Right Column - Space Background with Form */}
          <div
            className="flex-1 relative overflow-hidden min-h-[720px] lg:min-h-[720px]"
            style={{
              backgroundImage: `url('/images/hero-background.jpg')`,
              backgroundSize: "1020px",
              backgroundPosition: "bottom",
              backgroundRepeat: "no-repeat",
            }}
          >
            {/* Contact Form */}
            <div className="absolute inset-0 flex items-center justify-center p-6 lg:p-12">
              <div className="bg-black/20 backdrop-blur-md border border-white/20 rounded-none p-6 lg:p-8 w-full max-w-sm relative">
                {/* Corner Pointers */}
                <div className="absolute -top-0 -left-0 w-2 h-2 border-l-2 border-t-2 border-white"></div>
                <div className="absolute -top-0 -right-0 w-2 h-2 border-r-2 border-t-2 border-white"></div>
                <div className="absolute -bottom-0 -left-0 w-2 h-2 border-l-2 border-b-2 border-white"></div>
                <div className="absolute -bottom-0 -right-0 w-2 h-2 border-r-2 border-b-2 border-white"></div>

                <h3 className="text-white text-xl font-light mb-6">Get in Touch</h3>

                <form className="space-y-6">
                  <div>
                    <select
                      value={selectedInquiry}
                      onChange={(e) => setSelectedInquiry(e.target.value)}
                      className="w-full bg-transparent border-0 border-b border-white/30 rounded-none px-0 py-3 text-white text-sm placeholder-white/50 focus:outline-none focus:border-white/60"
                    >
                      <option value="Partnerships" className="bg-black/80">
                        Type of Request...
                      </option>
                      <option value="Partnerships" className="bg-black/80">
                        Partnerships
                      </option>
                      <option value="Press Inquiries" className="bg-black/80">
                        Press Inquiries
                      </option>
                      <option value="Law Enforcement" className="bg-black/80">
                        Law Enforcement
                      </option>
                    </select>
                  </div>

                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full bg-transparent border-0 border-b border-white/30 rounded-none px-0 py-3 text-white text-sm placeholder-white/50 focus:outline-none focus:border-white/60"
                  />

                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full bg-transparent border-0 border-b border-white/30 rounded-none px-0 py-3 text-white text-sm placeholder-white/50 focus:outline-none focus:border-white/60"
                  />

                  <input
                    type="text"
                    placeholder="Company"
                    className="w-full bg-transparent border-0 border-b border-white/30 rounded-none px-0 py-3 text-white text-sm placeholder-white/50 focus:outline-none focus:border-white/60"
                  />

                  <textarea
                    placeholder="Message"
                    rows={4}
                    className="w-full bg-transparent border-0 border-b border-white/30 rounded-none px-0 py-3 text-white text-sm placeholder-white/50 focus:outline-none focus:border-white/60 resize-none"
                  ></textarea>

                  <button
                    type="submit"
                    className="w-full bg-white text-black py-3 rounded-full font-medium hover:bg-gray-100 transition-colors mt-8"
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="fixed bottom-0 left-0 right-0 z-50 bg-black border-t border-white/10 backdrop-blur-xl overflow-hidden transition-all duration-700 ease-in-out h-16 hover:h-80">
        <div className="container mx-auto px-8 lg:px-12 py-8 h-full">
          {/* Main Footer Content - Only visible on hover */}
          <div className="opacity-0 hover:opacity-100 transition-opacity duration-300 ease-in-out">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
              {/* Product Column */}
              <div className="space-y-4">
                <h3 className="text-white font-medium text-sm">Product</h3>
                <div className="space-y-3">
                  <Link href="/features" className="block text-gray-300 hover:text-white text-sm transition-colors">
                    Features
                  </Link>
                </div>
              </div>

              {/* Resources Column */}
              <div className="space-y-4">
                <h3 className="text-white font-medium text-sm">Resources</h3>
                <div className="space-y-3">
                  <Link href="/privacy" className="block text-gray-300 hover:text-white text-sm transition-colors">
                    Privacy Policy
                  </Link>
                  <Link href="/terms" className="block text-gray-300 hover:text-white text-sm transition-colors">
                    DeFi Terms of Use
                  </Link>
                  <Link href="/cookies" className="block text-gray-300 hover:text-white text-sm transition-colors">
                    Cookie Policy
                  </Link>
                  <Link href="/aml-kyc" className="block text-gray-300 hover:text-white text-sm transition-colors">
                    AML/KYC Policy
                  </Link>
                  <Link href="/legal" className="block text-gray-300 hover:text-white text-sm transition-colors">
                    Legal Disclaimer
                  </Link>
                </div>
              </div>

              {/* Company Column */}
              <div className="space-y-4">
                <h3 className="text-white font-medium text-sm">Company</h3>
                <div className="space-y-3">
                  <Link href="/about" className="block text-gray-300 hover:text-white text-sm transition-colors">
                    About
                  </Link>
                </div>
              </div>

              {/* Social Column */}
              <div className="space-y-4">
                <h3 className="text-white font-medium text-sm">Our Social</h3>
                <div className="flex gap-4">
                  <Link
                    href="https://www.instagram.com/mirrorx.space"
                    className="text-white hover:text-gray-300 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.073-1.689-.073-4.949 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </Link>
                  <Link href="#" className="text-white hover:text-gray-300 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </Link>
                  <Link href="#" className="text-white hover:text-gray-300 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                    </svg>
                  </Link>
                  <Link href="#" className="text-white hover:text-gray-300 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                &copy; {new Date().getFullYear()} - All rights reserved. Made in Germany
                <img
                  src="/images/germany-flag-icon.svg"
                  alt="Germany Flag"
                  className="w-4 h-3 object-contain opacity-80"
                />
              </div>
              <div className="text-xs text-gray-500 max-w-md text-right">
                Registered Address: Office A, RAK DAO Business Centre, Al Qusais, Ground Floor, Al Rifaa, Sheikh
                Mohammed Bin Zayed Road, Ras Al Khaimah, United Arab Emirates
              </div>
            </div>
          </div>

          {/* Always visible minimal footer bar */}
          <div className="absolute bottom-0 left-0 right-0 h-16 flex items-center justify-center bg-black/30 backdrop-blur-xl border-t border-white/5">
            <div className="flex items-center gap-2 text-xs text-white">MADE IN GERMANY</div>
          </div>
        </div>
      </footer>

      {/* Add bottom padding to prevent content from being hidden behind fixed footer */}
      <div className="h-16" />
    </div>
  )
}
