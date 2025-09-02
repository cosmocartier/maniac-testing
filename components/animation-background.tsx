"use client"

import { useEffect, useRef, useState } from "react"

interface AnimationBackgroundProps {
  className?: string
}

export default function AnimationBackground({ className = "" }: AnimationBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined" || !isMounted) return

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

    return () => {}
  }, [isMounted])

  if (!isMounted) {
    return (
      <div
        className={`w-full h-full bg-gradient-to-br from-black via-gray-900 to-black ${className}`}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          overflow: "hidden",
        }}
      />
    )
  }

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
        data-us-project="ZfuOXwwYq0I4NN27FHXw"
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

declare global {
  interface Window {
    UnicornStudio: {
      isInitialized: boolean
      init?: () => void
    }
  }
}
