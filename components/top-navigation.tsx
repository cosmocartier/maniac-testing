"use client"

import { Suspense, memo } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { UserAccountDropdown } from "@/components/user-account-dropdown"
import DecryptedText from "@/components/decrypted-text"
import { OptimizedImage } from "@/components/optimized-image"
import { LogoSkeleton, ButtonSkeleton } from "@/components/lazy-components"
import { LanguageToggle } from "@/components/language-toggle"
import { useLanguage } from "@/lib/language-context"

interface TopNavigationProps {
  mobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
  user: any
}

export const TopNavigation = memo(function TopNavigation({
  mobileMenuOpen,
  setMobileMenuOpen,
  user,
}: TopNavigationProps) {
  const { t } = useLanguage()

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/0 bg-black/80 backdrop-blur-lg">
      <div className="container mx-auto px-8 lg:px-12">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <Suspense fallback={<LogoSkeleton />}>
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
              <Link href="/faq">
                <DecryptedText
                  text={t("nav.faq")}
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
                className="py-3 text-sm font-medium text-gray-300 tracking-caps"
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
