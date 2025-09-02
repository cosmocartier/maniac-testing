"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X, Link } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

interface NewPipelineModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (pipeline: any) => void
  vaultId: string
  personas: any[]
  pipelines: any[]
  operations: any[]
}

export default function NewPipelineModal({
  isOpen,
  onClose,
  onSubmit,
  vaultId,
  personas = [],
  pipelines = [],
  operations = [],
}: NewPipelineModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    steps: 3,
    attachedPersonas: [] as string[],
    attachedOperations: [] as string[],
    attachedResources: [] as string[],
  })

  const [showLinkModal, setShowLinkModal] = useState(false)
  const [linkType, setLinkType] = useState<"personas" | "operations" | "resources">("operations")

  const handleLinkItems = (type: "personas" | "operations" | "resources") => {
    setLinkType(type)
    setShowLinkModal(true)
  }

  const handleLinkSelection = (selectedId: string) => {
    if (linkType === "operations") {
      if (!formData.attachedOperations.includes(selectedId)) {
        setFormData((prev) => ({
          ...prev,
          attachedOperations: [...prev.attachedOperations, selectedId],
        }))
      }
    } else if (linkType === "personas") {
      if (!formData.attachedPersonas.includes(selectedId)) {
        setFormData((prev) => ({
          ...prev,
          attachedPersonas: [...prev.attachedPersonas, selectedId],
        }))
      }
    } else if (linkType === "resources") {
      if (!formData.attachedResources.includes(selectedId)) {
        setFormData((prev) => ({
          ...prev,
          attachedResources: [...prev.attachedResources, selectedId],
        }))
      }
    }
    setShowLinkModal(false)
  }

  const handleRemoveLinkedItem = (id: string, type: "personas" | "operations" | "resources") => {
    if (type === "operations") {
      setFormData((prev) => ({
        ...prev,
        attachedOperations: prev.attachedOperations.filter((operationId) => operationId !== id),
      }))
    } else if (type === "personas") {
      setFormData((prev) => ({
        ...prev,
        attachedPersonas: prev.attachedPersonas.filter((personaId) => personaId !== id),
      }))
    } else if (type === "resources") {
      setFormData((prev) => ({
        ...prev,
        attachedResources: prev.attachedResources.filter((resourceId) => resourceId !== id),
      }))
    }
  }

  const getLinkedOperations = () => {
    return operations.filter((operation) => formData.attachedOperations.includes(operation.id))
  }

  const getLinkedPersonas = () => {
    return personas.filter((persona) => formData.attachedPersonas.includes(persona.id))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newPipeline = {
      name: formData.name,
      steps: formData.steps,
      isActive: false,
      attachedTo: {
        personas: formData.attachedPersonas,
        operations: formData.attachedOperations,
        resources: formData.attachedResources,
      },
      stepData: {},
      status: "pending",
    }

    onSubmit(newPipeline)
    onClose()

    // Reset form
    setFormData({
      name: "",
      steps: 3,
      attachedPersonas: [],
      attachedOperations: [],
      attachedResources: [],
    })
  }

  const { t } = useLanguage()

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
            <h2 className="text-lg font-semibold text-white/90">{t("newPipeline.title")}</h2>
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
            {/* Pipeline Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/90">{t("newPipeline.pipelineName")}</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full bg-transparent border-0 border-b border-white/30 rounded-none px-0 py-3 text-white text-sm placeholder-white/50 focus:outline-none focus:border-white/60"
                placeholder={t("newPipeline.enterPipelineName")}
                required
              />
            </div>

            {/* Pipeline Steps */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/90">{t("newPipeline.numberOfSteps")}</label>
              <div className="grid grid-cols-4 gap-2">
                {[3, 4, 5, 6, 7, 8, 9, 10].map((stepCount) => (
                  <button
                    key={stepCount}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, steps: stepCount }))}
                    className={`h-10 px-3 border text-sm transition-all duration-0 ${
                      formData.steps === stepCount
                        ? "w-full bg-transparent border-0 border-b border-white/60 rounded-none px-0 py-3 text-white text-sm placeholder-white/50 focus:outline-none focus:border-white/60"
                        : "w-full bg-transparent border-0 border-b border-transparent rounded-none px-0 py-3 text-white text-sm placeholder-white/50 focus:outline-none focus:border-transparent"
                    }`}
                  >
                    {stepCount} {t("newPipeline.steps")}
                  </button>
                ))}
              </div>
            </div>

            {/* Linked Operations */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-white/90">{t("newPipeline.linkedOperations")}</label>
                <button
                  type="button"
                  onClick={() => handleLinkItems("operations")}
                  className="text-white/60 hover:text-white/90 transition-colors duration-200"
                >
                  <Link className="w-3 h-3" />
                </button>
              </div>
              {formData.attachedOperations.length > 0 && (
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

            {/* Linked Personas */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-white/90">{t("newPipeline.linkedPersonas")}</label>
                <button
                  type="button"
                  onClick={() => handleLinkItems("personas")}
                  className="text-white/60 hover:text-white/90 transition-colors duration-200"
                >
                  <Link className="w-3 h-3" />
                </button>
              </div>
              {formData.attachedPersonas.length > 0 && (
                <div className="p-2 sm:p-3 bg-white/5 border border-white/10 space-y-1 sm:space-y-2">
                  {getLinkedPersonas().map((persona) => (
                    <div
                      key={persona.id}
                      className="flex items-center gap-2 sm:gap-3 p-2 bg-white/5 border border-white/10"
                    >
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400"></div>
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

            {/* Linked Resources */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-white/90">{t("newPipeline.linkedResources")}</label>
                <button
                  type="button"
                  onClick={() => handleLinkItems("resources")}
                  className="text-white/60 hover:text-white/90 transition-colors duration-200"
                >
                  <Link className="w-3 h-3" />
                </button>
              </div>
              {formData.attachedResources.length > 0 && (
                <div className="p-2 sm:p-3 bg-white/5 border border-white/10 space-y-1 sm:space-y-2">
                  {formData.attachedResources.map((resource, index) => (
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
                {t("newPipeline.cancel")}
              </Button>
              <Button type="submit" className="flex-1 bg-white/10 hover:bg-white/20 text-white border-white/20">
                {t("newPipeline.createPipeline")}
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
                          <p className="text-xs text-white/70 mt-1">{persona.projected_identity}</p>
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
    </>
  )
}
