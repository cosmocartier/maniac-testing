"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CheckCircle, XCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth-context"

export default function VerifyPage() {
  const [code, setCode] = useState(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [resendCooldown, setResendCooldown] = useState(0)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const { verifyCode, sendVerificationCode } = useAuth()
  const router = useRouter()

  // Get user email from session storage
  useEffect(() => {
    const pendingUserEmail = sessionStorage.getItem("pendingUserEmail")

    if (!pendingUserEmail) {
      // Redirect to signup if no pending verification
      router.push("/auth/signup")
      return
    }

    setUserEmail(pendingUserEmail)
  }, [router])

  // Handle cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  const handleInputChange = (index: number, value: string) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return

    const newCode = [...code]
    newCode[index] = value.slice(-1) // Only take the last character

    setCode(newCode)
    setVerificationStatus("idle")
    setErrorMessage("")
    setSuccessMessage("")

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    const newCode = [...code]

    for (let i = 0; i < pastedData.length; i++) {
      newCode[i] = pastedData[i]
    }

    setCode(newCode)

    // Focus the next empty input or the last input
    const nextEmptyIndex = newCode.findIndex((digit) => !digit)
    const focusIndex = nextEmptyIndex === -1 ? 5 : Math.min(nextEmptyIndex, 5)
    inputRefs.current[focusIndex]?.focus()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!userEmail) {
      setVerificationStatus("error")
      setErrorMessage("Session expired. Please sign up again.")
      return
    }

    const verificationCode = code.join("")

    if (verificationCode.length !== 6) {
      setVerificationStatus("error")
      setErrorMessage("Please enter all 6 digits")
      return
    }

    setIsLoading(true)
    setVerificationStatus("idle")
    setErrorMessage("")
    setSuccessMessage("")

    try {
      const result = await verifyCode(userEmail, verificationCode)

      if (result.success) {
        setVerificationStatus("success")
        setSuccessMessage("Email verified successfully! Redirecting...")

        // Clear session storage
        sessionStorage.removeItem("pendingUserEmail")

        // Redirect to dashboard after successful verification
        setTimeout(() => {
          router.push("/")
        }, 2000)
      } else {
        setVerificationStatus("error")
        setErrorMessage(result.message || "Invalid verification code. Please try again.")

        // Clear the code on error
        setCode(["", "", "", "", "", ""])
        inputRefs.current[0]?.focus()
      }
    } catch (error: any) {
      setVerificationStatus("error")
      setErrorMessage(error.message || "Verification failed. Please try again.")
      // Clear the code on error
      setCode(["", "", "", "", "", ""])
      inputRefs.current[0]?.focus()
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    if (resendCooldown > 0 || !userEmail) return

    setIsResending(true)
    setErrorMessage("")
    setSuccessMessage("")

    try {
      await sendVerificationCode(userEmail)
      setResendCooldown(60) // 60 second cooldown
      setVerificationStatus("idle")
      setSuccessMessage("New verification code sent to your email!")
      // Clear current code
      setCode(["", "", "", "", "", ""])
      inputRefs.current[0]?.focus()
    } catch (error: any) {
      setErrorMessage(error.message || "Failed to resend code. Please try again.")
    } finally {
      setIsResending(false)
    }
  }

  const isCodeComplete = code.every((digit) => digit !== "")

  if (!userEmail) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-10 w-10 animate-spin text-white mx-auto mb-6" />
          <p className="text-white tracking-enhanced">LOADING...</p>
        </div>
      </div>
    )
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

      {/* Header Navigation */}
      <header className="fixed top-0 z-50 w-full border-b border-white/0 bg-black/80 backdrop-blur-lg">
        <div className="container mx-auto px-8 lg:px-12">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-4">
              <img
                src="/images/new-brand-logo.png"
                alt="Mirror X"
                className="h-9 w-auto object-contain"
                style={{
                  maxWidth: "140px",
                }}
              />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-8 pt-32 pb-20 relative z-10">
        <div className="w-full max-w-md mx-auto">
          <div className="flex flex-col items-center space-y-12">
            {/* Title */}
            <div className="text-center space-y-8">
              <div className="space-y-4">
                <h1 className="text-2xl font-light text-white tracking-enhanced">Verify your email</h1>
                <p className="text-gray-400 text-sm max-w-sm leading-relaxed">
                  We've sent a 6-digit verification code to <span className="text-white font-medium">{userEmail}</span>.
                  Enter it below to complete your account setup.
                </p>
              </div>
            </div>

            {/* Success Message */}
            {successMessage && (
              <div className="w-full p-6 bg-green-900/20 border border-green-500/30 rounded-md">
                <div className="flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-green-400 text-sm leading-relaxed">{successMessage}</p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="w-full p-6 bg-red-900/20 border border-red-500/30 rounded-md">
                <div className="flex items-start gap-4">
                  <XCircle className="h-6 w-6 text-red-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-red-400 text-sm leading-relaxed">{errorMessage}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Verification Form */}
            <form onSubmit={handleSubmit} className="w-full space-y-12">
              {/* Code Input Fields */}
              <div className="flex justify-center gap-4">
                {code.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className="w-14 h-14 text-center text-lg font-medium bg-white/5 border border-white/5 rounded-full text-white focus:outline-none focus:border-white/20 transition-colors"
                    disabled={isLoading || verificationStatus === "success"}
                  />
                ))}
              </div>

              {/* Status Messages */}
              {verificationStatus === "success" && (
                <div className="flex items-center justify-center gap-3 text-green-500 text-sm">
                  <CheckCircle className="h-5 w-5" />
                  <span className="tracking-enhanced">VERIFICATION SUCCESSFUL! REDIRECTING...</span>
                </div>
              )}

              {/* Verify Button */}
              <Button
                type="submit"
                className="w-full h-14 bg-white text-black hover:bg-gray-200 text-sm font-medium rounded-full disabled:opacity-50 tracking-caps"
                disabled={!isCodeComplete || isLoading || verificationStatus === "success"}
              >
                {isLoading ? "VERIFYING..." : verificationStatus === "success" ? "VERIFIED!" : "VERIFY CODE"}
              </Button>
            </form>

            {/* Resend Code */}
            <div className="text-center space-y-3">
              <p className="text-gray-400 text-sm">Didn't receive the code?</p>
              <button
                onClick={handleResendCode}
                disabled={resendCooldown > 0 || isResending}
                className="text-white hover:text-gray-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed tracking-enhanced"
              >
                {isResending ? "SENDING..." : resendCooldown > 0 ? `RESEND IN ${resendCooldown}S` : "RESEND CODE"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
