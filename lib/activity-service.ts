import { supabase, getAuthErrorMessage } from "./supabase"

export interface ActivityData {
  date: string
  minutes: number
}

export class ActivityService {
  // Get user activity for the last 12 months
  static async getUserActivity(userId: string): Promise<ActivityData[]> {
    try {
      const endDate = new Date()
      const startDate = new Date()
      startDate.setFullYear(endDate.getFullYear() - 1)

      const { data, error } = await supabase
        .from("user_activity")
        .select("date, minutes")
        .eq("user_id", userId)
        .gte("date", startDate.toISOString().split('T')[0])
        .lte("date", endDate.toISOString().split('T')[0])
        .order("date", { ascending: true })

      if (error) throw error
      return data || []
    } catch (error: any) {
      console.error("Error fetching user activity:", error)
      throw new Error(getAuthErrorMessage(error))
    }
  }

  // Record user activity for a day
  static async recordActivity(userId: string, date: string, minutes: number): Promise<void> {
    try {
      const { error } = await supabase
        .from("user_activity")
        .upsert({
          user_id: userId,
          date,
          minutes
        }, {
          onConflict: "user_id,date"
        })

      if (error) throw error
    } catch (error: any) {
      console.error("Error recording activity:", error)
      throw new Error(getAuthErrorMessage(error))
    }
  }

  // Get activity level based on minutes
  static getActivityLevel(minutes: number): 'none' | 'low' | 'medium' | 'high' | 'max' {
    if (minutes === 0) return 'none'
    if (minutes < 15) return 'low'
    if (minutes < 30) return 'medium'
    if (minutes < 45) return 'high'
    return 'max'
  }

  // Format minutes to readable time
  static formatTime(minutes: number): string {
    if (minutes === 0) return "No activity"
    if (minutes < 60) return `${minutes} minutes`
    
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    
    if (remainingMinutes === 0) {
      return `${hours} ${hours === 1 ? 'hour' : 'hours'}`
    }
    
    return `${hours}h ${remainingMinutes}m`
  }

  // Generate all dates for the last 12 months
  static generateYearDates(): string[] {
    const dates: string[] = []
    const endDate = new Date()
    const startDate = new Date()
    startDate.setFullYear(endDate.getFullYear() - 1)
    startDate.setDate(startDate.getDate() + 1) // Start from tomorrow of last year
    
    const currentDate = new Date(startDate)
    
    while (currentDate <= endDate) {
      dates.push(currentDate.toISOString().split('T')[0])
      currentDate.setDate(currentDate.getDate() + 1)
    }
    
    return dates
  }
}
