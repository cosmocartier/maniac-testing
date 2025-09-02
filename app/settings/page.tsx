"use client"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { UserAccountDropdown } from "@/components/user-account-dropdown"
import UnicornScene from "@/components/main-background"
import LoadingScreen from "@/components/loading-screen"
import { Menu, X, User, Shield, Bell, Eye, CreditCard, Key, Download, Trash2, Save, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import DecryptedText from "@/components/decrypted-text"
import { OptimizedImage } from "@/components/optimized-image"
import { LogoSkeleton } from "@/components/lazy-components"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { useLanguage } from "@/lib/language-context"

export default function Settings() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const { t } = useLanguage()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("profile")
  const [apiKeyCopied, setApiKeyCopied] = useState(false)
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: false,
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: false,
    profileVisibility: "private",
    dataSharing: false,
  })

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/signin")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        displayName: user.user_metadata?.display_name || "",
        email: user.email || "",
      }))
    }
  }, [user])

  if (isLoading) {
    return <LoadingScreen isLoading={true} />
  }

  if (!user) {
    return null
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSaveProfile = () => {
    // Implementation for saving profile changes
    console.log("Saving profile changes:", formData)
  }

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText("mk_live_1234567890abcdef")
    setApiKeyCopied(true)
    setTimeout(() => setApiKeyCopied(false), 2000)
  }

  const sections = [
    { id: "profile", label: t("accountSettings.sections.profile"), icon: User },
    { id: "security", label: t("accountSettings.sections.security"), icon: Shield },
    { id: "notifications", label: t("accountSettings.sections.notifications"), icon: Bell },
    { id: "privacy", label: t("accountSettings.sections.privacy"), icon: Eye },
    { id: "billing", label: t("accountSettings.sections.billing"), icon: CreditCard },
    { id: "api", label: t("accountSettings.sections.api"), icon: Key },
    { id: "data", label: t("accountSettings.sections.data"), icon: Download },
    { id: "danger", label: t("accountSettings.sections.danger"), icon: Trash2 },
  ]

  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">{t("accountSettings.profile.title")}</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t("accountSettings.profile.displayName")}
                  </label>
                  <Input
                    value={formData.displayName}
                    onChange={(e) => handleInputChange("displayName", e.target.value)}
                    className="bg-white/5 border-white/10 text-white"
                    placeholder={t("accountSettings.profile.displayNamePlaceholder") as string}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t("accountSettings.profile.emailAddress")}
                  </label>
                  <Input
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="bg-white/5 border-white/10 text-white"
                    placeholder={t("accountSettings.profile.emailPlaceholder") as string}
                    type="email"
                  />
                </div>
                <Button onClick={handleSaveProfile} className="bg-white/10 hover:bg-white/20 text-white">
                  <Save className="w-4 h-4 mr-2" />
                  {t("accountSettings.profile.saveChanges")}
                </Button>
              </div>
            </div>
          </div>
        )

      case "security":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">{t("accountSettings.security.title")}</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-white mb-3">
                    {t("accountSettings.security.changePassword")}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        {t("accountSettings.security.currentPassword")}
                      </label>
                      <Input
                        type="password"
                        value={formData.currentPassword}
                        onChange={(e) => handleInputChange("currentPassword", e.target.value)}
                        className="bg-white/5 border-white/10 text-white"
                        placeholder={t("accountSettings.security.currentPasswordPlaceholder") as string}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        {t("accountSettings.security.newPassword")}
                      </label>
                      <Input
                        type="password"
                        value={formData.newPassword}
                        onChange={(e) => handleInputChange("newPassword", e.target.value)}
                        className="bg-white/5 border-white/10 text-white"
                        placeholder={t("accountSettings.security.newPasswordPlaceholder") as string}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        {t("accountSettings.security.confirmPassword")}
                      </label>
                      <Input
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        className="bg-white/5 border-white/10 text-white"
                        placeholder={t("accountSettings.security.confirmPasswordPlaceholder") as string}
                      />
                    </div>
                  </div>
                </div>
                <div className="border-t border-white/10 pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-white">{t("accountSettings.security.twoFactor")}</h3>
                      <p className="text-sm text-gray-400">{t("accountSettings.security.twoFactorDescription")}</p>
                    </div>
                    <Switch
                      checked={formData.twoFactorEnabled}
                      onCheckedChange={(checked) => handleInputChange("twoFactorEnabled", checked)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case "notifications":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">{t("accountSettings.notifications.title")}</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3">
                  <div>
                    <h3 className="text-base font-medium text-white">{t("accountSettings.notifications.email")}</h3>
                    <p className="text-sm text-gray-400">{t("accountSettings.notifications.emailDescription")}</p>
                  </div>
                  <Switch
                    checked={formData.emailNotifications}
                    onCheckedChange={(checked) => handleInputChange("emailNotifications", checked)}
                  />
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <h3 className="text-base font-medium text-white">{t("accountSettings.notifications.push")}</h3>
                    <p className="text-sm text-gray-400">{t("accountSettings.notifications.pushDescription")}</p>
                  </div>
                  <Switch
                    checked={formData.pushNotifications}
                    onCheckedChange={(checked) => handleInputChange("pushNotifications", checked)}
                  />
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <h3 className="text-base font-medium text-white">{t("accountSettings.notifications.marketing")}</h3>
                    <p className="text-sm text-gray-400">{t("accountSettings.notifications.marketingDescription")}</p>
                  </div>
                  <Switch
                    checked={formData.marketingEmails}
                    onCheckedChange={(checked) => handleInputChange("marketingEmails", checked)}
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case "privacy":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">{t("accountSettings.privacy.title")}</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t("accountSettings.privacy.profileVisibility")}
                  </label>
                  <select
                    value={formData.profileVisibility}
                    onChange={(e) => handleInputChange("profileVisibility", e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="public">{t("accountSettings.privacy.public")}</option>
                    <option value="private">{t("accountSettings.privacy.private")}</option>
                    <option value="team">{t("accountSettings.privacy.teamOnly")}</option>
                  </select>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <h3 className="text-base font-medium text-white">{t("accountSettings.privacy.dataSharing")}</h3>
                    <p className="text-sm text-gray-400">{t("accountSettings.privacy.dataSharingDescription")}</p>
                  </div>
                  <Switch
                    checked={formData.dataSharing}
                    onCheckedChange={(checked) => handleInputChange("dataSharing", checked)}
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case "billing":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">{t("accountSettings.billing.title")}</h2>
              <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-white">{t("accountSettings.billing.currentPlan")}</h3>
                    <p className="text-sm text-gray-400">{t("accountSettings.billing.professionalPlan")}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">$29</p>
                    <p className="text-sm text-gray-400">{t("accountSettings.billing.perMonth")}</p>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-300">{t("accountSettings.billing.unlimitedVaults")}</p>
                  <p className="text-sm text-gray-300">{t("accountSettings.billing.advancedAI")}</p>
                  <p className="text-sm text-gray-300">{t("accountSettings.billing.prioritySupport")}</p>
                </div>
                <Button className="w-full bg-white/10 hover:bg-white/20 text-white">
                  {t("accountSettings.billing.manageSubscription")}
                </Button>
              </div>
            </div>
          </div>
        )

      case "api":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">{t("accountSettings.api.title")}</h2>
              <div className="space-y-4">
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-medium text-white">{t("accountSettings.api.productionKey")}</h3>
                    <Button
                      onClick={handleCopyApiKey}
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-white"
                    >
                      {apiKeyCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                  <p className="text-sm text-gray-400 font-mono">mk_live_••••••••••••••••</p>
                  <p className="text-xs text-gray-500 mt-2">{t("accountSettings.api.lastUsed")}</p>
                </div>
                <Button className="bg-white/10 hover:bg-white/20 text-white">
                  {t("accountSettings.api.generateNew")}
                </Button>
              </div>
            </div>
          </div>
        )

      case "data":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">{t("accountSettings.data.title")}</h2>
              <div className="space-y-4">
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <h3 className="text-base font-medium text-white mb-2">{t("accountSettings.data.exportTitle")}</h3>
                  <p className="text-sm text-gray-400 mb-4">{t("accountSettings.data.exportDescription")}</p>
                  <Button className="bg-white/10 hover:bg-white/20 text-white">
                    <Download className="w-4 h-4 mr-2" />
                    {t("accountSettings.data.exportButton")}
                  </Button>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <h3 className="text-base font-medium text-white mb-2">{t("accountSettings.data.importTitle")}</h3>
                  <p className="text-sm text-gray-400 mb-4">{t("accountSettings.data.importDescription")}</p>
                  <Button className="bg-white/10 hover:bg-white/20 text-white">
                    {t("accountSettings.data.chooseFile")}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )

      case "danger":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-red-400 mb-4">{t("accountSettings.danger.title")}</h2>
              <div className="space-y-4">
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <h3 className="text-base font-medium text-red-400 mb-2">
                    {t("accountSettings.danger.deleteAccount")}
                  </h3>
                  <p className="text-sm text-gray-400 mb-4">{t("accountSettings.danger.deleteDescription")}</p>
                  <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                    <Trash2 className="w-4 h-4 mr-2" />
                    {t("accountSettings.danger.deleteButton")}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-black text-white relative">
      <div className="fixed inset-0 z-0 opacity-30">
        <UnicornScene projectId="8gHd8X3xiGgvI1Eycn9g" width="100%" height="100%" className="w-full h-full" />
      </div>

      <header className="fixed top-0 z-50 w-full border-b border-white/0 bg-black/80 backdrop-blur-lg">
        <div className="container mx-auto px-8 lg:px-12">
          <div className="flex h-20 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Suspense fallback={<LogoSkeleton />}>
                  <OptimizedImage
                    src="/images/new-brand-logo.png"
                    alt="Mirror X"
                    width={140}
                    height={36}
                    className="h-9 w-auto object-contain cursor-pointer"
                    priority
                    quality={90}
                  />
                </Suspense>
              </Link>
            </div>

            <nav className="hidden lg:flex items-center gap-12">
              <div className="w-24 flex justify-center">
                <Link href="/vaults">
                  <DecryptedText
                    text={t("dashboard.nav.vaults") as string}
                    className="text-sm font-medium text-gray-300 transition-colors hover:text-white cursor-pointer tracking-caps"
                    encryptedClassName="text-sm font-medium text-gray-500 transition-colors tracking-caps"
                    speed={35}
                    sequential={true}
                    maxIterations={10}
                    animateOn="hover"
                  />
                </Link>
              </div>
              <div className="w-32 flex justify-center">
                <Link href="/cognition">
                  <DecryptedText
                    text={t("dashboard.nav.integrations") as string}
                    className="text-sm font-medium text-gray-300 transition-colors hover:text-white cursor-pointer tracking-caps"
                    encryptedClassName="text-sm font-medium text-gray-500 transition-colors tracking-caps"
                    speed={40}
                    sequential={true}
                    maxIterations={10}
                    animateOn="hover"
                  />
                </Link>
              </div>
              <div className="w-20 flex justify-center">
                <Link href="/agents">
                  <DecryptedText
                    text={t("dashboard.nav.agents") as string}
                    className="text-sm font-medium text-gray-300 transition-colors hover:text-white cursor-pointer tracking-caps"
                    encryptedClassName="text-sm font-medium text-gray-500 transition-colors tracking-caps"
                    speed={35}
                    sequential={true}
                    maxIterations={10}
                    animateOn="hover"
                  />
                </Link>
              </div>
              <div className="w-35 flex justify-center">
                <Link href="/precision-hub">
                  <DecryptedText
                    text={t("dashboard.nav.precisionHub") as string}
                    className="text-sm font-medium text-gray-300 transition-colors hover:text-white cursor-pointer tracking-caps"
                    encryptedClassName="text-sm font-medium text-gray-500 transition-colors tracking-caps"
                    speed={30}
                    sequential={true}
                    maxIterations={10}
                    animateOn="hover"
                  />
                </Link>
              </div>
            </nav>

            <div className="hidden lg:flex items-center gap-6">
              <UserAccountDropdown />
            </div>

            <div className="flex items-center gap-4 lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="hover:bg-transparent active:bg-transparent focus:bg-transparent lg:hover:bg-accent lg:hover:text-accent-foreground lg:active:bg-accent/90"
              >
                {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
                <span className="sr-only">Toggle menu</span>
              </Button>
            </div>
          </div>

          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="lg:hidden border-t border-white/10 py-6"
            >
              <div className="flex flex-col gap-6">
                <Link
                  href="/vaults"
                  className="py-3 text-sm font-medium text-gray-300 tracking-caps"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t("dashboard.nav.vaults")}
                </Link>
                <Link
                  href="/cognition"
                  className="py-3 text-sm font-medium text-gray-300 tracking-caps"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t("dashboard.nav.integrations")}
                </Link>
                <Link
                  href="/agents"
                  className="py-3 text-sm font-medium text-gray-300 tracking-caps"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t("dashboard.nav.agents")}
                </Link>
                <Link
                  href="/precision-hub"
                  className="py-3 text-sm font-medium text-gray-300 tracking-caps"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t("dashboard.nav.precisionHub")}
                </Link>
                <div className="flex flex-col gap-4 pt-4 border-t border-white/10">
                  <UserAccountDropdown />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </header>

      <main className="relative z-10 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-white mb-2">{t("accountSettings.title")}</h1>
            <p className="text-gray-400">{t("accountSettings.description")}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <nav className="space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-none text-left transition-colors ${
                        activeSection === section.id
                          ? "bg-white/10 text-white border-none"
                          : "text-gray-400 hover:text-white border-none hover:bg-white/5"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{section.label}</span>
                    </button>
                  )
                })}
              </nav>
            </div>

            <div className="lg:col-span-3">
              <div className="bg-white/5 border border-white/10 rounded-lg p-6">{renderContent()}</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
