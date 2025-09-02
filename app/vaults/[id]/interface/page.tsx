"use client"
import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState, useRef } from "react"
import { VaultsService, type VaultData } from "@/lib/vaults-service"
import AnimationBackground from "@/components/animation-background"
import ActiveOperations from "@/components/active-operations"
import Personas from "@/components/personas"
import Pipelines from "@/components/pipelines"
import NewOperationModal from "@/components/new-operation-modal"
import NewPersonaModal from "@/components/new-persona-modal"
import NewPipelineModal from "@/components/new-pipeline-modal"
import { Plus, ArrowLeft, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import NavigationDashboard from "@/components/navigation-dashboard"
import { OperationsService, type Operation } from "@/lib/operations-service"
import { PersonasService, type Persona } from "@/lib/personas-service"
import { PipelinesService, type Pipeline } from "@/lib/pipelines-service"
import Resources from "@/components/resources"
import NewResourceModal from "@/components/new-resource-modal"
import { ResourcesService, type Resource } from "@/lib/resources-service"
import Statistics from "@/components/statistics"
import Settings from "@/components/settings"
import { Input } from "@/components/ui/input"
import VaultInterfaceNavigation from "@/components/vault-interface-navigation"

const STORAGE_BUCKET = "vaults"

type VaultStoredFile = {
  name: string
  path: string
  signedUrl?: string
  size?: number | null
  updated_at?: string | null
}

export default function VaultInterfacePage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { t } = useLanguage()
  const vaultId = params.id as string

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const [vault, setVault] = useState<VaultData | null>(null)
  const [activeView, setActiveView] = useState<
    "operations" | "pipelines" | "personas" | "resources" | "statistics" | "settings"
  >("operations")
  const [showNewModal, setShowNewModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isLocked, setIsLocked] = useState(false)
  const [passwordInput, setPasswordInput] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [searchValue, setSearchValue] = useState("")
  const [operations, setOperations] = useState<Operation[]>([])
  const [personas, setPersonas] = useState<Persona[]>([])
  const [pipelines, setPipelines] = useState<Pipeline[]>([])
  const [resources, setResources] = useState<Resource[]>([])
  const [selectedOperation, setSelectedOperation] = useState<any>(null)
  const [selectedPersona, setSelectedPersona] = useState<any>(null)
  const [selectedPipeline, setSelectedPipeline] = useState<any>(null)
  const [selectedResource, setSelectedResource] = useState<any>(null)
  const [isHovered, setIsHovered] = useState(false)

  const filesUploadInputRef = useRef<HTMLInputElement>(null)
  const [vaultFiles, setVaultFiles] = useState<VaultStoredFile[]>([])
  const [filesLoading, setFilesLoading] = useState(false)
  const [filesError, setFilesError] = useState<string | null>(null)
  const [isUploadingFiles, setIsUploadingFiles] = useState(false)

  useEffect(() => {
    if (user && vaultId) {
      loadVault()
    }
  }, [user, vaultId])

  useEffect(() => {
    if (!isLocked && vault) {
      loadAllData()
    }
  }, [isLocked, vault])

  const loadVault = async () => {
    try {
      setIsLoading(true)
      const userVaults = await VaultsService.getUserVaults()
      const foundVault = userVaults.find((v) => v.id === vaultId)

      if (!foundVault) {
        router.push("/vaults")
        return
      }

      setVault(foundVault)

      setIsLocked(foundVault.is_password_protected || false)
    } catch (error) {
      console.error("Error loading vault:", error)
      router.push("/vaults")
    } finally {
      setIsLoading(false)
    }
  }

  const loadAllData = async () => {
    try {
      const [operationsData, personasData, pipelinesData, resourcesData] = await Promise.all([
        OperationsService.getVaultOperations(vaultId),
        PersonasService.getVaultPersonas(vaultId),
        PipelinesService.getVaultPipelines(vaultId),
        ResourcesService.getVaultResources(vaultId),
      ])
      setOperations(operationsData)
      setPersonas(personasData)
      setPipelines(pipelinesData)
      setResources(resourcesData)
    } catch (error) {
      console.error("Error loading data:", error)
    }
  }

  const handleNewItemClick = () => {
    setShowNewModal(true)
  }

  const handleNewOperation = async (newOperation: Operation) => {
    try {
      const createdOperation = await OperationsService.createOperation(newOperation, vaultId)
      setOperations((prev) => [createdOperation, ...prev])
      setShowNewModal(false)
    } catch (error) {
      console.error("Failed to create operation:", error)
    }
  }

  const handleNewPersona = async (newPersonaData: Omit<Persona, "id" | "status">) => {
    try {
      const personaToCreate: Persona = {
        ...newPersonaData,
        id: `persona-${Date.now()}`,
        status: "pending",
      }
      const createdPersona = await PersonasService.createPersona(personaToCreate, vaultId)
      setPersonas((prev) => [createdPersona, ...prev])
      setShowNewModal(false)
    } catch (error) {
      console.error("Failed to create persona:", error)
    }
  }

  const handleNewPipeline = async (newPipelineData: any) => {
    try {
      const pipeline: Pipeline = {
        id: "",
        name: newPipelineData.name,
        steps: newPipelineData.steps,
        isActive: false,
        attachedTo: {
          personas: newPipelineData.attachedTo?.personas || [],
          operations: newPipelineData.attachedTo?.operations || [],
          resources: newPipelineData.attachedTo?.resources || [],
        },
        stepData: {},
        status: "pending",
        createdAt: new Date().toISOString(),
      }
      const createdPipeline = await PipelinesService.createPipeline(pipeline, vaultId)
      setPipelines((prev) => [createdPipeline, ...prev])
      setShowNewModal(false)
    } catch (error) {
      console.error("Error creating pipeline:", error)
    }
  }

  const handleNewResource = async (newResourceData: Omit<Resource, "id">) => {
    try {
      const resourceToCreate: Resource = {
        ...newResourceData,
        id: `resource-${Date.now()}`,
      }
      const createdResource = await ResourcesService.createResource(resourceToCreate, vaultId)
      setResources((prev) => [createdResource, ...prev])
      setShowNewModal(false)
    } catch (error) {
      console.error("Failed to create resource:", error)
    }
  }

  const handleUpdateVault = async (name: string, description: string) => {
    if (!vault) return
    try {
      const updatedVault = await VaultsService.updateVault(vault.id, { name, description })
      setVault(updatedVault)
    } catch (error) {
      console.error("Failed to update vault:", error)
    }
  }

  const handleVaultDeletion = async () => {
    if (!vault) return
    try {
      await VaultsService.deleteVault(vault.id)
      router.push("/vaults")
    } catch (error) {
      console.error("Failed to delete vault:", error)
    }
  }

  const handleDownloadData = async (
    dataType: "all" | "operations" | "pipelines" | "personas" | "resources",
    format: "json" | "csv",
  ) => {
    console.log(`Downloading ${dataType} data in ${format} format for vault ${vaultId}`)
    alert(`Simulating download of ${dataType} data in ${format} format.`)
  }

  const handlePasswordSubmit = async () => {
    try {
      const isValid = await VaultsService.verifyVaultPassword(vaultId, passwordInput)
      if (isValid) {
        setIsLocked(false)
        setPasswordError("")
        setPasswordInput("")
      } else {
        setPasswordError("Incorrect password")
      }
    } catch (error) {
      console.error("Error validating password:", error)
      setPasswordError("Error validating password")
    }
  }

  const renderActiveComponent = () => {
    switch (activeView) {
      case "operations":
        return <ActiveOperations vaultId={vaultId} onOperationSelect={setSelectedOperation} searchValue={searchValue} />
      case "pipelines":
        return <Pipelines vaultId={vaultId} onPipelineSelect={setSelectedPipeline} searchValue={searchValue} />
      case "personas":
        return <Personas vaultId={vaultId} onPersonaSelect={setSelectedPersona} searchValue={searchValue} />
      case "resources":
        return <Resources vaultId={vaultId} onResourceSelect={setSelectedResource} searchValue={searchValue} />
      case "statistics":
        return <Statistics vaultId={vaultId} />
      case "settings":
        return vault ? (
          <Settings
            vaultId={vaultId}
            vaultName={vault.name}
            vaultDescription={vault.description || ""}
            vaultCreatedAt={vault.created_at}
            onUpdateVault={handleUpdateVault}
            onDeleteVault={handleVaultDeletion}
            onDownloadData={handleDownloadData}
          />
        ) : null
      default:
        return <ActiveOperations vaultId={vaultId} onOperationSelect={setSelectedOperation} searchValue={searchValue} />
    }
  }

  const renderNewModal = () => {
    if (!showNewModal) return null

    switch (activeView) {
      case "operations":
        return (
          <NewOperationModal
            isOpen={showNewModal}
            onClose={() => setShowNewModal(false)}
            onSubmit={handleNewOperation}
            vaultId={vaultId}
            personas={personas}
            pipelines={pipelines}
          />
        )
      case "personas":
        return (
          <NewPersonaModal
            isOpen={showNewModal}
            onClose={() => setShowNewModal(false)}
            onSubmit={handleNewPersona}
            vaultId={vaultId}
            personas={personas}
            pipelines={pipelines}
            operations={operations}
          />
        )
      case "pipelines":
        return (
          <NewPipelineModal
            isOpen={showNewModal}
            onClose={() => setShowNewModal(false)}
            onSubmit={handleNewPipeline}
            vaultId={vaultId}
            personas={personas}
            pipelines={pipelines}
            operations={operations}
          />
        )
      case "resources":
        return (
          <NewResourceModal
            isOpen={showNewModal}
            onClose={() => setShowNewModal(false)}
            onSubmit={handleNewResource}
            vaultId={vaultId}
            personas={personas}
            pipelines={pipelines}
            operations={operations}
          />
        )
      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white/50">{t("vaults.loading")}</div>
      </div>
    )
  }

  if (!vault) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white/50">{t("vaults.notFound")}</div>
      </div>
    )
  }

  if (isLocked) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-full max-w-md p-6 bg-black/40 backdrop-blur-sm border border-white/10">
          <div className="text-center mb-6">
            <Lock className="w-12 h-12 text-white/60 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">{vault.name}</h2>
            <p className="text-white/60 text-sm">{t("vaults.passwordProtected")}</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder={t("vaults.enterPassword")}
                className="bg-white/5 border-white/20 text-white placeholder-white/50 focus:border-white/40"
                onKeyPress={(e) => e.key === "Enter" && handlePasswordSubmit()}
              />
              {passwordError && <p className="text-red-400 text-sm">{passwordError}</p>}
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => router.push("/vaults")}
                variant="outline"
                className="flex-1 bg-white/5 border-white/20 text-white/80 hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t("vaults.back")}
              </Button>
              <Button
                onClick={handlePasswordSubmit}
                disabled={!passwordInput}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white border-white/20"
              >
                {t("vaults.unlock")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <NavigationDashboard mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

      <main className="pt-20 min-h-screen bg-black relative">
        <div className="absolute inset-0">
          <AnimationBackground />
        </div>

        <div className="h-full relative z-10">
          {/* Left navigation - sticky and full height */}
          <div className="hidden lg:block h-[calc(100vh-5rem)]">
            <div className="grid grid-cols-8 gap-[15px] p-2 h-full">
              {/* Left navigation - sticky and full height */}
              <div className="col-span-2 sticky top-20 h-[calc(100vh-5rem)] flex flex-col bg-black/20 backdrop-blur-sm border border-white/10 rounded-none">
                <VaultInterfaceNavigation
                  activeView={activeView}
                  onViewChange={setActiveView}
                  searchValue={searchValue}
                  onSearchChange={setSearchValue}
                />
              </div>

              {/* Right blocks - internally scrollable */}
              <div className="col-span-6 h-[calc(100vh-5rem)] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20">
                {renderActiveComponent()}
              </div>
            </div>
          </div>

          <div className="hidden md:block lg:hidden min-h-screen">
            <div className="grid grid-cols-2 gap-4 p-4 h-[calc(100vh-5rem)]">
              <div className="sticky top-20 h-[calc(100vh-5rem)]">
                <div className="h-full bg-black/20 backdrop-blur-sm border border-white/10 rounded-none">
                  <VaultInterfaceNavigation
                    activeView={activeView}
                    onViewChange={setActiveView}
                    searchValue={searchValue}
                    onSearchChange={setSearchValue}
                  />
                </div>
              </div>

              <div className="h-[calc(100vh-5rem)] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20">
                {renderActiveComponent()}
              </div>
            </div>
          </div>

          <div className="block md:hidden min-h-screen">
            <div className="flex flex-col gap-4 p-3 h-[calc(100vh-5rem)]">
              <div className="sticky top-20 h-64 bg-black/20 backdrop-blur-sm border border-white/10 rounded-none">
                <VaultInterfaceNavigation
                  activeView={activeView}
                  onViewChange={setActiveView}
                  searchValue={searchValue}
                  onSearchChange={setSearchValue}
                />
              </div>

              <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20">
                {renderActiveComponent()}
              </div>
            </div>
          </div>
        </div>

        {(activeView === "operations" ||
          activeView === "pipelines" ||
          activeView === "personas" ||
          activeView === "resources") && (
          <Button
            onClick={handleNewItemClick}
            className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/10 hover:border-white/20 transition-all duration-200 z-40 flex items-center justify-center"
          >
            <Plus className="w-6 h-6" />
          </Button>
        )}

        {renderNewModal()}
      </main>

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
