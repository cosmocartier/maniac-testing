"use client"

import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"

// Lazy load heavy animation components
export const LazyAnimationBackground = dynamic(() => import("@/components/animation-background"), {
  loading: () => <div className="w-full h-full bg-black/20" />,
  ssr: false,
})

export const LazyScrollTunnel = dynamic(() => import("@/components/scroll-tunnel"), {
  loading: () => <div className="w-full h-full bg-black/20" />,
  ssr: false,
})

export const LazyRevealBackground = dynamic(
  () => import("@/components/reveal-background").then((mod) => ({ default: mod.RevealBackground })),
  {
    loading: () => <div className="w-full h-full bg-black/20" />,
    ssr: false,
  },
)

export const LazyRevealBackground2 = dynamic(
  () => import("@/components/reveal-background-2").then((mod) => ({ default: mod.RevealBackground })),
  {
    loading: () => <div className="w-full h-full bg-black/20" />,
    ssr: false,
  },
)

export const LazyRevealBackground3 = dynamic(
  () => import("@/components/reveal-background-3").then((mod) => ({ default: mod.RevealBackground })),
  {
    loading: () => <div className="w-full h-full bg-black/20" />,
    ssr: false,
  },
)

export const LazyPixelCard = dynamic(() => import("@/components/pixel-card"), {
  loading: () => <div className="w-full h-full bg-black/20 rounded-lg" />,
  ssr: false,
})

export const LazyMetallicLogo = dynamic(() => import("@/components/metallic-logo"), {
  loading: () => <img src="/images/minimal-m-logo.png" alt="M" className="h-20 w-auto object-contain opacity-90" />,
  ssr: false,
})

export const LazySnowParticles = dynamic(
  () => import("@/components/snow-particles").then((mod) => ({ default: mod.SnowParticles })),
  {
    loading: () => null,
    ssr: false,
  },
)

// Skeleton components for better loading UX
export const ImageSkeleton = ({ className }: { className?: string }) => (
  <Skeleton className={`bg-gray-800 ${className}`} />
)

export const LogoSkeleton = () => <Skeleton className="h-9 w-32 bg-gray-800" />

export const ButtonSkeleton = () => <Skeleton className="h-10 w-24 bg-gray-800" />
