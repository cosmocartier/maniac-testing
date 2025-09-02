"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import DecryptedText from "@/components/decrypted-text"
import { Copy, Download, Trash2, Check } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

interface SettingsProps {
  vaultId: string
  vaultName: string
  vaultDescription: string
  vaultCreatedAt: string
  onUpdateVault: (name: string, description: string) => Promise<void>
  onDeleteVault: () => Promise<void>
  onDownloadData: (
    dataType: "all" | "operations" | "pipelines" | "personas" | "resources",
    format: "json" | "csv",
  ) => Promise<void>
}

export default function Settings({
  vaultId,
  vaultName,
  vaultDescription,
  vaultCreatedAt,
  onUpdateVault,
  onDeleteVault,
  onDownloadData,
}: SettingsProps) {
  const [editedName, setEditedName] = useState(vaultName)
  const [editedDescription, setEditedDescription] = useState(vaultDescription)
  const [isUpdating, setIsUpdating] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState<{ [key: string]: number }>({})
  const [copiedId, setCopiedId] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const { t } = useLanguage()

  const handleSaveChanges = async () => {
    if (editedName.trim() === "" || isUpdating) return

    setIsUpdating(true)
    try {
      await onUpdateVault(editedName.trim(), editedDescription.trim())
    } catch (error) {
      console.error("Failed to update vault:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeleteVault = async () => {
    setIsDeleting(true)
    try {
      await onDeleteVault()
    } catch (error) {
      console.error("Failed to delete vault:", error)
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(vaultId)
      setCopiedId(true)
      setTimeout(() => setCopiedId(false), 2000)
    } catch (error) {
      console.error("Failed to copy vault ID:", error)
    }
  }

  const handleDownload = async (
    dataType: "all" | "operations" | "pipelines" | "personas" | "resources",
    format: "json" | "csv",
  ) => {
    const key = `${dataType}-${format}`
    setDownloadProgress((prev) => ({ ...prev, [key]: 0 }))

    // Simulate progress
    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        const current = prev[key] || 0
        if (current >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setDownloadProgress((prev) => {
              const updated = { ...prev }
              delete updated[key]
              return updated
            })
          }, 1000)
          return prev
        }
        return { ...prev, [key]: current + 10 }
      })
    }, 200)

    try {
      await onDownloadData(dataType, format)
    } catch (error) {
      console.error("Failed to download data:", error)
      clearInterval(interval)
      setDownloadProgress((prev) => {
        const updated = { ...prev }
        delete updated[key]
        return updated
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    })
  }

  const hasChanges = editedName !== vaultName || editedDescription !== vaultDescription

  return (
    <div className="h-full flex flex-col bg-black/40 backdrop-blur-sm overflow-hidden">
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20 p-6 space-y-6">
        {/* General Information */}
        <Card className="bg-white/0 backdrop-blur-sm lg:border-l lg:border-l-white/ relative">
          {/* Corner pointers */}
          <div className="absolute -top-0 -left-0 w-2 h-2 border-l-2 border-t-2 border-white/20"></div>
          <div className="absolute -top-0 -right-0 w-2 h-2 border-r-2 border-t-2 border-white/20"></div>
          <div className="absolute -bottom-0 -left-0 w-2 h-2 border-l-2 border-b-2 border-white/20"></div>
          <div className="absolute -bottom-0 -right-0 w-2 h-2 border-r-2 border-b-2 border-white/20"></div>

          <CardHeader>
            <CardTitle className="text-white">
              <DecryptedText
                text={t("settings.generalInformation") as string}
                className="text-lg font-semibold text-white"
                encryptedClassName="text-lg font-semibold text-white/50"
                speed={0}
                sequential={true}
                maxIterations={0}
                animateOn="view"
              />
            </CardTitle>
            <CardDescription className="text-gray-400">{t("settings.generalDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Vault Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">{t("settings.vaultName")}</label>
              <Input
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-white/20"
                placeholder={t("settings.enterVaultName") as string}
              />
            </div>

            {/* Vault Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">{t("settings.description")}</label>
              <textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-white/20 transition-colors resize-none"
                rows={3}
                placeholder={t("settings.describeVault") as string}
              />
            </div>

            {/* Vault ID */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">{t("settings.vaultId")}</label>
              <div className="flex items-center gap-2">
                <Input
                  value={vaultId}
                  readOnly
                  className="bg-white/5 border-white/10 text-gray-300 cursor-not-allowed flex-1"
                />
                <Button
                  onClick={handleCopyId}
                  variant="outline"
                  size="icon"
                  className="bg-white/5 border-white/10 hover:bg-white/10 text-white"
                >
                  {copiedId ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {/* Creation Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">{t("settings.created")}</label>
              <div className="text-sm text-gray-400 bg-white/5 border border-white/10 rounded-md px-3 py-2">
                {formatDate(vaultCreatedAt)}
              </div>
            </div>

            {/* Save Changes Button */}
            <div className="pt-2">
              <Button
                onClick={handleSaveChanges}
                disabled={!hasChanges || isUpdating}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/10 hover:border-white/20 disabled:opacity-50"
              >
                {isUpdating ? (
                  <>
                    <div className="w-4 h-4 border border-white/30 border-t-white animate-spin rounded-full mr-2" />
                    {t("settings.saving")}
                  </>
                ) : (
                  t("settings.saveChanges")
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="bg-white/0 backdrop-blur-sm lg:border-l lg:border-l-white/ relative">
          {/* Corner pointers */}
          <div className="absolute -top-0 -left-0 w-2 h-2 border-l-2 border-t-2 border-white/20"></div>
          <div className="absolute -top-0 -right-0 w-2 h-2 border-r-2 border-t-2 border-white/20"></div>
          <div className="absolute -bottom-0 -left-0 w-2 h-2 border-l-2 border-b-2 border-white/20"></div>
          <div className="absolute -bottom-0 -right-0 w-2 h-2 border-r-2 border-b-2 border-white/20"></div>

          <CardHeader>
            <CardTitle className="text-white">
              <DecryptedText
                text={t("settings.dataManagement") as string}
                className="text-lg font-semibold text-white"
                encryptedClassName="text-lg font-semibold text-white/50"
                speed={30}
                sequential={true}
                maxIterations={8}
                animateOn="view"
              />
            </CardTitle>
            <CardDescription className="text-gray-400">{t("settings.dataDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Download All Data */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">{t("settings.completeVaultExport")}</label>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleDownload("all", "json")}
                  variant="outline"
                  className="bg-white/5 border-white/10 hover:bg-white/10 text-white flex-1"
                  disabled={downloadProgress["all-json"] !== undefined}
                >
                  <Download className="w-4 h-4 mr-2" />
                  {t("settings.downloadAllJson")}
                </Button>
                <Button
                  onClick={() => handleDownload("all", "csv")}
                  variant="outline"
                  className="bg-white/5 border-white/10 hover:bg-white/10 text-white flex-1"
                  disabled={downloadProgress["all-csv"] !== undefined}
                >
                  <Download className="w-4 h-4 mr-2" />
                  {t("settings.downloadAllCsv")}
                </Button>
              </div>
              {(downloadProgress["all-json"] !== undefined || downloadProgress["all-csv"] !== undefined) && (
                <Progress
                  value={downloadProgress["all-json"] || downloadProgress["all-csv"] || 0}
                  className="h-2 bg-white/10"
                />
              )}
            </div>

            {/* Granular Exports */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-300">{t("settings.individualDataTypes")}</label>

              {/* Operations */}
              <div className="space-y-2">
                <div className="text-xs text-gray-400">{t("settings.operations")}</div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleDownload("operations", "json")}
                    variant="outline"
                    size="sm"
                    className="bg-white/5 border-white/10 hover:bg-white/10 text-white text-xs"
                    disabled={downloadProgress["operations-json"] !== undefined}
                  >
                    {t("settings.json")}
                  </Button>
                  <Button
                    onClick={() => handleDownload("operations", "csv")}
                    variant="outline"
                    size="sm"
                    className="bg-white/5 border-white/10 hover:bg-white/10 text-white text-xs"
                    disabled={downloadProgress["operations-csv"] !== undefined}
                  >
                    {t("settings.csv")}
                  </Button>
                </div>
                {(downloadProgress["operations-json"] !== undefined ||
                  downloadProgress["operations-csv"] !== undefined) && (
                  <Progress
                    value={downloadProgress["operations-json"] || downloadProgress["operations-csv"] || 0}
                    className="h-1 bg-white/10"
                  />
                )}
              </div>

              {/* Pipelines */}
              <div className="space-y-2">
                <div className="text-xs text-gray-400">{t("settings.pipelines")}</div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleDownload("pipelines", "json")}
                    variant="outline"
                    size="sm"
                    className="bg-white/5 border-white/10 hover:bg-white/10 text-white text-xs"
                    disabled={downloadProgress["pipelines-json"] !== undefined}
                  >
                    {t("settings.json")}
                  </Button>
                  <Button
                    onClick={() => handleDownload("pipelines", "csv")}
                    variant="outline"
                    size="sm"
                    className="bg-white/5 border-white/10 hover:bg-white/10 text-white text-xs"
                    disabled={downloadProgress["pipelines-csv"] !== undefined}
                  >
                    {t("settings.csv")}
                  </Button>
                </div>
                {(downloadProgress["pipelines-json"] !== undefined ||
                  downloadProgress["pipelines-csv"] !== undefined) && (
                  <Progress
                    value={downloadProgress["pipelines-json"] || downloadProgress["pipelines-csv"] || 0}
                    className="h-1 bg-white/10"
                  />
                )}
              </div>

              {/* Personas */}
              <div className="space-y-2">
                <div className="text-xs text-gray-400">{t("settings.personas")}</div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleDownload("personas", "json")}
                    variant="outline"
                    size="sm"
                    className="bg-white/5 border-white/10 hover:bg-white/10 text-white text-xs"
                    disabled={downloadProgress["personas-json"] !== undefined}
                  >
                    {t("settings.json")}
                  </Button>
                  <Button
                    onClick={() => handleDownload("personas", "csv")}
                    variant="outline"
                    size="sm"
                    className="bg-white/5 border-white/10 hover:bg-white/10 text-white text-xs"
                    disabled={downloadProgress["personas-csv"] !== undefined}
                  >
                    {t("settings.csv")}
                  </Button>
                </div>
                {(downloadProgress["personas-json"] !== undefined ||
                  downloadProgress["personas-csv"] !== undefined) && (
                  <Progress
                    value={downloadProgress["personas-json"] || downloadProgress["personas-csv"] || 0}
                    className="h-1 bg-white/10"
                  />
                )}
              </div>

              {/* Resources */}
              <div className="space-y-2">
                <div className="text-xs text-gray-400">{t("settings.resources")}</div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleDownload("resources", "json")}
                    variant="outline"
                    size="sm"
                    className="bg-white/5 border-white/10 hover:bg-white/10 text-white text-xs"
                    disabled={downloadProgress["resources-json"] !== undefined}
                  >
                    {t("settings.json")}
                  </Button>
                  <Button
                    onClick={() => handleDownload("resources", "csv")}
                    variant="outline"
                    size="sm"
                    className="bg-white/5 border-white/10 hover:bg-white/10 text-white text-xs"
                    disabled={downloadProgress["resources-csv"] !== undefined}
                  >
                    {t("settings.csv")}
                  </Button>
                </div>
                {(downloadProgress["resources-json"] !== undefined ||
                  downloadProgress["resources-csv"] !== undefined) && (
                  <Progress
                    value={downloadProgress["resources-json"] || downloadProgress["resources-csv"] || 0}
                    className="h-1 bg-white/10"
                  />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="bg-white/0 backdrop-blur-sm lg:border-l lg:border-l-white/ relative">
          {/* Corner pointers */}
          <div className="absolute -top-0 -left-0 w-2 h-2 border-l-2 border-t-2 border-white/20"></div>
          <div className="absolute -top-0 -right-0 w-2 h-2 border-r-2 border-t-2 border-white/20"></div>
          <div className="absolute -bottom-0 -left-0 w-2 h-2 border-l-2 border-b-2 border-white/20"></div>
          <div className="absolute -bottom-0 -right-0 w-2 h-2 border-r-2 border-b-2 border-white/20"></div>

          <CardHeader>
            <CardTitle className="text-red-400">
              <DecryptedText
                text={t("settings.dangerZone") as string}
                className="text-lg font-semibold text-red-400"
                encryptedClassName="text-lg font-semibold text-red-500/50"
                speed={30}
                sequential={true}
                maxIterations={8}
                animateOn="view"
              />
            </CardTitle>
            <CardDescription className="text-red-300/70">{t("settings.dangerDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button
                onClick={() => setShowDeleteConfirm(true)}
                variant="destructive"
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {t("settings.deleteVault")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="bg-black/90 border-white/10 backdrop-blur-sm max-w-md w-full mx-4 relative">
            {/* Corner pointers */}
            <div className="absolute -top-0 -left-0 w-2 h-2 border-l-2 border-t-2 border-white/20"></div>
            <div className="absolute -top-0 -right-0 w-2 h-2 border-r-2 border-t-2 border-white/20"></div>
            <div className="absolute -bottom-0 -left-0 w-2 h-2 border-l-2 border-b-2 border-white/20"></div>
            <div className="absolute -bottom-0 -right-0 w-2 h-2 border-r-2 border-b-2 border-white/20"></div>

            <CardHeader>
              <CardTitle className="text-red-400">{t("settings.confirmDeletion")}</CardTitle>
              <CardDescription className="text-gray-400">{t("settings.confirmDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-sm text-red-300">
                  <strong>{t("settings.permanentlyDelete")}</strong>
                  <ul className="mt-2 space-y-1 text-xs">
                    <li>{t("settings.allOperations")}</li>
                    <li>{t("settings.allPipelines")}</li>
                    <li>{t("settings.allPersonas")}</li>
                    <li>{t("settings.allResources")}</li>
                    <li>{t("settings.vaultMetadata")}</li>
                  </ul>
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={() => setShowDeleteConfirm(false)}
                    variant="outline"
                    className="flex-1 bg-white/5 border-white/10 hover:bg-white/10 text-white"
                    disabled={isDeleting}
                  >
                    {t("settings.cancel")}
                  </Button>
                  <Button
                    onClick={handleDeleteVault}
                    variant="destructive"
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <>
                        <div className="w-4 h-4 border border-white/30 border-t-white animate-spin rounded-full mr-2" />
                        {t("settings.deleting")}
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4 mr-2" />
                        {t("settings.deleteForever")}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
