"use client"

import { Button } from "@/components/ui/button"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useState } from "react"
import { Loader2 } from "lucide-react"

export function GoogleSignIn() {
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClientComponentClient()

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true)
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
    } catch (error) {
      console.error("Error signing in with Google:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleGoogleSignIn}
      disabled={isLoading}
      className="w-full bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Connecting...
        </>
      ) : (
        <>
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google logo"
            className="w-6 h-6 mr-2"
          />
          Sign in with Google
        </>
      )}
    </Button>
  )
}
