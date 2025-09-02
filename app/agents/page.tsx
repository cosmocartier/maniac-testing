"use client"

import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import UnicornScene from "@/components/main-background"
import LoadingScreen from "@/components/loading-screen"
import { Button } from "@/components/ui/button"
import AgentsNavigation from "@/components/agents-navigation"
import NavigationDashboard from "@/components/navigation-dashboard"

// Agent Card Component
function AgentCard({ name, focus, slug }: { name: string; focus: string; slug: string }) {
  const { t } = useLanguage()

  return (
    <div className="relative bg-black/20 backdrop-blur-md border border-white/10 p-6 rounded-none group">
      {/* Corner Indicators - Same as vault components */}
      <div className="absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 border-white/30 z-30"></div>
      <div className="absolute top-0 right-0 w-2 h-2 border-r-2 border-t-2 border-white/30 z-30"></div>
      <div className="absolute bottom-0 left-0 w-2 h-2 border-l-2 border-b-2 border-white/30 z-30"></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 border-white/30 z-30"></div>

      <div className="mb-6 text-center">
        <h3 className="text-lg font-bold text-white mb-2">{name}</h3>
        <p className="text-sm text-gray-300">
          {t("agents.focus")}: {focus}
        </p>
      </div>

      {/* Centered Deploy Button */}
      <div className="flex justify-center gap-4">
        <Link href={`/agents/${slug}`}>
          <Button className="bg-white text-black hover:bg-gray-200 px-12 py-3 rounded-full font-medium">
            {t("agents.deployButton")}
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default function AgentsPage() {
  const { user, isLoading } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeView, setActiveView] = useState<
    "market-domination" | "growth-acceleration" | "perception-architecture" | "power-games"
  >("market-domination")

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

  const agentGroups = {
    "market-domination": [
      {
        name: t("agents.aestheticDrivenBranding.name"),
        focus: t("agents.aestheticDrivenBranding.focus"),
        slug: "aesthetic-driven-branding",
      },
      {
        name: t("agents.tacticalProblemSolving.name"),
        focus: t("agents.tacticalProblemSolving.focus"),
        slug: "tactical-problem-solving",
      },
      {
        name: t("agents.competitorEspionage.name"),
        focus: t("agents.competitorEspionage.focus"),
        slug: "competitor-espionage",
      },
      {
        name: t("agents.preSellNegotiation.name"),
        focus: t("agents.preSellNegotiation.focus"),
        slug: "pre-sell-negotiation-blueprint",
      },
      {
        name: t("agents.blueOceanMarkets.name"),
        focus: t("agents.blueOceanMarkets.focus"),
        slug: "blue-ocean-markets",
      },
      {
        name: t("agents.softwarePowerstack.name"),
        focus: t("agents.softwarePowerstack.focus"),
        slug: "software-powerstack",
      },
      {
        name: t("agents.cyberPresenceSecurity.name"),
        focus: t("agents.cyberPresenceSecurity.focus"),
        slug: "cyber-presence-security",
      },
    ],
    "growth-acceleration": [
      {
        name: t("agents.viralContentEngineering.name"),
        focus: t("agents.viralContentEngineering.focus"),
        slug: "viral-content-engineering",
      },
      {
        name: t("agents.magneticLeadGen.name"),
        focus: t("agents.magneticLeadGen.focus"),
        slug: "magnetic-lead-gen-outreach",
      },
    ],
    "perception-architecture": [
      {
        name: t("agents.psychologicalPatternHacking.name"),
        focus: t("agents.psychologicalPatternHacking.focus"),
        slug: "psychological-pattern-hacking",
      },
      {
        name: t("agents.artOfSeduction.name"),
        focus: t("agents.artOfSeduction.focus"),
        slug: "art-of-seduction",
      },
    ],
    "power-games": [
      {
        name: t("agents.opponentOutplay.name"),
        focus: t("agents.opponentOutplay.focus"),
        slug: "opponent-outplay-framework",
      },
      {
        name: t("agents.highValueNetwork.name"),
        focus: t("agents.highValueNetwork.focus"),
        slug: "high-value-network-infiltration",
      },
    ],
  }

  const currentAgents = agentGroups[activeView]

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Unicorn Background */}
      <div className="fixed inset-0 z-0 opacity-30">
        <UnicornScene projectId="8gHd8X3xiGgvI1Eycn9g" width="100%" height="100%" className="w-full h-full" />
      </div>

      <NavigationDashboard mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        <div className="py-8">
          {/* Navigation */}
          <div className="mb-8 flex justify-center">
            <AgentsNavigation activeView={activeView} onViewChange={setActiveView} />
          </div>

          {/* Agent Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {currentAgents.map((agent, index) => (
              <AgentCard key={index} name={agent.name} focus={agent.focus} slug={agent.slug} />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
