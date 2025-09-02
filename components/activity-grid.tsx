"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ActivityService, type ActivityData } from "@/lib/activity-service"
import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"

interface ActivityGridProps {
  className?: string
}

export default function ActivityGrid({ className = "" }: ActivityGridProps) {
  const { user } = useAuth()
  const { t } = useLanguage()
  const [activityData, setActivityData] = useState<ActivityData[]>([])
  const [hoveredDay, setHoveredDay] = useState<{ date: string; minutes: number; x: number; y: number } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadActivityData()
    }
  }, [user])

  const loadActivityData = async () => {
    if (!user) return

    try {
      setIsLoading(true)
      const data = await ActivityService.getUserActivity(user.id)
      setActivityData(data)
    } catch (error) {
      console.error("Error loading activity data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getActivityForDate = (date: string): number => {
    const activity = activityData.find((a) => a.date === date)
    return activity?.minutes || 0
  }

  const getActivityColor = (minutes: number): string => {
    const level = ActivityService.getActivityLevel(minutes)
    switch (level) {
      case "none":
        return "bg-zinc-800"
      case "low":
        return "bg-zinc-600"
      case "medium":
        return "bg-zinc-500"
      case "high":
        return "bg-zinc-400"
      case "max":
        return "bg-white"
      default:
        return "bg-zinc-800"
    }
  }

  const handleMouseEnter = (date: string, minutes: number, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const containerRect = event.currentTarget.closest(".bg-black\\/40")?.getBoundingClientRect()

    if (containerRect) {
      setHoveredDay({
        date,
        minutes,
        x: rect.left - containerRect.left + rect.width / 2,
        y: rect.top - containerRect.top - 10,
      })
    }
  }

  const handleMouseLeave = () => {
    setHoveredDay(null)
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  // Generate all dates for the last 12 months
  const allDates = ActivityService.generateYearDates()

  // Group dates into weeks (7 days each)
  const weeks: string[][] = []
  for (let i = 0; i < allDates.length; i += 7) {
    weeks.push(allDates.slice(i, i + 7))
  }

  return (
    <div className={`${className} relative`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-white">{t("activityGrid.title")}</h3>
        <div className="text-sm text-gray-400">{t("activityGrid.lastMonths")}</div>
      </div>

      <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-6 relative">
        <div className="flex gap-1 max-w-full overflow-x-auto">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((date, dayIndex) => {
                const minutes = getActivityForDate(date)
                return (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className={`w-3 h-3 rounded-md cursor-pointer transition-all duration-200 hover:ring-1 hover:ring-zinc-800 ${getActivityColor(minutes)}`}
                    onMouseEnter={(e) => handleMouseEnter(date, minutes, e)}
                    onMouseLeave={handleMouseLeave}
                  />
                )
              })}
            </div>
          ))}
        </div>

        {/* Tooltip */}
        {hoveredDay && (
          <div
            className="absolute z-50 bg-black border border-white/20 rounded-lg px-3 py-2 text-sm text-white shadow-lg pointer-events-none"
            style={{
              left: hoveredDay.x,
              top: hoveredDay.y,
              transform: "translateX(-50%) translateY(-100%)",
            }}
          >
            <div className="whitespace-nowrap">
              {ActivityService.formatTime(hoveredDay.minutes)} {t("activityGrid.on")} {formatDate(hoveredDay.date)}
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white/20" />
          </div>
        )}

        {/* Legend */}
        <div className="flex items-center justify-between mt-4 text-xs text-gray-400">
          <span>{t("activityGrid.less")}</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-md bg-zinc-800" />
            <div className="w-3 h-3 rounded-md bg-zinc-600" />
            <div className="w-3 h-3 rounded-md bg-zinc-500" />
            <div className="w-3 h-3 rounded-md bg-zinc-400" />
            <div className="w-3 h-3 rounded-md bg-white" />
          </div>
          <span>{t("activityGrid.more")}</span>
        </div>
      </div>
    </div>
  )
}
