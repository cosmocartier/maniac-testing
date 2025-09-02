import { createClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = (): boolean => {
  return !!(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== "your_supabase_url" &&
    supabaseAnonKey !== "your_supabase_anon_key" &&
    supabaseUrl.length > 10 &&
    supabaseAnonKey.length > 10
  )
}

// Create a single supabase client for interacting with your database
export const supabase = (() => {
  if (!isSupabaseConfigured()) {
    console.warn("⚠️ Supabase client not initialized - missing or invalid configuration")
    console.warn("URL:", supabaseUrl ? "Present" : "Missing")
    console.warn("Key:", supabaseAnonKey ? "Present" : "Missing")

    return {
      auth: {
        getSession: () =>
          Promise.resolve({
            data: { session: null },
            error: new Error("Authentication service is not configured. Please contact support."),
          }),
        signUp: () =>
          Promise.resolve({
            data: { user: null, session: null },
            error: new Error("Authentication service is not configured. Please contact support."),
          }),
        signInWithPassword: () =>
          Promise.resolve({
            data: { user: null, session: null },
            error: new Error("Authentication service is not configured. Please contact support."),
          }),
        signInWithOtp: () =>
          Promise.resolve({
            data: {},
            error: new Error("Authentication service is not configured. Please contact support."),
          }),
        verifyOtp: () =>
          Promise.resolve({
            data: { user: null, session: null },
            error: new Error("Authentication service is not configured. Please contact support."),
          }),
        signOut: () =>
          Promise.resolve({ error: new Error("Authentication service is not configured. Please contact support.") }),
        resend: () =>
          Promise.resolve({
            data: {},
            error: new Error("Authentication service is not configured. Please contact support."),
          }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            single: () =>
              Promise.resolve({
                data: null,
                error: new Error("Authentication service is not configured. Please contact support."),
              }),
          }),
        }),
        insert: () => ({
          select: () => ({
            single: () =>
              Promise.resolve({
                data: null,
                error: new Error("Authentication service is not configured. Please contact support."),
              }),
          }),
        }),
        update: () => ({
          eq: () =>
            Promise.resolve({
              data: null,
              error: new Error("Authentication service is not configured. Please contact support."),
            }),
        }),
        delete: () => ({
          eq: () =>
            Promise.resolve({
              data: null,
              error: new Error("Authentication service is not configured. Please contact support."),
            }),
        }),
        upsert: () =>
          Promise.resolve({
            data: null,
            error: new Error("Authentication service is not configured. Please contact support."),
          }),
      }),
      rpc: () =>
        Promise.resolve({
          data: null,
          error: new Error("Authentication service is not configured. Please contact support."),
        }),
    } as any
  }

  console.log("✅ Initializing Supabase client with valid configuration")
  return createClient<Database>(supabaseUrl!, supabaseAnonKey!, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  })
})()

// Test Supabase connection
export const testSupabaseConnection = async () => {
  try {
    if (!isSupabaseConfigured()) {
      return {
        success: false,
        error: "Supabase is not configured. Please check your environment variables.",
        details: {
          hasUrl: !!supabaseUrl,
          hasKey: !!supabaseAnonKey,
          urlValid: supabaseUrl ? supabaseUrl.startsWith("https://") && supabaseUrl.includes(".supabase.co") : false,
          keyValid: supabaseAnonKey ? supabaseAnonKey.length > 20 : false,
        },
      }
    }

    const { data, error } = await supabase.from("profiles").select("count").limit(1)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Enhanced error message handler with rate limiting support
export const getAuthErrorMessage = (error: any): string => {
  if (!error) return "An unknown error occurred"

  const message = error.message || error.error_description || error.error || "Authentication failed"

  // Handle configuration errors first
  if (message.includes("Supabase not configured")) {
    return "Authentication service is not configured. Please contact support."
  }

  // Map common Supabase auth errors to user-friendly messages
  const errorMappings: Record<string, string> = {
    "Invalid login credentials": "Invalid email or password. Please check your credentials and try again.",
    "Email not confirmed":
      "Please verify your email address before signing in. Check your inbox for a confirmation email.",
    "User not found": "No account found with this email address. Please sign up first.",
    "Password should be at least 6 characters": "Password must be at least 6 characters long.",
    "Unable to validate email address: invalid format": "Please enter a valid email address.",
    "User already registered": "An account with this email already exists. Please sign in instead.",
    "Signup requires a valid password": "Please enter a valid password.",
    "Database error saving new user": "Unable to create account. Please try again later.",
    "SMTP Error": "Unable to send verification email. Please try again later.",
    "Email rate limit exceeded": "Too many emails sent. Please wait before requesting another verification email.",
    "Token has expired or is invalid": "Verification code has expired. Please request a new one.",
    "Invalid token": "Invalid verification code. Please check the code and try again.",
    "Network request failed": "Network error. Please check your connection and try again.",
  }

  // Handle rate limiting messages
  if (message.includes("For security purposes, you can only request this after")) {
    const timeMatch = message.match(/after (\d+) seconds?/)
    const seconds = timeMatch ? Number.parseInt(timeMatch[1]) : 60
    return `Please wait ${seconds} seconds before trying again. This helps protect against spam.`
  }

  if (message.includes("rate limit") || message.includes("too many requests")) {
    return "Too many requests. Please wait a moment before trying again."
  }

  return errorMappings[message] || message
}

// Enhanced OTP Service with better rate limit handling
export const otpService = {
  // Generate and send OTP token with rate limit handling
  generateToken: async (email: string, type: "signup" | "recovery" = "signup") => {
    if (!isSupabaseConfigured()) {
      throw new Error("Authentication service is not configured")
    }

    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: type === "signup",
          data: {
            email_confirm: true,
          },
        },
      })

      if (error) throw error
      return { success: true, data }
    } catch (error: any) {
      throw new Error(getAuthErrorMessage(error))
    }
  },

  // Send email with OTP with retry logic
  sendEmail: async (email: string, retryCount = 0) => {
    if (!isSupabaseConfigured()) {
      throw new Error("Authentication service is not configured")
    }

    try {
      const { data, error } = await supabase.auth.resend({
        type: "signup",
        email,
      })

      if (error) throw error
      return { success: true, data }
    } catch (error: any) {
      // If rate limited and this is first attempt, suggest waiting
      if (error.message?.includes("For security purposes") && retryCount === 0) {
        throw new Error(getAuthErrorMessage(error))
      }
      throw new Error(getAuthErrorMessage(error))
    }
  },

  // Validate OTP token
  validateToken: async (email: string, token: string, type: "email" | "sms" = "email") => {
    if (!isSupabaseConfigured()) {
      throw new Error("Authentication service is not configured")
    }

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: type === "email" ? "email" : "sms",
      })

      if (error) throw error

      // Log successful verification
      if (data.user) {
        await logAuthEvent(data.user.id, "email_verified", {
          email,
          verified_at: new Date().toISOString(),
        })
      }

      return {
        success: true,
        user: data.user,
        session: data.session,
      }
    } catch (error: any) {
      throw new Error(getAuthErrorMessage(error))
    }
  },
}

// Auth event logging
export const logAuthEvent = async (
  userId: string,
  action: string,
  details?: any,
  ipAddress?: string,
  userAgent?: string,
) => {
  if (!isSupabaseConfigured()) {
    console.warn("Cannot log auth event - Supabase not configured")
    return
  }

  try {
    const { error } = await supabase.rpc("log_auth_event", {
      p_user_id: userId,
      p_action: action,
      p_details: details || {},
      p_ip_address: ipAddress || null,
      p_user_agent: userAgent || null,
    })

    if (error) {
      console.error("Failed to log auth event:", error)
    }
  } catch (error) {
    console.error("Error logging auth event:", error)
  }
}

// Session management
export const sessionService = {
  // Create new session
  createSession: async (userId: string, expiresIn: number = 24 * 60 * 60 * 1000) => {
    if (!isSupabaseConfigured()) {
      throw new Error("Authentication service is not configured")
    }

    try {
      const sessionToken = crypto.randomUUID()
      const expiresAt = new Date(Date.now() + expiresIn)

      const { data, error } = await supabase
        .from("user_sessions")
        .insert({
          user_id: userId,
          session_token: sessionToken,
          expires_at: expiresAt.toISOString(),
        })
        .select()
        .single()

      if (error) throw error
      return { success: true, session: data }
    } catch (error: any) {
      throw new Error(getAuthErrorMessage(error))
    }
  },

  // Validate session
  validateSession: async (sessionToken: string) => {
    if (!isSupabaseConfigured()) {
      return { success: false, error: "Authentication service is not configured" }
    }

    try {
      const { data, error } = await supabase
        .from("user_sessions")
        .select("*, profiles(*)")
        .eq("session_token", sessionToken)
        .gt("expires_at", new Date().toISOString())
        .single()

      if (error) throw error
      return { success: true, session: data }
    } catch (error: any) {
      return { success: false, error: getAuthErrorMessage(error) }
    }
  },

  // Clean expired sessions
  cleanupExpiredSessions: async () => {
    if (!isSupabaseConfigured()) {
      return { success: false, error: "Authentication service is not configured" }
    }

    try {
      const { data, error } = await supabase.rpc("cleanup_expired_sessions")
      if (error) throw error
      return { success: true, deletedCount: data }
    } catch (error: any) {
      console.error("Failed to cleanup expired sessions:", error)
      return { success: false, error: getAuthErrorMessage(error) }
    }
  },
}

// Environment configuration helper
export const getEnvironmentInfo = () => {
  return {
    hasSupabaseUrl: !!supabaseUrl,
    hasSupabaseKey: !!supabaseAnonKey,
    supabaseUrlValid: supabaseUrl ? supabaseUrl.startsWith("https://") && supabaseUrl.includes(".supabase.co") : false,
    supabaseKeyValid: supabaseAnonKey ? supabaseAnonKey.length > 20 : false,
    isConfigured: isSupabaseConfigured(),
    nodeEnv: process.env.NODE_ENV,
  }
}

export default supabase
