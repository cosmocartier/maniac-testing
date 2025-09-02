"use client"

import { useEffect, useRef } from "react"

interface AnimationBackgroundProps {
  className?: string
}

export default function AnimationBackground({ className = "" }: AnimationBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initialize UnicornStudio if not already loaded
    if (!window.UnicornStudio) {
      window.UnicornStudio = { isInitialized: false }

      const script = document.createElement("script")
      script.src = "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.26/dist/unicornStudio.umd.js"
      script.onload = () => {
        if (!window.UnicornStudio.isInitialized) {
          window.UnicornStudio.init()
          window.UnicornStudio.isInitialized = true
        }
      }
      ;(document.head || document.body).appendChild(script)
    }

    // Clean up function
    return () => {
      // Optional: Clean up UnicornStudio instances if needed
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={`w-full h-full ${className}`}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <div
        data-us-project="EZIRuoNJEIRcCmtC30WN"
        style={{
          width: "100%",
          height: "100%",
          minWidth: "1440px",
          minHeight: "900px",
          transform: "scale(1)",
          transformOrigin: "center center",
        }}
      />
    </div>
  )
}

// Extend the Window interface to include UnicornStudio
declare global {
  interface Window {
    UnicornStudio: {
      isInitialized: boolean
      init?: () => void
    }
  }
}
