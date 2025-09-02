import { supabase, getAuthErrorMessage } from "./supabase"
import type { Database } from "./database.types"

export type VaultData = Database["public"]["Tables"]["vaults"]["Row"]
export type CreateVaultData = {
  name: string
}

export class VaultsService {
  // Get all vaults for the current user
  static async getUserVaults(): Promise<VaultData[]> {
    try {
      const { data, error } = await supabase.from("vaults").select("*").order("created_at", { ascending: false })

      if (error) throw error
      return data || []
    } catch (error: any) {
      console.error("Error fetching vaults:", error)
      throw new Error(getAuthErrorMessage(error))
    }
  }

  // Create a new vault
  static async createVault(vaultData: CreateVaultData): Promise<string> {
    try {
      const { data, error } = await supabase.rpc("create_vault", {
        p_name: vaultData.name,
      })

      if (error) throw error
      return data
    } catch (error: any) {
      console.error("Error creating vault:", error)
      throw new Error(getAuthErrorMessage(error))
    }
  }

  // Delete a vault
  static async deleteVault(vaultId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc("delete_vault", {
        p_vault_id: vaultId,
      })

      if (error) throw error
      return data
    } catch (error: any) {
      console.error("Error deleting vault:", error)
      throw new Error(getAuthErrorMessage(error))
    }
  }

  // Update vault access time
  static async updateVaultAccess(vaultId: string): Promise<void> {
    try {
      const { error } = await supabase.rpc("update_vault_access", {
        p_vault_id: vaultId,
      })

      if (error) throw error
    } catch (error: any) {
      console.error("Error updating vault access:", error)
      // Don't throw error for access time updates as it's not critical
    }
  }

  // Update vault settings
  static async updateVault(
    vaultId: string,
    updates: {
      name?: string
      description?: string
    }
  ): Promise<VaultData> {
    try {
      const { data, error } = await supabase.rpc("update_vault", {
        p_vault_id: vaultId,
        p_name: updates.name || null,
        p_description: updates.description || null,
      })

      if (error) throw error
      return data
    } catch (error: any) {
      console.error("Error updating vault:", error)
      throw new Error(getAuthErrorMessage(error))
    }
  }

  // Subscribe to real-time vault changes
  static subscribeToVaultChanges(userId: string, onVaultChange: (payload: any) => void) {
    return supabase
      .channel("vault_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "vaults",
          filter: `user_id=eq.${userId}`,
        },
        onVaultChange,
      )
      .subscribe()
  }

  // Format date for display
  static formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }
}
