"use client"

import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
import { motion } from "framer-motion"
import UnicornScene from "@/components/main-background"
import LoadingScreen from "@/components/loading-screen"
import { Menu, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { UserAccountDropdown } from "@/components/user-account-dropdown"
import DecryptedText from "@/components/decrypted-text"
import { OptimizedImage } from "@/components/optimized-image"
import { LogoSkeleton } from "@/components/lazy-components"

export default function AestheticDrivenBrandingPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [selectedEnvironment, setSelectedEnvironment] = useState("")
  const [selectedStyle, setSelectedStyle] = useState("")
  const [selectedUse, setSelectedUse] = useState("")
  const [selectedNiche, setSelectedNiche] = useState("")
  const [environmentOpen, setEnvironmentOpen] = useState(false)
  const [useOpen, setUseOpen] = useState(false)
  const [nicheOpen, setNicheOpen] = useState(false)

  const styleOptions = [
    {
      id: "minimalist-luxury",
      name: "Minimalist Luxury",
      image: "/minimalist-luxury-design.png",
    },
    {
      id: "modern-corporate",
      name: "Modern Corporate",
      image: "/modern-corporate-design.png",
    },
    {
      id: "premium-tech",
      name: "Premium Tech",
      image: "/futuristic-tech-gradient.png",
    },
    {
      id: "elegant-classic",
      name: "Elegant Classic",
      image: "/classic-elegant-design.png",
    },
    {
      id: "contemporary-bold",
      name: "Contemporary Bold",
      image: "/bold-contemporary-design.png",
    },
  ]

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

      {/* Header */}
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
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">AESTHETIC-DRIVEN BRANDING</h1>
          <p className="text-gray-300 text-lg">Configure your branding intelligence agent</p>
        </div>

        {/* Configuration Form */}
        <div className="bg-black/20 backdrop-blur-md border border-white/10 p-8 rounded-none">
          <form className="space-y-8">
            <div className="relative">
              <div
                className="w-full bg-transparent border-0 border-b border-white/30 rounded-none px-0 py-4 text-white text-base cursor-pointer flex items-center justify-between"
                onClick={() => setEnvironmentOpen(!environmentOpen)}
              >
                <span className={selectedEnvironment ? "text-white" : "text-white/50"}>
                  {selectedEnvironment || "Choose the Environment"}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${environmentOpen ? "rotate-180" : ""}`} />
              </div>
              {environmentOpen && (
                <div className="absolute top-full left-0 right-0 bg-black/90 backdrop-blur-md border border-white/20 mt-1 z-10">
                  {["Instagram", "Landing Page"].map((option) => (
                    <div
                      key={option}
                      className="px-4 py-3 text-white hover:bg-white/10 cursor-pointer"
                      onClick={() => {
                        setSelectedEnvironment(option)
                        setEnvironmentOpen(false)
                      }}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <p className="text-white/70 text-sm mb-4">Choose Your Style</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {styleOptions.map((style) => (
                  <div
                    key={style.id}
                    className={`relative cursor-pointer rounded-lg overflow-hidden transition-all duration-300 ${
                      selectedStyle === style.id
                        ? "ring-2 ring-white/60 shadow-lg shadow-white/20"
                        : "hover:ring-1 hover:ring-white/30"
                    }`}
                    onClick={() => setSelectedStyle(style.id)}
                  >
                    <img
                      src={style.image || "/placeholder.svg"}
                      alt={style.name}
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded text-xs text-white">
                      {style.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div
                className="w-full bg-transparent border-0 border-b border-white/30 rounded-none px-0 py-4 text-white text-base cursor-pointer flex items-center justify-between"
                onClick={() => setUseOpen(!useOpen)}
              >
                <span className={selectedUse ? "text-white" : "text-white/50"}>{selectedUse || "Choose Use"}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${useOpen ? "rotate-180" : ""}`} />
              </div>
              {useOpen && (
                <div className="absolute top-full left-0 right-0 bg-black/90 backdrop-blur-md border border-white/20 mt-1 z-10">
                  {["Personal", "Business"].map((option) => (
                    <div
                      key={option}
                      className="px-4 py-3 text-white hover:bg-white/10 cursor-pointer"
                      onClick={() => {
                        setSelectedUse(option)
                        setUseOpen(false)
                      }}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <div
                className="w-full bg-transparent border-0 border-b border-white/30 rounded-none px-0 py-4 text-white text-base cursor-pointer flex items-center justify-between"
                onClick={() => setNicheOpen(!nicheOpen)}
              >
                <span className={selectedNiche ? "text-white" : "text-white/50"}>
                  {selectedNiche || "Choose the Niche"}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${nicheOpen ? "rotate-180" : ""}`} />
              </div>
              {nicheOpen && (
                <div className="absolute top-full left-0 right-0 bg-black/90 backdrop-blur-md border border-white/20 mt-1 z-10">
                  {["SMMA", "AI", "Finance/Blockchain", "Creative Artwork"].map((option) => (
                    <div
                      key={option}
                      className="px-4 py-3 text-white hover:bg-white/10 cursor-pointer"
                      onClick={() => {
                        setSelectedNiche(option)
                        setNicheOpen(false)
                      }}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
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
