"use client"

import { useEffect, useState } from "react"
import { motion, useSpring, useTransform } from "framer-motion"

interface CountUpProps {
  to: number
  from?: number
  duration?: number
  delay?: number
  className?: string
}

export default function CountUp({ to, from = 0, duration = 2, delay = 0, className = "" }: CountUpProps) {
  const [isVisible, setIsVisible] = useState(false)

  const spring = useSpring(from, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  const display = useTransform(spring, (current) => Math.round(current))

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
      spring.set(to)
    }, delay * 1000)

    return () => clearTimeout(timer)
  }, [spring, to, delay])

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
    >
      {display}
    </motion.span>
  )
}
