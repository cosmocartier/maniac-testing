"use client"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import UnicornScene from "@/components/main-background"
import LoadingScreen from "@/components/loading-screen"
import { Button } from "@/components/ui/button"
import { OptimizedImage } from "@/components/optimized-image"
import NavigationDashboard from "@/components/navigation-dashboard"
import { useLanguage } from "@/lib/language-context"

export default function Cognition() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const { t } = useLanguage()
  const [selectedClone, setSelectedClone] = useState("")
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const [selectedNotionClone, setSelectedNotionClone] = useState("")
  const [notionCompletedSteps, setNotionCompletedSteps] = useState<number[]>([])

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

  const handleStepComplete = (stepIndex: number) => {
    if (!completedSteps.includes(stepIndex)) {
      setCompletedSteps([...completedSteps, stepIndex])
    }
  }

  const isStepCompleted = (stepIndex: number) => completedSteps.includes(stepIndex)

  const handleNotionStepComplete = (stepIndex: number) => {
    if (!notionCompletedSteps.includes(stepIndex)) {
      setNotionCompletedSteps([...notionCompletedSteps, stepIndex])
    }
  }

  const isNotionStepCompleted = (stepIndex: number) => notionCompletedSteps.includes(stepIndex)

  const steps = [
    {
      title: t("cognition.steps.connectAccount"),
      description: t("cognition.steps.connectAccountDesc"),
      buttonText: t("cognition.buttons.selectClone"),
      hasDropdown: false,
    },
    {
      title: t("cognition.steps.importData"),
      description: t("cognition.steps.importDataDesc"),
      buttonText: t("cognition.buttons.activateNow"),
      hasDropdown: false,
    },
    {
      title: t("cognition.steps.testItOut"),
      description: t("cognition.steps.testItOutDesc"),
      buttonText: t("cognition.buttons.tryItOut"),
      hasDropdown: false,
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Unicorn Background */}
      <div className="fixed inset-0 z-0 opacity-30">
        <UnicornScene projectId="8gHd8X3xiGgvI1Eycn9g" width="100%" height="100%" className="w-full h-full" />
      </div>

      <NavigationDashboard mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

      {/* Main Content */}
      <main className="relative z-10 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* First Integration Section - Superclone */}
          <div className="flex flex-col lg:flex-row">
            {/* Left Side - Header Section (1/3 of screen on desktop) */}
            <div className="w-full lg:w-1/3 lg:pr-12 mb-8 lg:mb-0 order-1 lg:order-1">
              <div className="flex items-start gap-4">
                {/* Superclone Logo with vertical line */}
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 flex items-center justify-center">
                    <OptimizedImage
                      src="/images/superclone-logo-3.png"
                      alt="Superclone"
                      width={64}
                      height={64}
                      className="w-14 h-14"
                    />
                  </div>
                  <div
                    className="hidden lg:block w-px h-96 bg-gradient-to-b from-zinc-600 via-zinc-700 to-transparent mt-4 shadow-lg"
                    style={{
                      boxShadow: "0 0 8px rgba(0,0,0,0.8), inset 0 0 2px rgba(0,0,0,0.5)",
                    }}
                  />
                </div>

                {/* Text Content */}
                <div className="flex flex-col">
                  <p className="text-sm text-gray-400 mb-1">{t("cognition.integrations")}</p>
                  <h1 className="text-2xl font-semibold text-white">{t("cognition.superclone")}</h1>
                </div>
              </div>
            </div>

            {/* Right Side - Steps Section (2/3 of screen on desktop) */}
            <div className="w-full lg:w-2/3 lg:pl-12 order-1 lg:order-2">
              <div className="relative">
                {/* Steps */}
                <div className="space-y-12">
                  {steps.map((step, index) => (
                    <div key={index} className="relative">
                      <div className="absolute left-0 hidden lg:flex items-center justify-center">
                        <div className="text-sm font-bold text-gray-400">/{index + 1}</div>
                      </div>

                      {/* Step Content */}
                      <div className="lg:ml-20">
                        <div
                          className={`relative p-6 rounded-none border transition-all duration-200 ${
                            isStepCompleted(index)
                              ? "bg-zinc-0 border-white/10 backdrop-blur-lg"
                              : "bg-zinc-0 border-white/10 backdrop-blur-lg"
                          }`}
                        >
                          <div className="absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 border-white/20 z-30"></div>
                          <div className="absolute top-0 right-0 w-2 h-2 border-r-2 border-t-2 border-white/20 z-30"></div>
                          <div className="absolute bottom-0 left-0 w-2 h-2 border-l-2 border-b-2 border-white/20 z-30"></div>
                          <div className="absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 border-white/20 z-30"></div>

                          <h2 className="text-xl font-semibold text-white mb-2">{step.title}</h2>
                          <p className="text-zinc-400 text-sm mb-6">{step.description}</p>

                          {/* Action Button */}
                          <Button
                            onClick={() => handleStepComplete(index)}
                            disabled={step.hasDropdown && !selectedClone}
                            className={`transition-all duration-300 ${
                              isStepCompleted(index)
                                ? "bg-white/50 hover:bg-white-50 text-black rounded-full"
                                : "bg-white hover::bg-gray-200 text-black rounded-full"
                            } ${step.hasDropdown && !selectedClone ? "opacity-50 cursor-not-allowed" : ""}`}
                          >
                            {isStepCompleted(index) ? t("cognition.buttons.completed") : step.buttonText}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Second Integration Section - Notion */}
          <div className="flex flex-col lg:flex-row mt-32">
            {/* Left Side - Header Section (1/3 of screen on desktop) */}
            <div className="w-full lg:w-1/3 lg:pr-12 mb-8 lg:mb-0 order-1 lg:order-1">
              <div className="flex items-start gap-4">
                {/* Notion Logo with vertical line */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 flex items-center justify-center">
                    <OptimizedImage
                      src="/images/notion-logo.png"
                      alt="Notion"
                      width={64}
                      height={64}
                      className="w-16 h-16"
                    />
                  </div>
                  <div
                    className="hidden lg:block w-px h-96 bg-gradient-to-b from-zinc-600 via-zinc-700 to-transparent mt-4 shadow-lg"
                    style={{
                      boxShadow: "0 0 8px rgba(0,0,0,0.8), inset 0 0 2px rgba(0,0,0,0.5)",
                    }}
                  />
                </div>

                {/* Text Content */}
                <div className="flex flex-col">
                  <p className="text-sm text-gray-400 mb-1">{t("cognition.integrations")}</p>
                  <h1 className="text-2xl font-semibold text-white">{t("cognition.notion")}</h1>
                </div>
              </div>
            </div>

            {/* Right Side - Steps Section (2/3 of screen on desktop) */}
            <div className="w-full lg:w-2/3 lg:pl-12 order-1 lg:order-2">
              <div className="relative">
                {/* Steps */}
                <div className="space-y-12">
                  {steps.map((step, index) => (
                    <div key={`notion-${index}`} className="relative">
                      <div className="absolute left-0 hidden lg:flex items-center justify-center">
                        <div className="text-sm font-bold text-gray-400">/{index + 1}</div>
                      </div>

                      {/* Step Content */}
                      <div className="lg:ml-20">
                        <div
                          className={`relative p-6 rounded-none border transition-all duration-300 ${
                            isNotionStepCompleted(index)
                              ? "bg-zinc-0 border-white/10 backdrop-blur-lg"
                              : "bg-zinc-0 border-white/10 backdrop-blur-lg"
                          }`}
                        >
                          <div className="absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 border-white/30 z-30"></div>
                          <div className="absolute top-0 right-0 w-2 h-2 border-r-2 border-t-2 border-white/30 z-30"></div>
                          <div className="absolute bottom-0 left-0 w-2 h-2 border-l-2 border-b-2 border-white/30 z-30"></div>
                          <div className="absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 border-white/30 z-30"></div>

                          <h2 className="text-xl font-semibold text-white mb-2">{step.title}</h2>
                          <p className="text-gray-400 text-sm mb-6">{step.description}</p>

                          {/* Action Button */}
                          <Button
                            onClick={() => handleNotionStepComplete(index)}
                            disabled={step.hasDropdown && !selectedNotionClone}
                            className={`transition-all duration-300 ${
                              isNotionStepCompleted(index)
                                ? "bg-white/50 hover:bg-white-50 text-black rounded-full"
                                : "bg-white hover::bg-gray-200 text-black rounded-full"
                            } ${step.hasDropdown && !selectedNotionClone ? "opacity-50 cursor-not-allowed" : ""}`}
                          >
                            {isNotionStepCompleted(index) ? t("cognition.buttons.completed") : step.buttonText}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
