"use client"

import { useEffect } from "react"

interface PerformanceMetrics {
  fcp?: number
  lcp?: number
  fid?: number
  cls?: number
  ttfb?: number
}

export function PerformanceMonitor() {
  useEffect(() => {
    if (typeof window === "undefined" || process.env.NODE_ENV !== "production") {
      return
    }

    const metrics: PerformanceMetrics = {}

    // First Contentful Paint
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === "first-contentful-paint") {
          metrics.fcp = entry.startTime
        }
      }
    })
    observer.observe({ entryTypes: ["paint"] })

    // Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1]
      metrics.lcp = lastEntry.startTime
    })
    lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] })

    // Cumulative Layout Shift
    let clsValue = 0
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value
        }
      }
      metrics.cls = clsValue
    })
    clsObserver.observe({ entryTypes: ["layout-shift"] })

    // Time to First Byte
    const navigationEntry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming
    if (navigationEntry) {
      metrics.ttfb = navigationEntry.responseStart - navigationEntry.requestStart
    }

    // Log metrics after page load
    const logMetrics = () => {
      console.log("Performance Metrics:", metrics)

      // Send to analytics service in production
      if (process.env.NODE_ENV === "production") {
        // Example: analytics.track("page_performance", metrics)
      }
    }

    // Wait for page to be fully loaded
    if (document.readyState === "complete") {
      setTimeout(logMetrics, 1000)
    } else {
      window.addEventListener("load", () => {
        setTimeout(logMetrics, 1000)
      })
    }

    return () => {
      observer.disconnect()
      lcpObserver.disconnect()
      clsObserver.disconnect()
    }
  }, [])

  return null
}
