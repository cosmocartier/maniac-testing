"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X, Link } from "lucide-react"
import type { Persona } from "@/lib/personas-service"
import { useLanguage } from "@/lib/language-context"

interface NewPersonaModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (persona: Omit<Persona, "id" | "status">) => void
  vaultId: string
  personas: any[]
  pipelines: any[]
  operations: any[]
}

export default function NewPersonaModal({
  isOpen,
  onClose,
  onSubmit,
  vaultId,
  personas = [],
  pipelines = [],
  operations = [],
}: NewPersonaModalProps) {
  const { t } = useLanguage()

  const [formData, setFormData] = useState({
    name: "",
    context: "",
    linked_operations: [] as string[],
    linked_pipelines: [] as string[],
    linked_resources: [] as string[],
  })

  const [showLinkModal, setShowLinkModal] = useState(false)
  const [linkType, setLinkType] = useState<"operations" | "pipelines" | "resources">("operations")

  const handleLinkItems = (type: "operations" | "pipelines" | "resources") => {
    setLinkType(type)
    setShowLinkModal(true)
  }

  const handleLinkSelection = (selectedId: string) => {
    if (linkType === "operations") {
      if (!formData.linked_operations.includes(selectedId)) {
        setFormData((prev) => ({
          ...prev,
          linked_operations: [...prev.linked_operations, selectedId],
        }))
      }
    } else if (linkType === "pipelines") {
      if (!formData.linked_pipelines.includes(selectedId)) {
        setFormData((prev) => ({
          ...prev,
          linked_pipelines: [...prev.linked_pipelines, selectedId],
        }))
      }
    } else if (linkType === "resources") {
      if (!formData.linked_resources.includes(selectedId)) {
        setFormData((prev) => ({
          ...prev,
          linked_resources: [...prev.linked_resources, selectedId],
        }))
      }
    }
    setShowLinkModal(false)
  }

  const handleRemoveLinkedItem = (id: string, type: "operations" | "pipelines" | "resources") => {
    if (type === "operations") {
      setFormData((prev) => ({
        ...prev,
        linked_operations: prev.linked_operations.filter((operationId) => operationId !== id),
      }))
    } else if (type === "pipelines") {
      setFormData((prev) => ({
        ...prev,
        linked_pipelines: prev.linked_pipelines.filter((pipelineId) => pipelineId !== id),
      }))
    } else if (type === "resources") {
      setFormData((prev) => ({
        ...prev,
        linked_resources: prev.linked_resources.filter((resourceId) => resourceId !== id),
      }))
    }
  }

  const getLinkedOperations = () => {
    return operations.filter((operation) => formData.linked_operations.includes(operation.id))
  }

  const getLinkedPipelines = () => {
    return pipelines.filter((pipeline) => formData.linked_pipelines.includes(pipeline.id))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newPersona = {
      name: formData.name,
      context: formData.context,
      linked_operations: formData.linked_operations,
      linked_pipelines: formData.linked_pipelines,
      linked_resources: formData.linked_resources,
    }

    onSubmit(newPersona)
    onClose()

    // Reset form
    setFormData({
      name: "",
      context: "",
      linked_operations: [],
      linked_pipelines: [],
      linked_resources: [],
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
          {/* Corner Pointers */}
          <div className="absolute -top-0 -left-0 w-2 h-2 border-l-2 border-t-2 border-white/20"></div>
          <div className="absolute -top-0 -right-0 w-2 h-2 border-r-2 border-t-2 border-white/20"></div>
          <div className="absolute -bottom-0 -left-0 w-2 h-2 border-l-2 border-b-2 border-white/20"></div>
          <div className="absolute -bottom-0 -right-0 w-2 h-2 border-r-2 border-b-2 border-white/20"></div>

          {/* Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white/90">{t("newPersona.title")}</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white/60 hover:text-white/90 hover:bg-white/10 rounded-full"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
            {/* Persona Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/90">{t("newPersona.personaName")}</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full bg-transparent border-0 border-b border-white/30 rounded-none px-0 py-3 text-white text-sm placeholder-white/50 focus:outline-none focus:border-white/60"
                placeholder={t("newPersona.enterPersonaName")}
                required
              />
            </div>

            {/* Context Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/90">{t("newPersona.contextField")}</label>
              <textarea
                value={formData.context}
                onChange={(e) => setFormData((prev) => ({ ...prev, context: e.target.value }))}
                rows={6}
                className="w-full bg-transparent border-0 border-b border-white/30 rounded-none px-0 py-3 text-white text-sm placeholder-white/50 focus:outline-none focus:border-white/60"
                placeholder={t("newPersona.describePersona")}
                required
              />
            </div>

            {/* Linked Operations */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-white/90">{t("newPersona.linkedOperations")}</label>
                <button
                  type="button"
                  onClick={() => handleLinkItems("operations")}
                  className="text-white/60 hover:text-white/90 transition-colors duration-200"
                >
                  <Link className="w-3 h-3" />
                </button>
              </div>
              {formData.linked_operations.length > 0 && (
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
                <label className="block text-sm font-medium text-white/90">{t("newPersona.linkedPipelines")}</label>
                <button
                  type="button"
                  onClick={() => handleLinkItems("pipelines")}
                  className="text-white/60 hover:text-white/90 transition-colors duration-200"
                >
                  <Link className="w-3 h-3" />
                </button>
              </div>
              {formData.linked_pipelines.length > 0 && (
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

            {/* Linked Resources */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-white/90">{t("newPersona.linkedResources")}</label>
                <button
                  type="button"
                  onClick={() => handleLinkItems("resources")}
                  className="text-white/60 hover:text-white/90 transition-colors duration-200"
                >
                  <Link className="w-3 h-3" />
                </button>
              </div>
              {formData.linked_resources.length > 0 && (
                <div className="p-2 sm:p-3 bg-white/5 border border-white/10 space-y-1 sm:space-y-2">
                  {formData.linked_resources.map((resource, index) => (
                    <div
                      key={resource}
                      className="flex items-center gap-2 sm:gap-3 p-2 bg-white/5 border border-white/10"
                    >
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-orange-400"></div>
                      <span className="text-white/70 text-xs sm:text-sm flex-1">{resource}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveLinkedItem(resource, "resources")}
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
                {t("newPersona.cancel")}
              </Button>
              <Button type="submit" className="flex-1 bg-white/10 hover:bg-white/20 text-white border-white/20">
                {t("newPersona.createPersona")}
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
              {/* Corner Pointers */}
              <div className="absolute -top-0 -left-0 w-2 h-2 border-l-2 border-t-2 border-white/20"></div>
              <div className="absolute -top-0 -right-0 w-2 h-2 border-r-2 border-t-2 border-white/20"></div>
              <div className="absolute -bottom-0 -left-0 w-2 h-2 border-l-2 border-b-2 border-white/20"></div>
              <div className="absolute -bottom-0 -right-0 w-2 h-2 border-r-2 border-b-2 border-white/20"></div>

              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white/90">
                  {t("personas.linkOperations")}{" "}
                  {linkType === "operations"
                    ? t("newPersona.linkedOperations")
                    : linkType === "pipelines"
                      ? t("newPersona.linkedPipelines")
                      : t("newPersona.linkedResources")}
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
                        <p className="text-white/50 text-sm">{t("newPersona.noOperationsAvailable")}</p>
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
                            {pipeline.steps} {t("newPersona.steps")}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 bg-white/5 border border-white/10 text-center">
                        <p className="text-white/50 text-sm">{t("newPersona.noPipelinesAvailable")}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="p-3 bg-white/5 border border-white/10 text-center">
                      <p className="text-white/50 text-sm">{t("newPersona.resourcesAvailableSoon")}</p>
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
