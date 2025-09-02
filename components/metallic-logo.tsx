"use client"

import { useState, useEffect } from "react"

interface MetallicLogoProps {
  className?: string
}

export default function MetallicLogo({ className = "" }: MetallicLogoProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    // Preload the SVG to ensure it's available
    const img = new Image()
    img.onload = () => setIsLoaded(true)
    img.onerror = () => setHasError(true)
    img.src = "/images/metallic-m-logo.svg"
  }, [])

  return (
    <div className={`relative ${className}`} style={{ minHeight: "80px", minWidth: "80px" }}>
      {isLoaded && !hasError ? (
        <img
          src="/images/metallic-m-logo.svg"
          alt="Metallic Logo"
          className="w-full h-full object-contain"
          style={{
            filter: "drop-shadow(0 0 20px rgba(255, 255, 255, 0.3))",
          }}
        />
      ) : (
        <img src="/images/minimal-m-logo.png" alt="Logo" className="w-full h-full object-contain opacity-80" />
      )}
    </div>
  )
}
