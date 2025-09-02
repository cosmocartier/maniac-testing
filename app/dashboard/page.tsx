"use client"

import type React from "react"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { NavigationDashboard } from "@/components/navigation-dashboard"
import UnicornScene from "@/components/main-background"
import LoadingScreen from "@/components/loading-screen"
import { ArrowUp, Paperclip, Mic } from "lucide-react"
import { UpgradeBadge } from "@/components/upgrade-badge"
import { useLanguage } from "@/lib/language-context"

export default function Dashboard() {
  const { user, isLoading } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()
  const [inputValue, setInputValue] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/signin")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      const scrollHeight = textareaRef.current.scrollHeight
      const maxHeight = 120 // Limit height to prevent excessive expansion
      textareaRef.current.style.height = Math.min(scrollHeight, maxHeight) + "px"
    }
  }, [inputValue])

  if (isLoading) {
    return <LoadingScreen isLoading={true} />
  }

  if (!user) {
    return null
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newFiles = Array.from(files)
      setUploadedFiles((prev) => [...prev, ...newFiles])
    }
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSendMessage = async () => {
    if ((!inputValue.trim() && uploadedFiles.length === 0) || !user) return

    // Clear input and files
    setInputValue("")
    setUploadedFiles([])

    // TODO: Add message handling logic here when AI integration is ready
    console.log("Message sent:", inputValue)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const hasText = inputValue.trim().length > 0

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Unicorn Background */}
      <div className="fixed inset-0 z-0 opacity-30">
        <UnicornScene projectId="8gHd8X3xiGgvI1Eycn9g" width="100%" height="100%" className="w-full h-full" />
      </div>

      <NavigationDashboard mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-40">
        <div className="relative overflow-hidden">
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 1, y: 0 }}
              exit={{
                y: -100,
                transition: { duration: 0.3, ease: "easeIn" },
              }}
              className="flex flex-col items-center justify-center min-h-[50vh]"
            >
              <h1 className="text-3xl md:text-4xl font-md mb-2 bg-gradient-to-r from-white-400 via-white to-zinc-400 bg-clip-text">
                {t("dashboard.welcome")}
              </h1>
              <p className="text-zinc-400 text-sm">{t("dashboard.agenda")}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Fixed Chat Input at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-40 p-4">
        <div className="w-full flex items-end justify-center px-4">
          <div className="flex-1 max-w-4xl">
            {/* File Upload Preview */}
            {uploadedFiles.length > 0 && (
              <div className="mb-2 p-3 bg-white/5 border border-white/10 rounded-full">
                <div className="flex flex-wrap gap-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1 text-xs">
                      <span className="text-zinc-300">{file.name}</span>
                      <button
                        onClick={() => removeFile(index)}
                        className="text-zinc-400 hover:text-white transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="relative flex items-center bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2">
              <button className="flex-shrink-0 p-2 hover:bg-white/10 rounded-full transition-colors mr-2">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Photoroom_20250730_51940%E2%80%AFPM-lcjFTlv0IlWm39qUJMAHiGNUkoxoX9.png"
                  alt="Lightning"
                  className="w-5 h-5 brightness-0 invert"
                />
              </button>

              {/* Auto-resizing textarea */}
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask anything"
                className="flex-1 bg-transparent border-none outline-none resize-none text-white placeholder-zinc-400 text-sm leading-6 min-h-[24px] max-h-[120px] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10"
                rows={1}
                style={{ height: "auto" }}
              />

              {/* Right side buttons */}
              <div className="flex items-center gap-1 ml-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="*/*"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  title="Attach file"
                >
                  <Paperclip className="w-5 h-5 text-white" />
                </button>
                <button className="p-2 hover:bg-white/10 rounded-full transition-colors" title="Voice input">
                  <Mic className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() && uploadedFiles.length === 0}
                  className={`p-2 transition-colors rounded-full ${
                    hasText ? "bg-white hover:bg-zinc-200" : "bg-zinc-600 hover:bg-zinc-500"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <ArrowUp className={`w-4 h-4 ${hasText ? "text-black" : "text-white"}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Upgrade Badge - Right aligned */}
          <div className="hidden lg:block absolute right-4">
            <UpgradeBadge />
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <style jsx global>{`
        .scrollbar-thin {
          scrollbar-width: thin;
        }
        
        .scrollbar-track-transparent {
          scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
        }
        
        .scrollbar-thumb-white\\/10 {
          scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
        }
        
        .hover\\:scrollbar-thumb-white\\/20:hover {
          scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
        }
        
        /* Webkit scrollbar styles */
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        
        .scrollbar-track-transparent::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .scrollbar-thumb-white\\/10::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
        }
        
        .hover\\:scrollbar-thumb-white\\/20:hover::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  )
}
