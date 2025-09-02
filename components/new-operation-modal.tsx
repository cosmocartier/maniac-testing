"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X, Link, Sparkles } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

interface NewOperationModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (operation: any) => void
  vaultId: string
  personas: any[]
  pipelines: any[]
}

export default function NewOperationModal({
  isOpen,
  onClose,
  onSubmit,
  vaultId,
  personas,
  pipelines,
}: NewOperationModalProps) {
  const { t } = useLanguage()

  const [formData, setFormData] = useState({
    operationTitle: "",
    strategicObjective: "",
    priorityLevel: "medium" as "low" | "medium" | "high" | "critical",
    deadline: "",
    category: "",
    operationalTags: [] as string[],
    linkedResources: [] as string[],
    linkedPersonas: [] as string[],
    linkedPipelines: [] as string[],
  })

  const [tagInput, setTagInput] = useState("")
  const [resourceInput, setResourceInput] = useState("")
  const [newCategoryInput, setNewCategoryInput] = useState("")
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false)
  const [showLinkModal, setShowLinkModal] = useState(false)
  const [linkType, setLinkType] = useState<"personas" | "pipelines" | "resources">("personas")

  // Predefined categories with ability to add new ones
  const [categories, setCategories] = useState([
    "Security",
    "Development",
    "Marketing",
    "Operations",
    "Research",
    "Sales",
    "Support",
    "Analytics",
  ])

  const handleAddTag = (tag: string) => {
    if (tag && !formData.operationalTags.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        operationalTags: [...prev.operationalTags, tag],
      }))
      setTagInput("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      operationalTags: prev.operationalTags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const handleAddResource = (resource: string) => {
    if (resource && !formData.linkedResources.includes(resource)) {
      setFormData((prev) => ({
        ...prev,
        linkedResources: [...prev.linkedResources, resource],
      }))
      setResourceInput("")
    }
  }

  const handleRemoveResource = (resourceToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      linkedResources: prev.linkedResources.filter((resource) => resource !== resourceToRemove),
    }))
  }

  const handleAddNewCategory = () => {
    if (newCategoryInput && !categories.includes(newCategoryInput)) {
      setCategories((prev) => [...prev, newCategoryInput])
      setFormData((prev) => ({ ...prev, category: newCategoryInput }))
      setNewCategoryInput("")
      setShowNewCategoryInput(false)
    }
  }

  const handleCategoryChange = (value: string) => {
    if (value === "add-new") {
      setShowNewCategoryInput(true)
    } else {
      setFormData((prev) => ({ ...prev, category: value }))
    }
  }

  const handleLinkItems = (type: "personas" | "pipelines" | "resources") => {
    setLinkType(type)
    setShowLinkModal(true)
  }

  const handleLinkSelection = (selectedId: string) => {
    if (linkType === "personas") {
      if (!formData.linkedPersonas.includes(selectedId)) {
        setFormData((prev) => ({
          ...prev,
          linkedPersonas: [...prev.linkedPersonas, selectedId],
        }))
      }
    } else if (linkType === "pipelines") {
      if (!formData.linkedPipelines.includes(selectedId)) {
        setFormData((prev) => ({
          ...prev,
          linkedPipelines: [...prev.linkedPipelines, selectedId],
        }))
      }
    } else if (linkType === "resources") {
      if (!formData.linkedResources.includes(selectedId)) {
        setFormData((prev) => ({
          ...prev,
          linkedResources: [...prev.linkedResources, selectedId],
        }))
      }
    }
    setShowLinkModal(false)
  }

  const handleRemoveLinkedItem = (id: string, type: "personas" | "pipelines" | "resources") => {
    if (type === "personas") {
      setFormData((prev) => ({
        ...prev,
        linkedPersonas: prev.linkedPersonas.filter((personaId) => personaId !== id),
      }))
    } else if (type === "pipelines") {
      setFormData((prev) => ({
        ...prev,
        linkedPipelines: prev.linkedPipelines.filter((pipelineId) => pipelineId !== id),
      }))
    } else if (type === "resources") {
      setFormData((prev) => ({
        ...prev,
        linkedResources: prev.linkedResources.filter((resourceId) => resourceId !== id),
      }))
    }
  }

  const getLinkedPersonas = () => {
    return personas.filter((persona) => formData.linkedPersonas.includes(persona.id))
  }

  const getLinkedPipelines = () => {
    return pipelines.filter((pipeline) => formData.linkedPipelines.includes(pipeline.id))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Ensure category is properly captured
    const operationCategory = formData.category || ""

    const newOperation = {
      id: `op-${Date.now()}`,
      name: formData.operationTitle,
      objective: formData.strategicObjective,
      status: "pending" as const,
      missionTitle: formData.operationTitle,
      strategicObjective: formData.strategicObjective,
      deadline: formData.deadline || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      priorityLevel: formData.priorityLevel,
      category: operationCategory,
      operationalTags: formData.operationalTags,
      linkedResources: formData.linkedResources,
      linkedPersonas: formData.linkedPersonas,
      linkedPipelines: formData.linkedPipelines,
    }

    console.log("Submitting operation with category:", operationCategory) // Debug log
    onSubmit(newOperation)
    onClose()

    // Reset form
    setFormData({
      operationTitle: "",
      strategicObjective: "",
      priorityLevel: "medium",
      deadline: "",
      category: "",
      operationalTags: [],
      linkedResources: [],
      linkedPersonas: [],
      linkedPipelines: [],
    })
    setShowNewCategoryInput(false)
    setNewCategoryInput("")
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="w-full max-w-2xl bg-black/40 backdrop-blur-sm border border-white/10 overflow-hidden relative">
          <div className="absolute -top-0 -left-0 w-2 h-2 border-l-2 border-t-2 border-white/20"></div>
          <div className="absolute -top-0 -right-0 w-2 h-2 border-r-2 border-t-2 border-white/20"></div>
          <div className="absolute -bottom-0 -left-0 w-2 h-2 border-l-2 border-b-2 border-white/20"></div>
          <div className="absolute -bottom-0 -right-0 w-2 h-2 border-r-2 border-b-2 border-white/20"></div>

          {/* Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white/90">{t("newOperation.title")}</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white/60 hover:text-white/90 hover:bg-white/10 border-none"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
            {/* Operation Title */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/90">{t("newOperation.operationTitle")}</label>
              <input
                type="text"
                value={formData.operationTitle}
                onChange={(e) => setFormData((prev) => ({ ...prev, operationTitle: e.target.value }))}
                className="w-full bg-transparent border-0 border-b border-white/30 rounded-none px-0 py-3 text-white text-sm placeholder-white/50 focus:outline-none focus:border-white/60"
                placeholder={t("newOperation.enterOperationName")}
                required
              />
            </div>

            {/* Strategic Objective */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/90">{t("newOperation.strategicObjective")}</label>
              <div className="relative">
                <textarea
                  value={formData.strategicObjective}
                  onChange={(e) => setFormData((prev) => ({ ...prev, strategicObjective: e.target.value }))}
                  rows={3}
                  className="w-full bg-transparent border-0 border-b border-white/30 rounded-none px-0 py-3 text-white text-sm placeholder-white/50 focus:outline-none focus:border-white/60"
                  placeholder={t("newOperation.describeObjective")}
                  required
                />
                <div
                  className="absolute right-2 top-2 p-2 text-white/40 cursor-not-allowed"
                  title={t("newOperation.aiEnhancement")}
                >
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Priority Level and Deadline Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Priority Level */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/90">{t("newOperation.priorityLevel")}</label>
                <select
                  value={formData.priorityLevel}
                  onChange={(e) => setFormData((prev) => ({ ...prev, priorityLevel: e.target.value as any }))}
                  className="w-full bg-transparent border-0 border-b border-white/30 rounded-none px-0 py-3 text-white text-sm placeholder-white/50 focus:outline-none focus:border-white/60"
                >
                  <option value="low">{t("newOperation.priorityLow")}</option>
                  <option value="medium">{t("newOperation.priorityMedium")}</option>
                  <option value="high">{t("newOperation.priorityHigh")}</option>
                  <option value="critical">{t("newOperation.priorityCritical")}</option>
                </select>
              </div>

              {/* Deadline */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/90">{t("newOperation.deadline")}</label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData((prev) => ({ ...prev, deadline: e.target.value }))}
                  className="w-full bg-transparent border-0 border-b border-white/30 rounded-none px-0 py-3 text-white text-sm placeholder-white/50 focus:outline-none focus:border-white/60"
                />
              </div>
            </div>

            {/* Operational Tags */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/90">{t("newOperation.operationalTags")}</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleAddTag(tagInput)
                    }
                  }}
                  className="w-full bg-transparent border-0 border-b border-white/30 rounded-none px-0 py-3 text-white text-sm placeholder-white/50 focus:outline-none focus:border-white/60"
                  placeholder={t("newOperation.addTagsPlaceholder")}
                />
                <Button
                  type="button"
                  onClick={() => handleAddTag(tagInput)}
                  className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-sm h-10 px-3"
                >
                  {t("newOperation.add")}
                </Button>
              </div>
              {formData.operationalTags.length > 0 && (
                <div className="p-3 bg-white/5 border border-white/10">
                  <div className="flex flex-wrap gap-2">
                    {formData.operationalTags.map((tag) => (
                      <div key={tag} className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10">
                        <div className="flex items-center justify-center w-4 h-4 text-white/90 text-xs">#</div>
                        <span className="text-white/90 text-sm">{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="text-white/60 hover:text-white/90 ml-1"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Linked Pipelines */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-white/90">{t("newOperation.linkedPipelines")}</label>
                <button
                  type="button"
                  onClick={() => handleLinkItems("pipelines")}
                  className="text-white/60 hover:text-white/90 transition-colors duration-200"
                >
                  <Link className="w-4 h-4" />
                </button>
              </div>
              {formData.linkedPipelines.length > 0 && (
                <div className="p-3 bg-white/5 border border-white/10 space-y-2">
                  {getLinkedPipelines().map((pipeline) => (
                    <div key={pipeline.id} className="flex items-center gap-3 p-2 bg-white/5 border border-white/10">
                      <div className="w-2 h-2 bg-blue-400"></div>
                      <span className="text-white/90 text-sm flex-1">{pipeline.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveLinkedItem(pipeline.id, "pipelines")}
                        className="text-white/60 hover:text-white/90"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Linked Personas */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-white/90">{t("newOperation.linkedPersonas")}</label>
                <button
                  type="button"
                  onClick={() => handleLinkItems("personas")}
                  className="text-white/60 hover:text-white/90 transition-colors duration-200"
                >
                  <Link className="w-4 h-4" />
                </button>
              </div>
              {formData.linkedPersonas.length > 0 && (
                <div className="p-3 bg-white/5 border border-white/10 space-y-2">
                  {getLinkedPersonas().map((persona) => (
                    <div key={persona.id} className="flex items-center gap-3 p-2 bg-white/5 border border-white/10">
                      <div className="w-2 h-2 bg-green-400"></div>
                      <span className="text-white/90 text-sm flex-1">{persona.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveLinkedItem(persona.id, "personas")}
                        className="text-white/60 hover:text-white/90"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Linked Resources */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-white/90">{t("newOperation.linkedResources")}</label>
                <button
                  type="button"
                  onClick={() => handleLinkItems("resources")}
                  className="text-white/60 hover:text-white/90 transition-colors duration-200"
                >
                  <Link className="w-4 h-4" />
                </button>
              </div>
              {formData.linkedResources.length > 0 && (
                <div className="p-3 bg-white/5 border border-white/10 space-y-2">
                  {formData.linkedResources.map((resource, index) => (
                    <div key={resource} className="flex items-center gap-3 p-2 bg-white/5 border border-white/10">
                      <div className="w-2 h-2 bg-orange-400"></div>
                      <span className="text-white/90 text-sm flex-1">{resource}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveResource(resource)}
                        className="text-white/60 hover:text-white/90"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-white/10">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 w-full bg-transparent border-0 border-b border-white/30 rounded-none px-0 py-3 text-white text-sm placeholder-white/50 focus:outline-none focus:border-white/60"
              >
                {t("newOperation.cancel")}
              </Button>
              <Button type="submit" className="flex-1 w-full bg-transparent border-0 border-b border-white/30 rounded-none px-0 py-3 text-white text-sm placeholder-white/50 focus:outline-none focus:border-white/60">
                {t("newOperation.createOperation")}
              </Button>
            </div>
          </form>
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
                        <p className="text-xs text-white/70 mt-1">{persona.projected_identity}</p>
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
    </>
  )
}
