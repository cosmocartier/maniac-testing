"use client"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/lib/language-context"

interface VaultInterfaceNavigationProps {
  activeView: "operations" | "pipelines" | "personas" | "resources" | "statistics" | "settings"
  onViewChange: (view: "operations" | "pipelines" | "personas" | "resources" | "statistics" | "settings") => void
  searchValue: string
  onSearchChange: (value: string) => void
}

export default function VaultInterfaceNavigation({
  activeView,
  onViewChange,
  searchValue,
  onSearchChange,
}: VaultInterfaceNavigationProps) {
  const { t } = useLanguage()

  return (
    <div className="flex flex-col w-full h-full">
      {/* Search at top */}
      <div className="p-4 border-b border-white/10">
        <div className="relative">
          <Input
            type="text"
            placeholder={t("dashboard.search")}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-black/30 border border-white/10 rounded-none text-white placeholder-white/30 focus:border-white/30 focus:bg-black/30 transition-all duration-200 pr-10"
          />
          <Search
            className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
            style={{ color: "#F3F3F3" }}
          />
        </div>
      </div>

      {/* Navigation buttons stacked vertically */}
      <div className="flex flex-col p-2 space-y-1">
        <button
          className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors rounded-lg ${
            activeView === "resources" ? "text-white bg-white/10" : "text-white/70 hover:text-white rounded-none hover:bg-white/5"
          }`}
          onClick={() => onViewChange("resources")}
        >
          {t("dashboard.overview")}
        </button>
        <button
          className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors rounded-none ${
            activeView === "operations" ? "text-white bg-white/10" : "text-white/70 hover:text-white rounded-none hover:bg-white/5"
          }`}
          onClick={() => onViewChange("operations")}
        >
          {t("dashboard.operations")}
        </button>
        <button
          className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors rounded-none ${
            activeView === "pipelines" ? "text-white bg-white/10" : "text-white/70 hover:text-white rounded-none hover:bg-white/5"
          }`}
          onClick={() => onViewChange("pipelines")}
        >
          {t("dashboard.pipelines")}
        </button>
        <button
          className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors rounded-none ${
            activeView === "personas" ? "text-white bg-white/10" : "text-white/70 hover:text-white rounded-none hover:bg-white/5"
          }`}
          onClick={() => onViewChange("personas")}
        >
          {t("dashboard.personas")}
        </button>
        <button
          className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors rounded-none ${
            activeView === "resources" ? "text-white bg-white/10" : "text-white/70 hover:text-white rounded-none hover:bg-white/5"
          }`}
          onClick={() => onViewChange("resources")}
        >
          {t("dashboard.resources")}
        </button>
        <button
          className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors rounded-none ${
            activeView === "statistics" ? "text-white bg-white/10" : "text-white/70 hover:text-white rounded-none hover:bg-white/5"
          }`}
          onClick={() => onViewChange("statistics")}
        >
          {t("dashboard.statistics")}
        </button>
        <button
          className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors rounded-none ${
            activeView === "settings" ? "text-white bg-white/10" : "text-white/70 hover:text-white rounded-none hover:bg-white/5"
          }`}
          onClick={() => onViewChange("settings")}
        >
          {t("dashboard.settings")}
        </button>
      </div>
    </div>
  )
}
