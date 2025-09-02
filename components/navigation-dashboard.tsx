"use client"
import { Suspense } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { UserAccountDropdown } from "@/components/user-account-dropdown"
import DecryptedText from "@/components/decrypted-text"
import { OptimizedImage } from "@/components/optimized-image"
import { LogoSkeleton } from "@/components/lazy-components"
import { useLanguage } from "@/lib/language-context"

interface NavigationDashboardProps {
  mobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
}

export function NavigationDashboard({ mobileMenuOpen, setMobileMenuOpen }: NavigationDashboardProps) {
  const { t } = useLanguage()

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/0 bg-black/80 backdrop-blur-lg">
      <div className="container mx-auto px-8 lg:px-12">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Suspense fallback={<LogoSkeleton />}>
                <OptimizedImage
                  src="/images/new-brand-logo.png"
                  alt="Mirror X"
                  width={140}
                  height={36}
                  className="h-9 w-auto object-contain cursor-pointer"
                  priority
                  quality={90}
                />
              </Suspense>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-12">
            <div className="w-24 flex justify-center">
              <Link href="/vaults">
                <DecryptedText
                  text={t("dashboard.nav.vaults")}
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
              <Link href="/cognition">
                <DecryptedText
                  text={t("dashboard.nav.integrations")}
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
              <Link href="/agents">
                <DecryptedText
                  text={t("dashboard.nav.agents")}
                  className="text-sm font-medium text-gray-300 transition-colors hover:text-white cursor-pointer tracking-caps"
                  encryptedClassName="text-sm font-medium text-gray-500 transition-colors tracking-caps"
                  speed={35}
                  sequential={true}
                  maxIterations={10}
                  animateOn="hover"
                />
              </Link>
            </div>
            <div className="w-35 flex justify-center">
              <Link href="/precision-hub">
                <DecryptedText
                  text={t("dashboard.nav.precisionHub")}
                  className="text-sm font-medium text-gray-300 transition-colors hover:text-white cursor-pointer tracking-caps"
                  encryptedClassName="text-sm font-medium text-gray-500 transition-colors tracking-caps"
                  speed={30}
                  sequential={true}
                  maxIterations={10}
                  animateOn="hover"
                />
              </Link>
            </div>
          </nav>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center gap-6">
            <UserAccountDropdown />
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
                href="/vaults"
                className="py-3 text-sm font-medium text-gray-300 tracking-caps"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("dashboard.nav.vaults")}
              </Link>
              <Link
                href="/cognition"
                className="py-3 text-sm font-medium text-gray-300 tracking-caps"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("dashboard.nav.integrations")}
              </Link>
              <Link
                href="/agents"
                className="py-3 text-sm font-medium text-gray-300 tracking-caps"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("dashboard.nav.agents")}
              </Link>
              <Link
                href="/precision-hub"
                className="py-3 text-sm font-medium text-gray-300 tracking-caps"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("dashboard.nav.precisionHub")}
              </Link>
              <div className="flex flex-col gap-4 pt-4 border-t border-white/10">
                <UserAccountDropdown />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </header>
  )
}

export default NavigationDashboard
