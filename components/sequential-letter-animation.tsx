"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"

interface SequentialLetterAnimationProps {
  text: string
  className?: string
  duration?: number
  staggerDelay?: number
}

export function SequentialLetterAnimation({
  text,
  className = "",
  duration = 0.2,
  staggerDelay = 0.05,
}: SequentialLetterAnimationProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  const letters = text.split("").map((char, index) => ({
    char: char === " " ? "\u00A0" : char, // Use non-breaking space
    index,
  }))

  return (
    <div ref={ref} className={className}>
      {letters.map(({ char, index }) => (
        <motion.span
          key={index}
          initial={{
            opacity: 0,
            filter: "blur(8px)",
            y: 20,
          }}
          animate={
            isVisible
              ? {
                  opacity: 1,
                  filter: "blur(0px)",
                  y: 0,
                }
              : {
                  opacity: 0,
                  filter: "blur(8px)",
                  y: 20,
                }
          }
          transition={{
            duration,
            delay: index * staggerDelay,
            ease: "easeInOut",
          }}
          className="inline-block"
        >
          {char}
        </motion.span>
      ))}
    </div>
  )
}

// Default export for compatibility
export default SequentialLetterAnimation
