"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { OperationsService, type Operation } from "@/lib/operations-service"
import { PersonasService, type Persona } from "@/lib/personas-service"
import { PipelinesService, type Pipeline } from "@/lib/pipelines-service"
import { ResourcesService, type Resource } from "@/lib/resources-service"
import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"
import ActivityGrid from "@/components/activity-grid"

interface StatisticsProps {
  vaultId: string
}

export default function Statistics({ vaultId }: StatisticsProps) {
  const { user } = useAuth()
  const { t } = useLanguage()
  const [operations, setOperations] = useState<Operation[]>([])
  const [personas, setPersonas] = useState<Persona[]>([])
  const [pipelines, setPipelines] = useState<Pipeline[]>([])
  const [resources, setResources] = useState<Resource[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hoveredStat, setHoveredStat] = useState<{
    type: string
    value: number
    x: number
    y: number
  } | null>(null)

  useEffect(() => {
    loadAllData()
  }, [vaultId])

  const loadAllData = async () => {
    try {
      setIsLoading(true)
      const [operationsData, personasData, pipelinesData, resourcesData] = await Promise.all([
        OperationsService.getVaultOperations(vaultId),
        PersonasService.getVaultPersonas(vaultId),
        PipelinesService.getVaultPipelines(vaultId),
        ResourcesService.getVaultResources(vaultId),
      ])

      setOperations(operationsData)
      setPersonas(personasData)
      setPipelines(pipelinesData)
      setResources(resourcesData)
    } catch (error) {
      console.error("Error loading statistics data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleMouseEnter = (type: string, value: number, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const containerRect = event.currentTarget.closest(".h-full")?.getBoundingClientRect()

    if (containerRect) {
      setHoveredStat({
        type,
        value,
        x: rect.left - containerRect.left + rect.width / 2,
        y: rect.top - containerRect.top - 10,
      })
    }
  }

  const handleMouseLeave = () => {
    setHoveredStat(null)
  }

  const getStatusCounts = (items: (Operation | Persona | Pipeline)[], statusField = "status") => {
    const counts = { active: 0, pending: 0, completed: 0, critical: 0 }
    items.forEach((item) => {
      const status = (item as any)[statusField]
      if (status in counts) {
        counts[status as keyof typeof counts]++
      }
    })
    return counts
  }

  const operationStats = getStatusCounts(operations)
  const personaStats = getStatusCounts(personas)
  const pipelineStats = getStatusCounts(pipelines)

  const totalItems = operations.length + personas.length + pipelines.length + resources.length
  const activeItems = operationStats.active + personaStats.active + pipelineStats.active
  const completedItems = operationStats.completed + personaStats.completed + pipelineStats.completed

  if (isLoading) {
    return (
      <div className="h-full flex flex-col bg-black/40 backdrop-blur-sm overflow-hidden">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-white/50 text-sm">{t("statistics.loading")}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-black/40 backdrop-blur-sm overflow-hidden relative">
      <div className="flex-1 p-4 space-y-6 overflow-y-auto">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card
            className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
            onMouseEnter={(e) => handleMouseEnter("Total Items", totalItems, e)}
            onMouseLeave={handleMouseLeave}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-white/70">{t("statistics.totalItems")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{totalItems}</div>
            </CardContent>
          </Card>

          <Card
            className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
            onMouseEnter={(e) => handleMouseEnter("Active Items", activeItems, e)}
            onMouseLeave={handleMouseLeave}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-white/70">{t("statistics.activeItems")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">{activeItems}</div>
            </CardContent>
          </Card>

          <Card
            className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
            onMouseEnter={(e) => handleMouseEnter("Completed Items", completedItems, e)}
            onMouseLeave={handleMouseLeave}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-white/70">{t("statistics.completed")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">{completedItems}</div>
            </CardContent>
          </Card>

          <Card
            className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
            onMouseEnter={(e) =>
              handleMouseEnter("Completion Rate", Math.round((completedItems / totalItems) * 100), e)
            }
            onMouseLeave={handleMouseLeave}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-white/70">{t("statistics.completionRate")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Operations Breakdown */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-white">{t("statistics.operations")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white/70">{t("statistics.total")}</span>
                <span className="text-white font-medium">{operations.length}</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      {t("statistics.active")}
                    </Badge>
                  </div>
                  <span className="text-white">{operationStats.active}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                      {t("statistics.pending")}
                    </Badge>
                  </div>
                  <span className="text-white">{operationStats.pending}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                      {t("statistics.completed")}
                    </Badge>
                  </div>
                  <span className="text-white">{operationStats.completed}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-red-500/20 text-red-400 border-red-500/30">{t("statistics.critical")}</Badge>
                  </div>
                  <span className="text-white">{operationStats.critical}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personas Breakdown */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-white">{t("statistics.personas")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white/70">{t("statistics.total")}</span>
                <span className="text-white font-medium">{personas.length}</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                      {t("statistics.active")}
                    </Badge>
                  </div>
                  <span className="text-white">{personaStats.active}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                      {t("statistics.pending")}
                    </Badge>
                  </div>
                  <span className="text-white">{personaStats.pending}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                      {t("statistics.completed")}
                    </Badge>
                  </div>
                  <span className="text-white">{personaStats.completed}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-red-500/20 text-red-400 border-red-500/30">{t("statistics.critical")}</Badge>
                  </div>
                  <span className="text-white">{personaStats.critical}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pipelines Breakdown */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-white">{t("statistics.pipelines")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white/70">{t("statistics.total")}</span>
                <span className="text-white font-medium">{pipelines.length}</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      {t("statistics.active")}
                    </Badge>
                  </div>
                  <span className="text-white">{pipelineStats.active}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                      {t("statistics.pending")}
                    </Badge>
                  </div>
                  <span className="text-white">{pipelineStats.pending}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                      {t("statistics.completed")}
                    </Badge>
                  </div>
                  <span className="text-white">{pipelineStats.completed}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-red-500/20 text-red-400 border-red-500/30">{t("statistics.critical")}</Badge>
                  </div>
                  <span className="text-white">{pipelineStats.critical}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resources Breakdown */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-white">{t("statistics.resources")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white/70">{t("statistics.total")}</span>
                <span className="text-white font-medium">{resources.length}</span>
              </div>
              <div className="space-y-2">
                {resources.length > 0 ? (
                  (() => {
                    const categories = resources.reduce(
                      (acc, resource) => {
                        acc[resource.category] = (acc[resource.category] || 0) + 1
                        return acc
                      },
                      {} as Record<string, number>,
                    )

                    return Object.entries(categories).map(([category, count]) => (
                      <div key={category} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">{category}</Badge>
                        </div>
                        <span className="text-white">{count}</span>
                      </div>
                    ))
                  })()
                ) : (
                  <p className="text-white/50 text-sm">{t("statistics.noResourcesAvailable")}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Grid */}
        <ActivityGrid />
      </div>

      {/* Tooltip */}
      {hoveredStat && (
        <div
          className="absolute z-50 bg-black border border-white/20 rounded-lg px-3 py-2 text-sm text-white shadow-lg pointer-events-none"
          style={{
            left: hoveredStat.x,
            top: hoveredStat.y,
            transform: "translateX(-50%) translateY(-100%)",
          }}
        >
          <div className="whitespace-nowrap">
            {hoveredStat.type}: {hoveredStat.value}
            {hoveredStat.type === "Completion Rate" ? "%" : ""}
          </div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white/20" />
        </div>
      )}
    </div>
  )
}
