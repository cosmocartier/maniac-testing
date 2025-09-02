"use client"

import { useState, useEffect } from "react"

interface StreamingTextProps {
  text: string
  className?: string
  speed?: number
}

export function StreamingText({ text, className = "", speed = 10 }: StreamingTextProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, speed)

      return () => clearTimeout(timer)
    }
  }, [currentIndex, text, speed])

  useEffect(() => {
    setDisplayedText("")
    setCurrentIndex(0)
  }, [text])

  return (
    <div className={className}>
      {displayedText}
      {currentIndex < text.length && <span className="animate-pulse text-white">|</span>}
    </div>
  )
}
