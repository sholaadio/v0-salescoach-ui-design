"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowRight, Delete, Loader2 } from "lucide-react"

// Mock user data - in production this comes from your API
const MOCK_USERS: Record<string, { name: string; role: string; team?: string }> = {
  // Management
  "MGT001": { name: "Mr Shola Adio", role: "ceo" },
  "MGT002": { name: "Adebayo Johnson", role: "gm" },
  "MGT003": { name: "Funke Adeyemi", role: "head_sales" },
  "MGT004": { name: "Tolu Bakare", role: "head_creative" },
  "MGT005": { name: "Grace Okafor", role: "hr" },
  // Team Leads
  "TL001": { name: "Abigail Eze", role: "teamlead", team: "Team Abigail" },
  "TL002": { name: "Mary Okoro", role: "teamlead", team: "Team Mary" },
  "TL003": { name: "Deborah Nnamdi", role: "teamlead", team: "Team Deborah" },
  // Sales Closers
  "SC001": { name: "Chukwuemeka Obi", role: "closer", team: "Team Abigail" },
  "SC002": { name: "Fatima Aliyu", role: "closer", team: "Team Abigail" },
  "SC003": { name: "Segun Adeyemi", role: "closer", team: "Team Mary" },
}

function getRedirectPath(role: string): string {
  if (["ceo", "gm", "head_sales", "head_creative", "hr"].includes(role)) {
    return "/management"
  }
  if (role === "teamlead") {
    return "/team-lead"
  }
  return "/dashboard"
}

function getRoleLabel(role: string): string {
  const labels: Record<string, string> = {
    ceo: "CEO",
    gm: "General Manager",
    head_sales: "Head of Sales",
    head_creative: "Head of Creative",
    hr: "HR Manager",
    teamlead: "Team Lead",
    closer: "Sales Closer",
  }
  return labels[role] || "Staff"
}

export default function LoginPage() {
  const router = useRouter()
  const [step, setStep] = React.useState<"id" | "pin">("id")
  const [employeeId, setEmployeeId] = React.useState("")
  const [pin, setPin] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState("")

  const currentUser = MOCK_USERS[employeeId.toUpperCase()]

  const handleIdSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    const id = employeeId.trim().toUpperCase()
    if (!id) return
    
    if (!MOCK_USERS[id]) {
      setError("Employee ID not found")
      return
    }
    setStep("pin")
  }

  const handlePinDigit = (digit: string) => {
    if (pin.length < 4) {
      const newPin = pin + digit
      setPin(newPin)
      if (newPin.length === 4) {
        setIsLoading(true)
        // Simulate API call - in production, validate PIN with backend
        setTimeout(() => {
          const user = MOCK_USERS[employeeId.toUpperCase()]
          if (user) {
            const redirectPath = getRedirectPath(user.role)
            router.push(redirectPath)
          } else {
            setError("Invalid credentials")
            setPin("")
            setIsLoading(false)
          }
        }, 500)
      }
    }
  }

  const handleDeleteDigit = () => {
    setPin(pin.slice(0, -1))
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0b] px-4">
      {/* Logo */}
      <div className="mb-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 text-2xl font-bold text-white shadow-lg shadow-orange-500/20">
          S
        </div>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-[#f5f5f5]">
          Shoppyrex
        </h1>
        <h2 className="text-2xl font-bold tracking-tight text-[#f5f5f5]">
          SalesCoach
        </h2>
        <p className="mt-2 text-xs font-medium uppercase tracking-widest text-[#5e6ad2]">
          Powered by Shoppyrex
        </p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm rounded-xl border border-[#26262a] bg-[#161618] p-6 shadow-xl">
        {step === "id" ? (
          <form onSubmit={handleIdSubmit}>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-[#f5f5f5]">Welcome</h3>
              <p className="mt-1 text-sm text-[#5b5b5e]">
                Enter your Employee ID to sign in
              </p>
            </div>

            <div className="mt-6 space-y-4">
              <Input
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="e.g. SC001"
                className="h-12 border-[#26262a] bg-[#1f1f22] text-center text-lg text-[#f5f5f5] placeholder:text-[#5b5b5e] focus-visible:ring-[#5e6ad2]"
                autoFocus
              />
              {error && (
                <p className="text-sm text-[#e5484d] text-center">{error}</p>
              )}
              <Button
                type="submit"
                className="h-12 w-full bg-[#5e6ad2] text-white hover:bg-[#6b77db]"
                disabled={!employeeId.trim()}
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="mt-4 text-center text-xs text-[#5b5b5e]">
              <p>Demo IDs: MGT001 (CEO), TL001 (Team Lead), SC001 (Closer)</p>
            </div>
          </form>
        ) : (
          <div>
            <button
              onClick={() => {
                setStep("id")
                setPin("")
              }}
              className="mb-4 text-sm text-[#5b5b5e] hover:text-[#f5f5f5]"
            >
              ← Back
            </button>

            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#5e6ad2] text-lg font-semibold text-white">
                {currentUser?.name.split(" ").map(n => n[0]).join("").slice(0, 2) || employeeId.slice(0, 2).toUpperCase()}
              </div>
              <h3 className="mt-3 text-lg font-semibold text-[#f5f5f5]">
                Hi, {currentUser?.name.split(" ")[0] || employeeId}
              </h3>
              <p className="mt-1 text-xs text-[#5b5b5e]">
                {employeeId.toUpperCase()} · {currentUser ? getRoleLabel(currentUser.role) : "Staff"}
              </p>
              {currentUser?.team && (
                <p className="text-xs text-[#5e6ad2]">{currentUser.team}</p>
              )}
              <p className="mt-2 text-sm text-[#5b5b5e]">Enter your 4-digit PIN</p>
            </div>

            {/* PIN dots */}
            <div className="mt-6 flex justify-center gap-3">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-3 w-3 rounded-full transition-colors ${
                    i < pin.length ? "bg-[#5e6ad2]" : "bg-[#26262a]"
                  }`}
                />
              ))}
            </div>

            {/* Number pad */}
            {isLoading ? (
              <div className="mt-6 flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-[#5e6ad2]" />
                <p className="text-sm text-[#5b5b5e]">Signing in...</p>
              </div>
            ) : (
              <div className="mt-6 grid grid-cols-3 gap-3">
                {["1", "2", "3", "4", "5", "6", "7", "8", "9", null, "0", "delete"].map(
                  (key, i) => {
                    if (key === null) {
                      return <div key={i} />
                    }
                    if (key === "delete") {
                      return (
                        <button
                          key={i}
                          onClick={handleDeleteDigit}
                          className="flex h-14 items-center justify-center rounded-lg bg-[#e5484d]/10 text-[#e5484d] transition-colors hover:bg-[#e5484d]/20"
                        >
                          <Delete className="h-5 w-5" />
                        </button>
                      )
                    }
                    return (
                      <button
                        key={i}
                        onClick={() => handlePinDigit(key)}
                        className="flex h-14 items-center justify-center rounded-lg bg-[#1f1f22] text-xl font-medium text-[#f5f5f5] transition-colors hover:bg-[#26262a]"
                      >
                        {key}
                      </button>
                    )
                  }
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <p className="mt-8 text-xs text-[#5b5b5e]">
        Shoppyrex SalesCoach · Private & Secure
      </p>
    </div>
  )
}
