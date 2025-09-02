"use client"

import type React from "react"
import { useState, useEffect } from "react"

interface AgentsNavigationProps {
  activeView: "market-domination" | "growth-acceleration" | "perception-architecture" | "power-games"
  onViewChange: (view: "market-domination" | "growth-acceleration" | "perception-architecture" | "power-games") => void
}

export default function AgentsNavigation({ activeView, onViewChange }: AgentsNavigationProps) {
  const [currentMobileIndex, setCurrentMobileIndex] = useState(0)
  const [touchStartX, setTouchStartX] = useState(0)
  const [touchEndX, setTouchEndX] = useState(0)

  const navigationItems = [
    { key: "market-domination" as const, label: "Business Strategy" },
    { key: "growth-acceleration" as const, label: "Content Virality" },
    { key: "perception-architecture" as const, label: "Psychology" },
    { key: "power-games" as const, label: "Power Games" },
  ]

  useEffect(() => {
    const activeIndex = navigationItems.findIndex((item) => item.key === activeView)
    if (activeIndex !== -1) {
      setCurrentMobileIndex(activeIndex)
    }
  }, [activeView])

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return

    const distance = touchStartX - touchEndX
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe && currentMobileIndex < navigationItems.length - 1) {
      const newIndex = currentMobileIndex + 1
      setCurrentMobileIndex(newIndex)
      onViewChange(navigationItems[newIndex].key)
    }

    if (isRightSwipe && currentMobileIndex > 0) {
      const newIndex = currentMobileIndex - 1
      setCurrentMobileIndex(newIndex)
      onViewChange(navigationItems[newIndex].key)
    }
  }

  return (
    <>
      <div className="hidden md:flex items-center gap-8">
        {navigationItems.map((item) => (
          <button
            key={item.key}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeView === item.key ? "text-white bg-white/0" : "text-white/70 hover:text-white"
            }`}
            onClick={() => onViewChange(item.key)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="md:hidden flex flex-col items-center w-full">
        <div
          className="flex items-center justify-center w-full h-12 relative overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {navigationItems.map((item, index) => (
            <button
              key={item.key}
              className={`absolute px-4 py-2 text-lg uppercase font-medium transition-all duration-300 ease-in-out ${
                index === currentMobileIndex
                  ? "opacity-100 transform translate-x-0 text-white bg-white/0"
                  : "opacity-0 transform translate-x-full text-white/70"
              }`}
              onClick={() => onViewChange(item.key)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex gap-1 mt-2">
          {navigationItems.map((_, index) => (
            <div
              key={index}
              className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                index === currentMobileIndex ? "bg-white" : "bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>
    </>
  )
}
