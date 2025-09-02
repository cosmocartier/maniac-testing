"use client"

import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import NavigationDashboard from "@/components/navigation-dashboard"
import UnicornScene from "@/components/main-background"
import LoadingScreen from "@/components/loading-screen"
import PrecisionPost1 from "@/components/precision-post-1"
import PrecisionPost2 from "@/components/precision-post-2"
import PrecisionPost3 from "@/components/precision-post-3"
import PrecisionPost4 from "@/components/precision-post-4"
import PrecisionPost5 from "@/components/precision-post-5"
import PrecisionPost6 from "@/components/precision-post-6"

export default function PrecisionHub() {
  const { user, isLoading } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()
  const [dailyFocus, setDailyFocus] = useState("")
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

      {/* Navigation Dashboard with mobile menu props */}
      <NavigationDashboard mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
        {/* Blog Posts Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <PrecisionPost1 />
          <PrecisionPost2 />
          <PrecisionPost3 />
          <PrecisionPost4 />
          <PrecisionPost5 />
          <PrecisionPost6 />
        </div>
      </main>
    </div>
  )
}
