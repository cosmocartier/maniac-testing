"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import PipelineStepModal from "@/components/pipeline-step-modal"
import PipelineSimulationModal from "@/components/pipeline-simulation-modal"
import { GripVertical, X, Edit, Trash2, Link, Paperclip, Play, Download } from "lucide-react"
import { PipelinesService, type Pipeline } from "@/lib/pipelines-service"
import { OperationsService, type Operation } from "@/lib/operations-service"
import { PersonasService, type Persona } from "@/lib/personas-service"
import { useLanguage } from "@/lib/language-context"

interface PipelinesProps {
  vaultId: string
  onPipelineSelect?: (pipeline: Pipeline | null) => void
  searchValue?: string
  onAddNew?: () => void
  personas?: Persona[]
  operations?: Operation[]
}

export default function Pipelines({
  vaultId,
  searchValue,
  onPipelineSelect,
  onAddNew,
  personas = [],
  operations = [],
}: PipelinesProps) {
  const { t } = useLanguage()
  const [pipelines, setPipelines] = useState<Pipeline[]>([])
  const [filteredPipelines, setFilteredPipelines] = useState<Pipeline[]>([])
  const [selectedPipeline, setSelectedPipeline] = useState<Pipeline | null>(null)
  const [selectedStep, setSelectedStep] = useState<number | null>(null)
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const [showStepModal, setShowStepModal] = useState(false)
  const [showSimulationModal, setShowSimulationModal] = useState(false)
  const [simulatingPipeline, setSimulatingPipeline] = useState<Pipeline | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editingPipeline, setEditingPipeline] = useState<Pipeline | null>(null)
  const [showLinkModal, setShowLinkModal] = useState(false)
  const [linkType, setLinkType] = useState<"personas" | "operations" | "resources">("operations")
  const [attachedFiles, setAttachedFiles] = useState<{ [pipelineId: string]: File[] }>({})

  // Load pipelines, operations, and personas from Supabase
  useEffect(() => {
    loadPipelines()
    loadOperations()
    loadPersonas()
  }, [vaultId])

  // Filter pipelines based on search value
  useEffect(() => {
    if (!searchValue.trim()) {
      setFilteredPipelines(pipelines)
    } else {
      const filtered = pipelines.filter(
        (pipeline) =>
          pipeline.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          pipeline.status.toLowerCase().includes(searchValue.toLowerCase()),
      )
      setFilteredPipelines(filtered)
    }
  }, [pipelines, searchValue])

  const loadPipelines = async () => {
    try {
      setIsLoading(true)
      const pipelinesData = await PipelinesService.getVaultPipelines(vaultId)
      setPipelines(pipelinesData)
    } catch (error) {
      console.error("Error loading pipelines:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadOperations = async () => {
    try {
      const operationsData = await OperationsService.getVaultOperations(vaultId)
      operations = operationsData // Declare setOperations here
    } catch (error) {
      console.error("Error loading operations:", error)
    }
  }

  const loadPersonas = async () => {
    try {
      const personasData = await PersonasService.getVaultPersonas(vaultId)
      personas = personasData // Declare setPersonas here
    } catch (error) {
      console.error("Error loading personas:", error)
    }
  }

  const getStatusColor = (status: Pipeline["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "completed":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "critical":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const handleDragStart = (e: React.DragEvent, pipelineId: string) => {
    setDraggedItem(pipelineId)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault()
    if (!draggedItem || draggedItem === targetId) return

    const draggedIndex = filteredPipelines.findIndex((p) => p.id === draggedItem)
    const targetIndex = filteredPipelines.findIndex((p) => p.id === targetId)

    if (draggedIndex === -1 || targetIndex === -1) return

    const newPipelines = [...filteredPipelines]
    const [draggedPipeline] = newPipelines.splice(draggedIndex, 1)
    newPipelines.splice(targetIndex, 0, draggedPipeline)

    setFilteredPipelines(newPipelines)
    setDraggedItem(null)
  }

  const handleDragEnd = () => {
    setDraggedItem(null)
  }

  const handlePipelineClick = (pipeline: Pipeline) => {
    setSelectedPipeline(pipeline)
    onPipelineSelect?.(pipeline)
  }

  const handleCloseDetail = () => {
    setSelectedPipeline(null)
    setIsEditing(false)
    setEditingPipeline(null)
    onPipelineSelect?.(null)
  }

  const handleActivatePipeline = async (e: React.MouseEvent, pipelineId: string) => {
    e.stopPropagation()
    const pipeline = filteredPipelines.find((p) => p.id === pipelineId)
    if (!pipeline) return

    if (pipeline.isActive) {
      // If already active, deactivate
      try {
        const updatedPipeline = await PipelinesService.updatePipeline(pipelineId, {
          isActive: false,
        })
        setPipelines((prev) => prev.map((p) => (p.id === pipelineId ? updatedPipeline : p)))
      } catch (error) {
        console.error("Error updating pipeline:", error)
      }
    } else {
      // If not active, show simulation modal
      setSimulatingPipeline(pipeline)
      setShowSimulationModal(true)
    }
  }

  const handleSimulationComplete = async (optimizedPipeline: Pipeline) => {
    try {
      // Update the pipeline with optimized configuration
      const updatedPipeline = await PipelinesService.updatePipeline(optimizedPipeline.id, {
        ...optimizedPipeline,
        isActive: true,
      })

      setPipelines((prev) => prev.map((p) => (p.id === optimizedPipeline.id ? updatedPipeline : p)))

      // Update selected pipeline if it's the one being simulated
      if (selectedPipeline?.id === optimizedPipeline.id) {
        setSelectedPipeline(updatedPipeline)
      }

      setShowSimulationModal(false)
      setSimulatingPipeline(null)
    } catch (error) {
      console.error("Error applying simulation results:", error)
    }
  }

  const handleDotClick = (pipeline: Pipeline, stepIndex: number) => {
    setSelectedPipeline(pipeline)
    setSelectedStep(stepIndex)
    setShowStepModal(true)
  }

  const handleFileAttach = (e: React.MouseEvent, pipelineId: string) => {
    e.stopPropagation()
    const input = document.createElement("input")
    input.type = "file"
    input.multiple = true
    input.onchange = (event) => {
      const files = (event.target as HTMLInputElement).files
      if (files) {
        const fileArray = Array.from(files)
        setAttachedFiles((prev) => ({
          ...prev,
          [pipelineId]: [...(prev[pipelineId] || []), ...fileArray],
        }))
      }
    }
    input.click()
  }

  const handleDownload = (e: React.MouseEvent, pipelineId: string) => {
    e.stopPropagation()
    const pipeline = filteredPipelines.find((p) => p.id === pipelineId)
    if (pipeline) {
      const dataStr = JSON.stringify(pipeline, null, 2)
      const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
      const exportFileDefaultName = `pipeline-${pipeline.name}.json`
      const linkElement = document.createElement("a")
      linkElement.setAttribute("href", dataUri)
      linkElement.setAttribute("download", exportFileDefaultName)
      linkElement.click()
    }
  }

  const updateBidirectionalLinks = async (pipeline: Pipeline) => {
    try {
      // Update linked operations to include this pipeline
      if (pipeline.attachedTo.operations && pipeline.attachedTo.operations.length > 0) {
        for (const operationId of pipeline.attachedTo.operations) {
          const operation = operations.find((op) => op.id === operationId)
          if (operation && !operation.linkedPipelines?.includes(pipeline.id)) {
            await OperationsService.updateOperation(operationId, {
              linkedPipelines: [...(operation.linkedPipelines || []), pipeline.id],
            })
          }
        }
      }

      // Update linked personas to include this pipeline
      if (pipeline.attachedTo.personas && pipeline.attachedTo.personas.length > 0) {
        for (const personaId of pipeline.attachedTo.personas) {
          const persona = personas.find((p) => p.id === personaId)
          if (persona && !persona.linked_pipelines.includes(pipeline.id)) {
            await PersonasService.updatePersona(personaId, {
              linked_pipelines: [...persona.linked_pipelines, pipeline.id],
            })
          }
        }
      }

      // Reload data to reflect changes
      await loadOperations()
      await loadPersonas()
    } catch (error) {
      console.error("Failed to update bidirectional links:", error)
    }
  }

  const handleStepUpdate = async (stepIndex: number, stepData: any) => {
    if (!selectedPipeline) return

    try {
      const updatedStepData = {
        ...selectedPipeline.stepData,
        [stepIndex]: stepData,
      }

      const updatedPipeline = await PipelinesService.updatePipeline(selectedPipeline.id, {
        stepData: updatedStepData,
      })

      setPipelines((prev) => prev.map((p) => (p.id === selectedPipeline.id ? updatedPipeline : p)))
      setSelectedPipeline(updatedPipeline)
    } catch (error) {
      console.error("Error updating step:", error)
    }
  }

  const handleEditPipeline = () => {
    if (isEditing) {
      // Cancel editing - reset to original data
      setEditingPipeline(selectedPipeline)
      setIsEditing(false)
    } else {
      // Start editing - create a deep copy of the current pipeline
      if (selectedPipeline) {
        setEditingPipeline({
          ...selectedPipeline,
          attachedTo: {
            personas: [...selectedPipeline.attachedTo.personas],
            operations: [...selectedPipeline.attachedTo.operations],
            resources: [...selectedPipeline.attachedTo.resources],
          },
        })
      }
      setIsEditing(true)
    }
  }

  const handleDeletePipeline = async () => {
    if (!selectedPipeline) return

    try {
      // Remove bidirectional links before deleting
      await removeBidirectionalLinks(selectedPipeline)

      await PipelinesService.deletePipeline(selectedPipeline.id)
      setPipelines((prev) => prev.filter((p) => p.id !== selectedPipeline.id))
      handleCloseDetail()
    } catch (error) {
      console.error("Error deleting pipeline:", error)
    }
  }

  const removeBidirectionalLinks = async (pipeline: Pipeline) => {
    try {
      // Remove from linked operations
      if (pipeline.attachedTo.operations && pipeline.attachedTo.operations.length > 0) {
        for (const operationId of pipeline.attachedTo.operations) {
          const operation = operations.find((op) => op.id === operationId)
          if (operation && operation.linkedPipelines?.includes(pipeline.id)) {
            await OperationsService.updateOperation(operationId, {
              linkedPipelines: operation.linkedPipelines.filter((id) => id !== pipeline.id),
            })
          }
        }
      }

      // Remove from linked personas
      if (pipeline.attachedTo.personas && pipeline.attachedTo.personas.length > 0) {
        for (const personaId of pipeline.attachedTo.personas) {
          const persona = personas.find((p) => p.id === personaId)
          if (persona && persona.linked_pipelines.includes(pipeline.id)) {
            await PersonasService.updatePersona(personaId, {
              linked_pipelines: persona.linked_pipelines.filter((id) => id !== pipeline.id),
            })
          }
        }
      }

      // Reload data to reflect changes
      await loadOperations()
      await loadPersonas()
    } catch (error) {
      console.error("Failed to remove bidirectional links:", error)
    }
  }

  const handleSaveEdit = async () => {
    if (!editingPipeline || !selectedPipeline) return

    try {
      // Get the original linked items for comparison
      const originalOperations = selectedPipeline.attachedTo.operations || []
      const originalPersonas = selectedPipeline.attachedTo.personas || []
      const originalResources = selectedPipeline.attachedTo.resources || []

      // Get the new linked items from edit form
      const newOperations = editingPipeline.attachedTo.operations || []
      const newPersonas = editingPipeline.attachedTo.personas || []
      const newResources = editingPipeline.attachedTo.resources || []

      // Update the pipeline with new data
      const updatedPipeline = await PipelinesService.updatePipeline(selectedPipeline.id, editingPipeline)
      setPipelines((prev) => prev.map((p) => (p.id === selectedPipeline.id ? updatedPipeline : p)))
      setSelectedPipeline(updatedPipeline)
      setIsEditing(false)
      setEditingPipeline(null)

      // Handle bidirectional link updates for operations
      await handleBidirectionalOperationUpdates(originalOperations, newOperations, selectedPipeline.id)

      // Handle bidirectional link updates for personas
      await handleBidirectionalPersonaUpdates(originalPersonas, newPersonas, selectedPipeline.id)

      // Reload data to reflect all changes
      await loadOperations()
      await loadPersonas()
    } catch (error) {
      console.error("Error saving pipeline:", error)
    }
  }

  const handleBidirectionalOperationUpdates = async (
    originalOperations: string[],
    newOperations: string[],
    pipelineId: string,
  ) => {
    // Find operations that were removed
    const removedOperations = originalOperations.filter((id) => !newOperations.includes(id))
    // Find operations that were added
    const addedOperations = newOperations.filter((id) => !originalOperations.includes(id))

    // Remove pipeline from operations that were unlinked
    for (const operationId of removedOperations) {
      const operation = operations.find((op) => op.id === operationId)
      if (operation && operation.linkedPipelines?.includes(pipelineId)) {
        await OperationsService.updateOperation(operationId, {
          linkedPipelines: operation.linkedPipelines.filter((id) => id !== pipelineId),
        })
      }
    }

    // Add pipeline to operations that were linked
    for (const operationId of addedOperations) {
      const operation = operations.find((op) => op.id === operationId)
      if (operation && !operation.linkedPipelines?.includes(pipelineId)) {
        await OperationsService.updateOperation(operationId, {
          linkedPipelines: [...(operation.linkedPipelines || []), pipelineId],
        })
      }
    }
  }

  const handleBidirectionalPersonaUpdates = async (
    originalPersonas: string[],
    newPersonas: string[],
    pipelineId: string,
  ) => {
    // Find personas that were removed
    const removedPersonas = originalPersonas.filter((id) => !newPersonas.includes(id))
    // Find personas that were added
    const addedPersonas = newPersonas.filter((id) => !originalPersonas.includes(id))

    // Remove pipeline from personas that were unlinked
    for (const personaId of removedPersonas) {
      const persona = personas.find((p) => p.id === personaId)
      if (persona && persona.linked_pipelines.includes(pipelineId)) {
        await PersonasService.updatePersona(personaId, {
          linked_pipelines: persona.linked_pipelines.filter((id) => id !== pipelineId),
        })
      }
    }

    // Add pipeline to personas that were linked
    for (const personaId of addedPersonas) {
      const persona = personas.find((p) => p.id === personaId)
      if (persona && !persona.linked_pipelines.includes(pipelineId)) {
        await PersonasService.updatePersona(personaId, {
          linked_pipelines: [...persona.linked_pipelines, pipelineId],
        })
      }
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditingPipeline(null)
  }

  const handleLinkItems = (type: "personas" | "operations" | "resources") => {
    setLinkType(type)
    setShowLinkModal(true)
  }

  const handleLinkSelection = async (selectedId: string) => {
    if (!selectedPipeline) return

    try {
      const updates: Partial<Pipeline> = {}
      const currentAttachedTo = { ...selectedPipeline.attachedTo }

      if (linkType === "operations") {
        const currentLinked = currentAttachedTo.operations || []
        if (!currentLinked.includes(selectedId)) {
          currentAttachedTo.operations = [...currentLinked, selectedId]

          // Update the operation to include this pipeline
          const operation = operations.find((op) => op.id === selectedId)
          if (operation && !operation.linkedPipelines?.includes(selectedPipeline.id)) {
            await OperationsService.updateOperation(selectedId, {
              linkedPipelines: [...(operation.linkedPipelines || []), selectedPipeline.id],
            })
          }
        }
      } else if (linkType === "personas") {
        const currentLinked = currentAttachedTo.personas || []
        if (!currentLinked.includes(selectedId)) {
          currentAttachedTo.personas = [...currentLinked, selectedId]

          // Update the persona to include this pipeline
          const persona = personas.find((p) => p.id === selectedId)
          if (persona && !persona.linked_pipelines.includes(selectedPipeline.id)) {
            await PersonasService.updatePersona(selectedId, {
              linked_pipelines: [...persona.linked_pipelines, selectedPipeline.id],
            })
          }
        }
      } else if (linkType === "resources") {
        const currentLinked = currentAttachedTo.resources || []
        if (!currentLinked.includes(selectedId)) {
          currentAttachedTo.resources = [...currentLinked, selectedId]
        }
      }

      updates.attachedTo = currentAttachedTo

      const updatedPipeline = await PipelinesService.updatePipeline(selectedPipeline.id, updates)
      setPipelines((prev) => prev.map((p) => (p.id === selectedPipeline.id ? updatedPipeline : p)))
      setSelectedPipeline(updatedPipeline)
      setShowLinkModal(false)

      // Reload data to reflect changes
      await loadOperations()
      await loadPersonas()
    } catch (error) {
      console.error("Failed to link items:", error)
    }
  }

  const handleRemoveLinkedItem = async (id: string, type: "personas" | "operations" | "resources") => {
    if (!selectedPipeline) return

    if (isEditing && editingPipeline) {
      // In edit mode, update the editing pipeline data
      const updatedAttachedTo = { ...editingPipeline.attachedTo }

      if (type === "operations") {
        updatedAttachedTo.operations = (editingPipeline.attachedTo.operations || []).filter((opId) => opId !== id)
      } else if (type === "personas") {
        updatedAttachedTo.personas = (editingPipeline.attachedTo.personas || []).filter((personaId) => personaId !== id)
      } else if (type === "resources") {
        updatedAttachedTo.resources = (editingPipeline.attachedTo.resources || []).filter(
          (resourceId) => resourceId !== id,
        )
      }

      setEditingPipeline({
        ...editingPipeline,
        attachedTo: updatedAttachedTo,
      })
    } else {
      // In view mode, update immediately
      try {
        const updates: Partial<Pipeline> = {}
        const currentAttachedTo = { ...selectedPipeline.attachedTo }

        if (type === "operations") {
          currentAttachedTo.operations = (currentAttachedTo.operations || []).filter((opId) => opId !== id)

          // Remove this pipeline from the operation
          const operation = operations.find((op) => op.id === id)
          if (operation && operation.linkedPipelines?.includes(selectedPipeline.id)) {
            await OperationsService.updateOperation(id, {
              linkedPipelines: operation.linkedPipelines.filter((pipelineId) => pipelineId !== selectedPipeline.id),
            })
          }
        } else if (type === "personas") {
          currentAttachedTo.personas = (currentAttachedTo.personas || []).filter((personaId) => personaId !== id)

          // Remove this pipeline from the persona
          const persona = personas.find((p) => p.id === id)
          if (persona && persona.linked_pipelines.includes(selectedPipeline.id)) {
            await PersonasService.updatePersona(id, {
              linked_pipelines: persona.linked_pipelines.filter((pipelineId) => pipelineId !== selectedPipeline.id),
            })
          }
        } else if (type === "resources") {
          currentAttachedTo.resources = (currentAttachedTo.resources || []).filter((resourceId) => resourceId !== id)
        }

        updates.attachedTo = currentAttachedTo

        const updatedPipeline = await PipelinesService.updatePipeline(selectedPipeline.id, updates)
        setPipelines((prev) => prev.map((p) => (p.id === selectedPipeline.id ? updatedPipeline : p)))
        setSelectedPipeline(updatedPipeline)

        // Reload data to reflect changes
        await loadOperations()
        await loadPersonas()
      } catch (error) {
        console.error("Failed to remove linked item:", error)
      }
    }
  }

  const getLinkedOperations = (pipeline: Pipeline) => {
    return operations.filter((operation) => pipeline.attachedTo.operations.includes(operation.id))
  }

  const getLinkedPersonas = (pipeline: Pipeline) => {
    return personas.filter((persona) => pipeline.attachedTo.personas.includes(persona.id))
  }

  // Get the appropriate data source based on edit mode
  const getDisplayData = () => {
    return isEditing && editingPipeline ? editingPipeline : selectedPipeline
  }

  if (isLoading) {
    return (
      <div className="h-full flex flex-col bg-black/40 backdrop-blur-sm overflow-hidden">
        <div className="flex items-center justify-center h-full">
          <p className="text-white/50 text-sm">{t("pipelines.loading")}</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="h-full flex flex-col bg-black/40 backdrop-blur-sm overflow-hidden">
        {/* Pipelines Grid - Responsive */}
        <div className="flex-1 p-2 sm:p-4 space-y-2 sm:space-y-3 overflow-y-auto">
          {filteredPipelines.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-white/50 text-sm">
                {searchValue ? t("pipelines.noMatches") : t("pipelines.noPipelines")}
              </p>
            </div>
          ) : (
            filteredPipelines.map((pipeline) => (
              <div
                key={pipeline.id}
                draggable
                onDragStart={(e) => handleDragStart(e, pipeline.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, pipeline.id)}
                onClick={() => setSelectedPipeline(pipeline)}
                className={`
                  group relative p-3 sm:p-4 border cursor-pointer transition-all duration-200
                  bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/20 hover:bg-white/10
                  ${draggedItem === pipeline.id ? "opacity-50" : ""}
                `}
              >
                {/* Active Indicator - Blinking Green Dot */}
                {pipeline.isActive && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                )}

                {/* Drag Handle - Hidden on mobile */}
                <div className="hidden sm:block absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <GripVertical className="w-4 h-4 text-white/40" />
                </div>

                {/* Pipeline Content - Responsive grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 sm:ml-6">
                  {/* Left Column */}
                  <div className="space-y-1 sm:space-y-2">
                    <h3 className="font-semibold text-white/90 text-sm truncate">{pipeline.name}</h3>
                    <div className="flex items-center gap-2 cursor-pointer" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: pipeline.steps }, (_, index) => (
                          <button
                            key={index}
                            onClick={() => handleDotClick(pipeline, index)}
                            className={`w-2 h-2 rounded-full transition-colors ${
                              pipeline.stepData[index]?.completed ? "bg-green-400" : "bg-white/30 hover:bg-white/50"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-white/60">
                        {pipeline.steps} {t("pipelines.steps")}
                      </span>
                    </div>
                  </div>

                  {/* Right Column - Responsive layout */}
                  <div className="flex sm:flex-col items-start sm:items-center justify-between sm:justify-center space-x-2 sm:space-x-0 sm:space-y-2">
                    <Badge className={`text-xs ${getStatusColor(pipeline.status)}`}>
                      {pipeline.status.toUpperCase()}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => handleDownload(e, pipeline.id)}
                        className="p-1.5 bg-white/0 hover:bg-white/10 rounded-full transition-colors"
                        title={t("pipelines.downloadPipeline")}
                      >
                        <Download className="w-5 h-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          console.log(`Lightning action for pipeline: ${pipeline.id}`)
                        }}
                        className="p-1.5 bg-white/0 hover:bg-white/10 rounded-full transition-colors"
                        title={t("pipelines.assignAgent")}
                      >
                        <img
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Photoroom_20250730_51940%E2%80%AFPM-6CmBVPS9jtgj9TXiTBUgXrBIqzwx4L.png"
                          alt="Lightning"
                          className="w-5 h-5 filter brightness-0 invert"
                        />
                      </button>
                      <button
                        onClick={(e) => handleFileAttach(e, pipeline.id)}
                        className="p-1.5 bg-white/0 hover:bg-white/10 rounded-full transition-colors"
                        title={t("pipelines.attachFile")}
                      >
                        <Paperclip className="w-5 h-5" />
                      </button>
                      <button
                        onClick={(e) => handleActivatePipeline(e, pipeline.id)}
                        className="p-1.5 bg-white/0 hover:bg-white/10 rounded-full transition-colors"
                        title={t("pipelines.runDiagnostic")}
                      >
                        <Play className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Pipeline Step Modal */}
      {selectedPipeline && selectedStep !== null && (
        <PipelineStepModal
          isOpen={showStepModal}
          onClose={() => {
            setShowStepModal(false)
            setSelectedStep(null)
          }}
          pipeline={selectedPipeline}
          stepIndex={selectedStep}
          onStepUpdate={handleStepUpdate}
        />
      )}

      {/* Pipeline Simulation Modal */}
      {simulatingPipeline && (
        <PipelineSimulationModal
          isOpen={showSimulationModal}
          onClose={() => {
            setShowSimulationModal(false)
            setSimulatingPipeline(null)
          }}
          pipeline={simulatingPipeline}
          onSimulationComplete={handleSimulationComplete}
          vaultId={vaultId}
          operations={operations}
          personas={personas}
        />
      )}

      {/* Link Selection Modal */}
      {showLinkModal && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]" onClick={() => setShowLinkModal(false)} />
          <div className="fixed inset-0 flex items-center justify-center z-[70] p-4">
            <div className="w-full max-w-md bg-black/40 backdrop-blur-sm border border-white/10 overflow-hidden">
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white/90">
                  {linkType === "operations"
                    ? t("pipelines.linkOperations")
                    : linkType === "personas"
                      ? t("pipelines.linkPersonas")
                      : t("pipelines.linkResources")}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowLinkModal(false)}
                  className="text-white/60 hover:text-white/90 hover:bg-white/10 border-none"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="p-4 max-h-96 overflow-y-auto">
                {linkType === "operations" ? (
                  <div className="space-y-2">
                    {operations.length > 0 ? (
                      operations.map((operation) => (
                        <div
                          key={operation.id}
                          onClick={() => handleLinkSelection(operation.id)}
                          className="p-3 bg-white/5 border border-white/10 hover:bg-white/10 cursor-pointer transition-all duration-200"
                        >
                          <h4 className="font-medium text-white/90 text-sm">{operation.name}</h4>
                          <p className="text-xs text-white/70 mt-1">{operation.objective}</p>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 bg-white/5 border border-white/10 text-center">
                        <p className="text-white/50 text-sm">{t("pipelines.noOperationsAvailable")}</p>
                      </div>
                    )}
                  </div>
                ) : linkType === "personas" ? (
                  <div className="space-y-2">
                    {personas.length > 0 ? (
                      personas.map((persona) => (
                        <div
                          key={persona.id}
                          onClick={() => handleLinkSelection(persona.id)}
                          className="p-3 bg-white/5 border border-white/10 hover:bg-white/10 cursor-pointer transition-all duration-200"
                        >
                          <h4 className="font-medium text-white/90 text-sm">{persona.name}</h4>
                          <p className="text-xs text-white/70 mt-1">{persona.context}</p>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 bg-white/5 border border-white/10 text-center">
                        <p className="text-white/50 text-sm">{t("pipelines.noPersonasAvailable")}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="p-3 bg-white/5 border border-white/10 text-center">
                      <p className="text-white/50 text-sm">{t("pipelines.resourcesAvailableSoon")}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Detailed Pipeline Slide-in Panel - Responsive */}
      {selectedPipeline && !showStepModal && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={handleCloseDetail} />

          {/* Slide-in Panel - Responsive width */}
          <div className="fixed right-0 top-16 sm:top-20 bottom-0 w-full sm:w-1/2 lg:w-1/3 bg-black/40 backdrop-blur-sm border-l border-white/10 z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto">
            {/* Panel Header */}
            <div className="p-3 sm:p-4 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-semibold text-white/90">{selectedPipeline.name}</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCloseDetail}
                className="text-white/60 hover:text-white/90 hover:bg-white/10 rounded-full border-none"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Panel Content - Responsive spacing */}
            <div className="p-3 sm:p-4 space-y-4 sm:space-y-6">
              {/* Attached Files */}
              {attachedFiles[selectedPipeline.id] && attachedFiles[selectedPipeline.id].length > 0 && (
                <div className="space-y-2 sm:space-y-3">
                  <h3 className="font-semibold text-white/90 text-sm sm:text-base">{t("pipelines.attachedFiles")}</h3>
                  <div className="p-2 sm:p-3 bg-white/5 border border-white/10 space-y-2">
                    {attachedFiles[selectedPipeline.id].map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 sm:gap-3 p-2 bg-white/5 border border-white/10"
                      >
                        <Paperclip className="w-3 h-3 text-white/60" />
                        <span className="text-white/70 text-xs sm:text-sm flex-1">{file.name}</span>
                        <span className="text-white/50 text-xs">({(file.size / 1024).toFixed(1)}KB)</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pipeline Steps */}
              <div className="space-y-2 sm:space-y-3">
                <h3 className="font-semibold text-white/90 text-sm sm:text-base">{t("pipelines.pipelineSteps")}</h3>
                <div className="p-2 sm:p-3 bg-white/5 border border-white/10 space-y-2">
                  {Array.from({ length: selectedPipeline.steps }, (_, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-2 bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors"
                      onClick={() => handleDotClick(selectedPipeline, index)}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          selectedPipeline.stepData[index]?.completed ? "bg-green-400" : "bg-white/30"
                        }`}
                      ></div>
                      <div className="flex-1">
                        <p className="text-white/90 text-sm">
                          {selectedPipeline.stepData[index]?.title || `Step ${index + 1}`}
                        </p>
                        {selectedPipeline.stepData[index]?.description && (
                          <p className="text-white/60 text-xs">{selectedPipeline.stepData[index].description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Linked Operations */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-white/90 text-xs sm:text-sm">{t("pipelines.linkedOperations")}</h4>
                  <button
                    onClick={() => handleLinkItems("operations")}
                    className="text-white/60 hover:text-white/90 transition-colors duration-200"
                  >
                    <Link className="w-3 h-3" />
                  </button>
                </div>
                <div className="p-2 sm:p-3 bg-white/5 border border-white/10 space-y-1 sm:space-y-2">
                  {(() => {
                    const displayData = getDisplayData()
                    const linkedOperations = displayData ? getLinkedOperations(displayData) : []
                    return linkedOperations.length > 0 ? (
                      linkedOperations.map((operation) => (
                        <div
                          key={operation.id}
                          className="flex items-center gap-2 sm:gap-3 p-2 bg-white/5 border border-white/10"
                        >
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white/70"></div>
                          <span className="text-white/70 text-xs sm:text-sm flex-1">{operation.name}</span>
                          <button
                            onClick={() => handleRemoveLinkedItem(operation.id, "operations")}
                            className="text-white/60 hover:text-white/90 transition-colors duration-200"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-white/50 text-xs sm:text-sm">{t("pipelines.noOperationsLinked")}</p>
                    )
                  })()}
                </div>
              </div>

              {/* Linked Personas */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-white/90 text-xs sm:text-sm">{t("pipelines.linkedPersonas")}</h4>
                  <button
                    onClick={() => handleLinkItems("personas")}
                    className="text-white/60 hover:text-white/90 transition-colors duration-200"
                  >
                    <Link className="w-3 h-3" />
                  </button>
                </div>
                <div className="p-2 sm:p-3 bg-white/5 border border-white/10 space-y-1 sm:space-y-2">
                  {(() => {
                    const displayData = getDisplayData()
                    const linkedPersonas = displayData ? getLinkedPersonas(displayData) : []
                    return linkedPersonas.length > 0 ? (
                      linkedPersonas.map((persona) => (
                        <div
                          key={persona.id}
                          className="flex items-center gap-2 sm:gap-3 p-2 bg-white/5 border border-white/10"
                        >
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white/70"></div>
                          <span className="text-white/70 text-xs sm:text-sm flex-1">{persona.name}</span>
                          <button
                            onClick={() => handleRemoveLinkedItem(persona.id, "personas")}
                            className="text-white/60 hover:text-white/90 transition-colors duration-200"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-white/50 text-xs sm:text-sm">{t("pipelines.noPersonasLinked")}</p>
                    )
                  })()}
                </div>
              </div>

              {/* Linked Resources */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-white/90 text-xs sm:text-sm">{t("pipelines.linkedResources")}</h4>
                  <button
                    onClick={() => handleLinkItems("resources")}
                    className="text-white/60 hover:text-white/90 transition-colors duration-200"
                  >
                    <Link className="w-3 h-3" />
                  </button>
                </div>
                <div className="p-2 sm:p-3 bg-white/5 border border-white/10 space-y-1 sm:space-y-2">
                  {(() => {
                    const displayData = getDisplayData()
                    const linkedResources = displayData?.attachedTo.resources || []
                    return linkedResources.length > 0 ? (
                      linkedResources.map((resource, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 sm:gap-3 p-2 bg-white/5 border border-white/10"
                        >
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-orange-400"></div>
                          <span className="text-white/70 text-xs sm:text-sm flex-1">{resource}</span>
                          <button
                            onClick={() => handleRemoveLinkedItem(resource, "resources")}
                            className="text-white/60 hover:text-white/90 transition-colors duration-200"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-white/50 text-xs sm:text-sm">{t("pipelines.noResourcesLinked")}</p>
                    )
                  })()}
                </div>
              </div>

              {/* Edit and Delete Buttons */}
              <div className="flex gap-3 pt-4 border-t border-white/10">
                {isEditing ? (
                  <>
                    <Button
                      onClick={handleCancelEdit}
                      variant="outline"
                      className="flex-1 bg-white/5 border-white/20 text-white/80 hover:bg-white/10"
                    >
                      {t("pipelines.cancel")}
                    </Button>
                    <Button
                      onClick={handleSaveEdit}
                      className="flex-1 bg-white/10 hover:bg-white/20 text-white border-white/20"
                    >
                      {t("pipelines.save")}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={handleEditPipeline}
                      variant="outline"
                      className="flex-1 bg-white/10 hover:bg-white/10 rounded-none text-white border-white/0"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      {t("pipelines.edit")}
                    </Button>
                    <Button
                      onClick={handleDeletePipeline}
                      variant="outline"
                      className="flex-1 bg-red-500/20 border-red-500/0 text-white hover:bg-red-0"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      {t("pipelines.delete")}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
