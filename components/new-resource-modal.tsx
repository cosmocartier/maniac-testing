"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X, Link } from "lucide-react"
import type { Resource } from "@/lib/resources-service"
import { useLanguage } from "@/lib/language-context"

interface NewResourceModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (resource: Omit<Resource, "id">) => void
  vaultId: string
  personas: any[]
  pipelines: any[]
  operations: any[]
}

export default function NewResourceModal({
  isOpen,
  onClose,
  onSubmit,
  vaultId,
  personas = [],
  pipelines = [],
  operations = [],
}: NewResourceModalProps) {
  const { t } = useLanguage()

  const [formData, setFormData] = useState({
    name: "",
    value: "",
    category: "",
    context: "",
    linkedOperations: [] as string[],
    linkedPipelines: [] as string[],
    linkedPersonas: [] as string[],
  })

  const [showLinkModal, setShowLinkModal] = useState(false)
  const [linkType, setLinkType] = useState<"operations" | "pipelines" | "personas">("operations")

  const handleLinkItems = (type: "operations" | "pipelines" | "personas") => {
    setLinkType(type)
    setShowLinkModal(true)
  }

  const handleLinkSelection = (selectedId: string) => {
    if (linkType === "operations") {
      if (!formData.linkedOperations.includes(selectedId)) {
        setFormData((prev) => ({
          ...prev,
          linkedOperations: [...prev.linkedOperations, selectedId],
        }))
      }
    } else if (linkType === "pipelines") {
      if (!formData.linkedPipelines.includes(selectedId)) {
        setFormData((prev) => ({
          ...prev,
          linkedPipelines: [...prev.linkedPipelines, selectedId],
        }))
      }
    } else if (linkType === "personas") {
      if (!formData.linkedPersonas.includes(selectedId)) {
        setFormData((prev) => ({
          ...prev,
          linkedPersonas: [...prev.linkedPersonas, selectedId],
        }))
      }
    }
    setShowLinkModal(false)
  }

  const handleRemoveLinkedItem = (id: string, type: "operations" | "pipelines" | "personas") => {
    if (type === "operations") {
      setFormData((prev) => ({
        ...prev,
        linkedOperations: prev.linkedOperations.filter((operationId) => operationId !== id),
      }))
    } else if (type === "pipelines") {
      setFormData((prev) => ({
        ...prev,
        linkedPipelines: prev.linkedPipelines.filter((pipelineId) => pipelineId !== id),
      }))
    } else if (type === "personas") {
      setFormData((prev) => ({
        ...prev,
        linkedPersonas: prev.linkedPersonas.filter((personaId) => personaId !== id),
      }))
    }
  }

  const getLinkedOperations = () => {
    return operations.filter((operation) => formData.linkedOperations.includes(operation.id))
  }

  const getLinkedPipelines = () => {
    return pipelines.filter((pipeline) => formData.linkedPipelines.includes(pipeline.id))
  }

  const getLinkedPersonas = () => {
    return personas.filter((persona) => formData.linkedPersonas.includes(persona.id))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newResource = {
      name: formData.name,
      value: formData.value,
      category: formData.category,
      context: formData.context,
      linkedOperations: formData.linkedOperations,
      linkedPipelines: formData.linkedPipelines,
      linkedPersonas: formData.linkedPersonas,
    }

    onSubmit(newResource)
    onClose()

    // Reset form
    setFormData({
      name: "",
      value: "",
      category: "",
      context: "",
      linkedOperations: [],
      linkedPipelines: [],
      linkedPersonas: [],
    })
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="relative w-full max-w-2xl bg-black/40 backdrop-blur-sm border border-white/10 overflow-hidden">
          <div className="absolute -top-0 -left-0 w-2 h-2 border-l-2 border-t-2 border-white/20"></div>
          <div className="absolute -top-0 -right-0 w-2 h-2 border-r-2 border-t-2 border-white/20"></div>
          <div className="absolute -bottom-0 -left-0 w-2 h-2 border-l-2 border-b-2 border-white/20"></div>
          <div className="absolute -bottom-0 -right-0 w-2 h-2 border-r-2 border-b-2 border-white/20"></div>

          {/* Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white/90">{t("newResource.title")}</h2>
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
            {/* Resource Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/90">{t("newResource.resourceName")}</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full bg-transparent border-0 border-b border-white/30 rounded-none px-0 py-3 text-white text-sm placeholder-white/50 focus:outline-none focus:border-white/60"
                placeholder={t("newResource.enterResourceName")}
                required
              />
            </div>

            {/* Value */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/90">{t("newResource.value")}</label>
              <input
                type="text"
                value={formData.value}
                onChange={(e) => setFormData((prev) => ({ ...prev, value: e.target.value }))}
                className="w-full bg-transparent border-0 border-b border-white/30 rounded-none px-0 py-3 text-white text-sm placeholder-white/50 focus:outline-none focus:border-white/60"
                placeholder={t("newResource.enterResourceValue")}
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/90">{t("newResource.category")}</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                className="w-full bg-transparent border-0 border-b border-white/30 rounded-none px-0 py-3 text-white text-sm placeholder-white/50 focus:outline-none focus:border-white/60"
                placeholder={t("newResource.enterResourceCategory")}
                required
              />
            </div>

            {/* Context Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/90">{t("newResource.contextField")}</label>
              <textarea
                value={formData.context}
                onChange={(e) => setFormData((prev) => ({ ...prev, context: e.target.value }))}
                rows={6}
                className="w-full bg-transparent border-0 border-b border-white/30 rounded-none px-0 py-3 text-white text-sm placeholder-white/50 focus:outline-none focus:border-white/60"
                placeholder={t("newResource.describeResourceContext")}
                required
              />
            </div>

            {/* Linked Operations */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-white/90">{t("newResource.linkedOperations")}</label>
                <button
                  type="button"
                  onClick={() => handleLinkItems("operations")}
                  className="text-white/60 hover:text-white/90 transition-colors duration-200"
                >
                  <Link className="w-3 h-3" />
                </button>
              </div>
              {formData.linkedOperations.length > 0 && (
                <div className="p-2 sm:p-3 bg-white/5 border border-white/10 space-y-1 sm:space-y-2">
                  {getLinkedOperations().map((operation) => (
                    <div
                      key={operation.id}
                      className="flex items-center gap-2 sm:gap-3 p-2 bg-white/5 border border-white/10"
                    >
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400"></div>
                      <span className="text-white/70 text-xs sm:text-sm flex-1">{operation.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveLinkedItem(operation.id, "operations")}
                        className="text-white/60 hover:text-white/90 transition-colors duration-200"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Linked Pipelines */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-white/90">{t("newResource.linkedPipelines")}</label>
                <button
                  type="button"
                  onClick={() => handleLinkItems("pipelines")}
                  className="text-white/60 hover:text-white/90 transition-colors duration-200"
                >
                  <Link className="w-3 h-3" />
                </button>
              </div>
              {formData.linkedPipelines.length > 0 && (
                <div className="p-2 sm:p-3 bg-white/5 border border-white/10 space-y-1 sm:space-y-2">
                  {getLinkedPipelines().map((pipeline) => (
                    <div
                      key={pipeline.id}
                      className="flex items-center gap-2 sm:gap-3 p-2 bg-white/5 border border-white/10"
                    >
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400"></div>
                      <span className="text-white/70 text-xs sm:text-sm flex-1">{pipeline.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveLinkedItem(pipeline.id, "pipelines")}
                        className="text-white/60 hover:text-white/90 transition-colors duration-200"
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
                <label className="block text-sm font-medium text-white/90">{t("newResource.linkedPersonas")}</label>
                <button
                  type="button"
                  onClick={() => handleLinkItems("personas")}
                  className="text-white/60 hover:text-white/90 transition-colors duration-200"
                >
                  <Link className="w-3 h-3" />
                </button>
              </div>
              {formData.linkedPersonas.length > 0 && (
                <div className="p-2 sm:p-3 bg-white/5 border border-white/10 space-y-1 sm:space-y-2">
                  {getLinkedPersonas().map((persona) => (
                    <div
                      key={persona.id}
                      className="flex items-center gap-2 sm:gap-3 p-2 bg-white/5 border border-white/10"
                    >
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-400"></div>
                      <span className="text-white/70 text-xs sm:text-sm flex-1">{persona.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveLinkedItem(persona.id, "personas")}
                        className="text-white/60 hover:text-white/90 transition-colors duration-200"
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
                className="flex-1 bg-white/5 border-white/20 text-white/80 hover:bg-white/10"
              >
                {t("newResource.cancel")}
              </Button>
              <Button type="submit" className="flex-1 bg-white/10 hover:bg-white/20 text-white border-white/20">
                {t("newResource.createResource")}
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
            <div className="relative w-full max-w-md bg-black/40 backdrop-blur-sm border border-white/10 overflow-hidden">
              <div className="absolute -top-0 -left-0 w-2 h-2 border-l-2 border-t-2 border-white/20"></div>
              <div className="absolute -top-0 -right-0 w-2 h-2 border-r-2 border-t-2 border-white/20"></div>
              <div className="absolute -bottom-0 -left-0 w-2 h-2 border-l-2 border-b-2 border-white/20"></div>
              <div className="absolute -bottom-0 -right-0 w-2 h-2 border-r-2 border-b-2 border-white/20"></div>

              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white/90">
                  {linkType === "operations"
                    ? t("resources.linkOperations")
                    : linkType === "pipelines"
                      ? t("resources.linkPipelines")
                      : t("resources.linkPersonas")}
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
                        </div>
                      ))
                    ) : (
                      <div className="p-3 bg-white/5 border border-white/10 text-center">
                        <p className="text-white/50 text-sm">{t("newResource.noOperationsAvailable")}</p>
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
                            {pipeline.steps} {t("newResource.steps")}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 bg-white/5 border border-white/10 text-center">
                        <p className="text-white/50 text-sm">{t("newResource.noPipelinesAvailable")}</p>
                      </div>
                    )}
                  </div>
                ) : (
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
                        <p className="text-white/50 text-sm">{t("newResource.noPersonasAvailable")}</p>
                      </div>
                    )}
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
