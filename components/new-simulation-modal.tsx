"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X, Sparkles } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

interface NewSimulationModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (simulation: any) => void
  vaultId: string
}

export default function NewSimulationModal({ isOpen, onClose, onSubmit, vaultId }: NewSimulationModalProps) {
  const { t } = useLanguage()

  const [formData, setFormData] = useState({
    temperature: 1000,
    simulationsAmount: 1,
    duration: "",
    objective: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newSimulation = {
      id: `sim-${Date.now()}`,
      temperature: formData.temperature,
      simulationsAmount: formData.simulationsAmount,
      duration: formData.duration,
      objective: formData.objective,
      status: "pending" as const,
      createdAt: new Date().toISOString(),
      vaultId,
    }

    onSubmit(newSimulation)
    onClose()

    // Reset form
    setFormData({
      temperature: 1000,
      simulationsAmount: 1,
      duration: "",
      objective: "",
    })
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
            <h2 className="text-lg font-semibold text-white/90">New Simulation</h2>
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
            {/* Temperature Slider */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/90">Temperature</label>
              <div className="space-y-3">
                <input
                  type="range"
                  min="0"
                  max="50000"
                  step="100"
                  value={formData.temperature}
                  onChange={(e) => setFormData((prev) => ({ ...prev, temperature: Number.parseInt(e.target.value) }))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-white/60">
                  <span>0</span>
                  <span className="text-white/90 font-medium">{formData.temperature.toLocaleString()}</span>
                  <span>50,000</span>
                </div>
              </div>
            </div>

            {/* Simulations Amount and Duration Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Simulations Amount */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/90">Simulations Amount</label>
                <input
                  type="number"
                  min="1"
                  value={formData.simulationsAmount}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, simulationsAmount: Number.parseInt(e.target.value) || 1 }))
                  }
                  className="w-full bg-transparent border-0 border-b border-white/30 rounded-none px-0 py-3 text-white text-sm placeholder-white/50 focus:outline-none focus:border-white/60"
                  placeholder="Enter amount"
                  required
                />
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/90">Duration</label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData((prev) => ({ ...prev, duration: e.target.value }))}
                  className="w-full bg-transparent border-0 border-b border-white/30 rounded-none px-0 py-3 text-white text-sm placeholder-white/50 focus:outline-none focus:border-white/60"
                  placeholder="e.g., 30 minutes"
                  required
                />
              </div>
            </div>

            {/* Objective */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/90">Objective</label>
              <div className="relative">
                <textarea
                  value={formData.objective}
                  onChange={(e) => setFormData((prev) => ({ ...prev, objective: e.target.value }))}
                  rows={3}
                  className="w-full bg-transparent border-0 border-b border-white/30 rounded-none px-0 py-3 text-white text-sm placeholder-white/50 focus:outline-none focus:border-white/60"
                  placeholder="Describe the simulation objective..."
                  required
                />
                <div className="absolute right-2 top-2 p-2 text-white/40 cursor-not-allowed" title="AI Enhancement">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-white/10">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 w-full bg-transparent border-0 border-b border-white/30 rounded-none px-0 py-3 text-white text-sm placeholder-white/50 focus:outline-none focus:border-white/60"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 w-full bg-transparent border-0 border-b border-white/30 rounded-none px-0 py-3 text-white text-sm placeholder-white/50 focus:outline-none focus:border-white/60"
              >
                Run Simulation
              </Button>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.9);
          cursor: pointer;
          border: 2px solid rgba(255, 255, 255, 0.3);
        }

        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.9);
          cursor: pointer;
          border: 2px solid rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </>
  )
}
