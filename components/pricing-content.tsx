"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Check, X, Zap, Shield, Users, Cpu, Database, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"
import { TopNavigation } from "@/components/top-navigation"
import { SiteFooter } from "@/components/site-footer"
import dynamic from "next/dynamic"

const UnicornScene = dynamic(() => import("@/components/main-background"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gradient-to-br from-black via-black to-black" />,
})

// Counter component for animated price transitions
function Counter({ value, duration = 500 }: { value: number; duration?: number }) {
  const [displayValue, setDisplayValue] = useState(value)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    if (typeof window === "undefined") return

    const startValue = displayValue
    const endValue = value

    const startTime = typeof performance !== "undefined" && performance.now ? performance.now() : 0

    const animate = () => {
      if (typeof performance === "undefined" || !performance.now || typeof requestAnimationFrame === "undefined") {
        setDisplayValue(endValue)
        return
      }

      const now = performance.now()
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Custom easing function (ease-out-quart)
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)

      const currentValue = startValue + (endValue - startValue) * easeOutQuart
      setDisplayValue(Math.round(currentValue))

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    if (startValue !== endValue && typeof requestAnimationFrame !== "undefined") {
      requestAnimationFrame(animate)
    }
  }, [value, duration, displayValue, mounted])

  if (!mounted) {
    return <span>{value.toLocaleString()}</span>
  }

  return <span>{displayValue.toLocaleString()}</span>
}

export default function PricingContent() {
  const [isYearly, setIsYearly] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { user } = useAuth()
  const { t } = useLanguage()

  useEffect(() => {
    setMounted(true)
  }, [])

  const plans = [
    {
      name: t("pricing.free"),
      monthlyPrice: 0,
      yearlyPrice: 0,
      popular: false,
      features: [
        { icon: Check, text: t("pricing.feature.credits5"), included: true },
        { icon: Check, text: t("pricing.feature.contextLimited"), included: true },
        { icon: Check, text: t("pricing.feature.imageBasic"), included: true },
        { icon: Check, text: t("pricing.feature.projects5"), included: true },
        { icon: Check, text: t("pricing.feature.tasksBasic"), included: true },
      ],
      buttonText: t("pricing.currentPlan"),
      buttonDisabled: true,
    },
    {
      name: t("pricing.pro"),
      monthlyPrice: 30,
      yearlyPrice: 300,
      popular: true,
      features: [
        { icon: Zap, text: t("pricing.feature.credits30"), included: true },
        { icon: Check, text: t("pricing.feature.synaAccess"), included: true },
        { icon: Database, text: t("pricing.feature.context128k"), included: true },
        { icon: Cpu, text: t("pricing.feature.analysisAdvanced"), included: true },
        { icon: Check, text: t("pricing.feature.everythingBasic"), included: true },
      ],
      buttonText: t("pricing.upgradeToPro"),
      buttonDisabled: false,
    },
    {
      name: t("pricing.enterprise"),
      monthlyPrice: 300,
      yearlyPrice: 3000,
      popular: false,
      features: [
        { icon: Zap, text: t("pricing.feature.creditsUnlimited"), included: true },
        { icon: Database, text: t("pricing.feature.context500k"), included: true },
        { icon: Users, text: t("pricing.feature.earlyAccess"), included: true },
        { icon: Shield, text: t("pricing.feature.supportDedicated"), included: true },
        { icon: Globe, text: t("pricing.feature.everythingPro"), included: true },
      ],
      buttonText: t("pricing.upgradeToEnterprise"),
      buttonDisabled: false,
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Main Background Animation */}
      <div className="fixed inset-0 z-0">
        <UnicornScene className="w-full h-full opacity-30" width="100%" height="100%" />
      </div>

      {/* Lightning effect at top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />

      <TopNavigation />

      {/* Main Content */}
      <main className="pt-32 pb-20 relative z-10">
        <div className="container mx-auto px-8 lg:px-12">
          {/* Hero Section */}
          <div className="text-center mb-16">
            {/* Billing Toggle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0, delay: 0 }}
              className="flex items-center justify-center gap-4 mb-16"
            >
              <button
                onClick={() => setIsYearly(true)}
                className={`px-6 py-3 text-sm font-medium transition-all duration-300 backdrop-blur-sm border ${
                  isYearly
                    ? "bg-white/10 border-transparent text-gray-300 hover:bg-white/10 rounded-full"
                    : "bg-white/0 border-transparent text-white shadow-lg rounded-full"
                }`}
              >
                {t("pricing.payYearly")}
              </button>
              <button
                onClick={() => setIsYearly(false)}
                className={`px-6 py-3 text-sm font-medium transition-all duration-300 backdrop-blur-sm border ${
                  !isYearly
                    ? "bg-white/10 border-transparent text-gray-300 hover:bg-white/10 rounded-full"
                    : "bg-white/0 border-transparent text-white shadow-lg rounded-full"
                }`}
              >
                {t("pricing.payMonthly")}
              </button>
            </motion.div>
          </div>

          {/* Pricing Cards */}
          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {plans.map((plan, index) => (
              <div
                key={plan.name}
                className={`relative backdrop-blur-sm border p-8 ${
                  plan.popular
                    ? "bg-black/20 backdrop-blur-md border border-white/20 rounded-none"
                    : "bg-black/20 backdrop-blur-md border border-white/20 rounded-none"
                } transition-all duration-300`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-white border-transparent text-black/80 px-4 py-1 text-sm font-medium">
                      {t("pricing.popular")}
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold uppercase text-white mb-6">{plan.name}</h2>

                  {plan.monthlyPrice === 0 ? (
                    <div className="mb-8">
                      <span className="text-4xl font-light">
                        $<Counter value={0} />
                        .00
                      </span>
                      <span className="text-gray-400 ml-2">/{isYearly ? "year" : "month"}</span>
                    </div>
                  ) : (
                    <div className="mb-8">
                      <span className="text-4xl font-light">
                        $<Counter value={isYearly ? plan.yearlyPrice : plan.monthlyPrice} />
                        .00
                      </span>
                      <span className="text-gray-400 ml-2">/{isYearly ? "year" : "month"}</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-zinc-600 mb-8"></div>

                <ul className="space-y-4 mb-8 flex-grow">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-transparent flex items-center justify-center flex-shrink-0">
                        {feature.included ? (
                          <Check className="h-4 w-4 text-white" />
                        ) : (
                          <X className="h-4 w-4 text-white" />
                        )}
                      </div>
                      <span className="text-sm text-white">{feature.text}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  disabled={plan.buttonDisabled}
                  className={`w-full py-3 text-sm font-medium transition-all duration-300 backdrop-blur-sm border ${
                    plan.buttonDisabled
                      ? "bg-white/5 border-white/10 text-gray-400 cursor-not-allowed"
                      : "bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30 shadow-lg"
                  }`}
                >
                  {plan.buttonText}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </main>

      <SiteFooter />

      {/* Add bottom padding to prevent content from being hidden behind fixed footer */}
      <div className="h-16" />
    </div>
  )
}
