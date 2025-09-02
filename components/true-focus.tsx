"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"

interface TrueFocusProps {
  sentence: string
  manualMode?: boolean
  blurAmount?: number
  borderColor?: string
  glowColor?: string
  animationDuration?: number
  pauseBetweenAnimations?: number
}

export default function TrueFocus({
  sentence,
  manualMode = false,
  blurAmount = 5,
  borderColor = "#ffffff",
  glowColor = "rgba(255, 255, 255, 0.4)",
  animationDuration = 1,
  pauseBetweenAnimations = 1,
}: TrueFocusProps) {
  const words = sentence.split(" ")

  // Find the index of "intelligence" (case-insensitive)
  const intelligenceIndex = words.findIndex((word) => word.toLowerCase().includes("intelligence"))

  // Set initial focus to "intelligence" if it exists, otherwise 0
  const [currentIndex, setCurrentIndex] = useState(intelligenceIndex !== -1 ? intelligenceIndex : 0)
  const [wordPositions, setWordPositions] = useState<{
    [key: number]: { x: number; y: number; width: number; height: number }
  }>({})
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    const updatePositions = () => {
      const positions: { [key: number]: { x: number; y: number; width: number; height: number } } = {}
      wordRefs.current.forEach((ref, index) => {
        if (ref) {
          const rect = ref.getBoundingClientRect()
          const containerRect = ref.closest(".relative")?.getBoundingClientRect()
          if (containerRect) {
            positions[index] = {
              x: rect.left - containerRect.left,
              y: rect.top - containerRect.top,
              width: rect.width,
              height: rect.height,
            }
          }
        }
      })
      setWordPositions(positions)
    }

    updatePositions()
    window.addEventListener("resize", updatePositions)
    return () => window.removeEventListener("resize", updatePositions)
  }, [])

  const handleMouseEnter = (index: number) => {
    if (manualMode) {
      setCurrentIndex(index)
    }
  }

  const handleMouseLeave = () => {
    if (manualMode) {
      // Return to intelligence if it exists, otherwise stay on current
      setCurrentIndex(intelligenceIndex !== -1 ? intelligenceIndex : currentIndex)
    }
  }

  const currentPosition = wordPositions[currentIndex]

  return (
    <div className="relative">
      {/* Tracking motion div - now empty, no corner indicators */}
      {currentPosition && (
        <motion.div
          className="absolute pointer-events-none z-10"
          animate={{
            x: currentPosition.x,
            y: currentPosition.y,
            width: currentPosition.width,
            height: currentPosition.height,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
        />
      )}

      {/* Text content */}
      <div className="relative z-0">
        {words.map((word, index) => (
          <span
            key={index}
            ref={(el) => (wordRefs.current[index] = el)}
            className={`inline-block transition-all duration-300 cursor-pointer ${
              index === currentIndex ? "text-white" : "text-gray-400"
            }`}
            style={{
              filter: index === currentIndex ? "blur(0px)" : `blur(${blurAmount}px)`,
            }}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            {word}
            {index < words.length - 1 && " "}
          </span>
        ))}
      </div>
    </div>
  )
}
