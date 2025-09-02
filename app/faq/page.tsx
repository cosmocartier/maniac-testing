"use client"

import { useState, useEffect, Suspense, memo } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"
import { UserAccountDropdown } from "@/components/user-account-dropdown"
import { LanguageToggle } from "@/components/language-toggle"
import DecryptedText from "@/components/decrypted-text"
import SequentialLetterAnimation from "@/components/sequential-letter-animation"
import LoadingScreen from "@/components/loading-screen"
import { PerformanceMonitor } from "@/components/performance-monitor"
import { OptimizedImage } from "@/components/optimized-image"
import { LogoSkeleton, ButtonSkeleton } from "@/components/lazy-components"

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
              <Link href="/features">
                <DecryptedText
                  text={t("nav.features")}
                  className="text-sm font-medium text-gray-300 transition-colors hover:text-white cursor-pointer tracking-caps"
                  encryptedClassName="text-sm font-medium text-gray-500 transition-colors tracking-caps"
                  speed={35}
                  sequential={true}
                  maxIterations={10}
                  animateOn="hover"
                />
              </Link>
            </div>
            <div className="w-32 flex justify-center">
              <Link href="/community">
                <DecryptedText
                  text={t("nav.community")}
                  className="text-sm font-medium text-gray-300 transition-colors hover:text-white cursor-pointer tracking-caps"
                  encryptedClassName="text-sm font-medium text-gray-500 transition-colors tracking-caps"
                  speed={40}
                  sequential={true}
                  maxIterations={10}
                  animateOn="hover"
                />
              </Link>
            </div>
            <div className="w-20 flex justify-center">
              <Link href="/pricing">
                <DecryptedText
                  text={t("nav.pricing")}
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
                text={t("nav.faq")}
                className="text-sm font-medium text-white transition-colors hover:text-white cursor-pointer tracking-caps"
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
            <LanguageToggle />
            {user ? (
              <UserAccountDropdown />
            ) : (
              <Suspense fallback={<ButtonSkeleton />}>
                <>
                  <Link href="/auth/signin">
                    <span className="text-sm font-medium text-gray-300 hover:text-white px-4 py-3 tracking-caps">
                      {t("nav.signIn")}
                    </span>
                  </Link>
                  <Link href="/auth/signup">
                    <Button className="rounded-full bg-white text-black hover:bg-gray-200 text-sm font-medium px-8 py-3 tracking-caps">
                      {t("nav.joinPlatform")}
                    </Button>
                  </Link>
                </>
              </Suspense>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-4 lg:hidden">
            <LanguageToggle />
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
                className="py-3 text-sm font-medium text-white tracking-caps"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("nav.faq")}
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

// FAQ Item Component
const FAQItem = memo(function FAQItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div className="bg-black/20 backdrop-blur-md border-0 border-b border-white/20 rounded-none">
      <button
        onClick={onToggle}
        className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <span className="text-white font-medium text-sm uppercase">{question}</span>
        <ChevronDown className={`w-5 h-5 text-white transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 text-zinc-500 text-sm leading-relaxed">{answer}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
})

export default function FAQPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [openItems, setOpenItems] = useState<number[]>([])
  const { user } = useAuth()
  const { t } = useLanguage()

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const toggleItem = (index: number) => {
    setOpenItems((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  const faqQuestions = (t("faq.questions") as string[]) || []
  const faqAnswers = (t("faq.answers") as string[]) || []

  const faqData = faqQuestions.map((question: string, index: number) => ({
    question,
    answer: faqAnswers[index] || "",
  }))

  return (
    <>
      <PerformanceMonitor />

      <AnimatePresence>
        <LoadingScreen isLoading={isLoading} />
      </AnimatePresence>

      {!isLoading && (
        <>
          <Navigation mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} user={user} />

          {/* Main Content */}
          <main className="relative min-h-screen bg-black pt-20 pb-32">
            <div className="container mx-auto px-8 lg:px-12 py-32">
              {/* Header Section */}
              <div className="text-center mb-20">
                <SequentialLetterAnimation
                  text={t("faq.title")}
                  className="text-4xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-5xl font-light text-white leading-tight tracking-enhanced"
                  duration={0.3}
                  staggerDelay={0.05}
                />
              </div>

              {/* FAQ Content */}
              <div className="max-w-4xl mx-auto">
                <div className="space-y-2">
                  {faqData.map((item: any, index: number) => (
                    <FAQItem
                      key={index}
                      question={item.question}
                      answer={item.answer}
                      isOpen={openItems.includes(index)}
                      onToggle={() => toggleItem(index)}
                    />
                  ))}
                </div>

                {/* Contact Section */}
                <div className="mt-16 text-center">
                  <div className="bg-black/20 backdrop-blur-md border border-transparent rounded-none p-8">
                    <h3 className="text-white text-xl font-medium mb-4">{t("faq.stillHaveQuestions")}</h3>
                    <p className="text-gray-300 mb-6">{t("faq.cantFindAnswer")}</p>
                    <Link href="/privacy#contact">
                      <Button className="rounded-full bg-white text-black hover:bg-gray-200 text-sm font-medium px-8 py-3 tracking-caps">
                        {t("faq.contactSupport")}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </main>

          <footer className="fixed bottom-0 left-0 right-0 z-50 bg-black border-t border-white/0 backdrop-blur-xl overflow-hidden transition-all duration-700 ease-in-out h-16 hover:h-80">
            <div className="container mx-auto px-8 lg:px-12 py-8 h-full">
              {/* Main Footer Content - Only visible on hover */}
              <div className="opacity-40 hover:opacity-100 transition-opacity duration-300 ease-in-out">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                  {/* Product Column */}
                  <div className="space-y-4">
                    <h3 className="text-white font-medium text-large">{t("footer.product")}</h3>
                    <div className="space-y-3">
                      <Link
                        href="/features"
                        className="block text-gray-300 hover:text-white text-sm transition-colors break-words"
                      >
                        {t("footer.features")}
                      </Link>
                    </div>
                  </div>

                  {/* Resources Column */}
                  <div className="space-y-4">
                    <h3 className="text-white font-medium text-large">{t("footer.resources")}</h3>
                    <div className="space-y-3">
                      <Link
                        href="/privacy"
                        className="block text-gray-300 hover:text-white text-sm transition-colors break-words"
                      >
                        {t("footer.privacyPolicy")}
                      </Link>
                      <Link
                        href="/terms"
                        className="block text-gray-300 hover:text-white text-sm transition-colors break-words"
                      >
                        {t("footer.termsOfUse")}
                      </Link>
                      <Link
                        href="/cookies"
                        className="block text-gray-300 hover:text-white text-sm transition-colors break-words"
                      >
                        {t("footer.cookiePolicy")}
                      </Link>
                      <Link
                        href="/aml-kyc"
                        className="block text-gray-300 hover:text-white text-sm transition-colors break-words"
                      >
                        {t("footer.amlKycPolicy")}
                      </Link>
                      <Link
                        href="/legal"
                        className="block text-gray-300 hover:text-white text-sm transition-colors break-words"
                      >
                        {t("footer.legalDisclaimer")}
                      </Link>
                    </div>
                  </div>

                  {/* Company Column */}
                  <div className="space-y-4">
                    <h3 className="text-white font-medium text-large">{t("footer.company")}</h3>
                    <div className="space-y-3">
                      <Link
                        href="/about"
                        className="block text-gray-300 hover:text-white text-sm transition-colors break-words"
                      >
                        {t("footer.about")}
                      </Link>
                    </div>
                  </div>

                  {/* Social Column */}
                  <div className="space-y-4">
                    <h3 className="text-white font-medium text-large">{t("footer.social")}</h3>
                    <div className="flex gap-4">
                      <Link
                        href="https://www.instagram.com/mirrorx.space"
                        className="text-white hover:text-gray-300 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.919-.058-1.265-.073-1.689-.073-4.949 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
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
                    {t("footer.copyright")}
                    <img
                      src="/images/germany-flag-icon.svg"
                      alt="Germany Flag"
                      className="w-4 h-3 object-contain opacity-80"
                    />
                  </div>
                  <div className="text-xs text-gray-500 max-w-md text-right break-words">{t("footer.address")}</div>
                </div>
              </div>

              {/* Always visible minimal footer bar */}
              <div className="absolute bottom-0 left-0 right-0 h-16 flex items-center justify-center bg-black/30 backdrop-blur-xl border-t border-white/0">
                <div className="flex items-center gap-2 text-xs text-white">{t("footer.madeInGermany")}</div>
              </div>
            </div>
          </footer>

          {/* Add bottom padding to prevent content from being hidden behind fixed footer */}
          <div className="h-16" />
        </>
      )}
    </>
  )
}
