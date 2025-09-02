"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase, getAuthErrorMessage, logAuthEvent, otpService } from "./supabase"

interface AuthUser {
  id: string
  email: string
  name: string
  plan: "Strategic" | "Professional" | "Enterprise"
}

interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (
    email: string,
    password: string,
    name: string,
  ) => Promise<{
    needsVerification?: boolean
    shouldRedirectToSignIn?: boolean
    message?: string
  }>
  signOut: () => Promise<void>
  verifyOtp: (email: string, token: string) => Promise<void>
  resendOtp: (email: string) => Promise<void>
  error: string | null
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const clearError = () => setError(null)

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      setError(null)

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        // Fetch user profile
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single()

        if (profileError) throw profileError

        const authUser: AuthUser = {
          id: data.user.id,
          email: data.user.email!,
          name: profile.full_name || data.user.email!.split("@")[0],
          plan: profile.plan || "Strategic",
        }

        setUser(authUser)

        // Log successful sign in
        await logAuthEvent(data.user.id, "sign_in", {
          email: data.user.email,
          timestamp: new Date().toISOString(),
        })

        // Redirect to dashboard page after successful sign in
        router.push("/dashboard")
      }
    } catch (error: any) {
      setError(getAuthErrorMessage(error))
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true)
      setError(null)

      // Use OTP service for signup
      await otpService.generateToken(email, "signup")

      // Store signup data temporarily (in real app, you'd handle this differently)
      sessionStorage.setItem("pendingSignup", JSON.stringify({ email, password, name }))

      // Return a proper response object instead of redirecting directly
      return {
        needsVerification: true,
        message: "Verification code sent to your email",
      }
    } catch (error: any) {
      setError(getAuthErrorMessage(error))
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const verifyOtp = async (email: string, token: string) => {
    try {
      setIsLoading(true)
      setError(null)

      const result = await otpService.validateToken(email, token)

      if (result.user) {
        // Get pending signup data
        const pendingSignup = sessionStorage.getItem("pendingSignup")
        if (pendingSignup) {
          const { name } = JSON.parse(pendingSignup)

          // Create or update profile
          const { error: profileError } = await supabase.from("profiles").upsert({
            id: result.user.id,
            email: result.user.email!,
            full_name: name,
            plan: "Strategic",
          })

          if (profileError) throw profileError

          sessionStorage.removeItem("pendingSignup")
        }

        // Fetch user profile
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", result.user.id)
          .single()

        if (profileError) throw profileError

        const authUser: AuthUser = {
          id: result.user.id,
          email: result.user.email!,
          name: profile.full_name || result.user.email!.split("@")[0],
          plan: profile.plan || "Strategic",
        }

        setUser(authUser)

        // Redirect to dashboard page after successful verification
        router.push("/dashboard")
      }
    } catch (error: any) {
      setError(getAuthErrorMessage(error))
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const resendOtp = async (email: string) => {
    try {
      setIsLoading(true)
      setError(null)

      await otpService.sendEmail(email)
    } catch (error: any) {
      setError(getAuthErrorMessage(error))
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setIsLoading(true)
      setError(null)

      if (user) {
        await logAuthEvent(user.id, "sign_out", {
          timestamp: new Date().toISOString(),
        })
      }

      const { error } = await supabase.auth.signOut()
      if (error) throw error

      setUser(null)
      router.push("/")
    } catch (error: any) {
      setError(getAuthErrorMessage(error))
    } finally {
      setIsLoading(false)
    }
  }

  // Listen for auth state changes
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const value = {
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
    verifyOtp,
    resendOtp,
    error,
    clearError,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
