// Client-safe authentication utilities (no MongoDB imports)
// This file can be safely imported in client components

export function hashPassword(password: string): string {
  // Simple hash for demo (use bcrypt in production)
  // Use Buffer to work in both Node (server) and browser
  return typeof window === "undefined"
    ? Buffer.from(password, "utf-8").toString("base64")
    : btoa(password)
}

export function verifyPassword(password: string, hash: string): boolean {
  const encoded = typeof window === "undefined"
    ? Buffer.from(password, "utf-8").toString("base64")
    : btoa(password)
  return encoded === hash
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export function generateToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export function calculateAge(dateOfBirth: string): number {
  const today = new Date()
  const birthDate = new Date(dateOfBirth)
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

export function checkPasswordStrength(password: string): {
  score: number
  feedback: string[]
} {
  const feedback: string[] = []
  let score = 0

  if (password.length >= 8) {
    score += 1
  } else {
    feedback.push("At least 8 characters")
  }

  if (/[a-z]/.test(password)) score += 1
  else feedback.push("Include lowercase letters")

  if (/[A-Z]/.test(password)) score += 1
  else feedback.push("Include uppercase letters")

  if (/[0-9]/.test(password)) score += 1
  else feedback.push("Include numbers")

  if (/[^a-zA-Z0-9]/.test(password)) score += 1
  else feedback.push("Include special characters")

  return { score, feedback }
}

export function sendEmailOTP(email: string, code: string, type: "verification" | "reset"): void {
  // Mock email service (log to console in development)
  console.log(`[Nazzel And Avionna] Email sent to ${email}`)
  console.log(`[Nazzel and Avionna] ${type === "verification" ? "Verification" : "Password Reset"} Code: ${code}`)
  console.log(`[Nazzel and Avionna] This code expires in 10 minutes`)
}
