"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"
import { TopNavigation } from "@/components/top-navigation"
import { SiteFooter } from "@/components/site-footer"

export default function SignInClient() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const { signIn, isLoading } = useAuth()
  const { t } = useLanguage()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email.trim() || !password) {
      setError(t("signin.errorRequired"))
      return
    }

    try {
      await signIn(email.trim(), password)
      // Redirect will be handled by the auth context
    } catch (error: any) {
      console.error("Sign in error:", error)
      setError(error.message || t("signin.errorGeneral"))
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col relative"
      style={{
        backgroundImage: "url('/images/hero-diagonal-background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/65 z-0" />

      <TopNavigation />

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-8 pt-32 pb-20 relative z-10">
        <div className="w-full max-w-md mx-auto">
          <div className="flex flex-col items-center space-y-12">
            {/* Title */}
            <div className="text-center space-y-8">
              <h1 className="text-2xl font-light text-white tracking-enhanced">{t("signin.title")}</h1>
            </div>

            {/* Error Message */}
            {error && (
              <div className="w-full p-6 bg-red-900/20 border border-red-500/30 rounded-md">
                <div className="flex items-start gap-4">
                  <AlertCircle className="h-6 w-6 text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-red-400 text-sm leading-relaxed">{error}</p>
                </div>
              </div>
            )}

            {/* Sign In Form */}
            <form onSubmit={handleSubmit} className="w-full space-y-8">
              {/* Email Field */}
              <div>
                <Input
                  type="email"
                  placeholder={t("signin.emailPlaceholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/5 rounded-3xl p-4 pr-20 text-white placeholder-gray-400 resize-none focus:outline-none focus:border-white/20 transition-colors"
                  required
                />
              </div>

              {/* Password Field */}
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder={t("signin.passwordPlaceholder")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/5 rounded-3xl p-4 pr-20 text-white placeholder-gray-400 resize-none focus:outline-none focus:border-white/20 transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              {/* Sign In Button */}
              <Button
                type="submit"
                className="w-full h-14 bg-white/90 text-black hover:bg-gray-200 text-sm font-medium rounded-full disabled:opacity-50 tracking-caps"
                disabled={isLoading}
              >
                {isLoading ? t("signin.signingInButton") : t("signin.signInButton")}
              </Button>
            </form>

            {/* Sign Up Link */}
            <div className="text-center">
              <span className="text-gray-400 text-sm">
                {t("signin.noAccount")}{" "}
                <Link href="/auth/signup" className="text-white hover:text-gray-300 tracking-enhanced">
                  {t("signin.signUpNow")}
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  )
}
