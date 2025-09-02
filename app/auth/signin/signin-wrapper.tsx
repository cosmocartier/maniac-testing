"use client"

import dynamic from "next/dynamic"

const SignInClient = dynamic(() => import("./signin-client"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-10 h-10 border-2 border-white/30 border-t-white animate-spin rounded-full"></div>
    </div>
  ),
})

export default function SignInWrapper() {
  return <SignInClient />
}
