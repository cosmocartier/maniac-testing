import { supabase, getAuthErrorMessage } from "./supabase"
import type { Database } from "./database.types"

export type PersonaData = Database["public"]["Tables"]["personas"]["Row"]
export type CreatePersonaData = Database["public"]["Tables"]["personas"]["Insert"]
export type UpdatePersonaData = Database["public"]["Tables"]["personas"]["Update"]

// Transform database row to component interface
export interface Persona {
  id: string
  name: string
  context: string
  status: "active" | "pending" | "completed" | "critical"
  linked_operations: string[]
  linked_pipelines: string[]
  linked_resources: string[]
}

export class PersonasService {
  // Transform database row to component interface
  static transformToPersona(row: PersonaData): Persona {
    return {
      id: row.id,
      name: row.name,
      context: row.context || "",
      status: row.status,
      linked_operations: row.linked_operations || [],
      linked_pipelines: row.linked_pipelines || [],
      linked_resources: row.linked_resources || [],
    }
  }

  // Transform component interface to database insert
  static transformToInsert(persona: Persona, vaultId: string): CreatePersonaData {
    return {
      vault_id: vaultId,
      name: persona.name,
      context: persona.context,
      status: persona.status,
      linked_operations: persona.linked_operations,
      linked_pipelines: persona.linked_pipelines,
      linked_resources: persona.linked_resources,
    }
  }

  // Get all personas for a specific vault (RLS will automatically filter by user)
  static async getVaultPersonas(vaultId: string): Promise<Persona[]> {
    try {
      const { data, error } = await supabase
        .from("personas")
        .select("*")
        .eq("vault_id", vaultId)
        .order("created_at", { ascending: false })

      if (error) throw error
      return (data || []).map(this.transformToPersona)
    } catch (error: any) {
      console.error("Error fetching personas:", error)
      throw new Error(getAuthErrorMessage(error))
    }
  }

  // Create a new persona (RLS will automatically check vault ownership)
  static async createPersona(persona: Persona, vaultId: string): Promise<Persona> {
    try {
      const insertData = this.transformToInsert(persona, vaultId)
      const { data, error } = await supabase.from("personas").insert(insertData).select().single()

      if (error) throw error
      return this.transformToPersona(data)
    } catch (error: any) {
      console.error("Error creating persona:", error)
      throw new Error(getAuthErrorMessage(error))
    }
  }

  // Update a persona (RLS will automatically check ownership)
  static async updatePersona(personaId: string, updates: Partial<Persona>): Promise<Persona> {
    try {
      const updateData: UpdatePersonaData = {}

      if (updates.name !== undefined) updateData.name = updates.name
      if (updates.context !== undefined) updateData.context = updates.context
      if (updates.status !== undefined) updateData.status = updates.status
      if (updates.linked_operations !== undefined) updateData.linked_operations = updates.linked_operations
      if (updates.linked_pipelines !== undefined) updateData.linked_pipelines = updates.linked_pipelines
      if (updates.linked_resources !== undefined) updateData.linked_resources = updates.linked_resources

      updateData.updated_at = new Date().toISOString()

      const { data, error } = await supabase.from("personas").update(updateData).eq("id", personaId).select().single()

      if (error) throw error
      return this.transformToPersona(data)
    } catch (error: any) {
      console.error("Error updating persona:", error)
      throw new Error(getAuthErrorMessage(error))
    }
  }

  // Delete a persona (RLS will automatically check ownership)
  static async deletePersona(personaId: string): Promise<boolean> {
    try {
      const { error } = await supabase.from("personas").delete().eq("id", personaId)

      if (error) throw error
      return true
    } catch (error: any) {
      console.error("Error deleting persona:", error)
      throw new Error(getAuthErrorMessage(error))
    }
  }

  // Subscribe to real-time persona changes for a vault (RLS will filter automatically)
  static subscribeToPersonaChanges(vaultId: string, onPersonaChange: (payload: any) => void) {
    return supabase
      .channel("persona_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "personas",
          filter: `vault_id=eq.${vaultId}`,
        },
        onPersonaChange,
      )
      .subscribe()
  }
}
