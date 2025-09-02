"use client"

import type React from "react"
import { useLanguage } from "@/lib/language-context"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GripVertical, X, Edit3, Link, Trash2, Paperclip, Play, Download } from "lucide-react"
import { OperationsService, type Operation } from "@/lib/operations-service"
import { PersonasService, type Persona } from "@/lib/personas-service"
import { PipelinesService, type Pipeline } from "@/lib/pipelines-service"

interface ActiveOperationsProps {
  vaultId: string
  onOperationSelect?: (operation: Operation | null) => void
  searchValue?: string
}

export default function ActiveOperations({ vaultId, onOperationSelect, searchValue = "" }: ActiveOperationsProps) {
  const { t } = useLanguage()
  const [operations, setOperations] = useState<Operation[]>([])
  const [filteredOperations, setFilteredOperations] = useState<Operation[]>([])
  const [personas, setPersonas] = useState<Persona[]>([])
  const [pipelines, setPipelines] = useState<Pipeline[]>([])
  const [selectedOperation, setSelectedOperation] = useState<Operation | null>(null)
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editFormData, setEditFormData] = useState<Partial<Operation>>({})
  const [showLinkModal, setShowLinkModal] = useState(false)
  const [linkType, setLinkType] = useState<"personas" | "pipelines" | "resources">("personas")
  const [attachedFiles, setAttachedFiles] = useState<{ [operationId: string]: File[] }>({})

  // Load operations on component mount
  useEffect(() => {
    loadOperations()
    loadPersonas()
    loadPipelines()
  }, [vaultId])

  // Filter operations based on search value
  useEffect(() => {
    if (!searchValue.trim()) {
      setFilteredOperations(operations)
    } else {
      const filtered = operations.filter(
        (operation) =>
          operation.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          operation.objective.toLowerCase().includes(searchValue.toLowerCase()) ||
          operation.missionTitle.toLowerCase().includes(searchValue.toLowerCase()) ||
          operation.status.toLowerCase().includes(searchValue.toLowerCase()) ||
          operation.priorityLevel.toLowerCase().includes(searchValue.toLowerCase()),
      )
      setFilteredOperations(filtered)
    }
  }, [operations, searchValue])

  // Set up real-time subscription
  useEffect(() => {
    const subscription = OperationsService.subscribeToOperationChanges(vaultId, (payload) => {
      console.log("Operation change detected:", payload)
      loadOperations() // Reload operations when changes occur
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [vaultId])

  const loadOperations = async () => {
    try {
      setIsLoading(true)
      const data = await OperationsService.getVaultOperations(vaultId)
      setOperations(data)
    } catch (error) {
      console.error("Failed to load operations:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadPersonas = async () => {
    try {
      const data = await PersonasService.getVaultPersonas(vaultId)
      setPersonas(data)
    } catch (error) {
      console.error("Failed to load personas:", error)
    }
  }

  const loadPipelines = async () => {
    try {
      const data = await PipelinesService.getVaultPipelines(vaultId)
      setPipelines(data)
    } catch (error) {
      console.error("Failed to load pipelines:", error)
    }
  }

  const getStatusColor = (status: Operation["status"]) => {
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

  const getPriorityColor = (priority: Operation["priorityLevel"]) => {
    switch (priority) {
      case "critical":
        return "text-red-400"
      case "high":
        return "text-orange-400"
      case "medium":
        return "text-yellow-400"
      case "low":
        return "text-green-400"
      default:
        return "text-gray-400"
    }
  }

  const handleDragStart = (e: React.DragEvent, operationId: string) => {
    setDraggedItem(operationId)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault()
    if (!draggedItem || draggedItem === targetId) return

    const draggedIndex = filteredOperations.findIndex((op) => op.id === draggedItem)
    const targetIndex = filteredOperations.findIndex((op) => op.id === targetId)

    if (draggedIndex === -1 || targetIndex === -1) return

    const newOperations = [...filteredOperations]
    const [draggedOperation] = newOperations.splice(draggedIndex, 1)
    newOperations.splice(targetIndex, 0, draggedOperation)

    setFilteredOperations(newOperations)
    setDraggedItem(null)
  }

  const handleDragEnd = () => {
    setDraggedItem(null)
  }

  const handleOperationClick = (operation: Operation) => {
    setSelectedOperation(operation)
    setEditFormData(operation)
    onOperationSelect?.(operation)
  }

  const handleCloseDetail = () => {
    setSelectedOperation(null)
    setIsEditing(false)
    setEditFormData({})
    onOperationSelect?.(null)
  }

  const handleRunDiagnostic = (e: React.MouseEvent, operationId: string) => {
    e.stopPropagation()
    // Handle diagnostic run logic here
    console.log(`Running diagnostic for operation: ${operationId}`)
  }

  const handleFileAttach = (e: React.MouseEvent, operationId: string) => {
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
          [operationId]: [...(prev[operationId] || []), ...fileArray],
        }))
      }
    }
    input.click()
  }

  const handleDownload = (e: React.MouseEvent, operationId: string) => {
    e.stopPropagation()
    const operation = filteredOperations.find((op) => op.id === operationId)
    if (operation) {
      const dataStr = JSON.stringify(operation, null, 2)
      const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
      const exportFileDefaultName = `operation-${operation.name}.json`
      const linkElement = document.createElement("a")
      linkElement.setAttribute("href", dataUri)
      linkElement.setAttribute("download", exportFileDefaultName)
      linkElement.click()
    }
  }

  const updateBidirectionalLinks = async (operation: Operation) => {
    try {
      // Update linked personas to include this operation
      if (operation.linkedPersonas && operation.linkedPersonas.length > 0) {
        for (const personaId of operation.linkedPersonas) {
          const persona = personas.find((p) => p.id === personaId)
          if (persona && !persona.linked_operations.includes(operation.id)) {
            await PersonasService.updatePersona(personaId, {
              linked_operations: [...persona.linked_operations, operation.id],
            })
          }
        }
      }

      // Update linked pipelines to include this operation
      if (operation.linkedPipelines && operation.linkedPipelines.length > 0) {
        for (const pipelineId of operation.linkedPipelines) {
          const pipeline = pipelines.find((p) => p.id === pipelineId)
          if (pipeline && !pipeline.attachedTo.operations.includes(operation.id)) {
            await PipelinesService.updatePipeline(pipelineId, {
              attachedTo: {
                ...pipeline.attachedTo,
                operations: [...pipeline.attachedTo.operations, operation.id],
              },
            })
          }
        }
      }

      // Reload data to reflect changes
      await loadPersonas()
      await loadPipelines()
    } catch (error) {
      console.error("Failed to update bidirectional links:", error)
    }
  }

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - reset to original data
      setEditFormData(selectedOperation || {})
      setIsEditing(false)
    } else {
      // Start editing - create a deep copy of the current operation
      if (selectedOperation) {
        setEditFormData({
          ...selectedOperation,
          linkedPersonas: [...(selectedOperation.linkedPersonas || [])],
          linkedPipelines: [...(selectedOperation.linkedPipelines || [])],
          linkedResources: [...(selectedOperation.linkedResources || [])],
        })
      }
      setIsEditing(true)
    }
  }

  const handleSaveEdit = async () => {
    if (!selectedOperation || !editFormData) return

    try {
      // Get the original linked items for comparison
      const originalPersonas = selectedOperation.linkedPersonas || []
      const originalPipelines = selectedOperation.linkedPipelines || []
      const originalResources = selectedOperation.linkedResources || []

      // Get the new linked items from edit form
      const newPersonas = editFormData.linkedPersonas || []
      const newPipelines = editFormData.linkedPipelines || []
      const newResources = editFormData.linkedResources || []

      // Update the operation with new data
      const updatedOperation = await OperationsService.updateOperation(selectedOperation.id, editFormData)
      setOperations((prev) => prev.map((op) => (op.id === selectedOperation.id ? updatedOperation : op)))
      setSelectedOperation(updatedOperation)
      setIsEditing(false)

      // Handle bidirectional link updates for personas
      await handleBidirectionalPersonaUpdates(originalPersonas, newPersonas, selectedOperation.id)

      // Handle bidirectional link updates for pipelines
      await handleBidirectionalPipelineUpdates(originalPipelines, newPipelines, selectedOperation.id)

      // Reload data to reflect all changes
      await loadPersonas()
      await loadPipelines()
    } catch (error) {
      console.error("Failed to update operation:", error)
    }
  }

  const handleBidirectionalPersonaUpdates = async (
    originalPersonas: string[],
    newPersonas: string[],
    operationId: string,
  ) => {
    // Find personas that were removed
    const removedPersonas = originalPersonas.filter((id) => !newPersonas.includes(id))
    // Find personas that were added
    const addedPersonas = newPersonas.filter((id) => !originalPersonas.includes(id))

    // Remove operation from personas that were unlinked
    for (const personaId of removedPersonas) {
      const persona = personas.find((p) => p.id === personaId)
      if (persona && persona.linked_operations.includes(operationId)) {
        await PersonasService.updatePersona(personaId, {
          linked_operations: persona.linked_operations.filter((id) => id !== operationId),
        })
      }
    }

    // Add operation to personas that were linked
    for (const personaId of addedPersonas) {
      const persona = personas.find((p) => p.id === personaId)
      if (persona && !persona.linked_operations.includes(operationId)) {
        await PersonasService.updatePersona(personaId, {
          linked_operations: [...persona.linked_operations, operationId],
        })
      }
    }
  }

  const handleBidirectionalPipelineUpdates = async (
    originalPipelines: string[],
    newPipelines: string[],
    operationId: string,
  ) => {
    // Find pipelines that were removed
    const removedPipelines = originalPipelines.filter((id) => !newPipelines.includes(id))
    // Find pipelines that were added
    const addedPipelines = newPipelines.filter((id) => !originalPipelines.includes(id))

    // Remove operation from pipelines that were unlinked
    for (const pipelineId of removedPipelines) {
      const pipeline = pipelines.find((p) => p.id === pipelineId)
      if (pipeline && pipeline.attachedTo.operations.includes(operationId)) {
        await PipelinesService.updatePipeline(pipelineId, {
          attachedTo: {
            ...pipeline.attachedTo,
            operations: pipeline.attachedTo.operations.filter((id) => id !== operationId),
          },
        })
      }
    }

    // Add operation to pipelines that were linked
    for (const pipelineId of addedPipelines) {
      const pipeline = pipelines.find((p) => p.id === pipelineId)
      if (pipeline && !pipeline.attachedTo.operations.includes(operationId)) {
        await PipelinesService.updatePipeline(pipelineId, {
          attachedTo: {
            ...pipeline.attachedTo,
            operations: [...pipeline.attachedTo.operations, operationId],
          },
        })
      }
    }
  }

  const handleDeleteOperation = async () => {
    if (!selectedOperation) return

    try {
      // Remove bidirectional links before deleting
      await removeBidirectionalLinks(selectedOperation)

      await OperationsService.deleteOperation(selectedOperation.id)
      setOperations((prev) => prev.filter((op) => op.id !== selectedOperation.id))
      handleCloseDetail()
    } catch (error) {
      console.error("Failed to delete operation:", error)
    }
  }

  const removeBidirectionalLinks = async (operation: Operation) => {
    try {
      // Remove from linked personas
      if (operation.linkedPersonas && operation.linkedPersonas.length > 0) {
        for (const personaId of operation.linkedPersonas) {
          const persona = personas.find((p) => p.id === personaId)
          if (persona && persona.linked_operations.includes(operation.id)) {
            await PersonasService.updatePersona(personaId, {
              linked_operations: persona.linked_operations.filter((id) => id !== operation.id),
            })
          }
        }
      }

      // Remove from linked pipelines
      if (operation.linkedPipelines && operation.linkedPipelines.length > 0) {
        for (const pipelineId of operation.linkedPipelines) {
          const pipeline = pipelines.find((p) => p.id === pipelineId)
          if (pipeline && pipeline.attachedTo.operations.includes(operation.id)) {
            await PipelinesService.updatePipeline(pipelineId, {
              attachedTo: {
                ...pipeline.attachedTo,
                operations: pipeline.attachedTo.operations.filter((id) => id !== operation.id),
              },
            })
          }
        }
      }

      // Reload data to reflect changes
      await loadPersonas()
      await loadPipelines()
    } catch (error) {
      console.error("Failed to remove bidirectional links:", error)
    }
  }

  const handleLinkItems = (type: "personas" | "pipelines" | "resources") => {
    setLinkType(type)
    setShowLinkModal(true)
  }

  const handleLinkSelection = async (selectedId: string) => {
    if (!selectedOperation) return

    try {
      const updates: Partial<Operation> = {}

      if (linkType === "personas") {
        const currentLinked = selectedOperation.linkedPersonas || []
        if (!currentLinked.includes(selectedId)) {
          updates.linkedPersonas = [...currentLinked, selectedId]

          // Update the persona to include this operation
          const persona = personas.find((p) => p.id === selectedId)
          if (persona && !persona.linked_operations.includes(selectedOperation.id)) {
            await PersonasService.updatePersona(selectedId, {
              linked_operations: [...persona.linked_operations, selectedOperation.id],
            })
          }
        }
      } else if (linkType === "pipelines") {
        const currentLinked = selectedOperation.linkedPipelines || []
        if (!currentLinked.includes(selectedId)) {
          updates.linkedPipelines = [...currentLinked, selectedId]

          // Update the pipeline to include this operation
          const pipeline = pipelines.find((p) => p.id === selectedId)
          if (pipeline && !pipeline.attachedTo.operations.includes(selectedOperation.id)) {
            await PipelinesService.updatePipeline(selectedId, {
              attachedTo: {
                ...pipeline.attachedTo,
                operations: [...pipeline.attachedTo.operations, selectedOperation.id],
              },
            })
          }
        }
      } else if (linkType === "resources") {
        const currentLinked = selectedOperation.linkedResources || []
        if (!currentLinked.includes(selectedId)) {
          updates.linkedResources = [...currentLinked, selectedId]
        }
      }

      const updatedOperation = await OperationsService.updateOperation(selectedOperation.id, updates)
      setOperations((prev) => prev.map((op) => (op.id === selectedOperation.id ? updatedOperation : op)))
      setSelectedOperation(updatedOperation)
      setShowLinkModal(false)

      // Reload data to reflect changes
      await loadPersonas()
      await loadPipelines()
    } catch (error) {
      console.error("Failed to link items:", error)
    }
  }

  const handleRemoveLinkedItem = async (itemId: string, type: "personas" | "pipelines" | "resources") => {
    if (!selectedOperation) return

    if (isEditing) {
      // In edit mode, update the edit form data
      const updatedEditFormData = { ...editFormData }

      if (type === "personas") {
        updatedEditFormData.linkedPersonas = (editFormData.linkedPersonas || []).filter((id) => id !== itemId)
      } else if (type === "pipelines") {
        updatedEditFormData.linkedPipelines = (editFormData.linkedPipelines || []).filter((id) => id !== itemId)
      } else if (type === "resources") {
        updatedEditFormData.linkedResources = (editFormData.linkedResources || []).filter((id) => id !== itemId)
      }

      setEditFormData(updatedEditFormData)
    } else {
      // In view mode, update immediately
      try {
        const updates: Partial<Operation> = {}

        if (type === "personas") {
          updates.linkedPersonas = (selectedOperation.linkedPersonas || []).filter((id) => id !== itemId)

          // Remove this operation from the persona
          const persona = personas.find((p) => p.id === itemId)
          if (persona && persona.linked_operations.includes(selectedOperation.id)) {
            await PersonasService.updatePersona(itemId, {
              linked_operations: persona.linked_operations.filter((id) => id !== selectedOperation.id),
            })
          }
        } else if (type === "pipelines") {
          updates.linkedPipelines = (selectedOperation.linkedPipelines || []).filter((id) => id !== itemId)

          // Remove this operation from the pipeline
          const pipeline = pipelines.find((p) => p.id === itemId)
          if (pipeline && pipeline.attachedTo.operations.includes(selectedOperation.id)) {
            await PipelinesService.updatePipeline(itemId, {
              attachedTo: {
                ...pipeline.attachedTo,
                operations: pipeline.attachedTo.operations.filter((id) => id !== selectedOperation.id),
              },
            })
          }
        } else if (type === "resources") {
          updates.linkedResources = (selectedOperation.linkedResources || []).filter((id) => id !== itemId)
        }

        const updatedOperation = await OperationsService.updateOperation(selectedOperation.id, updates)
        setOperations((prev) => prev.map((op) => (op.id === selectedOperation.id ? updatedOperation : op)))
        setSelectedOperation(updatedOperation)

        // Reload data to reflect changes
        await loadPersonas()
        await loadPipelines()
      } catch (error) {
        console.error("Failed to remove linked item:", error)
      }
    }
  }

  const getLinkedPersonas = (personaIds: string[]) => {
    return personas.filter((persona) => personaIds.includes(persona.id))
  }

  const getLinkedPipelines = (pipelineIds: string[]) => {
    return pipelines.filter((pipeline) => pipelineIds.includes(pipeline.id))
  }

  // Get the appropriate data source based on edit mode
  const getDisplayData = () => {
    return isEditing ? editFormData : selectedOperation
  }

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="text-center">
          <p className="text-white/50 text-sm">{t("operations.loading")}</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="h-full flex flex-col bg-black/40 backdrop-blur-sm overflow-hidden">
        {/* Operations Grid - Responsive */}
        <div className="flex-1 p-2 sm:p-4 space-y-2 sm:space-y-3 overflow-y-auto">
          {filteredOperations.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-white/50 text-sm">
                {searchValue ? t("operations.noMatches") : t("operations.noOperations")}
              </p>
            </div>
          ) : (
            filteredOperations.map((operation) => (
              <div
                key={operation.id}
                draggable
                onDragStart={(e) => handleDragStart(e, operation.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, operation.id)}
                onDragEnd={handleDragEnd}
                onClick={() => handleOperationClick(operation)}
                className={`
                group relative p-3 sm:p-4 border rounded-none cursor-pointer transition-all duration-200
                bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/20 hover:bg-white/10
                ${draggedItem === operation.id ? "opacity-50" : ""}
              `}
              >
                {/* Drag Handle - Hidden on mobile */}
                <div className="hidden sm:block absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <GripVertical className="w-4 h-4 text-white/40" />
                </div>

                {/* Operation Content - Responsive Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 sm:ml-6">
                  {/* Left Column */}
                  <div className="space-y-1 sm:space-y-2">
                    <h3 className="font-semibold text-white/90 text-sm truncate">{operation.name}</h3>
                    <p className="text-xs text-white/70 line-clamp-2">{operation.objective}</p>
                  </div>

                  {/* Right Column - Responsive layout */}
                  <div className="flex sm:flex-col items-start sm:items-center justify-between sm:justify-center space-x-2 sm:space-x-0 sm:space-y-2">
                    <Badge className={`text-xs ${getStatusColor(operation.status)}`}>
                      {operation.status.toUpperCase()}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => handleDownload(e, operation.id)}
                        className="p-1.5 bg-white/0 hover:bg-white/10 rounded-full transition-colors"
                        title={t("operations.downloadOperation")}
                      >
                        <Download className="w-5 h-5" />
                      </button>
                      <button
                        onClick={(e) => handleFileAttach(e, operation.id)}
                        className="p-1.5 bg-white/0 hover:bg-white/10 rounded-full transition-colors"
                        title={t("operations.attachFile")}
                      >
                        <Paperclip className="w-5 h-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          console.log(`Lightning action for operation: ${operation.id}`)
                        }}
                        className="p-1.5 bg-white/0 hover:bg-white/10 rounded-full transition-colors"
                        title={t("operations.assignManager")}
                      >
                        <img
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Photoroom_20250730_51940%E2%80%AFPM-6CmBVPS9jtgj9TXiTBUgXrBIqzwx4L.png"
                          alt="Lightning"
                          className="w-5 h-5 filter brightness-0 invert"
                        />
                      </button>
                      <button
                        onClick={(e) => handleRunDiagnostic(e, operation.id)}
                        className="p-1.5 bg-white/0 hover:bg-white/10 rounded-full transition-colors"
                        title={t("operations.runDiagnostic")}
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

      {/* Link Selection Modal */}
      {showLinkModal && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]" onClick={() => setShowLinkModal(false)} />
          <div className="fixed inset-0 flex items-center justify-center z-[70] p-4">
            <div className="w-full max-w-md bg-black/40 backdrop-blur-sm border border-white/10 overflow-hidden">
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white/90">
                  {t(
                    linkType === "personas"
                      ? "operations.linkPersonas"
                      : linkType === "pipelines"
                        ? "operations.linkPipelines"
                        : "operations.linkResources",
                  )}
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
                {linkType === "personas" ? (
                  <div className="space-y-2">
                    {personas.map((persona) => (
                      <div
                        key={persona.id}
                        onClick={() => handleLinkSelection(persona.id)}
                        className="p-3 bg-white/5 border border-white/10 hover:bg-white/10 cursor-pointer transition-all duration-200"
                      >
                        <h4 className="font-medium text-white/90 text-sm">{persona.name}</h4>
                        <p className="text-xs text-white/70 mt-1">{persona.context}</p>
                      </div>
                    ))}
                  </div>
                ) : linkType === "pipelines" ? (
                  <div className="space-y-2">
                    {pipelines.map((pipeline) => (
                      <div
                        key={pipeline.id}
                        onClick={() => handleLinkSelection(pipeline.id)}
                        className="p-3 bg-white/5 border border-white/10 hover:bg-white/10 cursor-pointer transition-all duration-200"
                      >
                        <h4 className="font-medium text-white/90 text-sm">{pipeline.name}</h4>
                        <p className="text-xs text-white/70 mt-1">
                          {pipeline.steps} {t("newOperation.steps")}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="p-3 bg-white/5 border border-white/10 text-center">
                      <p className="text-white/50 text-sm">{t("operations.resourcesAvailableSoon")}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Detailed Operation Slide-in Panel - Responsive */}
      {selectedOperation && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={handleCloseDetail} />

          {/* Slide-in Panel - Responsive width */}
          <div
            className={`fixed right-0 top-16 sm:top-20 bottom-0 w-full sm:w-1/2 lg:w-1/3 bg-black/40 backdrop-blur-sm border-l border-white/10 z-50 transform transition-transform ease-in-out overflow-y-auto ${
              selectedOperation ? "translate-x-0 duration-700" : "translate-x-full duration-[400ms]"
            }`}
          >
            {/* Panel Header */}
            <div className="p-3 sm:p-4 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-semibold text-white/90">
                {isEditing ? (
                  <input
                    type="text"
                    value={editFormData.missionTitle || ""}
                    onChange={(e) => setEditFormData((prev) => ({ ...prev, missionTitle: e.target.value }))}
                    className="bg-white/5 border border-white/10 text-white/90 text-base sm:text-lg px-2 py-1 focus:border-white/20 focus:outline-none"
                  />
                ) : (
                  selectedOperation.missionTitle
                )}
              </h2>
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
              {attachedFiles[selectedOperation.id] && attachedFiles[selectedOperation.id].length > 0 && (
                <div className="space-y-2 sm:space-y-3">
                  <h3 className="font-semibold text-white/90 text-sm sm:text-base">{t("operations.attachedFiles")}</h3>
                  <div className="p-2 sm:p-3 bg-white/5 border border-white/10 space-y-2">
                    {attachedFiles[selectedOperation.id].map((file, index) => (
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

              {/* Strategic Objective */}
              <div className="space-y-2 sm:space-y-3">
                <h3 className="font-semibold text-white/90 text-sm sm:text-base">
                  {t("operations.strategicObjective")}
                </h3>
                <div className="p-2 sm:p-3 bg-white/5 border border-white/10">
                  {isEditing ? (
                    <textarea
                      value={editFormData.strategicObjective || ""}
                      onChange={(e) => setEditFormData((prev) => ({ ...prev, strategicObjective: e.target.value }))}
                      rows={3}
                      className="w-full bg-transparent text-white/70 text-xs sm:text-sm leading-relaxed resize-none focus:outline-none"
                    />
                  ) : (
                    <p className="text-white/70 text-xs sm:text-sm leading-relaxed">
                      {selectedOperation.strategicObjective}
                    </p>
                  )}
                </div>
              </div>

              {/* Key Details Grid - Responsive */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-white/90 text-xs sm:text-sm">{t("operations.priorityLevel")}</h4>
                  <div className="p-2 sm:p-3 bg-white/5 border border-white/10">
                    {isEditing ? (
                      <select
                        value={editFormData.priorityLevel || ""}
                        onChange={(e) => setEditFormData((prev) => ({ ...prev, priorityLevel: e.target.value as any }))}
                        className="w-full bg-transparent text-white/70 text-xs sm:text-sm focus:outline-none"
                      >
                        <option value="low">{t("operations.low")}</option>
                        <option value="medium">{t("operations.medium")}</option>
                        <option value="high">{t("operations.high")}</option>
                        <option value="critical">{t("operations.critical")}</option>
                      </select>
                    ) : (
                      <p
                        className={`text-xs sm:text-sm font-medium ${getPriorityColor(selectedOperation.priorityLevel)}`}
                      >
                        {selectedOperation.priorityLevel.toUpperCase()}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-white/90 text-xs sm:text-sm">{t("operations.operationalTags")}</h4>
                  <div className="p-2 sm:p-3 bg-white/5 border border-white/10">
                    {selectedOperation.operationalTags && selectedOperation.operationalTags.length > 0 ? (
                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        {selectedOperation.operationalTags.map((tag, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 bg-white/5 border border-white/10 rounded"
                          >
                            <span className="text-white/60 text-xs sm:text-sm">#</span>
                            <span className="text-white/70 text-xs sm:text-sm">{tag}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-white/50 text-xs sm:text-sm">{t("operations.noTags")}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Linked Pipelines */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-white/90 text-xs sm:text-sm">{t("operations.linkedPipelines")}</h4>
                  <button
                    onClick={() => handleLinkItems("pipelines")}
                    className="text-white/60 hover:text-white/90 transition-colors duration-200"
                  >
                    <Link className="w-3 h-3" />
                  </button>
                </div>
                <div className="p-2 sm:p-3 bg-white/5 border border-white/5 space-y-1 sm:space-y-2">
                  {(() => {
                    const displayData = getDisplayData()
                    const linkedPipelineIds = displayData?.linkedPipelines || []
                    return linkedPipelineIds.length > 0 ? (
                      getLinkedPipelines(linkedPipelineIds).map((pipeline) => (
                        <div
                          key={pipeline.id}
                          className="flex items-center gap-2 sm:gap-3 p-2 bg-white/5 border border-white/5"
                        >
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white/70"></div>
                          <span className="text-white/70 text-xs sm:text-sm flex-1">{pipeline.name}</span>
                          <span className="text-white/50 text-xs">
                            ({pipeline.steps} {t("newOperation.steps")})
                          </span>
                          <button
                            onClick={() => handleRemoveLinkedItem(pipeline.id, "pipelines")}
                            className="text-white/60 hover:text-white/90 transition-colors duration-200"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-white/50 text-xs sm:text-sm">{t("operations.noPipelinesLinked")}</p>
                    )
                  })()}
                </div>
              </div>

              {/* Linked Personas */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-white/90 text-xs sm:text-sm">{t("operations.linkedPersonas")}</h4>
                  <button
                    onClick={() => handleLinkItems("personas")}
                    className="text-white/60 hover:text-white/90 transition-colors duration-200"
                  >
                    <Link className="w-3 h-3" />
                  </button>
                </div>
                <div className="p-2 sm:p-3 bg-white/5 border border-white/5 space-y-1 sm:space-y-2">
                  {(() => {
                    const displayData = getDisplayData()
                    const linkedPersonaIds = displayData?.linkedPersonas || []
                    return linkedPersonaIds.length > 0 ? (
                      getLinkedPersonas(linkedPersonaIds).map((persona) => (
                        <div
                          key={persona.id}
                          className="flex items-center gap-2 sm:gap-3 p-2 bg-white/5 border border-white/5"
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
                      <p className="text-white/50 text-xs sm:text-sm">{t("operations.noPersonasLinked")}</p>
                    )
                  })()}
                </div>
              </div>

              {/* Linked Resources */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-white/90 text-xs sm:text-sm">{t("operations.linkedResources")}</h4>
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
                    const linkedResourceIds = displayData?.linkedResources || []
                    return linkedResourceIds.length > 0 ? (
                      linkedResourceIds.map((resource, index) => (
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
                      <p className="text-white/50 text-xs sm:text-sm">{t("operations.noResourcesLinked")}</p>
                    )
                  })()}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-3 sm:p-4 border-t border-white/10">
              <div className="flex gap-3">
                {isEditing ? (
                  <>
                    <Button
                      onClick={handleEditToggle}
                      variant="outline"
                      className="flex-1 bg-white/5 border-white/20 text-white/80 hover:bg-white/10"
                    >
                      {t("operations.cancel")}
                    </Button>
                    <Button
                      onClick={handleSaveEdit}
                      className="flex-1 bg-white/10 hover:bg-white/20 text-white border-white/20"
                    >
                      {t("operations.saveChanges")}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={handleEditToggle}
                      className="flex-1 bg-white/10 hover:bg-white/10 text-white border-white/10"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      {t("operations.edit")}
                    </Button>
                    <Button
                      onClick={handleDeleteOperation}
                      variant="outline"
                      className="flex-1 bg-red-500/20 border-red-500/0 text-white hover:bg-red-0"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      {t("operations.delete")}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </>
  )
}
