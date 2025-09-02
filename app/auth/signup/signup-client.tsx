"use client"

import type React from "react"
import { Check } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Circle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"
import { TopNavigation } from "@/components/top-navigation"
import { SiteFooter } from "@/components/site-footer"

export default function SignUpClient() {
  const { t } = useLanguage()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const { signUp, isLoading } = useAuth()
  const router = useRouter()

  // Password validation
  const hasLowercase = /[a-z]/.test(password)
  const hasUppercase = /[A-Z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)
  const isLongEnough = password.length >= 6
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0

  const isFormValid =
    firstName.trim() &&
    lastName.trim() &&
    email.trim() &&
    hasLowercase &&
    hasUppercase &&
    hasNumber &&
    hasSpecialChar &&
    isLongEnough &&
    passwordsMatch

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid) return

    setError("")
    setSuccess("")

    try {
      const fullName = `${firstName.trim()} ${lastName.trim()}`
      const result = await signUp(email.trim(), password, fullName)

      if (result && result.needsVerification) {
        // Store user email for verification page
        sessionStorage.setItem("pendingUserEmail", email.trim())

        // Redirect to verification page immediately
        router.push("/auth/verify")
      } else if (result && result.shouldRedirectToSignIn) {
        // User already exists, redirect to sign in
        setError(result.message || "Account already exists. Redirecting to sign in...")
        setTimeout(() => {
          router.push("/auth/signin")
        }, 2000)
      } else {
        // User is automatically signed in
        setSuccess(result?.message || "Account created successfully!")
        setTimeout(() => {
          router.push("/")
        }, 2000)
      }
    } catch (error: any) {
      console.error("Sign up error:", error)
      setError(error.message || "Failed to create account. Please try again.")
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
            <div className="text-center space-y-8">
              <h1 className="text-2xl font-light text-white tracking-enhanced">{t("signup.title")}</h1>
            </div>

            {/* Success Message */}
            {success && (
              <div className="w-full p-6 bg-green-900/20 border border-green-500/30 rounded-md">
                <div className="flex items-start gap-4">
                  <Check className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-green-400 text-sm leading-relaxed">{success}</p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="w-full p-6 bg-red-900/20 border border-red-500/30 rounded-md">
                <div className="flex items-start gap-4">
                  <AlertCircle className="h-6 w-6 text-red-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-red-400 text-sm leading-relaxed">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Sign Up Form */}
            <form onSubmit={handleSubmit} className="w-full space-y-8">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Input
                    type="text"
                    placeholder={t("signup.firstName")}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-white/5 border border-white/5 rounded-3xl p-4 text-white placeholder-gray-400 resize-none focus:outline-none focus:border-white/20 transition-colors"
                    required
                  />
                </div>
                <div>
                  <Input
                    type="text"
                    placeholder={t("signup.lastName")}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-white/5 border border-white/5 rounded-3xl p-4 text-white placeholder-gray-400 resize-none focus:outline-none focus:border-white/20 transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <Input
                  type="email"
                  placeholder={t("signup.email")}
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
                  placeholder={t("signup.password")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/5 rounded-3xl p-4 pr-20 text-white placeholder-gray-400 resize-none focus:outline-none focus:border-white/20 transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 disabled:opacity-50"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              {/* Confirm Password Field */}
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder={t("signup.confirmPassword")}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/5 rounded-3xl p-4 pr-20 text-white placeholder-gray-400 resize-none focus:outline-none focus:border-white/20 transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 disabled:opacity-50"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  {hasLowercase ? (
                    <Check className="h-4 w-4 text-white" />
                  ) : (
                    <Circle className="h-4 w-4 text-gray-400" />
                  )}
                  <span className={`text-sm ${hasLowercase ? "text-white" : "text-gray-400"} leading-relaxed`}>
                    {t("signup.passwordRequirements.lowercase")}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  {hasUppercase ? (
                    <Check className="h-4 w-4 text-white" />
                  ) : (
                    <Circle className="h-4 w-4 text-gray-400" />
                  )}
                  <span className={`text-sm ${hasUppercase ? "text-white" : "text-gray-400"} leading-relaxed`}>
                    {t("signup.passwordRequirements.uppercase")}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  {hasNumber ? <Check className="h-4 w-4 text-white" /> : <Circle className="h-4 w-4 text-gray-400" />}
                  <span className={`text-sm ${hasNumber ? "text-white" : "text-gray-400"} leading-relaxed`}>
                    {t("signup.passwordRequirements.number")}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  {hasSpecialChar ? (
                    <Check className="h-4 w-4 text-white" />
                  ) : (
                    <Circle className="h-4 w-4 text-gray-400" />
                  )}
                  <span className={`text-sm ${hasSpecialChar ? "text-white" : "text-gray-400"} leading-relaxed`}>
                    {t("signup.passwordRequirements.specialChar")}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  {isLongEnough ? (
                    <Check className="h-4 w-4 text-white" />
                  ) : (
                    <Circle className="h-4 w-4 text-gray-400" />
                  )}
                  <span className={`text-sm ${isLongEnough ? "text-white" : "text-gray-400"} leading-relaxed`}>
                    {t("signup.passwordRequirements.length")}
                  </span>
                </div>
                {confirmPassword.length > 0 && (
                  <div className="flex items-center gap-4">
                    {passwordsMatch ? (
                      <Check className="h-4 w-4 text-white" />
                    ) : (
                      <Circle className="h-4 w-4 text-red-500" />
                    )}
                    <span className={`text-sm ${passwordsMatch ? "text-white" : "text-red-400"} leading-relaxed`}>
                      {t("signup.passwordRequirements.match")}
                    </span>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-14 bg-white text-black hover:bg-gray-200 text-sm font-medium rounded-full disabled:opacity-50 tracking-caps"
                disabled={!isFormValid || isLoading}
              >
                {isLoading ? t("signup.creatingAccount") : t("signup.createAccount")}
              </Button>
            </form>

            <div className="text-center">
              <span className="text-gray-400 text-sm">
                {t("signup.alreadyHaveAccount")}{" "}
                <Link href="/auth/signin" className="text-white hover:text-gray-300 tracking-enhanced">
                  {t("signup.signInNow")}
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
