"use client"

import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
import { motion } from "framer-motion"
import UnicornScene from "@/components/main-background"
import LoadingScreen from "@/components/loading-screen"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { UserAccountDropdown } from "@/components/user-account-dropdown"
import DecryptedText from "@/components/decrypted-text"
import { OptimizedImage } from "@/components/optimized-image"
import { LogoSkeleton } from "@/components/lazy-components"

export default function TacticalProblemSolvingPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/signin")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return <LoadingScreen isLoading={true} />
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Unicorn Background */}
      <div className="fixed inset-0 z-0 opacity-30">
        <UnicornScene projectId="8gHd8X3xiGgvI1Eycn9g" width="100%" height="100%" className="w-full h-full" />
      </div>

      {/* Header - Same as other pages */}
      <header className="fixed top-0 z-50 w-full border-b border-white/0 bg-black/80 backdrop-blur-lg">
        <div className="container mx-auto px-8 lg:px-12">
          <div className="flex h-20 items-center justify-between">
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

            <nav className="hidden lg:flex items-center gap-12">
              <div className="w-24 flex justify-center">
                <Link href="/vaults">
                  <DecryptedText
                    text="VAULTS"
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
                    text="INTEGRATIONS"
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
                    text="AGENTS"
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
                    text="PRECISION HUB"
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

            <div className="hidden lg:flex items-center gap-6">
              <UserAccountDropdown />
            </div>

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
                  VAULTS
                </Link>
                <Link
                  href="/cognition"
                  className="py-3 text-sm font-medium text-gray-300 tracking-caps"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  INTEGRATIONS
                </Link>
                <Link
                  href="/agents"
                  className="py-3 text-sm font-medium text-gray-300 tracking-caps"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  AGENTS
                </Link>
                <Link
                  href="/precision-hub"
                  className="py-3 text-sm font-medium text-gray-300 tracking-caps"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  PRECISION HUB
                </Link>
                <div className="flex flex-col gap-4 pt-4 border-t border-white/10">
                  <UserAccountDropdown />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">TACTICAL PROBLEM SOLVING</h1>
          <p className="text-gray-300 text-lg">Configure your problem-solving intelligence agent</p>
        </div>

        <div className="bg-black/20 backdrop-blur-md border border-white/10 p-8 rounded-none">
          <form className="space-y-8">
            <div>
              <input
                type="text"
                placeholder="Problem Domain/Industry"
                className="w-full bg-transparent border-0 border-b border-white/30 rounded-none px-0 py-4 text-white text-base placeholder-white/50 focus:outline-none focus:border-white/60"
              />
            </div>

            <div>
              <input
                type="text"
                placeholder="Problem Complexity Level"
                className="w-full bg-transparent border-0 border-b border-white/30 rounded-none px-0 py-4 text-white text-base placeholder-white/50 focus:outline-none focus:border-white/60"
              />
            </div>

            <div>
              <input
                type="text"
                placeholder="Available Resources & Constraints"
                className="w-full bg-transparent border-0 border-b border-white/30 rounded-none px-0 py-4 text-white text-base placeholder-white/50 focus:outline-none focus:border-white/60"
              />
            </div>

            <div>
              <input
                type="text"
                placeholder="Decision Timeline & Urgency"
                className="w-full bg-transparent border-0 border-b border-white/30 rounded-none px-0 py-4 text-white text-base placeholder-white/50 focus:outline-none focus:border-white/60"
              />
            </div>

            <div>
              <textarea
                placeholder="Specific Problem Description & Context"
                rows={4}
                className="w-full bg-transparent border-0 border-b border-white/30 rounded-none px-0 py-4 text-white text-base placeholder-white/50 focus:outline-none focus:border-white/60 resize-none"
              />
            </div>

            <div className="flex justify-center pt-8">
              <Button className="bg-white text-black hover:bg-gray-200 px-12 py-3 rounded-full font-medium">
                Deploy Agent
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
