import { supabase, getAuthErrorMessage } from "./supabase"
import type { Database } from "./database.types"

export type OperationData = Database["public"]["Tables"]["operations"]["Row"]
export type CreateOperationData = Database["public"]["Tables"]["operations"]["Insert"]
export type UpdateOperationData = Database["public"]["Tables"]["operations"]["Update"]

// Transform database row to component interface
export interface Operation {
  id: string
  name: string
  objective: string
  status: "active" | "pending" | "completed" | "critical"
  missionTitle: string
  strategicObjective: string
  deadline: string
  priorityLevel: "low" | "medium" | "high" | "critical"
  category: string
  operationalTags: string[]
  linkedResources: string[]
  linkedPersonas?: string[]
  linkedPipelines?: string[]
}

export class OperationsService {
  // Transform database row to component interface
  static transformToOperation(row: OperationData): Operation {
    return {
      id: row.id,
      name: row.name,
      objective: row.objective,
      status: row.status,
      missionTitle: row.mission_title,
      strategicObjective: row.strategic_objective,
      deadline: row.deadline,
      priorityLevel: row.priority_level,
      category: row.category,
      operationalTags: row.operational_tags || [],
      linkedResources: row.linked_resources || [],
      linkedPersonas: row.linked_personas || [],
      linkedPipelines: row.linked_pipelines || [],
    }
  }

  // Transform component interface to database insert
  static transformToInsert(operation: Operation, vaultId: string): CreateOperationData {
    return {
      vault_id: vaultId,
      name: operation.name,
      objective: operation.objective,
      status: operation.status,
      mission_title: operation.missionTitle,
      strategic_objective: operation.strategicObjective,
      deadline: operation.deadline,
      priority_level: operation.priorityLevel,
      category: operation.category,
      operational_tags: operation.operationalTags,
      linked_resources: operation.linkedResources,
      linked_personas: operation.linkedPersonas || [],
      linked_pipelines: operation.linkedPipelines || [],
    }
  }

  // Get all operations for a specific vault (RLS will automatically filter by user)
  static async getVaultOperations(vaultId: string): Promise<Operation[]> {
    try {
      const { data, error } = await supabase
        .from("operations")
        .select("*")
        .eq("vault_id", vaultId)
        .order("created_at", { ascending: false })

      if (error) throw error
      return (data || []).map(this.transformToOperation)
    } catch (error: any) {
      console.error("Error fetching operations:", error)
      throw new Error(getAuthErrorMessage(error))
    }
  }

  // Create a new operation (RLS will automatically check vault ownership)
  static async createOperation(operation: Operation, vaultId: string): Promise<Operation> {
    try {
      const insertData = this.transformToInsert(operation, vaultId)
      const { data, error } = await supabase.from("operations").insert(insertData).select().single()

      if (error) throw error
      return this.transformToOperation(data)
    } catch (error: any) {
      console.error("Error creating operation:", error)
      throw new Error(getAuthErrorMessage(error))
    }
  }

  // Update an operation (RLS will automatically check ownership)
  static async updateOperation(operationId: string, updates: Partial<Operation>): Promise<Operation> {
    try {
      const updateData: UpdateOperationData = {}

      if (updates.name !== undefined) updateData.name = updates.name
      if (updates.objective !== undefined) updateData.objective = updates.objective
      if (updates.status !== undefined) updateData.status = updates.status
      if (updates.missionTitle !== undefined) updateData.mission_title = updates.missionTitle
      if (updates.strategicObjective !== undefined) updateData.strategic_objective = updates.strategicObjective
      if (updates.deadline !== undefined) updateData.deadline = updates.deadline
      if (updates.priorityLevel !== undefined) updateData.priority_level = updates.priorityLevel
      if (updates.category !== undefined) updateData.category = updates.category
      if (updates.operationalTags !== undefined) updateData.operational_tags = updates.operationalTags
      if (updates.linkedResources !== undefined) updateData.linked_resources = updates.linkedResources
      if (updates.linkedPersonas !== undefined) updateData.linked_personas = updates.linkedPersonas
      if (updates.linkedPipelines !== undefined) updateData.linked_pipelines = updates.linkedPipelines

      updateData.updated_at = new Date().toISOString()

      const { data, error } = await supabase
        .from("operations")
        .update(updateData)
        .eq("id", operationId)
        .select()
        .single()

      if (error) throw error
      return this.transformToOperation(data)
    } catch (error: any) {
      console.error("Error updating operation:", error)
      throw new Error(getAuthErrorMessage(error))
    }
  }

  // Delete an operation (RLS will automatically check ownership)
  static async deleteOperation(operationId: string): Promise<boolean> {
    try {
      const { error } = await supabase.from("operations").delete().eq("id", operationId)

      if (error) throw error
      return true
    } catch (error: any) {
      console.error("Error deleting operation:", error)
      throw new Error(getAuthErrorMessage(error))
    }
  }

  // Subscribe to real-time operation changes for a vault (RLS will filter automatically)
  static subscribeToOperationChanges(vaultId: string, onOperationChange: (payload: any) => void) {
    return supabase
      .channel("operation_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "operations",
          filter: `vault_id=eq.${vaultId}`,
        },
        onOperationChange,
      )
      .subscribe()
  }
}
