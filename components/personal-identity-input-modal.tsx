"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface ConsciousnessField {
  id: string
  title: string
  description: string
  status: "active" | "pending" | "completed" | "critical"
  priority: "low" | "medium" | "high" | "critical"
  tags: string[]
  createdAt: string
  hasInput?: boolean
  inputValue?: string
}

interface PersonalIdentityInputModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (fieldId: string, inputValue: string) => void
  field: ConsciousnessField
}

export default function PersonalIdentityInputModal({
  isOpen,
  onClose,
  onSubmit,
  field,
}: PersonalIdentityInputModalProps) {
  const [inputValue, setInputValue] = useState("")

  useEffect(() => {
    if (field?.inputValue) {
      setInputValue(field.inputValue)
    } else {
      setInputValue("")
    }
  }, [field])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      onSubmit(field.id, inputValue.trim())
      onClose()
    }
  }

  const getInputType = (fieldId: string) => {
    switch (fieldId) {
      case "date-of-birth":
        return "date"
      case "age":
      case "iq-score":
        return "number"
      case "social-security-number":
      case "driver-license-number":
      case "passport-details":
        return "password"
      default:
        return "text"
    }
  }

  const getPlaceholder = (fieldId: string, title: string) => {
    switch (fieldId) {
      case "name":
        return "Enter your full legal name"
      case "preferred-name":
        return "Enter your preferred name"
      case "gender":
        return "Enter your gender identity"
      case "biological-sex":
        return "Enter biological sex"
      case "age":
        return "Enter your age"
      case "date-of-birth":
        return "Select your date of birth"
      case "place-of-birth":
        return "Enter city, state/province, country"
      case "nationality":
        return "Enter your nationality"
      case "ethnicity":
        return "Enter your ethnicity"
      case "race":
        return "Enter your race"
      case "cultural-background":
        return "Describe your cultural background"
      case "religious-beliefs":
        return "Enter your religious beliefs"
      case "spiritual-practices":
        return "Describe your spiritual practices"
      case "political-affiliation":
        return "Enter political party affiliation"
      case "political-views":
        return "Describe your political views"
      case "citizenship":
        return "Enter citizenship details"
      case "passport-details":
        return "Enter passport number and details"
      case "social-security-number":
        return "Enter SSN or national ID"
      case "driver-license-number":
        return "Enter driver's license number"
      default:
        return `Enter ${title.toLowerCase()}`
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="w-full max-w-2xl bg-black/40 backdrop-blur-sm border border-white/10 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white/90">
              {field.hasInput ? "Edit" : "Create"} Input: {field.title}
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
            {/* Field Description */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/90">Description</label>
              <div className="p-3 bg-white/5 border border-white/10">
                <p className="text-white/70 text-sm leading-relaxed">{field.description}</p>
              </div>
            </div>

            {/* Input Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/90">Input Value</label>
              {field.id === "cultural-background" ||
              field.id === "religious-beliefs" ||
              field.id === "spiritual-practices" ||
              field.id === "political-views" ? (
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={getPlaceholder(field.id, field.title)}
                  className="w-full h-32 px-3 py-2 bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:border-white/30 resize-none"
                  required
                />
              ) : (
                <input
                  type={getInputType(field.id)}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={getPlaceholder(field.id, field.title)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:border-white/30"
                  required
                />
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                className="text-white/60 hover:text-white/90 hover:bg-white/10 border-white/20"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                disabled={!inputValue.trim()}
              >
                {field.hasInput ? "Update" : "Create"} Input
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
