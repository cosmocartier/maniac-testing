"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { useState } from "react"

export function UpgradeBadge() {
  const [isVisible, setIsVisible] = useState(true)

  // Generate random particles
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 2,
  }))

  const handleUpgradeClick = () => {
    window.open("https://www.superclone.space/", "_blank", "noopener,noreferrer")
  }

  const handleDismiss = () => {
    setIsVisible(false)
  }

  if (!isVisible) {
    return null
  }

  return (
    <div className="relative bg-white/5 border border-white/5 rounded-3xl p-4 pr-6 backdrop-blur-sm overflow-hidden">
      {/* Floating Particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute bg-white rounded-full opacity-60"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
          animate={{
            y: [-10, 10, -10],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Number.POSITIVE_INFINITY,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Dismiss X Button */}
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 z-20 p-1 hover:bg-white/10 rounded-full transition-colors"
        aria-label="Dismiss"
      >
        <X className="w-3 h-3 text-white/60 hover:text-white" />
      </button>

      <div className="relative z-10 flex items-center gap-4">
        <div className="flex flex-col">
          <h3 className="text-white font-semibold text-lg">SUPERCLONE</h3>
          <p className="text-gray-400 text-sm">10k simulations FREE</p>
        </div>
        <Button
          onClick={handleUpgradeClick}
          className="bg-white text-black hover:bg-gray-100 rounded-full px-6 py-2 font-medium"
          size="sm"
        >
          Upgrade
        </Button>
      </div>
    </div>
  )
}

export default UpgradeBadge
