import { supabase, getAuthErrorMessage } from "./supabase"
import type { Database } from "./database.types"

export type PipelineData = Database["public"]["Tables"]["pipelines"]["Row"]
export type CreatePipelineData = Database["public"]["Tables"]["pipelines"]["Insert"]
export type UpdatePipelineData = Database["public"]["Tables"]["pipelines"]["Update"]

// Transform database row to component interface
export interface Pipeline {
  id: string
  name: string
  steps: number
  isActive: boolean
  attachedTo: {
    personas: string[]
    operations: string[]
    resources: string[]
  }
  stepData: {
    [stepIndex: number]: {
      title: string
      description: string
      completed: boolean
    }
  }
  status: "active" | "pending" | "completed" | "critical"
  createdAt: string
}

export class PipelinesService {
  // Transform database row to component interface
  static transformToPipeline(row: PipelineData): Pipeline {
    return {
      id: row.id,
      name: row.name,
      steps: row.steps,
      isActive: row.is_active,
      attachedTo: {
        personas: row.attached_personas || [],
        operations: row.attached_operations || [],
        resources: row.attached_resources || [],
      },
      stepData: (row.step_data as any) || {},
      status: row.status,
      createdAt: row.created_at,
    }
  }

  // Transform component interface to database insert
  static transformToInsert(pipeline: Pipeline, vaultId: string): CreatePipelineData {
    return {
      vault_id: vaultId,
      name: pipeline.name,
      steps: pipeline.steps,
      is_active: pipeline.isActive,
      attached_personas: pipeline.attachedTo.personas,
      attached_operations: pipeline.attachedTo.operations,
      attached_resources: pipeline.attachedTo.resources,
      step_data: pipeline.stepData as any,
      status: pipeline.status,
    }
  }

  // Get all pipelines for a specific vault
  static async getVaultPipelines(vaultId: string): Promise<Pipeline[]> {
    try {
      const { data, error } = await supabase
        .from("pipelines")
        .select("*")
        .eq("vault_id", vaultId)
        .order("created_at", { ascending: false })

      if (error) throw error
      return (data || []).map(this.transformToPipeline)
    } catch (error: any) {
      console.error("Error fetching pipelines:", error)
      throw new Error(getAuthErrorMessage(error))
    }
  }

  // Create a new pipeline
  static async createPipeline(pipeline: Pipeline, vaultId: string): Promise<Pipeline> {
    try {
      const insertData = this.transformToInsert(pipeline, vaultId)
      const { data, error } = await supabase.from("pipelines").insert(insertData).select().single()

      if (error) throw error
      return this.transformToPipeline(data)
    } catch (error: any) {
      console.error("Error creating pipeline:", error)
      throw new Error(getAuthErrorMessage(error))
    }
  }

  // Update a pipeline
  static async updatePipeline(pipelineId: string, updates: Partial<Pipeline>): Promise<Pipeline> {
    try {
      const updateData: UpdatePipelineData = {}

      if (updates.name !== undefined) updateData.name = updates.name
      if (updates.steps !== undefined) updateData.steps = updates.steps
      if (updates.isActive !== undefined) updateData.is_active = updates.isActive
      if (updates.attachedTo !== undefined) {
        updateData.attached_personas = updates.attachedTo.personas
        updateData.attached_operations = updates.attachedTo.operations
        updateData.attached_resources = updates.attachedTo.resources
      }
      if (updates.stepData !== undefined) updateData.step_data = updates.stepData as any
      if (updates.status !== undefined) updateData.status = updates.status

      updateData.updated_at = new Date().toISOString()

      const { data, error } = await supabase.from("pipelines").update(updateData).eq("id", pipelineId).select().single()

      if (error) throw error
      return this.transformToPipeline(data)
    } catch (error: any) {
      console.error("Error updating pipeline:", error)
      throw new Error(getAuthErrorMessage(error))
    }
  }

  // Delete a pipeline
  static async deletePipeline(pipelineId: string): Promise<boolean> {
    try {
      const { error } = await supabase.from("pipelines").delete().eq("id", pipelineId)

      if (error) throw error
      return true
    } catch (error: any) {
      console.error("Error deleting pipeline:", error)
      throw new Error(getAuthErrorMessage(error))
    }
  }

  // Subscribe to real-time pipeline changes for a vault
  static subscribeToPipelineChanges(vaultId: string, onPipelineChange: (payload: any) => void) {
    return supabase
      .channel("pipeline_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "pipelines",
          filter: `vault_id=eq.${vaultId}`,
        },
        onPipelineChange,
      )
      .subscribe()
  }
}
