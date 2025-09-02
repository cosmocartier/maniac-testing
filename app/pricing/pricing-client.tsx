"use client"

import dynamic from "next/dynamic"

const PricingContent = dynamic(() => import("@/components/pricing-content"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-white/30 border-t-white animate-spin rounded-full"></div>
    </div>
  ),
})

export default function PricingClient() {
  return <PricingContent />
}
