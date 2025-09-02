"use client"

import type React from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import NavigationDashboard from "@/components/navigation-dashboard"
import UnicornScene from "@/components/main-background"
import LoadingScreen from "@/components/loading-screen"
import { Plus, Shield, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { VaultsService, type VaultData } from "@/lib/vaults-service"
import { OperationsService } from "@/lib/operations-service"
import { OptimizedImage } from "@/components/optimized-image"
import { useLanguage } from "@/lib/language-context"

interface NewVaultModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { name: string }) => void
  isLoading: boolean
}

interface VaultCounts {
  operations: number
}

function NewVaultModal({ isOpen, onClose, onSubmit, isLoading }: NewVaultModalProps) {
  const [name, setName] = useState("")
  const { t } = useLanguage()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    onSubmit({
      name: name.trim(),
    })
  }

  const handleClose = () => {
    setName("")
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative bg-black/20 border border-white/10 backdrop-blur-md p-8 w-full max-w-md mx-4">
        <div className="absolute -top-0 -left-0 w-2 h-2 border-l-2 border-t-2 border-white/20"></div>
        <div className="absolute -top-0 -right-0 w-2 h-2 border-r-2 border-t-2 border-white/20"></div>
        <div className="absolute -bottom-0 -left-0 w-2 h-2 border-l-2 border-b-2 border-white/20"></div>
        <div className="absolute -bottom-0 -right-0 w-2 h-2 border-r-2 border-b-2 border-white/20"></div>

        <h2 className="text-xl font-bold mb-6 text-white">{t("vaults.createNew")}</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">{t("vaults.vaultName")}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-transparent border-0 border-b border-white/30 rounded-none px-0 py-3 text-white text-sm placeholder-white/50 focus:outline-none focus:border-white/60"
              placeholder={t("vaults.enterName")}
              required
            />
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              onClick={handleClose}
              variant="outline"
              className="flex-1 bg-transparent border-white/20 text-white hover:bg-white/0"
              disabled={isLoading}
            >
              {t("vaults.cancel")}
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-white text-black hover:bg-gray-200"
              disabled={isLoading || !name.trim()}
            >
              {isLoading ? t("vaults.creating") : t("vaults.createNew")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function VaultsPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const { t } = useLanguage()
  const [vaults, setVaults] = useState<VaultData[]>([])
  const [vaultCounts, setVaultCounts] = useState<Record<string, VaultCounts>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [hoveredPerformance, setHoveredPerformance] = useState<{ vaultId: string; x: number; y: number } | null>(null)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/signin")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      loadVaults()
    }
  }, [user])

  const loadVaults = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const userVaults = await VaultsService.getUserVaults()
      setVaults(userVaults)

      // Load counts for each vault
      const counts: Record<string, VaultCounts> = {}
      for (const vault of userVaults) {
        try {
          const operations = await OperationsService.getVaultOperations(vault.id)

          counts[vault.id] = {
            operations: operations.length,
          }
        } catch (error) {
          console.error(`Error loading counts for vault ${vault.id}:`, error)
          counts[vault.id] = { operations: 0 }
        }
      }
      setVaultCounts(counts)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateVault = async (data: { name: string }) => {
    try {
      setIsCreating(true)
      await VaultsService.createVault(data)
      setIsModalOpen(false)
      await loadVaults()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsCreating(false)
    }
  }

  const handleVaultClick = (vaultId: string) => {
    router.push(`/vaults/${vaultId}/interface`)
  }

  const handlePerformanceHover = (vaultId: string, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const containerRect = event.currentTarget.closest(".relative")?.getBoundingClientRect()

    if (containerRect) {
      setHoveredPerformance({
        vaultId,
        x: rect.left - containerRect.left + rect.width / 2,
        y: rect.top - containerRect.top - 10,
      })
    }
  }

  const handlePerformanceLeave = () => {
    setHoveredPerformance(null)
  }

  const handleDropdownToggle = (vaultId: string, event: React.MouseEvent) => {
    event.stopPropagation()
    const newState = openDropdown === vaultId ? null : vaultId
    setOpenDropdown(newState)
  }

  const handleDropdownAction = (action: string, vaultId: string) => {
    console.log(`${action} for vault ${vaultId}`)
    setOpenDropdown(null)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setOpenDropdown(null)
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  if (authLoading) {
    return <LoadingScreen isLoading={true} />
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Unicorn Background */}
      <div className="fixed inset-0 z-0 opacity-30">
        <UnicornScene projectId="8gHd8X3xiGgvI1Eycn9g" width="100%" height="100%" className="w-full h-full" />
      </div>

      {/* Navigation Dashboard */}
      <NavigationDashboard mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        <div className="py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl mb-2 text-white">{t("vaults.title")}</h1>
              <p className="text-gray-400 text-sm">{t("vaults.subtitle")}</p>
            </div>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/10 hover:border-white/20 transition-all duration-200 z-40 flex items-center justify-center"
            >
              <Plus className="w-6 h-6" />
            </Button>
          </div>

          {/* Error Message */}
          {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400">{error}</div>}

          {/* Loading State */}
          {isLoading ? (
            <div className="flex justify-start">
              <div className="w-6 h-6 border-2 border-white/30 border-t-white animate-spin rounded-full" />
            </div>
          ) : vaults.length === 0 ? (
            /* Empty State */
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-white/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Shield className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-300 mb-2">{t("vaults.noVaults")}</h3>
              <p className="text-gray-400 mb-6">{t("vaults.noVaultsDescription")}</p>
              <Button onClick={() => setIsModalOpen(true)} className="bg-white text-black hover:bg-gray-200">
                {t("vaults.createFirst")}
              </Button>
            </div>
          ) : (
            /* Vaults Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vaults.map((vault) => (
                <div
                  key={vault.id}
                  className="bg-black/20 backdrop-blur-md border border-white/10 rounded-none p-6 cursor-pointer transition-all duration-200 group relative animate-in fade-in slide-in-from-bottom-4"
                  style={{ animationDuration: "200ms" }}
                  onClick={() => handleVaultClick(vault.id)}
                >
                  <div className="absolute -top-0 -left-0 w-2 h-2 border-l-2 border-t-2 border-white/20"></div>
                  <div className="absolute -top-0 -right-0 w-2 h-2 border-r-2 border-t-2 border-white/20"></div>
                  <div className="absolute -bottom-0 -left-0 w-2 h-2 border-l-2 border-b-2 border-white/20"></div>
                  <div className="absolute -bottom-0 -right-0 w-2 h-2 border-r-2 border-b-2 border-white/20"></div>

                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-medium text-white group-hover:text-gray-100">{vault.name}</h3>

                    <div className="flex items-center gap-2">
                      {/* Performance Icon */}
                      <div
                        className="w-9 h-9 cursor-pointer opacity-60 hover:opacity-100 transition-opacity"
                        onMouseEnter={(e) => handlePerformanceHover(vault.id, e)}
                        onMouseLeave={handlePerformanceLeave}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <OptimizedImage
                          src="/images/performance-icon.png"
                          alt="Performance"
                          width={32}
                          height={32}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      {/* Three Dots Menu */}
                      <div className="relative">
                        <button
                          className="w-6 h-6 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity"
                          onClick={(e) => handleDropdownToggle(vault.id, e)}
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>

                        {/* Dropdown Menu */}
                        {openDropdown === vault.id && (
                          <div className="absolute right-0 top-full mt-1 bg-black/90 backdrop-blur-sm border border-white/30 rounded-none py-2 min-w-[160px] z-[100] shadow-xl">
                            <button
                              className="w-full px-4 py-2 text-left text-sm text-white hover:bg-white/20 transition-colors"
                              onClick={() => handleDropdownAction("Add Favourite", vault.id)}
                            >
                              Add Favourite
                            </button>
                            <button
                              className="w-full px-4 py-2 text-left text-sm text-white hover:bg-white/20 transition-colors"
                              onClick={() => handleDropdownAction("View Logs", vault.id)}
                            >
                              View Logs
                            </button>
                            <button
                              className="w-full px-4 py-2 text-left text-sm text-white hover:bg-white/20 transition-colors"
                              onClick={() => handleDropdownAction("Manage Vault", vault.id)}
                            >
                              Manage Vault
                            </button>
                            <button
                              className="w-full px-4 py-2 text-left text-sm text-white hover:bg-white/20 transition-colors"
                              onClick={() => handleDropdownAction("Settings", vault.id)}
                            >
                              Settings
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="bg-white/20 rounded-full px-2 py-1 text-white font-light inline-block">
                      {t("vaults.operations")} {vaultCounts[vault.id]?.operations || 0}
                    </div>
                  </div>

                  {/* Performance Tooltip */}
                  {hoveredPerformance && hoveredPerformance.vaultId === vault.id && (
                    <div
                      className="absolute z-200 bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white shadow-lg pointer-events-none"
                      style={{
                        left: hoveredPerformance.x,
                        top: hoveredPerformance.y,
                        transform: "translateX(-50%) translateY(-100%)",
                      }}
                    >
                      <div className="whitespace-nowrap">{t("vaults.performanceTooltip")}</div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white/20" />
                    </div>
                  )}

                  <div className="flex items-center justify-end mt-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      <span className="text-white text-xs">{t("vaults.allSystemsNormal")}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* New Vault Modal */}
      <NewVaultModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateVault}
        isLoading={isCreating}
      />
    </div>
  )
}
