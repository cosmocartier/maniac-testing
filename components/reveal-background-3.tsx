"use client"

import { useEffect } from "react"

interface RevealBackgroundProps {
  className?: string
}

export function RevealBackground({ className = "" }: RevealBackgroundProps) {
  useEffect(() => {
    // Initialize UnicornStudio if not already done
    if (!window.UnicornStudio) {
      window.UnicornStudio = { isInitialized: false }
      const script = document.createElement("script")
      script.src = "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.26/dist/unicornStudio.umd.js"
      script.onload = () => {
        const UnicornStudio = window.UnicornStudio // Declare the variable before using it
        if (!UnicornStudio.isInitialized) {
          UnicornStudio.init()
          UnicornStudio.isInitialized = true
        }
      }
      ;(document.head || document.body).appendChild(script)
    }
  }, [])

  return (
    <div
      data-us-project="B7PCDarm4xptnKbPKFu6"
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{ width: "100%", height: "100%" }}
    />
  )
}

declare global {
  interface Window {
    UnicornStudio: {
      isInitialized: boolean
      init?: () => void
    }
  }
}
