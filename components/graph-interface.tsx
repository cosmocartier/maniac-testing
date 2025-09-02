"use client"

import { useEffect, useRef, useState } from "react"
import * as d3 from "d3"
import { useAuth } from "@/lib/auth-context"
import { VaultsService, type VaultData } from "@/lib/vaults-service"
import { OperationsService, type Operation } from "@/lib/operations-service"
import { PersonasService, type Persona } from "@/lib/personas-service"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface GraphNode extends d3.SimulationNodeDatum {
  id: string
  name: string
  type: "user" | "vault" | "operation" | "persona"
  data?: VaultData | Operation | Persona
  vaultId?: string
  status?: string
}

interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: string | GraphNode
  target: string | GraphNode
}

export default function GraphInterface() {
  const { user } = useAuth()
  const svgRef = useRef<SVGSVGElement>(null)
  const [vaults, setVaults] = useState<VaultData[]>([])
  const [operations, setOperations] = useState<Operation[]>([])
  const [personas, setPersonas] = useState<Persona[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadData()
    }
  }, [user])

  const loadData = async () => {
    try {
      setIsLoading(true)

      // Load vaults
      const userVaults = await VaultsService.getUserVaults()
      setVaults(userVaults)

      // Load operations and personas for all vaults
      const allOperations: Operation[] = []
      const allPersonas: Persona[] = []

      for (const vault of userVaults) {
        try {
          const vaultOperations = await OperationsService.getVaultOperations(vault.id)
          const vaultPersonas = await PersonasService.getVaultPersonas(vault.id)

          allOperations.push(...vaultOperations)
          allPersonas.push(...vaultPersonas)
        } catch (error) {
          console.error(`Error loading data for vault ${vault.id}:`, error)
        }
      }

      setOperations(allOperations)
      setPersonas(allPersonas)
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!user || isLoading || !svgRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    const width = window.innerWidth
    const height = window.innerHeight - 80 // Account for header height

    // Create nodes: user as central node + vault nodes + operation nodes + persona nodes
    const nodes: GraphNode[] = [
      {
        id: "user",
        name: user.name || "User",
        type: "user",
        x: 0,
        y: 0,
      },
      // Vault nodes
      ...vaults.map((vault) => ({
        id: vault.id,
        name: vault.name,
        type: "vault" as const,
        data: vault,
      })),
      // Operation nodes
      ...operations.map((operation) => ({
        id: `op-${operation.id}`,
        name: operation.name,
        type: "operation" as const,
        data: operation,
        vaultId: (operation as any).vault_id || operations.find((op) => op.id === operation.id)?.id,
        status: operation.status,
      })),
      // Persona nodes
      ...personas.map((persona) => ({
        id: `persona-${persona.id}`,
        name: persona.name,
        type: "persona" as const,
        data: persona,
        vaultId: (persona as any).vault_id || personas.find((p) => p.id === persona.id)?.id,
        status: persona.status,
      })),
    ]

    // Create links: connect all vaults to user, operations to their vaults, personas to their vaults
    const links: GraphLink[] = [
      // User to vaults
      ...vaults.map((vault) => ({
        source: "user",
        target: vault.id,
      })),
      // Operations to vaults (find vault for each operation)
      ...operations
        .map((operation) => {
          // Find the vault this operation belongs to by checking which vault contains this operation
          const operationVault = vaults.find((vault) => {
            // This is a simplified approach - in a real scenario, you'd have the vault_id in the operation data
            return true // For now, we'll connect to the first vault or implement proper vault detection
          })
          return {
            source: operationVault?.id || vaults[0]?.id || "user",
            target: `op-${operation.id}`,
          }
        })
        .filter((link) => link.source),
      // Personas to vaults
      ...personas
        .map((persona) => {
          const personaVault = vaults.find((vault) => {
            return true // Similar to operations, implement proper vault detection
          })
          return {
            source: personaVault?.id || vaults[0]?.id || "user",
            target: `persona-${persona.id}`,
          }
        })
        .filter((link) => link.source),
    ]

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d: any) => d.id)
          .distance((d: any) => {
            // Different distances for different node types
            if (d.source.type === "user" && d.target.type === "vault") return 150
            if (d.source.type === "vault" && (d.target.type === "operation" || d.target.type === "persona")) return 100
            return 80
          })
          .strength(0.3),
      )
      .force(
        "charge",
        d3.forceManyBody().strength((d: any) => {
          // Different charges for different node types
          if (d.type === "user") return -800
          if (d.type === "vault") return -400
          return -200
        }),
      )
      .force("center", d3.forceCenter(0, 0))
      .force(
        "collision",
        d3.forceCollide().radius((d: any) => {
          if (d.type === "user") return 25
          if (d.type === "vault") return 20
          return 15
        }),
      )

    svg
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .attr("style", "max-width: 100%; height: auto;")

    // Add links
    const link = svg
      .append("g")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 1.5)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#666666") // Uniform gray for all links

    // Define base colors for each vault
    const vaultColors = [
      "#8b5cf6", // Purple
      "#06b6d4", // Cyan
      "#10b981", // Emerald
      "#f59e0b", // Amber
      "#ef4444", // Red
      "#3b82f6", // Blue
      "#8b5a2b", // Brown
      "#ec4899", // Pink
    ]

    const getVaultColor = (vaultIndex: number) => {
      return vaultColors[vaultIndex % vaultColors.length]
    }

    const lightenColor = (color: string, amount: number) => {
      // Convert hex to RGB, lighten, and convert back
      const hex = color.replace("#", "")
      const r = Number.parseInt(hex.substr(0, 2), 16)
      const g = Number.parseInt(hex.substr(2, 2), 16)
      const b = Number.parseInt(hex.substr(4, 2), 16)

      const newR = Math.min(255, Math.floor(r + (255 - r) * amount))
      const newG = Math.min(255, Math.floor(g + (255 - g) * amount))
      const newB = Math.min(255, Math.floor(b + (255 - b) * amount))

      return `rgb(${newR}, ${newG}, ${newB})`
    }

    // Add nodes
    const node = svg
      .append("g")
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", (d) => {
        if (d.type === "user") return 15
        if (d.type === "vault") return 12
        if (d.type === "operation") return 8
        if (d.type === "persona") return 8
        return 6
      })
      .attr("fill", (d) => {
        if (d.type === "user") return "#ffffff"
        if (d.type === "vault") return "#888888"

        if (d.type === "operation" || d.type === "persona") {
          // Find which vault this node belongs to
          const vaultIndex = vaults.findIndex((vault) => {
            // For now, distribute nodes evenly across vaults
            // In a real scenario, you'd use the actual vault_id from the node data
            const nodeIndex = nodes.findIndex((n) => n.id === d.id)
            const nodesPerVault = Math.ceil((operations.length + personas.length) / vaults.length)
            const expectedVaultIndex = Math.floor((nodeIndex - vaults.length - 1) / nodesPerVault)
            return expectedVaultIndex === vaults.indexOf(vault)
          })

          const baseColor = getVaultColor(vaultIndex >= 0 ? vaultIndex : 0)

          if (d.type === "operation") {
            return lightenColor(baseColor, 0.2) // Slightly lighter for operations
          } else {
            return lightenColor(baseColor, 0.4) // More lighter for personas
          }
        }

        return "#888888"
      })
      .attr("stroke", "#666666") // Uniform gray stroke for all nodes
      .attr("stroke-width", 2)
      .style("cursor", "pointer")
      .call(
        d3
          .drag<SVGCircleElement, GraphNode>()
          .on("start", (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart()
            d.fx = d.x
            d.fy = d.y
          })
          .on("drag", (event, d) => {
            d.fx = event.x
            d.fy = event.y
          })
          .on("end", (event, d) => {
            if (!event.active) simulation.alphaTarget(0)
            d.fx = null
            d.fy = null
          }),
      )

    // Add labels
    const labels = svg
      .append("g")
      .selectAll("text")
      .data(nodes)
      .join("text")
      .text((d) => {
        // Truncate long names
        if (d.name.length > 15) {
          return d.name.substring(0, 12) + "..."
        }
        return d.name
      })
      .attr("font-size", (d) => {
        if (d.type === "user") return 14
        if (d.type === "vault") return 12
        return 10
      })
      .attr("font-weight", (d) => (d.type === "user" ? "bold" : "normal"))
      .attr("fill", "#ffffff")
      .attr("text-anchor", "middle")
      .attr("dy", (d) => {
        if (d.type === "user") return -22
        if (d.type === "vault") return -18
        return -14
      })
      .style("pointer-events", "none")

    // Add type labels for operations and personas
    const typeLabels = svg
      .append("g")
      .selectAll("text.type-label")
      .data(nodes.filter((d) => d.type === "operation" || d.type === "persona"))
      .join("text")
      .attr("class", "type-label")
      .text((d) => (d.type === "operation" ? "OP" : "P"))
      .attr("font-size", 8)
      .attr("font-weight", "bold")
      .attr("fill", "#ffffff")
      .attr("text-anchor", "middle")
      .attr("dy", 3)
      .style("pointer-events", "none")

    // Add hover effects
    node
      .on("mouseover", function (event, d) {
        d3.select(this).attr("stroke-width", 3)

        // Show tooltip
        const tooltip = svg.append("g").attr("class", "tooltip").attr("transform", `translate(${d.x}, ${d.y})`)

        const rect = tooltip
          .append("rect")
          .attr("x", -50)
          .attr("y", -30)
          .attr("width", 100)
          .attr("height", 20)
          .attr("fill", "rgba(0, 0, 0, 0.8)")
          .attr("rx", 4)

        tooltip
          .append("text")
          .attr("text-anchor", "middle")
          .attr("dy", -15)
          .attr("fill", "white")
          .attr("font-size", 10)
          .text(d.type.toUpperCase())
      })
      .on("mouseout", function (event, d) {
        d3.select(this).attr("stroke-width", 2)
        svg.selectAll(".tooltip").remove()
      })

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y)

      node.attr("cx", (d) => d.x!).attr("cy", (d) => d.y!)

      labels.attr("x", (d) => d.x!).attr("y", (d) => d.y!)

      typeLabels.attr("x", (d) => d.x!).attr("y", (d) => d.y!)
    })

    return () => {
      simulation.stop()
    }
  }, [user, vaults, operations, personas, isLoading])

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-white tracking-enhanced">LOADING...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex flex-col relative">
      {/* Header Navigation */}
      <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-lg">
        <div className="container mx-auto px-8 lg:px-12">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-4">
              <img
                src="/images/mirror-x-logo-dark.png"
                alt="Mirror X"
                className="h-9 w-auto object-contain"
                style={{
                  maxWidth: "140px",
                }}
              />
            </Link>

            {/* Right Side Actions */}
            <div className="flex items-center gap-6">
              <Link href="/vaults">
                <Button variant="ghost" className="text-sm font-medium text-gray-300 hover:text-white tracking-caps">
                  BACK TO VAULTS
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Panel */}
      <div className="fixed top-24 right-4 z-40 bg-black/80 backdrop-blur-lg border border-white/10 rounded-lg p-4">
        <h3 className="text-white text-sm font-semibold mb-3">Statistics</h3>
        <div className="space-y-2 text-xs text-gray-300">
          <div>Vaults: {vaults.length}</div>
          <div>Operations: {operations.length}</div>
          <div>Personas: {personas.length}</div>
          <div>Active Operations: {operations.filter((op) => op.status === "active").length}</div>
          <div>Critical Operations: {operations.filter((op) => op.status === "critical").length}</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center pt-20 relative z-10">
        <div className="w-full h-full">
          {isLoading ? (
            <div className="text-center">
              <p className="text-gray-400">Loading graph...</p>
            </div>
          ) : (
            <div className="w-full h-full">
              <svg ref={svgRef} className="w-full h-full bg-black" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
