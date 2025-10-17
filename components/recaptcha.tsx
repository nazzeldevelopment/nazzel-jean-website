"use client"

import { useRef, useEffect, useState } from "react"
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

  useEffect(() => {
    // Check if reCAPTCHA is loaded
    const checkRecaptcha = () => {
      if (window.grecaptcha && window.grecaptcha.render) {
        setIsLoaded(true)
      } else {
        setTimeout(checkRecaptcha, 100)
      }
    }
    checkRecaptcha()
  }, [])

  const handleVerify = (token: string | null) => {
    onVerify(token)
  }

  const handleExpire = () => {
    onExpire?.()
  }

  const handleError = () => {
    onError?.()
  }

  const resetRecaptcha = () => {
    recaptchaRef.current?.reset()
  }

  // Expose reset function for parent components
  useEffect(() => {
    if (recaptchaRef.current) {
      (recaptchaRef.current as any).resetRecaptcha = resetRecaptcha
    }
  }, [])

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
        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
        onChange={handleVerify}
        onExpired={handleExpire}
        onErrored={handleError}
        theme={theme}
        size={size}
      />
    </div>
  )
}

// Hook for managing reCAPTCHA state
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

  return {
    isVerified,
    token,
    error,
    handleVerify,
    handleExpire,
    handleError,
    reset
  }
}
