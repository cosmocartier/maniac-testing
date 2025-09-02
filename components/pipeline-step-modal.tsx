"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

interface Pipeline {
  id: string
  name: string
  steps: number
  stepData: {
    [stepIndex: number]: {
      title: string
      description: string
      completed: boolean
    }
  }
}

interface PipelineStepModalProps {
  isOpen: boolean
  onClose: () => void
  pipeline: Pipeline
  stepIndex: number
  onStepUpdate: (stepIndex: number, stepData: any) => void
}

export default function PipelineStepModal({
  isOpen,
  onClose,
  pipeline,
  stepIndex,
  onStepUpdate,
}: PipelineStepModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    completed: false,
  })

  const { t } = useLanguage()

  useEffect(() => {
    if (pipeline.stepData[stepIndex]) {
      setFormData(pipeline.stepData[stepIndex])
    } else {
      setFormData({
        title: `Step ${stepIndex + 1}`,
        description: "",
        completed: false,
      })
    }
  }, [pipeline, stepIndex])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onStepUpdate(stepIndex, formData)
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="w-full max-w-lg bg-black/40 backdrop-blur-sm border border-white/10 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white/90">
              {t("pipelineStepModal.editStep")} {stepIndex + 1} - {pipeline.name}
            </h2>
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
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            {/* Step Title */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/90">{t("pipelineStepModal.stepTitle")}</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                className="w-full h-10 px-3 bg-white/5 border border-white/10 text-white/90 text-sm focus:border-white/20 focus:outline-none transition-all duration-200"
                placeholder={t("pipelineStepModal.enterStepTitle")}
                required
              />
            </div>

            {/* Step Description */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/90">
                {t("pipelineStepModal.stepDescription")}
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 text-white/90 text-sm focus:border-white/20 focus:outline-none transition-all duration-200 resize-none"
                placeholder={t("pipelineStepModal.describeStep")}
              />
            </div>

            {/* Completion Status */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/90">{t("pipelineStepModal.status")}</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, completed: false }))}
                  className={`flex-1 h-10 px-3 border text-sm transition-all duration-200 ${
                    !formData.completed
                      ? "bg-white/20 border-white/30 text-white/90"
                      : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                  }`}
                >
                  {t("pipelineStepModal.inProgress")}
                </button>
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, completed: true }))}
                  className={`flex-1 h-10 px-3 border text-sm transition-all duration-200 ${
                    formData.completed
                      ? "bg-green-500/20 border-green-500/30 text-green-400"
                      : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                  }`}
                >
                  {t("pipelineStepModal.completed")}
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-white/10">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 bg-white/5 border-white/20 text-white/80 hover:bg-white/10"
              >
                {t("pipelineStepModal.cancel")}
              </Button>
              <Button type="submit" className="flex-1 bg-white/10 hover:bg-white/20 text-white border-white/20">
                {t("pipelineStepModal.saveStep")}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
