"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X, Play, RotateCcw, CheckCircle, Zap, Brain, Target } from "lucide-react"
import type { Pipeline } from "@/lib/pipelines-service"
import type { Operation } from "@/lib/operations-service"
import type { Persona } from "@/lib/personas-service"

interface PipelineSimulationModalProps {
  isOpen: boolean
  onClose: () => void
  pipeline: Pipeline
  onSimulationComplete: (optimizedPipeline: Pipeline) => void
  vaultId: string
  operations: Operation[]
  personas: Persona[]
}

interface SimulationState {
  phase: "config" | "running" | "complete"
  progress: number
  currentIteration: number
  totalIterations: number
  bestScore: number
  exploredNodes: number
  optimizations: string[]
  isRunning: boolean
  isPaused: false
}

interface OptimizationSuggestion {
  type: "reorder" | "mutate" | "rewire" | "add" | "remove"
  description: string
  impact: "high" | "medium" | "low"
  confidence: number
}

export default function PipelineSimulationModal({
  isOpen,
  onClose,
  pipeline,
  onSimulationComplete,
  vaultId,
  operations,
  personas,
}: PipelineSimulationModalProps) {
  const [simulationCount, setSimulationCount] = useState(1000)
  const [simulationState, setSimulationState] = useState<SimulationState>({
    phase: "config",
    progress: 0,
    currentIteration: 0,
    totalIterations: 0,
    bestScore: 0,
    exploredNodes: 0,
    optimizations: [],
    isRunning: false,
    isPaused: false,
  })
  const [optimizedPipeline, setOptimizedPipeline] = useState<Pipeline | null>(null)
  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>([])
  const [selectedSuggestions, setSelectedSuggestions] = useState<Set<number>>(new Set())

  useEffect(() => {
    if (!isOpen) {
      // Reset state when modal closes
      setSimulationState({
        phase: "config",
        progress: 0,
        currentIteration: 0,
        totalIterations: 0,
        bestScore: 0,
        exploredNodes: 0,
        optimizations: [],
        isRunning: false,
        isPaused: false,
      })
      setOptimizedPipeline(null)
      setSuggestions([])
      setSelectedSuggestions(new Set())
    }
  }, [isOpen])

  const startSimulation = () => {
    setSimulationState((prev) => ({
      ...prev,
      phase: "running",
      totalIterations: simulationCount,
      isRunning: true,
    }))

    // Simulate MCTS process
    simulateMCTS()
  }

  const simulateMCTS = async () => {
    const totalIterations = simulationCount
    const updateInterval = Math.max(1, Math.floor(totalIterations / 100)) // Update 100 times max

    for (let i = 0; i <= totalIterations; i++) {
      if (i % updateInterval === 0 || i === totalIterations) {
        await new Promise((resolve) => setTimeout(resolve, 50)) // Simulate processing time

        const progress = (i / totalIterations) * 100
        const bestScore = Math.min(100, 20 + (progress / 100) * 80) // Score improves over time
        const exploredNodes = Math.floor((i / totalIterations) * simulationCount * 3.2) // Realistic node exploration

        setSimulationState((prev) => ({
          ...prev,
          progress,
          currentIteration: i,
          bestScore,
          exploredNodes,
          optimizations: generateOptimizations(progress),
        }))
      }
    }

    // Generate final optimized pipeline and suggestions
    const optimized = generateOptimizedPipeline()
    const optimizationSuggestions = generateSuggestions()

    setOptimizedPipeline(optimized)
    setSuggestions(optimizationSuggestions)
    setSelectedSuggestions(new Set(optimizationSuggestions.map((_, index) => index))) // Select all by default

    setSimulationState((prev) => ({
      ...prev,
      phase: "complete",
      isRunning: false,
    }))
  }

  const generateOptimizations = (progress: number): string[] => {
    const optimizations = []
    if (progress > 10) optimizations.push("Analyzing step dependencies")
    if (progress > 25) optimizations.push("Exploring reordering possibilities")
    if (progress > 40) optimizations.push("Evaluating data flow efficiency")
    if (progress > 60) optimizations.push("Integrating consciousness layer insights")
    if (progress > 80) optimizations.push("Optimizing resource allocation")
    if (progress > 95) optimizations.push("Finalizing configuration")
    return optimizations
  }

  const generateOptimizedPipeline = (): Pipeline => {
    // Create an optimized version of the pipeline
    const optimized: Pipeline = {
      ...pipeline,
      stepData: {
        ...pipeline.stepData,
        // Add optimized step configurations
        0: {
          title: "Initialize Context Analysis",
          description: "Enhanced initialization with consciousness layer integration",
          completed: false,
        },
        1: {
          title: "Execute Primary Operations",
          description: "Optimized execution sequence based on dependency analysis",
          completed: false,
        },
        2: {
          title: "Validate & Iterate",
          description: "Streamlined validation with automated feedback loops",
          completed: false,
        },
      },
    }

    return optimized
  }

  const generateSuggestions = (): OptimizationSuggestion[] => {
    return [
      {
        type: "reorder",
        description: "Reorder steps 2 and 3 for improved data flow efficiency",
        impact: "high",
        confidence: 0.87,
      },
      {
        type: "mutate",
        description: "Enhance step 1 logic with consciousness layer integration",
        impact: "medium",
        confidence: 0.73,
      },
      {
        type: "rewire",
        description: "Optimize data bindings between operations and personas",
        impact: "high",
        confidence: 0.91,
      },
      {
        type: "add",
        description: "Add validation checkpoint after critical operations",
        impact: "medium",
        confidence: 0.68,
      },
    ]
  }

  const handleSuggestionToggle = (index: number) => {
    const newSelected = new Set(selectedSuggestions)
    if (newSelected.has(index)) {
      newSelected.delete(index)
    } else {
      newSelected.add(index)
    }
    setSelectedSuggestions(newSelected)
  }

  const applyOptimizations = () => {
    if (!optimizedPipeline) return

    // Apply only selected suggestions to the optimized pipeline
    const finalPipeline = { ...optimizedPipeline }

    // Here you would apply the selected suggestions to the pipeline
    // For now, we'll just pass the optimized pipeline as-is

    onSimulationComplete(finalPipeline)
  }

  const getSuggestionIcon = (type: OptimizationSuggestion["type"]) => {
    switch (type) {
      case "reorder":
        return <RotateCcw className="w-4 h-4" />
      case "mutate":
        return <Zap className="w-4 h-4" />
      case "rewire":
        return <Brain className="w-4 h-4" />
      case "add":
        return <Target className="w-4 h-4" />
      case "remove":
        return <X className="w-4 h-4" />
    }
  }

  const getImpactColor = (impact: OptimizationSuggestion["impact"]) => {
    switch (impact) {
      case "high":
        return "text-green-400"
      case "medium":
        return "text-yellow-400"
      case "low":
        return "text-blue-400"
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="w-full max-w-4xl bg-black/40 backdrop-blur-sm border border-white/10 overflow-hidden max-h-[90vh]">
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain className="w-5 h-5 text-white/90" />
              <h2 className="text-lg font-semibold text-white/90">MCTS Pipeline Simulation</h2>
              <div className="px-2 py-1 bg-white/10 border border-white/20 text-xs text-white/70">{pipeline.name}</div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white/60 hover:text-white/90 hover:bg-white/10 border-none"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-4 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {simulationState.phase === "config" && (
              <>
                {/* Configuration Phase */}
                <div className="space-y-4">
                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-semibold text-white/90">Configuration Phase</h3>
                    <p className="text-white/70 text-sm">
                      Configure the Monte Carlo Tree Search parameters for pipeline optimization
                    </p>
                  </div>

                  {/* Simulation Count Selector */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-white/90">Number of Simulations</label>
                    <div className="grid grid-cols-4 gap-2">
                      {[100, 500, 1000, 2000, 5000, 10000, 15000, 20000].map((count) => (
                        <button
                          key={count}
                          onClick={() => setSimulationCount(count)}
                          className={`p-3 border text-sm transition-all duration-200 ${
                            simulationCount === count
                              ? "bg-white/20 border-white/30 text-white/90"
                              : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                          }`}
                        >
                          {count.toLocaleString()}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Pipeline Context */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium text-white/90 text-sm">Current Configuration</h4>
                      <div className="p-3 bg-white/5 border border-white/10 space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-white/70">Steps:</span>
                          <span className="text-white/90">{pipeline.steps}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-white/70">Linked Operations:</span>
                          <span className="text-white/90">{pipeline.attachedTo.operations.length}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-white/70">Linked Personas:</span>
                          <span className="text-white/90">{pipeline.attachedTo.personas.length}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-white/90 text-sm">Optimization Scope</h4>
                      <div className="p-3 bg-white/5 border border-white/10 space-y-2">
                        <div className="flex items-center gap-2 text-xs">
                          <CheckCircle className="w-3 h-3 text-green-400" />
                          <span className="text-white/70">Step Reordering</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <CheckCircle className="w-3 h-3 text-green-400" />
                          <span className="text-white/70">Logic Mutation</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <CheckCircle className="w-3 h-3 text-green-400" />
                          <span className="text-white/70">Data Flow Rewiring</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <CheckCircle className="w-3 h-3 text-green-400" />
                          <span className="text-white/70">Component Addition/Removal</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Start Button */}
                  <div className="flex justify-center pt-4">
                    <Button
                      onClick={startSimulation}
                      className="bg-white/10 hover:bg-white/20 text-white border-white/20 px-8 py-3"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start MCTS Simulation
                    </Button>
                  </div>
                </div>
              </>
            )}

            {simulationState.phase === "running" && (
              <>
                {/* Simulation Phase */}
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-semibold text-white/90">Simulation Phase</h3>
                    <p className="text-white/70 text-sm">MCTS engine is exploring pipeline configurations</p>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/70">Progress</span>
                      <span className="text-white/90">{simulationState.progress.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-white/10 border border-white/20 h-2">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300"
                        style={{ width: `${simulationState.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Simulation Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-white/5 border border-white/10">
                      <div className="text-2xl font-bold text-white/90">
                        {simulationState.currentIteration.toLocaleString()}
                      </div>
                      <div className="text-xs text-white/70">Iterations</div>
                    </div>
                    <div className="text-center p-4 bg-white/5 border border-white/10">
                      <div className="text-2xl font-bold text-green-400">{simulationState.bestScore.toFixed(1)}</div>
                      <div className="text-xs text-white/70">Best Score</div>
                    </div>
                    <div className="text-center p-4 bg-white/5 border border-white/10">
                      <div className="text-2xl font-bold text-blue-400">
                        {simulationState.exploredNodes.toLocaleString()}
                      </div>
                      <div className="text-xs text-white/70">Explored Nodes</div>
                    </div>
                  </div>

                  {/* Current Optimizations */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-white/90 text-sm">Current Optimizations</h4>
                    <div className="p-3 bg-white/5 border border-white/10 space-y-2">
                      {simulationState.optimizations.map((optimization, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                          <span className="text-white/70">{optimization}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {simulationState.phase === "complete" && (
              <>
                {/* Output Phase */}
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-semibold text-white/90">Output Phase</h3>
                    <p className="text-white/70 text-sm">Simulation complete - Review and apply optimizations</p>
                  </div>

                  {/* Final Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-white/5 border border-white/10">
                      <div className="text-2xl font-bold text-white/90">
                        {simulationState.totalIterations.toLocaleString()}
                      </div>
                      <div className="text-xs text-white/70">Total Iterations</div>
                    </div>
                    <div className="text-center p-4 bg-white/5 border border-white/10">
                      <div className="text-2xl font-bold text-green-400">{simulationState.bestScore.toFixed(1)}</div>
                      <div className="text-xs text-white/70">Final Score</div>
                    </div>
                    <div className="text-center p-4 bg-white/5 border border-white/10">
                      <div className="text-2xl font-bold text-blue-400">
                        {simulationState.exploredNodes.toLocaleString()}
                      </div>
                      <div className="text-xs text-white/70">Total Nodes</div>
                    </div>
                  </div>

                  {/* Optimization Suggestions */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-white/90 text-sm">Optimization Suggestions</h4>
                    <div className="space-y-2">
                      {suggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className={`p-3 border cursor-pointer transition-all duration-200 ${
                            selectedSuggestions.has(index)
                              ? "bg-white/10 border-white/20"
                              : "bg-white/5 border-white/10 hover:bg-white/8"
                          }`}
                          onClick={() => handleSuggestionToggle(index)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              {getSuggestionIcon(suggestion.type)}
                              <span className="text-white/90 text-sm font-medium">{suggestion.type.toUpperCase()}</span>
                            </div>
                            <div className={`text-xs px-2 py-1 border ${getImpactColor(suggestion.impact)}`}>
                              {suggestion.impact.toUpperCase()}
                            </div>
                            <div className="text-xs text-white/60">
                              {(suggestion.confidence * 100).toFixed(0)}% confidence
                            </div>
                            <div className="ml-auto">
                              {selectedSuggestions.has(index) ? (
                                <CheckCircle className="w-4 h-4 text-green-400" />
                              ) : (
                                <div className="w-4 h-4 border border-white/30 rounded-full" />
                              )}
                            </div>
                          </div>
                          <p className="text-white/70 text-xs mt-2">{suggestion.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pipeline Preview */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-white/90 text-sm">Optimized Pipeline Preview</h4>
                    <div className="p-3 bg-white/5 border border-white/10 space-y-2">
                      {optimizedPipeline &&
                        Array.from({ length: optimizedPipeline.steps }, (_, index) => (
                          <div key={index} className="flex items-center gap-3 p-2 bg-white/5 border border-white/10">
                            <div className="w-4 h-4 rounded-full bg-white/30" />
                            <div className="flex-1">
                              <p className="text-white/90 text-sm">
                                {optimizedPipeline.stepData[index]?.title || `Step ${index + 1}`}
                              </p>
                              {optimizedPipeline.stepData[index]?.description && (
                                <p className="text-white/60 text-xs">{optimizedPipeline.stepData[index].description}</p>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t border-white/10">
                    <Button
                      onClick={onClose}
                      variant="outline"
                      className="flex-1 bg-white/5 border-white/20 text-white/80 hover:bg-white/10"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={applyOptimizations}
                      className="flex-1 bg-white/10 hover:bg-white/20 text-white border-white/20"
                      disabled={selectedSuggestions.size === 0}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Apply Selected Optimizations
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
