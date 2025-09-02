"use client"

import { useState, useEffect } from "react"
import { MarkdownRenderer } from "./markdown-renderer"

interface StreamingMarkdownProps {
  text: string
  className?: string
  speed?: number
}

export function StreamingMarkdown({ text, className = "", speed = 10 }: StreamingMarkdownProps) {
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

  return <MarkdownRenderer content={displayedText} className={className} />
}
