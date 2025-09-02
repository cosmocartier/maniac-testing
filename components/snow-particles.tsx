"use client"

import { motion } from "framer-motion"
import { useEffect, useState, useCallback, useMemo } from "react"

interface Particle {
  id: number
  x: number
  y: number
  z: number
  size: number
  speed: number
  opacity: number
  drift: number
  lifespan: number
  birthTime: number
}

interface SnowParticlesProps {
  particleCount?: number
  className?: string
}

export function SnowParticles({ particleCount = 100, className = "" }: SnowParticlesProps) {
  const [particles, setParticles] = useState<Particle[]>([])
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [isVisible, setIsVisible] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  const [frameRate, setFrameRate] = useState(60)
  const [frameDropCount, setFrameDropCount] = useState(0)
  const [adaptiveReductions, setAdaptiveReductions] = useState(0)
  const [renderTime, setRenderTime] = useState(0)

  const [deviceProfile, setDeviceProfile] = useState({
    type: "unknown",
    performanceClass: "medium",
    optimalParticleCount: particleCount,
    maxParticleCount: Math.floor(particleCount * 1.5),
    minParticleCount: Math.floor(particleCount * 0.5),
  })

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (typeof window === "undefined" || !isMounted) return

    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)

    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden)
    }
    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      window.removeEventListener("resize", updateDimensions)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [isMounted])

  const profileDevice = useCallback(() => {
    if (typeof window === "undefined" || typeof navigator === "undefined") {
      return deviceProfile
    }

    const width = window.innerWidth
    const cores = navigator.hardwareConcurrency || 1
    const memory = (navigator as any).deviceMemory || 4

    let deviceType = "desktop"
    let performanceClass = "medium"
    let optimalCount = particleCount
    let maxCount = Math.floor(particleCount * 1.5)
    let minCount = Math.floor(particleCount * 0.5)

    if (width < 768) {
      deviceType = "mobile"
      optimalCount = Math.floor(particleCount * 0.6)
      maxCount = Math.floor(particleCount * 0.8)
      minCount = Math.floor(particleCount * 0.3)
    } else if (width < 1024) {
      deviceType = "tablet"
      optimalCount = Math.floor(particleCount * 0.8)
      maxCount = Math.floor(particleCount * 1.2)
      minCount = Math.floor(particleCount * 0.4)
    }

    if (cores >= 8 && memory >= 8) {
      performanceClass = "high"
      optimalCount = Math.floor(optimalCount * 1.4)
      maxCount = Math.floor(maxCount * 1.4)
    } else if (cores <= 2 || memory <= 2) {
      performanceClass = "low"
      optimalCount = Math.floor(optimalCount * 0.6)
      maxCount = Math.floor(maxCount * 0.6)
    }

    const profile = {
      type: deviceType,
      performanceClass,
      optimalParticleCount: optimalCount,
      maxParticleCount: maxCount,
      minParticleCount: minCount,
    }

    setDeviceProfile(profile)
    return profile
  }, [particleCount, deviceProfile])

  const getOptimalParticleCount = useCallback(() => {
    const profile = deviceProfile.optimalParticleCount ? deviceProfile : profileDevice()
    let targetCount = profile.optimalParticleCount

    if (frameRate < 20) {
      targetCount = profile.minParticleCount
      setAdaptiveReductions((prev) => prev + 1)
    } else if (frameRate < 30) {
      targetCount = Math.floor(profile.optimalParticleCount * 0.7)
      setAdaptiveReductions((prev) => prev + 1)
    } else if (frameRate > 55 && targetCount < profile.maxParticleCount) {
      targetCount = Math.min(profile.maxParticleCount, Math.floor(targetCount * 1.1))
    }

    if (frameDropCount > 10) {
      targetCount = Math.max(profile.minParticleCount, Math.floor(targetCount * 0.8))
    }

    return Math.max(profile.minParticleCount, Math.min(profile.maxParticleCount, targetCount))
  }, [frameRate, frameDropCount, deviceProfile, profileDevice])

  const generateParticle = useCallback((): Particle => {
    const currentTime = performance.now()
    const profile = deviceProfile

    const x = Math.random() * 100
    const y = Math.random() * 100
    const z = -(Math.random() * 0.8 + 0.2)

    const baseSize = profile.performanceClass === "high" ? 2.5 : profile.performanceClass === "low" ? 1.5 : 2.0
    const size = Math.random() * baseSize + 1.8

    const baseSpeed = profile.performanceClass === "high" ? 0.8 : profile.performanceClass === "low" ? 0.5 : 0.6
    const speed = Math.random() * baseSpeed + 0.4

    const baseOpacity = profile.performanceClass === "high" ? 0.5 : profile.performanceClass === "low" ? 0.3 : 0.4
    const opacity = Math.random() * baseOpacity + 0.2

    const drift = (Math.random() - 0.5) * 25
    const lifespan = Math.random() * 8000 + 6000

    return {
      id: Math.random(),
      x,
      y,
      z,
      size,
      speed,
      opacity,
      drift,
      lifespan,
      birthTime: currentTime,
    }
  }, [deviceProfile])

  const sortedParticles = useMemo(() => {
    return [...particles].sort((a, b) => a.z - b.z)
  }, [particles])

  useEffect(() => {
    if (typeof window === "undefined" || !isMounted) return

    let animationId: number
    let frameCount = 0
    let lastTime = performance.now()
    let renderStart = 0

    const measureFrameRate = (currentTime: number) => {
      frameCount++
      const deltaTime = currentTime - lastTime

      if (deltaTime >= 1000) {
        const currentFPS = Math.round((frameCount * 1000) / deltaTime)

        if (currentFPS < 30) {
          setFrameDropCount((prev) => prev + 1)
        }

        setFrameRate((prev) => {
          const smoothedFPS = prev * 0.8 + currentFPS * 0.2
          return smoothedFPS
        })

        frameCount = 0
        lastTime = currentTime
      }

      renderStart = performance.now()
      animationId = requestAnimationFrame((nextTime) => {
        const renderEnd = performance.now()
        setRenderTime(renderEnd - renderStart)
        measureFrameRate(nextTime)
      })
    }

    if (isVisible) {
      animationId = requestAnimationFrame(measureFrameRate)
    }

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [isVisible, particles.length, frameDropCount, adaptiveReductions, renderTime, isMounted])

  useEffect(() => {
    if (!isVisible || typeof window === "undefined" || !isMounted) return

    const optimalCount = getOptimalParticleCount()

    if (particles.length === 0) {
      const initialParticles = Array.from({ length: optimalCount }, generateParticle)
      setParticles(initialParticles)
    }

    const getSpawnInterval = () => {
      if (frameRate > 50) return 1000
      if (frameRate > 30) return 1500
      if (frameRate > 20) return 2000
      return 3000
    }

    const interval = setInterval(() => {
      setParticles((prev) => {
        const currentTime = performance.now()
        const currentOptimalCount = getOptimalParticleCount()

        const activeParticles = prev.filter((particle) => currentTime - particle.birthTime < particle.lifespan)

        if (activeParticles.length < currentOptimalCount) {
          const newParticlesNeeded = Math.min(3, currentOptimalCount - activeParticles.length)
          const newParticles = Array.from({ length: newParticlesNeeded }, generateParticle)
          return [...activeParticles, ...newParticles]
        }

        if (activeParticles.length > currentOptimalCount) {
          return activeParticles.slice(0, currentOptimalCount)
        }

        return activeParticles
      })
    }, getSpawnInterval())

    return () => clearInterval(interval)
  }, [generateParticle, getOptimalParticleCount, frameRate, isVisible, particles.length, isMounted])

  if (!isMounted || !isVisible) return null

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {/* Background particle layers */}
      <div className="absolute inset-0" style={{ zIndex: -10 }}>
        {sortedParticles
          .filter((particle) => particle.z < -0.7)
          .map((particle) => (
            <motion.div
              key={`bg-${particle.id}`}
              className="absolute rounded-full will-change-transform"
              style={{
                width: `${particle.size * 0.8}px`,
                height: `${particle.size * 0.8}px`,
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                background: `radial-gradient(circle, rgba(255,255,255,${particle.opacity * 0.6}) 0%, rgba(255,255,255,${particle.opacity * 0.3}) 70%, transparent 100%)`,
                filter: deviceProfile.performanceClass === "low" ? "none" : "blur(0.5px)",
              }}
              animate={{
                x: [0, particle.drift * 0.8, particle.drift * 1.2, particle.drift * 0.6],
                y: [0, -dimensions.height * 1.4],
                opacity: [particle.opacity * 0.6, particle.opacity * 0.8, particle.opacity * 0.4, 0],
                scale: deviceProfile.performanceClass === "high" ? [0.8, 1, 1.1, 0.9] : [0.9, 1, 0.9],
              }}
              transition={{
                duration: dimensions.width > 0 ? 120 / particle.speed : 25,
                ease: [0.25, 0.46, 0.45, 0.94],
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: Math.random() * 2 + 1,
              }}
            />
          ))}
      </div>

      {/* Mid-layer particles */}
      <div className="absolute inset-0" style={{ zIndex: -5 }}>
        {sortedParticles
          .filter((particle) => particle.z >= -0.7 && particle.z < -0.4)
          .map((particle) => (
            <motion.div
              key={`mid-${particle.id}`}
              className="absolute rounded-full will-change-transform"
              style={{
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                background: `radial-gradient(circle, rgba(255,255,255,${particle.opacity}) 0%, rgba(255,255,255,${particle.opacity * 0.5}) 60%, transparent 100%)`,
                boxShadow:
                  deviceProfile.performanceClass !== "low"
                    ? `0 0 ${particle.size * 2}px rgba(255,255,255,${particle.opacity * 0.3})`
                    : "none",
              }}
              animate={{
                x: [0, particle.drift, particle.drift * 1.5, particle.drift * 0.8],
                y: [0, -dimensions.height * 1.3],
                opacity: [particle.opacity, particle.opacity * 0.9, particle.opacity * 0.6, 0],
                scale: deviceProfile.performanceClass === "high" ? [0.9, 1.1, 1.2, 1] : [0.95, 1.05, 1],
              }}
              transition={{
                duration: dimensions.width > 0 ? 110 / particle.speed : 22,
                ease: [0.23, 1, 0.32, 1],
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: Math.random() * 2.5 + 1.2,
              }}
            />
          ))}
      </div>

      {/* Foreground particles */}
      <div className="absolute inset-0" style={{ zIndex: -2 }}>
        {sortedParticles
          .filter((particle) => particle.z >= -0.4)
          .map((particle) => (
            <motion.div
              key={`fg-${particle.id}`}
              className="absolute rounded-full will-change-transform"
              style={{
                width: `${particle.size * 1.1}px`,
                height: `${particle.size * 1.1}px`,
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                background: `radial-gradient(circle, rgba(255,255,255,${particle.opacity * 1.1}) 0%, rgba(255,255,255,${particle.opacity * 0.7}) 50%, transparent 100%)`,
                boxShadow:
                  deviceProfile.performanceClass === "high"
                    ? `0 0 ${particle.size * 3}px rgba(255,255,255,${particle.opacity * 0.4})`
                    : "none",
                filter: deviceProfile.performanceClass === "high" ? "blur(0.2px)" : "none",
              }}
              animate={{
                x: [0, particle.drift * 1.2, particle.drift * 1.8, particle.drift],
                y: [0, -dimensions.height * 1.2],
                opacity: [particle.opacity * 1.1, particle.opacity, particle.opacity * 0.7, 0],
                scale: deviceProfile.performanceClass === "high" ? [1, 1.2, 1.3, 1.1] : [1, 1.1, 1],
                rotate: deviceProfile.performanceClass === "high" ? [0, particle.drift > 0 ? 15 : -15, 0] : [0, 0, 0],
              }}
              transition={{
                duration: dimensions.width > 0 ? 100 / particle.speed : 20,
                ease: [0.19, 1, 0.22, 1],
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: Math.random() * 3 + 1.5,
              }}
            />
          ))}
      </div>
    </div>
  )
}
