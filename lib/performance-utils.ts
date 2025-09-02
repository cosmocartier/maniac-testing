// Performance optimization utilities
export const dynamicImport = async (importFn: () => Promise<any>): Promise<any> => {
  try {
    const module = await importFn()
    return module.default
  } catch (error) {
    console.error("Dynamic import failed:", error)
    throw error
  }
}

// Preload critical resources
export const preloadResource = (href: string, as: string) => {
  if (typeof window !== "undefined") {
    const link = document.createElement("link")
    link.rel = "preload"
    link.href = href
    link.as = as
    document.head.appendChild(link)
  }
}

// Debounce function for performance optimization
export const debounce = (func: (...args: any[]) => any, wait: number): ((...args: any[]) => void) => {
  let timeout: any
  return (...args: any[]) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Throttle function for performance optimization
export const throttle = (func: (...args: any[]) => any, limit: number): ((...args: any[]) => void) => {
  let inThrottle: boolean
  return (...args: any[]) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Intersection Observer for lazy loading
export const createIntersectionObserver = (
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit,
) => {
  if (typeof window !== "undefined" && "IntersectionObserver" in window) {
    return new IntersectionObserver(callback, {
      rootMargin: "50px",
      threshold: 0.1,
      ...options,
    })
  }
  return null
}

// Memory usage monitoring
export const getMemoryUsage = () => {
  if (typeof window !== "undefined" && "performance" in window && "memory" in performance) {
    const memory = (performance as any).memory
    return {
      used: Math.round(memory.usedJSHeapSize / 1048576),
      total: Math.round(memory.totalJSHeapSize / 1048576),
      limit: Math.round(memory.jsHeapSizeLimit / 1048576),
    }
  }
  return null
}
