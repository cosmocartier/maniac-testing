"use client"

import dynamic from "next/dynamic"

const SignUpClient = dynamic(() => import("./signup-client"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
    </div>
  ),
})

export default function SignUpPage() {
  return <SignUpClient />
}
