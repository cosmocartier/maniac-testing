import { supabase, getAuthErrorMessage } from "./supabase"
import type { Database } from "./database.types"

export type ResourceData = Database["public"]["Tables"]["resources"]["Row"]
export type CreateResourceData = Database["public"]["Tables"]["resources"]["Insert"]
export type UpdateResourceData = Database["public"]["Tables"]["resources"]["Update"]

// Transform database row to component interface
export interface Resource {
  id: string
  name: string
  value: string
  category: string
  context: string
  linkedOperations: string[]
  linkedPipelines: string[]
  linkedPersonas: string[]
}

export class ResourcesService {
  // Transform database row to component interface
  static transformToResource(row: ResourceData): Resource {
    return {
      id: row.id,
      name: row.name,
      value: row.value,
      category: row.category,
      context: row.context,
      linkedOperations: row.linked_operations || [],
      linkedPipelines: row.linked_pipelines || [],
      linkedPersonas: row.linked_personas || [],
    }
  }

  // Transform component interface to database insert
  static transformToInsert(resource: Resource, vaultId: string): CreateResourceData {
    return {
      vault_id: vaultId,
      name: resource.name,
      value: resource.value,
      category: resource.category,
      context: resource.context,
      linked_operations: resource.linkedOperations,
      linked_pipelines: resource.linkedPipelines,
      linked_personas: resource.linkedPersonas,
    }
  }

  // Get all resources for a specific vault
  static async getVaultResources(vaultId: string): Promise<Resource[]> {
    try {
      const { data, error } = await supabase
        .from("resources")
        .select("*")
        .eq("vault_id", vaultId)
        .order("created_at", { ascending: false })

      if (error) throw error
      return (data || []).map(this.transformToResource)
    } catch (error: any) {
      console.error("Error fetching resources:", error)
      throw new Error(getAuthErrorMessage(error))
    }
  }

  // Create a new resource
  static async createResource(resource: Resource, vaultId: string): Promise<Resource> {
    try {
      const insertData = this.transformToInsert(resource, vaultId)
      const { data, error } = await supabase.from("resources").insert(insertData).select().single()

      if (error) throw error
      return this.transformToResource(data)
    } catch (error: any) {
      console.error("Error creating resource:", error)
      throw new Error(getAuthErrorMessage(error))
    }
  }

  // Update a resource
  static async updateResource(resourceId: string, updates: Partial<Resource>): Promise<Resource> {
    try {
      const updateData: UpdateResourceData = {}

      if (updates.name !== undefined) updateData.name = updates.name
      if (updates.value !== undefined) updateData.value = updates.value
      if (updates.category !== undefined) updateData.category = updates.category
      if (updates.context !== undefined) updateData.context = updates.context
      if (updates.linkedOperations !== undefined) updateData.linked_operations = updates.linkedOperations
      if (updates.linkedPipelines !== undefined) updateData.linked_pipelines = updates.linkedPipelines
      if (updates.linkedPersonas !== undefined) updateData.linked_personas = updates.linkedPersonas

      updateData.updated_at = new Date().toISOString()

      const { data, error } = await supabase
        .from("resources")
        .update(updateData)
        .eq("id", resourceId)
        .select()
        .single()

      if (error) throw error
      return this.transformToResource(data)
    } catch (error: any) {
      console.error("Error updating resource:", error)
      throw new Error(getAuthErrorMessage(error))
    }
  }

  // Delete a resource
  static async deleteResource(resourceId: string): Promise<boolean> {
    try {
      const { error } = await supabase.from("resources").delete().eq("id", resourceId)

      if (error) throw error
      return true
    } catch (error: any) {
      console.error("Error deleting resource:", error)
      throw new Error(getAuthErrorMessage(error))
    }
  }

  // Subscribe to real-time resource changes for a vault
  static subscribeToResourceChanges(vaultId: string, onResourceChange: (payload: any) => void) {
    return supabase
      .channel("resource_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "resources",
          filter: `vault_id=eq.${vaultId}`,
        },
        onResourceChange,
      )
      .subscribe()
  }
}
