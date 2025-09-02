"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Settings, LogOut, ChevronDown, Globe, CreditCard, FileText, MessageSquare, DollarSign } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"

export function UserAccountDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, signOut } = useAuth()
  const { t, language, setLanguage } = useLanguage()

  if (!user) return null

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 h-10 px-4 transition-none focus:outline-none group"
      >
        <div className="hidden sm:block">
          <span className="font-medium text-gray-300">{user.name}</span>
        </div>
        <div className="sm:hidden">
          <span className="font-medium text-gray-300">{user.name}</span>
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform text-white ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute right-0 top-full mt-3 w-72 bg-black/95 backdrop-blur-xl border border-white/10 shadow-2xl z-50 overflow-hidden"
            >
              <div className="p-6 border-b border-white/10 bg-black">
                <div className="flex items-center">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white text-lg truncate">{user.name}</p>
                    <p className="text-sm text-zinc-400 truncate">{user.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm font-bold text-gray-200 py-1 uppercase bg-white-20 rounded-full">
                        {user.plan} {t("dashboard.plan")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3">
                <Link href="/settings" onClick={() => setIsOpen(false)}>
                  <div className="flex items-center gap-3 px-1 py-2 transition-none cursor-pointer">
                    <Settings className="w-3 h-3 text-gray-400" />
                    <span className="text-sm font-medium text-white">{t("dashboard.accountSettings")}</span>
                  </div>
                </Link>

                <Link href="/pricing" onClick={() => setIsOpen(false)}>
                  <div className="flex items-center gap-3 px-1 py-2 transition-none cursor-pointer">
                    <CreditCard className="w-3 h-3 text-gray-400" />
                    <span className="text-sm font-medium text-white">{t("dashboard.pricing")}</span>
                  </div>
                </Link>

                <Link href="/documentation" onClick={() => setIsOpen(false)}>
                  <div className="flex items-center gap-3 px-1 py-2 transition-none cursor-pointer">
                    <FileText className="w-3 h-3 text-gray-400" />
                    <span className="text-sm font-medium text-white">{t("dashboard.documentation")}</span>
                  </div>
                </Link>

                <Link href="/feedback" onClick={() => setIsOpen(false)}>
                  <div className="flex items-center gap-3 px-1 py-2 transition-none cursor-pointer">
                    <MessageSquare className="w-3 h-3 text-gray-400" />
                    <span className="text-sm font-medium text-white">{t("dashboard.feedback")}</span>
                  </div>
                </Link>

                <Link href="/credits" onClick={() => setIsOpen(false)}>
                  <div className="flex items-center gap-3 px-1 py-2 transition-none cursor-pointer">
                    <DollarSign className="w-3 h-3 text-gray-400" />
                    <span className="text-sm font-medium text-white">{t("dashboard.creditBalance")}</span>
                    <span className="text-sm text-gray-400 pr-2 ml-auto">213.45</span>
                  </div>
                </Link>

                <div className="flex items-center gap-3 px-1 py-2">
                  <Globe className="w-3 h-3 text-gray-400" />
                  <span className="text-sm font-medium text-white mr-auto">{t("dashboard.language")}</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setLanguage("en")}
                      className={`text-sm px-2 py-1 rounded transition-colors hover:bg-white/20 ${
                        language === "en" ? "text-white" : "text-gray-400"
                      }`}
                    >
                      EN
                    </button>
                    <button
                      onClick={() => setLanguage("de")}
                      className={`text-sm px-2 py-1 rounded transition-colors hover:bg-white/20 ${
                        language === "de" ? "text-white" : "text-gray-400"
                      }`}
                    >
                      DE
                    </button>
                  </div>
                </div>

                <div className="border-t border-white/10 my-3" />

                <button
                  onClick={() => {
                    signOut()
                    setIsOpen(false)
                  }}
                  className="w-full flex items-center gap-3 px-1 py-2 transition-none text-red-400"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="text-sm font-medium">{t("dashboard.signOut")}</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
