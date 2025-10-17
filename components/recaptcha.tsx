"use client"

import { useEffect, useRef, useState } from "react"
import ReCAPTCHA from "react-google-recaptcha"

interface ReCaptchaProps {
  onVerify: (token: string | null) => void
  onExpire?: () => void
  onError?: () => void
  theme?: "light" | "dark"
  size?: "compact" | "normal" | "invisible"
  className?: string
}

export function ReCaptcha({
  onVerify,
  onExpire,
  onError,
  theme = "light",
  size = "normal",
  className = ""
}: ReCaptchaProps) {
  const recaptchaRef = useRef<ReCAPTCHA>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY

  // ✅ Load Google reCAPTCHA script manually if not loaded yet
  useEffect(() => {
    const existingScript = document.querySelector('script[src*="recaptcha/api.js"]')
    if (existingScript) {
      setIsLoaded(true)
      return
    }

    const script = document.createElement("script")
    script.src = `https://www.google.com/recaptcha/api.js?render=explicit`
    script.async = true
    script.defer = true
    script.onload = () => setIsLoaded(true)
    document.body.appendChild(script)
  }, [])

  const handleVerify = (token: string | null) => onVerify(token)
  const handleExpire = () => onExpire?.()
  const handleError = () => onError?.()

  if (!siteKey) {
    return (
      <div className={`p-4 border border-red-500 rounded ${className}`}>
        <p className="text-red-500 text-sm">⚠️ reCAPTCHA not configured</p>
        <p className="text-xs text-gray-500">Add NEXT_PUBLIC_RECAPTCHA_SITE_KEY in .env file</p>
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className={`flex items-center justify-center p-4 ${className}`}>
        <div className="text-sm text-muted-foreground">Loading reCAPTCHA...</div>
      </div>
    )
  }

  return (
    <div className={className}>
      <ReCAPTCHA
        ref={recaptchaRef}
        sitekey={siteKey}
        onChange={handleVerify}
        onExpired={handleExpire}
        onErrored={handleError}
        theme={theme}
        size={size}
      />
    </div>
  )
}

// ✅ Hook for managing state (optional)
export function useReCaptcha() {
  const [isVerified, setIsVerified] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleVerify = (recaptchaToken: string | null) => {
    if (recaptchaToken) {
      setToken(recaptchaToken)
      setIsVerified(true)
      setError(null)
    } else {
      setIsVerified(false)
      setToken(null)
    }
  }

  const handleExpire = () => {
    setIsVerified(false)
    setToken(null)
    setError("reCAPTCHA expired. Please verify again.")
  }

  const handleError = () => {
    setIsVerified(false)
    setToken(null)
    setError("reCAPTCHA error. Please try again.")
  }

  const reset = () => {
    setIsVerified(false)
    setToken(null)
    setError(null)
  }

  return { isVerified, token, error, handleVerify, handleExpire, handleError, reset }
}
