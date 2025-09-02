"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GripVertical, Play, X, Info, Edit, Trash2, Link, Paperclip, Download } from "lucide-react"
import { PersonasService, type Persona } from "@/lib/personas-service"
import { OperationsService, type Operation } from "@/lib/operations-service"
import { PipelinesService, type Pipeline } from "@/lib/pipelines-service"
import { motion, AnimatePresence } from "framer-motion"
import { useLanguage } from "@/lib/language-context"

interface PersonasProps {
  vaultId: string
  onPersonaSelect?: (persona: Persona | null) => void
  searchValue?: string
}

export default function Personas({ vaultId, onPersonaSelect, searchValue = "" }: PersonasProps) {
  const { t } = useLanguage()
  const [personas, setPersonas] = useState<Persona[]>([])
  const [filteredPersonas, setFilteredPersonas] = useState<Persona[]>([])
  const [operations, setOperations] = useState<Operation[]>([])
  const [pipelines, setPipelines] = useState<Pipeline[]>([])
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null)
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const [showLinkModal, setShowLinkModal] = useState(false)
  const [linkType, setLinkType] = useState<"operations" | "pipelines" | "resources">("operations")
  const [isLoading, setIsLoading] = useState(true)
  const [decodingPersonaId, setDecodingPersonaId] = useState<string | null>(null)
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null)
  const [selectedDecodingOption, setSelectedDecodingOption] = useState<{ [personaId: string]: string }>({})
  const [isEditing, setIsEditing] = useState(false)
  const [editFormData, setEditFormData] = useState<Partial<Persona>>({})
  const [attachedFiles, setAttachedFiles] = useState<{ [personaId: string]: File[] }>({})

  // Load data on component mount
  useEffect(() => {
    loadAllData()
  }, [vaultId])

  // Filter personas based on search value
  useEffect(() => {
    if (!searchValue.trim()) {
      setFilteredPersonas(personas)
    } else {
      const filtered = personas.filter(
        (persona) =>
          persona.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          persona.context.toLowerCase().includes(searchValue.toLowerCase()) ||
          persona.status.toLowerCase().includes(searchValue.toLowerCase()),
      )
      setFilteredPersonas(filtered)
    }
  }, [personas, searchValue])

  // Set up real-time subscription
  useEffect(() => {
    const subscription = PersonasService.subscribeToPersonaChanges(vaultId, (payload) => {
      console.log("Persona change detected:", payload)
      loadPersonas()
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [vaultId])

  const loadAllData = async () => {
    try {
      setIsLoading(true)
      await Promise.all([loadPersonas(), loadOperations(), loadPipelines()])
    } catch (error) {
      console.error("Failed to load data:", error)
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

  const loadOperations = async () => {
    try {
      const data = await OperationsService.getVaultOperations(vaultId)
      setOperations(data)
    } catch (error) {
      console.error("Failed to load operations:", error)
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

  const getStatusColor = (status: Persona["status"]) => {
    switch (status) {
      case "active":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
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

  const handleDragStart = (e: React.DragEvent, personaId: string) => {
    setDraggedItem(personaId)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault()
    if (!draggedItem || draggedItem === targetId) return

    const draggedIndex = filteredPersonas.findIndex((p) => p.id === draggedItem)
    const targetIndex = filteredPersonas.findIndex((p) => p.id === targetId)

    if (draggedIndex === -1 || targetIndex === -1) return

    const newPersonas = [...filteredPersonas]
    const [draggedPersona] = newPersonas.splice(draggedIndex, 1)
    newPersonas.splice(targetIndex, 0, draggedPersona)

    setFilteredPersonas(newPersonas)
    setDraggedItem(null)
  }

  const handleDragEnd = () => {
    setDraggedItem(null)
  }

  const handlePersonaClick = (persona: Persona) => {
    setSelectedPersona(persona)
    setEditFormData(persona)
    onPersonaSelect?.(persona)
  }

  const handleCloseDetail = () => {
    setSelectedPersona(null)
    setIsEditing(false)
    setEditFormData({})
    onPersonaSelect?.(null)
  }

  const handleRunDecoding = (e: React.MouseEvent, personaId: string) => {
    e.stopPropagation()
    setDecodingPersonaId(decodingPersonaId === personaId ? null : personaId)
    setActiveTooltip(null)
    if (decodingPersonaId === personaId) {
      setSelectedDecodingOption((prev) => {
        const newState = { ...prev }
        delete newState[personaId]
        return newState
      })
    }
  }

  const handleDecodingOptionClick = (e: React.MouseEvent, personaId: string, option: string) => {
    e.stopPropagation()
    setSelectedDecodingOption((prev) => ({
      ...prev,
      [personaId]: option,
    }))
  }

  const handleInfoClick = (e: React.MouseEvent, tooltipId: string) => {
    e.stopPropagation()
    setActiveTooltip(activeTooltip === tooltipId ? null : tooltipId)
  }

  const handleFileAttach = (e: React.MouseEvent, personaId: string) => {
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
          [personaId]: [...(prev[personaId] || []), ...fileArray],
        }))
      }
    }
    input.click()
  }

  const handleDownload = (e: React.MouseEvent, personaId: string) => {
    e.stopPropagation()
    const persona = filteredPersonas.find((p) => p.id === personaId)
    if (persona) {
      const dataStr = JSON.stringify(persona, null, 2)
      const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
      const exportFileDefaultName = `persona-${persona.name}.json`
      const linkElement = document.createElement("a")
      linkElement.setAttribute("href", dataUri)
      linkElement.setAttribute("download", exportFileDefaultName)
      linkElement.click()
    }
  }

  const handleLinkItems = (type: "operations" | "pipelines" | "resources") => {
    setLinkType(type)
    setShowLinkModal(true)
  }

  const handleLinkSelection = async (selectedId: string) => {
    if (!selectedPersona) return

    try {
      const updates: Partial<Persona> = {}

      if (linkType === "operations") {
        const currentLinked = selectedPersona.linked_operations || []
        if (!currentLinked.includes(selectedId)) {
          updates.linked_operations = [...currentLinked, selectedId]

          // Update the operation to include this persona
          const operation = operations.find((op) => op.id === selectedId)
          if (operation && !operation.linkedPersonas?.includes(selectedPersona.id)) {
            await OperationsService.updateOperation(selectedId, {
              linkedPersonas: [...(operation.linkedPersonas || []), selectedPersona.id],
            })
          }
        }
      } else if (linkType === "pipelines") {
        const currentLinked = selectedPersona.linked_pipelines || []
        if (!currentLinked.includes(selectedId)) {
          updates.linked_pipelines = [...currentLinked, selectedId]

          // Update the pipeline to include this persona
          const pipeline = pipelines.find((p) => p.id === selectedId)
          if (pipeline && !pipeline.attachedTo.personas.includes(selectedPersona.id)) {
            await PipelinesService.updatePipeline(selectedId, {
              attachedTo: {
                ...pipeline.attachedTo,
                personas: [...pipeline.attachedTo.personas, selectedPersona.id],
              },
            })
          }
        }
      } else if (linkType === "resources") {
        const currentLinked = selectedPersona.linked_resources || []
        if (!currentLinked.includes(selectedId)) {
          updates.linked_resources = [...currentLinked, selectedId]
        }
      }

      const updatedPersona = await PersonasService.updatePersona(selectedPersona.id, updates)
      setPersonas((prev) => prev.map((p) => (p.id === selectedPersona.id ? updatedPersona : p)))
      setSelectedPersona(updatedPersona)
      setShowLinkModal(false)

      // Reload data to reflect changes
      await loadOperations()
      await loadPipelines()
    } catch (error) {
      console.error("Failed to link items:", error)
    }
  }

  const handleRemoveLinkedItem = async (itemId: string, type: "operations" | "pipelines" | "resources") => {
    if (!selectedPersona) return

    if (isEditing) {
      // In edit mode, update the edit form data
      const updatedEditFormData = { ...editFormData }

      if (type === "operations") {
        updatedEditFormData.linked_operations = (editFormData.linked_operations || []).filter((id) => id !== itemId)
      } else if (type === "pipelines") {
        updatedEditFormData.linked_pipelines = (editFormData.linked_pipelines || []).filter((id) => id !== itemId)
      } else if (type === "resources") {
        updatedEditFormData.linked_resources = (editFormData.linked_resources || []).filter((id) => id !== itemId)
      }

      setEditFormData(updatedEditFormData)
    } else {
      // In view mode, update immediately
      try {
        const updates: Partial<Persona> = {}

        if (type === "operations") {
          updates.linked_operations = (selectedPersona.linked_operations || []).filter((id) => id !== itemId)

          // Remove this persona from the operation
          const operation = operations.find((op) => op.id === itemId)
          if (operation && operation.linkedPersonas?.includes(selectedPersona.id)) {
            await OperationsService.updateOperation(itemId, {
              linkedPersonas: operation.linkedPersonas.filter((id) => id !== selectedPersona.id),
            })
          }
        } else if (type === "pipelines") {
          updates.linked_pipelines = (selectedPersona.linked_pipelines || []).filter((id) => id !== itemId)

          // Remove this persona from the pipeline
          const pipeline = pipelines.find((p) => p.id === itemId)
          if (pipeline && pipeline.attachedTo.personas.includes(selectedPersona.id)) {
            await PipelinesService.updatePipeline(itemId, {
              attachedTo: {
                ...pipeline.attachedTo,
                personas: pipeline.attachedTo.personas.filter((id) => id !== selectedPersona.id),
              },
            })
          }
        } else if (type === "resources") {
          updates.linked_resources = (selectedPersona.linked_resources || []).filter((id) => id !== itemId)
        }

        const updatedPersona = await PersonasService.updatePersona(selectedPersona.id, updates)
        setPersonas((prev) => prev.map((p) => (p.id === selectedPersona.id ? updatedPersona : p)))
        setSelectedPersona(updatedPersona)

        // Reload data to reflect changes
        await loadOperations()
        await loadPipelines()
      } catch (error) {
        console.error("Failed to remove linked item:", error)
      }
    }
  }

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - reset to original data
      setEditFormData(selectedPersona || {})
      setIsEditing(false)
    } else {
      // Start editing - create a deep copy of the current persona
      if (selectedPersona) {
        setEditFormData({
          ...selectedPersona,
          linked_operations: [...(selectedPersona.linked_operations || [])],
          linked_pipelines: [...(selectedPersona.linked_pipelines || [])],
          linked_resources: [...(selectedPersona.linked_resources || [])],
        })
      }
      setIsEditing(true)
    }
  }

  const handleSaveEdit = async () => {
    if (!selectedPersona || !editFormData) return

    try {
      // Get the original linked items for comparison
      const originalOperations = selectedPersona.linked_operations || []
      const originalPipelines = selectedPersona.linked_pipelines || []
      const originalResources = selectedPersona.linked_resources || []

      // Get the new linked items from edit form
      const newOperations = editFormData.linked_operations || []
      const newPipelines = editFormData.linked_pipelines || []
      const newResources = editFormData.linked_resources || []

      // Update the persona with new data
      const updatedPersona = await PersonasService.updatePersona(selectedPersona.id, editFormData)
      setPersonas((prev) => prev.map((p) => (p.id === selectedPersona.id ? updatedPersona : p)))
      setSelectedPersona(updatedPersona)
      setIsEditing(false)

      // Handle bidirectional link updates for operations
      await handleBidirectionalOperationUpdates(originalOperations, newOperations, selectedPersona.id)

      // Handle bidirectional link updates for pipelines
      await handleBidirectionalPipelineUpdates(originalPipelines, newPipelines, selectedPersona.id)

      // Reload data to reflect all changes
      await loadOperations()
      await loadPipelines()
    } catch (error) {
      console.error("Failed to update persona:", error)
    }
  }

  const handleBidirectionalOperationUpdates = async (
    originalOperations: string[],
    newOperations: string[],
    personaId: string,
  ) => {
    // Find operations that were removed
    const removedOperations = originalOperations.filter((id) => !newOperations.includes(id))
    // Find operations that were added
    const addedOperations = newOperations.filter((id) => !originalOperations.includes(id))

    // Remove persona from operations that were unlinked
    for (const operationId of removedOperations) {
      const operation = operations.find((op) => op.id === operationId)
      if (operation && operation.linkedPersonas?.includes(personaId)) {
        await OperationsService.updateOperation(operationId, {
          linkedPersonas: operation.linkedPersonas.filter((id) => id !== personaId),
        })
      }
    }

    // Add persona to operations that were linked
    for (const operationId of addedOperations) {
      const operation = operations.find((op) => op.id === operationId)
      if (operation && !operation.linkedPersonas?.includes(personaId)) {
        await OperationsService.updateOperation(operationId, {
          linkedPersonas: [...(operation.linkedPersonas || []), personaId],
        })
      }
    }
  }

  const handleBidirectionalPipelineUpdates = async (
    originalPipelines: string[],
    newPipelines: string[],
    personaId: string,
  ) => {
    // Find pipelines that were removed
    const removedPipelines = originalPipelines.filter((id) => !newPipelines.includes(id))
    // Find pipelines that were added
    const addedPipelines = newPipelines.filter((id) => !originalPipelines.includes(id))

    // Remove persona from pipelines that were unlinked
    for (const pipelineId of removedPipelines) {
      const pipeline = pipelines.find((p) => p.id === pipelineId)
      if (pipeline && pipeline.attachedTo.personas.includes(personaId)) {
        await PipelinesService.updatePipeline(pipelineId, {
          attachedTo: {
            ...pipeline.attachedTo,
            personas: pipeline.attachedTo.personas.filter((id) => id !== personaId),
          },
        })
      }
    }

    // Add persona to pipelines that were linked
    for (const pipelineId of addedPipelines) {
      const pipeline = pipelines.find((p) => p.id === pipelineId)
      if (pipeline && !pipeline.attachedTo.personas.includes(personaId)) {
        await PipelinesService.updatePipeline(pipelineId, {
          attachedTo: {
            ...pipeline.attachedTo,
            personas: [...pipeline.attachedTo.personas, personaId],
          },
        })
      }
    }
  }

  const handleDeletePersona = async () => {
    if (!selectedPersona) return

    try {
      // Remove bidirectional links before deleting
      await removeBidirectionalLinks(selectedPersona)

      await PersonasService.deletePersona(selectedPersona.id)
      setPersonas((prev) => prev.filter((p) => p.id !== selectedPersona.id))
      handleCloseDetail()
    } catch (error) {
      console.error("Failed to delete persona:", error)
    }
  }

  const removeBidirectionalLinks = async (persona: Persona) => {
    try {
      // Remove from linked operations
      if (persona.linked_operations && persona.linked_operations.length > 0) {
        for (const operationId of persona.linked_operations) {
          const operation = operations.find((op) => op.id === operationId)
          if (operation && operation.linkedPersonas?.includes(persona.id)) {
            await OperationsService.updateOperation(operationId, {
              linkedPersonas: operation.linkedPersonas.filter((id) => id !== persona.id),
            })
          }
        }
      }

      // Remove from linked pipelines
      if (persona.linked_pipelines && persona.linked_pipelines.length > 0) {
        for (const pipelineId of persona.linked_pipelines) {
          const pipeline = pipelines.find((p) => p.id === pipelineId)
          if (pipeline && pipeline.attachedTo.personas.includes(persona.id)) {
            await PipelinesService.updatePipeline(pipelineId, {
              attachedTo: {
                ...pipeline.attachedTo,
                personas: pipeline.attachedTo.personas.filter((id) => id !== persona.id),
              },
            })
          }
        }
      }

      // Reload data to reflect changes
      await loadOperations()
      await loadPipelines()
    } catch (error) {
      console.error("Failed to remove bidirectional links:", error)
    }
  }

  const getLinkedOperations = (operationIds: string[]) => {
    return operations.filter((operation) => operationIds.includes(operation.id))
  }

  const getLinkedPipelines = (pipelineIds: string[]) => {
    return pipelines.filter((pipeline) => pipelineIds.includes(pipeline.id))
  }

  // Get the appropriate data source based on edit mode
  const getDisplayData = () => {
    return isEditing ? editFormData : selectedPersona
  }

  if (isLoading) {
    return (
      <div className="h-full flex flex-col bg-black/40 backdrop-blur-sm overflow-hidden">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-white/50 text-sm">{t("personas.loadingPersonas")}</p>
        </div>
      </div>
    )
  }

  const decodingButtons = [
    {
      label: t("personas.projectedIdentity"),
      tooltip: t("personas.projectedIdentityTooltip"),
    },
    {
      label: t("personas.hiddenVulnerability"),
      tooltip: t("personas.hiddenVulnerabilityTooltip"),
    },
    {
      label: t("personas.controlMechanism"),
      tooltip: t("personas.controlMechanismTooltip"),
    },
    {
      label: t("personas.coreEmotionalLoop"),
      tooltip: t("personas.coreEmotionalLoopTooltip"),
    },
    {
      label: t("personas.unmetNeed"),
      tooltip: t("personas.unmetNeedTooltip"),
    },
  ]

  return (
    <>
      <div className="h-full flex flex-col bg-black/40 backdrop-blur-sm overflow-hidden">
        {/* Personas Grid - Responsive */}
        <div className="flex-1 p-2 sm:p-4 space-y-2 sm:space-y-3 overflow-y-auto">
          {filteredPersonas.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-white/50 text-sm">
                {searchValue ? t("personas.noMatches") : t("personas.noPersonas")}
              </p>
            </div>
          ) : (
            filteredPersonas.map((persona) => (
              <div
                key={persona.id}
                draggable={decodingPersonaId !== persona.id}
                onDragStart={(e) => handleDragStart(e, persona.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, persona.id)}
                onDragEnd={handleDragEnd}
                onClick={() => handlePersonaClick(persona)}
                className={`
                group relative p-3 sm:p-4 border cursor-pointer transition-all duration-200
                bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/20 hover:bg-white/10
                ${draggedItem === persona.id ? "opacity-50" : ""}
                ${decodingPersonaId === persona.id ? "h-auto" : ""}
              `}
              >
                {/* Drag Handle */}
                {decodingPersonaId !== persona.id && (
                  <div className="hidden sm:block absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <GripVertical className="w-4 h-4 text-white/40" />
                  </div>
                )}

                {/* Persona Content */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 sm:ml-6">
                  {/* Left Column */}
                  <div className="space-y-1 sm:space-y-2">
                    <h3 className="font-semibold text-white/90 text-sm truncate">{persona.name}</h3>

                    {/* Social Credit Bar */}
                    <div className="w-full h-1 bg-white/10 backdrop-blur-sm overflow-hidden">
                      <div className="h-full bg-white/80 transition-all duration-300" style={{ width: "20%" }} />
                    </div>

                    <div className="flex flex-wrap gap-1">
                      <Badge className={`text-xs ${getStatusColor(persona.status)}`}>
                        {persona.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="flex sm:flex-col items-start sm:items-center justify-between sm:justify-center space-x-2 sm:space-x-0 sm:space-y-2">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => handleDownload(e, persona.id)}
                        className="p-1.5 bg-white/0 hover:bg-white/10 rounded-full transition-colors"
                        title={t("personas.downloadPersona")}
                      >
                        <Download className="w-5 h-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          console.log(`Lightning action for persona: ${persona.id}`)
                        }}
                        className="p-1.5 bg-white/0 hover:bg-white/10 rounded-full transition-colors"
                        title={t("personas.assignAgent")}
                      >
                        <img
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Photoroom_20250730_51940%E2%80%AFPM-6CmBVPS9jtgj9TXiTBUgXrBIqzwx4L.png"
                          alt="Lightning"
                          className="w-5 h-5 filter brightness-0 invert"
                        />
                      </button>
                      <button
                        onClick={(e) => handleFileAttach(e, persona.id)}
                        className="p-1.5 bg-white/0 hover:bg-white/10 rounded-full transition-colors"
                        title={t("personas.attachFile")}
                      >
                        <Paperclip className="w-5 h-5" />
                      </button>
                      <button
                        onClick={(e) => handleRunDecoding(e, persona.id)}
                        className="p-1.5 bg-white/0 hover:bg-white/10 rounded-full transition-colors"
                        title={t("personas.runDiagnostic")}
                      >
                        <Play className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Decoding Buttons */}
                <AnimatePresence>
                  {decodingPersonaId === persona.id && (
                    <motion.div
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 100 }}
                      transition={{ duration: 0.3, staggerChildren: 0.05 }}
                      className="mt-4 pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-3"
                    >
                      {decodingButtons.map((button, index) => {
                        const tooltipId = `${persona.id}-${index}`
                        const isSelected = selectedDecodingOption[persona.id] === button.label
                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 100 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="relative"
                          >
                            <Button
                              className={`w-full flex items-center justify-center gap-2 text-white border text-xs sm:text-sm py-2 px-3 rounded-none transition-all duration-200 ${
                                isSelected
                                  ? "bg-white/20 border-white/40 hover:bg-white/20"
                                  : "bg-white/10 hover:bg-white/20 border-white/20"
                              }`}
                              onClick={(e) => handleDecodingOptionClick(e, persona.id, button.label)}
                            >
                              {button.label}
                              <div
                                className="absolute top-1 right-1 cursor-pointer"
                                onClick={(e) => handleInfoClick(e, tooltipId)}
                              >
                                <Info className="w-2 h-2 text-white/60 hover:text-white/90 transition-colors" />
                                {activeTooltip === tooltipId && (
                                  <span className="absolute bg-black/70 text-white text-xs rounded px-2 py-1 -translate-y-full -translate-x-1/2 left-1/2 mt-1 whitespace-nowrap z-10">
                                    {button.tooltip}
                                  </span>
                                )}
                              </div>
                            </Button>
                          </motion.div>
                        )
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
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
                  {t("personas.linkOperations")}{" "}
                  {linkType === "operations"
                    ? t("operations.operations")
                    : linkType === "pipelines"
                      ? t("pipelines.pipelines")
                      : t("personas.linkedResources")}
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
                        <p className="text-white/50 text-sm">{t("operations.noOperations")}</p>
                      </div>
                    )}
                  </div>
                ) : linkType === "pipelines" ? (
                  <div className="space-y-2">
                    {pipelines.length > 0 ? (
                      pipelines.map((pipeline) => (
                        <div
                          key={pipeline.id}
                          onClick={() => handleLinkSelection(pipeline.id)}
                          className="p-3 bg-white/5 border border-white/10 hover:bg-white/10 cursor-pointer transition-all duration-200"
                        >
                          <h4 className="font-medium text-white/90 text-sm">{pipeline.name}</h4>
                          <p className="text-xs text-white/70 mt-1">
                            {pipeline.steps} {t("pipelines.steps")}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 bg-white/5 border border-white/10 text-center">
                        <p className="text-white/50 text-sm">{t("pipelines.noPipelines")}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="p-3 bg-white/5 border border-white/10 text-center">
                      <p className="text-white/50 text-sm">{t("personas.resourcesSoon")}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Detailed Persona Slide-in Panel */}
      {selectedPersona && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={handleCloseDetail} />
          <div className="fixed right-0 top-16 sm:top-20 bottom-0 w-full sm:w-1/2 lg:w-1/3 bg-black/40 backdrop-blur-sm border-l border-white/10 z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto">
            {/* Panel Header */}
            <div className="p-3 sm:p-4 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-semibold text-white/90">
                {isEditing ? (
                  <input
                    type="text"
                    value={editFormData.name || ""}
                    onChange={(e) => setEditFormData((prev) => ({ ...prev, name: e.target.value }))}
                    className="bg-white/5 border border-white/10 text-white/90 text-base sm:text-lg px-2 py-1 focus:border-white/20 focus:outline-none"
                  />
                ) : (
                  selectedPersona.name
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

            {/* Panel Content */}
            <div className="p-3 sm:p-4 space-y-4 sm:space-y-6">
              {/* Attached Files */}
              {attachedFiles[selectedPersona.id] && attachedFiles[selectedPersona.id].length > 0 && (
                <div className="space-y-2 sm:space-y-3">
                  <h3 className="font-semibold text-white/90 text-sm sm:text-base">{t("personas.attachedFiles")}</h3>
                  <div className="p-2 sm:p-3 bg-white/5 border border-white/10 space-y-2">
                    {attachedFiles[selectedPersona.id].map((file, index) => (
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

              {/* Context */}
              <div className="space-y-2 sm:space-y-3">
                <h3 className="font-semibold text-white/90 text-sm sm:text-base">{t("personas.context")}</h3>
                <div className="p-2 sm:p-3 bg-white/5 border border-white/10">
                  {isEditing ? (
                    <textarea
                      value={editFormData.context || ""}
                      onChange={(e) => setEditFormData((prev) => ({ ...prev, context: e.target.value }))}
                      rows={3}
                      className="w-full bg-transparent text-white/70 text-xs sm:text-sm leading-relaxed resize-none focus:outline-none"
                    />
                  ) : (
                    <p className="text-white/70 text-xs sm:text-sm leading-relaxed">{selectedPersona.context}</p>
                  )}
                </div>
              </div>

              {/* Linked Operations */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-white/90 text-xs sm:text-sm">{t("personas.linkedOperations")}</h4>
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
                    const linkedOperationIds = displayData?.linked_operations || []
                    return linkedOperationIds.length > 0 ? (
                      getLinkedOperations(linkedOperationIds).map((operation) => (
                        <div
                          key={operation.id}
                          className="flex items-center gap-2 sm:gap-3 p-2 bg-white/5 border border-white/10"
                        >
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white"></div>
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
                      <p className="text-white/50 text-xs sm:text-sm">{t("personas.noOperationsLinked")}</p>
                    )
                  })()}
                </div>
              </div>

              {/* Linked Pipelines */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-white/90 text-xs sm:text-sm">{t("personas.linkedPipelines")}</h4>
                  <button
                    onClick={() => handleLinkItems("pipelines")}
                    className="text-white/60 hover:text-white/90 transition-colors duration-200"
                  >
                    <Link className="w-3 h-3" />
                  </button>
                </div>
                <div className="p-2 sm:p-3 bg-white/5 border border-white/10 space-y-1 sm:space-y-2">
                  {(() => {
                    const displayData = getDisplayData()
                    const linkedPipelineIds = displayData?.linked_pipelines || []
                    return linkedPipelineIds.length > 0 ? (
                      getLinkedPipelines(linkedPipelineIds).map((pipeline) => (
                        <div
                          key={pipeline.id}
                          className="flex items-center gap-2 sm:gap-3 p-2 bg-white/5 border border-white/10"
                        >
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400"></div>
                          <span className="text-white/70 text-xs sm:text-sm flex-1">{pipeline.name}</span>
                          <span className="text-white/50 text-xs">
                            ({pipeline.steps} {t("pipelines.steps")})
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
                      <p className="text-white/50 text-xs sm:text-sm">{t("personas.noPipelinesLinked")}</p>
                    )
                  })()}
                </div>
              </div>

              {/* Linked Resources */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-white/90 text-xs sm:text-sm">{t("personas.linkedResources")}</h4>
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
                    const linkedResourceIds = displayData?.linked_resources || []
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
                      <p className="text-white/50 text-xs sm:text-sm">{t("personas.noResourcesLinked")}</p>
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
                      {t("personas.cancel")}
                    </Button>
                    <Button
                      onClick={handleSaveEdit}
                      className="flex-1 bg-white/10 hover:bg-white/20 text-white border-white/20"
                    >
                      {t("personas.save")}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={handleEditToggle}
                      className="flex-1 bg-white/10 hover:bg-white/10 text-white border-white/0"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      {t("personas.edit")}
                    </Button>
                    <Button
                      onClick={handleDeletePersona}
                      variant="outline"
                      className="flex-1 bg-red-500/20 border-red-500/0 text-white hover:bg-red-0"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      {t("personas.delete")}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
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
