"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { GripVertical, X, Edit3, Link, Paperclip, Play } from "lucide-react"
import { ResourcesService, type Resource } from "@/lib/resources-service"
import { PersonasService, type Persona } from "@/lib/personas-service"
import { PipelinesService, type Pipeline } from "@/lib/pipelines-service"
import { OperationsService, type Operation } from "@/lib/operations-service"
import { useLanguage } from "@/lib/language-context"

interface ResourcesProps {
  vaultId: string
  onResourceSelect?: (resource: Resource | null) => void
}

export default function Resources({ vaultId, onResourceSelect }: ResourcesProps) {
  const { t } = useLanguage()

  const [resources, setResources] = useState<Resource[]>([])
  const [personas, setPersonas] = useState<Persona[]>([])
  const [pipelines, setPipelines] = useState<Pipeline[]>([])
  const [operations, setOperations] = useState<Operation[]>([])
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null)
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editFormData, setEditFormData] = useState<Partial<Resource>>({})
  const [showLinkModal, setShowLinkModal] = useState(false)
  const [linkType, setLinkType] = useState<"personas" | "pipelines" | "operations">("personas")

  useEffect(() => {
    loadResources()
    loadPersonas()
    loadPipelines()
    loadOperations()
  }, [vaultId])

  useEffect(() => {
    const subscription = ResourcesService.subscribeToResourceChanges(vaultId, (payload) => {
      console.log("Resource change detected:", payload)
      loadResources()
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [vaultId])

  const loadResources = async () => {
    try {
      setIsLoading(true)
      const data = await ResourcesService.getVaultResources(vaultId)
      setResources(data)
    } catch (error) {
      console.error("Failed to load resources:", error)
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

  const loadOperations = async () => {
    try {
      const data = await OperationsService.getVaultOperations(vaultId)
      setOperations(data)
    } catch (error) {
      console.error("Failed to load operations:", error)
    }
  }

  const handleDragStart = (e: React.DragEvent, resourceId: string) => {
    setDraggedItem(resourceId)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault()
    if (!draggedItem || draggedItem === targetId) return

    const draggedIndex = resources.findIndex((res) => res.id === draggedItem)
    const targetIndex = resources.findIndex((res) => res.id === targetId)

    if (draggedIndex === -1 || targetIndex === -1) return

    const newResources = [...resources]
    const [draggedResource] = newResources.splice(draggedIndex, 1)
    newResources.splice(targetIndex, 0, draggedResource)

    setResources(newResources)
    setDraggedItem(null)
  }

  const handleDragEnd = () => {
    setDraggedItem(null)
  }

  const handleResourceClick = (resource: Resource) => {
    setSelectedResource(resource)
    setEditFormData(resource)
    onResourceSelect?.(resource)
  }

  const handleCloseDetail = () => {
    setSelectedResource(null)
    setIsEditing(false)
    setEditFormData({})
    onResourceSelect?.(null)
  }

  const handleRunDiagnostic = (e: React.MouseEvent, resourceId: string) => {
    e.stopPropagation()
    console.log(`Running diagnostic for resource: ${resourceId}`)
  }

  const handleEditToggle = () => {
    if (isEditing) {
      setEditFormData(selectedResource || {})
      setIsEditing(false)
    } else {
      if (selectedResource) {
        setEditFormData({
          ...selectedResource,
          linkedPersonas: [...(selectedResource.linkedPersonas || [])],
          linkedPipelines: [...(selectedResource.linkedPipelines || [])],
          linkedOperations: [...(selectedResource.linkedOperations || [])],
        })
      }
      setIsEditing(true)
    }
  }

  const handleSaveEdit = async () => {
    if (!selectedResource || !editFormData) return

    try {
      const updatedResource = await ResourcesService.updateResource(selectedResource.id, editFormData)
      setResources((prev) => prev.map((res) => (res.id === selectedResource.id ? updatedResource : res)))
      setSelectedResource(updatedResource)
      setIsEditing(false)
    } catch (error) {
      console.error("Failed to update resource:", error)
    }
  }

  const handleDeleteResource = async () => {
    if (!selectedResource) return

    try {
      await ResourcesService.deleteResource(selectedResource.id)
      setResources((prev) => prev.filter((res) => res.id !== selectedResource.id))
      handleCloseDetail()
    } catch (error) {
      console.error("Failed to delete resource:", error)
    }
  }

  const handleLinkItems = (type: "personas" | "pipelines" | "operations") => {
    setLinkType(type)
    setShowLinkModal(true)
  }

  const handleLinkSelection = async (selectedId: string) => {
    if (!selectedResource) return

    try {
      const updates: Partial<Resource> = {}

      if (linkType === "personas") {
        const currentLinked = selectedResource.linkedPersonas || []
        if (!currentLinked.includes(selectedId)) {
          updates.linkedPersonas = [...currentLinked, selectedId]
        }
      } else if (linkType === "pipelines") {
        const currentLinked = selectedResource.linkedPipelines || []
        if (!currentLinked.includes(selectedId)) {
          updates.linkedPipelines = [...currentLinked, selectedId]
        }
      } else if (linkType === "operations") {
        const currentLinked = selectedResource.linkedOperations || []
        if (!currentLinked.includes(selectedId)) {
          updates.linkedOperations = [...currentLinked, selectedId]
        }
      }

      const updatedResource = await ResourcesService.updateResource(selectedResource.id, updates)
      setResources((prev) => prev.map((res) => (res.id === selectedResource.id ? updatedResource : res)))
      setSelectedResource(updatedResource)
      setShowLinkModal(false)
    } catch (error) {
      console.error("Failed to link items:", error)
    }
  }

  const handleRemoveLinkedItem = async (itemId: string, type: "personas" | "pipelines" | "operations") => {
    if (!selectedResource) return

    if (isEditing) {
      const updatedEditFormData = { ...editFormData }

      if (type === "personas") {
        updatedEditFormData.linkedPersonas = (editFormData.linkedPersonas || []).filter((id) => id !== itemId)
      } else if (type === "pipelines") {
        updatedEditFormData.linkedPipelines = (editFormData.linkedPipelines || []).filter((id) => id !== itemId)
      } else if (type === "operations") {
        updatedEditFormData.linkedOperations = (editFormData.linkedOperations || []).filter((id) => id !== itemId)
      }

      setEditFormData(updatedEditFormData)
    } else {
      try {
        const updates: Partial<Resource> = {}

        if (type === "personas") {
          updates.linkedPersonas = (selectedResource.linkedPersonas || []).filter((id) => id !== itemId)
        } else if (type === "pipelines") {
          updates.linkedPipelines = (selectedResource.linkedPipelines || []).filter((id) => id !== itemId)
        } else if (type === "operations") {
          updates.linkedOperations = (selectedResource.linkedOperations || []).filter((id) => id !== itemId)
        }

        const updatedResource = await ResourcesService.updateResource(selectedResource.id, updates)
        setResources((prev) => prev.map((res) => (res.id === selectedResource.id ? updatedResource : res)))
        setSelectedResource(updatedResource)
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

  const getLinkedOperations = (operationIds: string[]) => {
    return operations.filter((operation) => operationIds.includes(operation.id))
  }

  const getDisplayData = () => {
    return isEditing ? editFormData : selectedResource
  }

  if (isLoading) {
    return (
      <div className="h-full flex flex-col bg-black/40 backdrop-blur-sm overflow-hidden">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-white/50 text-sm">{t("resources.loading")}</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="h-full flex flex-col bg-black/40 backdrop-blur-sm overflow-hidden">
        <div className="flex-1 p-2 sm:p-4 space-y-2 sm:space-y-3 overflow-y-auto">
          {resources.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-white/50 text-sm">{t("resources.noResources")}</p>
            </div>
          ) : (
            resources.map((resource) => (
              <div
                key={resource.id}
                draggable
                onDragStart={(e) => handleDragStart(e, resource.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, resource.id)}
                onDragEnd={handleDragEnd}
                onClick={() => handleResourceClick(resource)}
                className={`
                group relative p-3 sm:p-4 border cursor-pointer transition-all duration-200
                bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/20 hover:bg-white/10
                ${draggedItem === resource.id ? "opacity-50" : ""}
              `}
              >
                <div className="hidden sm:block absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <GripVertical className="w-4 h-4 text-white/40" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 sm:ml-6">
                  <div className="space-y-1 sm:space-y-2">
                    <h3 className="font-semibold text-white/90 text-sm truncate">{resource.name}</h3>
                    <p className="text-xs text-white/70 line-clamp-1">{resource.category}</p>
                    <p className="text-xs text-white/60 line-clamp-1">{resource.value}</p>
                  </div>

                  <div className="flex sm:flex-col items-start sm:items-center justify-between sm:justify-center space-x-2 sm:space-x-0 sm:space-y-2">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          console.log(`Lightning action for resource: ${resource.id}`)
                        }}
                        className="p-1.5 bg-white/0 hover:bg-white/10 rounded-full transition-colors"
                        title="Lightning action"
                      >
                        <img
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Photoroom_20250730_51940%E2%80%AFPM-6CmBVPS9jtgj9TXiTBUgXrBIqzwx4L.png"
                          alt="Lightning"
                          className="w-5 h-5 filter brightness-0 invert"
                        />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          console.log(`Attach file for resource: ${resource.id}`)
                        }}
                        className="p-1.5 bg-white/0 hover:bg-white/10 rounded-full transition-colors"
                        title={t("resources.attachFile")}
                      >
                        <Paperclip className="w-5 h-5" />
                      </button>
                      <button
                        onClick={(e) => handleRunDiagnostic(e, resource.id)}
                        className="p-1.5 bg-white/0 hover:bg-white/10 rounded-full transition-colors"
                        title={t("resources.runDiagnostic")}
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

      {showLinkModal && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]" onClick={() => setShowLinkModal(false)} />
          <div className="fixed inset-0 flex items-center justify-center z-[70] p-4">
            <div className="w-full max-w-md bg-black/40 backdrop-blur-sm border border-white/10 overflow-hidden">
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white/90">
                  {linkType === "personas"
                    ? t("resources.linkPersonas")
                    : linkType === "pipelines"
                      ? t("resources.linkPipelines")
                      : t("resources.linkOperations")}
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
                          {pipeline.steps} {t("newResource.steps")}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {operations.map((operation) => (
                      <div
                        key={operation.id}
                        onClick={() => handleLinkSelection(operation.id)}
                        className="p-3 bg-white/5 border border-white/10 hover:bg-white/10 cursor-pointer transition-all duration-200"
                      >
                        <h4 className="font-medium text-white/90 text-sm">{operation.name}</h4>
                        <p className="text-xs text-white/70 mt-1">{operation.objective}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {selectedResource && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={handleCloseDetail} />

          <div className="fixed right-0 top-16 sm:top-20 bottom-0 w-full sm:w-1/2 lg:w-1/3 bg-black/40 backdrop-blur-sm border-l border-white/10 z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto">
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
                  selectedResource.name
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

            <div className="p-3 sm:p-4 space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-white/90 text-xs sm:text-sm">{t("resources.value")}</h4>
                  <div className="p-2 sm:p-3 bg-white/5 border border-white/10">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editFormData.value || ""}
                        onChange={(e) => setEditFormData((prev) => ({ ...prev, value: e.target.value }))}
                        className="w-full bg-transparent text-white/70 text-xs sm:text-sm focus:outline-none"
                      />
                    ) : (
                      <p className="text-white/70 text-xs sm:text-sm">{selectedResource.value}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-white/90 text-xs sm:text-sm">{t("resources.category")}</h4>
                  <div className="p-2 sm:p-3 bg-white/5 border border-white/10">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editFormData.category || ""}
                        onChange={(e) => setEditFormData((prev) => ({ ...prev, category: e.target.value }))}
                        className="w-full bg-transparent text-white/70 text-xs sm:text-sm focus:outline-none"
                      />
                    ) : (
                      <p className="text-white/70 text-xs sm:text-sm">{selectedResource.category}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2 sm:space-y-3">
                <h3 className="font-semibold text-white/90 text-sm sm:text-base">{t("resources.context")}</h3>
                <div className="p-2 sm:p-3 bg-white/5 border border-white/10">
                  {isEditing ? (
                    <textarea
                      value={editFormData.context || ""}
                      onChange={(e) => setEditFormData((prev) => ({ ...prev, context: e.target.value }))}
                      rows={3}
                      className="w-full bg-transparent text-white/70 text-xs sm:text-sm leading-relaxed resize-none focus:outline-none"
                    />
                  ) : (
                    <p className="text-white/70 text-xs sm:text-sm leading-relaxed">{selectedResource.context}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-white/90 text-xs sm:text-sm">{t("resources.linkedOperations")}</h4>
                  <button
                    onClick={() => handleLinkItems("operations")}
                    className="text-white/60 hover:text-white/90 transition-colors duration-200"
                  >
                    <Link className="w-3 h-3" />
                  </button>
                </div>
                <div className="p-2 sm:p-3 bg-white/5 border border-white/5 space-y-1 sm:space-y-2">
                  {(() => {
                    const displayData = getDisplayData()
                    const linkedOperationIds = displayData?.linkedOperations || []
                    return linkedOperationIds.length > 0 ? (
                      getLinkedOperations(linkedOperationIds).map((operation) => (
                        <div
                          key={operation.id}
                          className="flex items-center gap-2 sm:gap-3 p-2 bg-white/5 border border-white/5"
                        >
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-400"></div>
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
                      <p className="text-white/50 text-xs sm:text-sm">{t("resources.noOperationsLinked")}</p>
                    )
                  })()}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-white/90 text-xs sm:text-sm">{t("resources.linkedPipelines")}</h4>
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
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-blue-400"></div>
                          <span className="text-white/70 text-xs sm:text-sm flex-1">{pipeline.name}</span>
                          <span className="text-white/50 text-xs">
                            ({pipeline.steps} {t("newResource.steps")})
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
                      <p className="text-white/50 text-xs sm:text-sm">{t("resources.noPipelinesLinked")}</p>
                    )
                  })()}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-white/90 text-xs sm:text-sm">{t("resources.linkedPersonas")}</h4>
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
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-purple-400"></div>
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
                      <p className="text-white/50 text-xs sm:text-sm">{t("resources.noPersonasLinked")}</p>
                    )
                  })()}
                </div>
              </div>
            </div>

            <div className="p-3 sm:p-4 border-t border-white/10">
              <div className="flex gap-3">
                {isEditing ? (
                  <>
                    <Button
                      onClick={handleEditToggle}
                      variant="outline"
                      className="flex-1 bg-white/5 border-white/20 text-white/80 hover:bg-white/10"
                    >
                      {t("resources.cancel")}
                    </Button>
                    <Button
                      onClick={handleSaveEdit}
                      className="flex-1 bg-white/10 hover:bg-white/20 text-white border-white/20"
                    >
                      {t("resources.save")}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={handleEditToggle}
                      className="flex-1 bg-white/10 hover:bg-white/10 text-white border-white/0"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      {t("resources.edit")}
                    </Button>
                    <Button
                      onClick={handleDeleteResource}
                      variant="outline"
                      className="flex-1 bg-red-500/20 border-red-500/0 text-white hover:bg-red-0"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-trash2 w-4 h-4 mr-2"
                      >
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                        <line x1="10" x2="10" y1="11" y2="17"></line>
                        <line x1="14" x2="14" y1="11" y2="17"></line>
                      </svg>
                      {t("resources.delete")}
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
      `}</style>
    </>
  )
}
