"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trophy, ArrowLeft, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    identifier: "", // Can be first name or Aadhaar
    password: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const [loginError, setLoginError] = useState<string | null>(null)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.identifier.trim()) {
      newErrors.identifier = "First name or Aadhaar number is required"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      setIsLoading(true)
      setLoginError(null)

      try {
        let registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")

        if (registeredUsers.length === 0) {
          const demoUsers = [
            {
              firstName: "Rahul",
              lastName: "Sharma",
              gmail: "rahul.sharma@gmail.com",
              aadhaar: "123456789012",
              phone: "9876543210",
              password: "password123",
              state: "Maharashtra",
              district: "Mumbai",
              city: "Mumbai",
              pincode: "400001",
              registeredAt: new Date().toISOString(),
            },
            {
              firstName: "Priya",
              lastName: "Patel",
              gmail: "priya.patel@gmail.com",
              aadhaar: "987654321098",
              phone: "9123456789",
              password: "password123",
              state: "Gujarat",
              district: "Ahmedabad",
              city: "Ahmedabad",
              pincode: "380001",
              registeredAt: new Date().toISOString(),
            },
            {
              firstName: "Arjun",
              lastName: "Singh",
              gmail: "arjun.singh@gmail.com",
              aadhaar: "456789123456",
              phone: "9988776655",
              password: "password123",
              state: "Punjab",
              district: "Ludhiana",
              city: "Ludhiana",
              pincode: "141001",
              registeredAt: new Date().toISOString(),
            },
          ]
          localStorage.setItem("registeredUsers", JSON.stringify(demoUsers))
          registeredUsers = demoUsers
          console.log("[v0] Added demo users for testing")
        }

        console.log("[v0] Total registered users:", registeredUsers.length)
        console.log("[v0] Looking for identifier:", formData.identifier)
        console.log(
          "[v0] All registered users:",
          registeredUsers.map((u: any) => ({ firstName: u.firstName, aadhaar: u.aadhaar })),
        )

        const isAadhaar = /^\d{12}$/.test(formData.identifier.replace(/\s/g, ""))
        console.log("[v0] Is Aadhaar format:", isAadhaar)

        let foundUser = null

        if (isAadhaar) {
          const cleanAadhaar = formData.identifier.replace(/\s/g, "")
          console.log("[v0] Searching for Aadhaar:", cleanAadhaar)

          foundUser = registeredUsers.find((user: any) => user.aadhaar === cleanAadhaar)
          console.log("[v0] Found user by Aadhaar:", foundUser ? "Yes" : "No")

          if (!foundUser) {
            if (registeredUsers.length === 0) {
              throw new Error("No user accounts found in the system. Please register first.")
            } else {
              throw new Error(`No account found with this Aadhaar number. Please check your number or register first.`)
            }
          }
        } else {
          const matchingUsers = registeredUsers.filter(
            (user: any) => user.firstName.toLowerCase() === formData.identifier.trim().toLowerCase(),
          )
          console.log("[v0] Found users by first name:", matchingUsers.length)

          if (matchingUsers.length === 0) {
            if (registeredUsers.length === 0) {
              throw new Error("No user accounts found in the system. Please register first.")
            } else {
              throw new Error(
                `No account found with this first name. Please check spelling or use your Aadhaar number.`,
              )
            }
          }

          if (matchingUsers.length > 1) {
            throw new Error("Multiple accounts found with this name. Please use your Aadhaar number to login")
          }

          foundUser = matchingUsers[0]
        }

        if (foundUser.password !== formData.password) {
          throw new Error("Incorrect password. Please try again.")
        }

        console.log("[v0] Login successful for user:", foundUser.firstName)
        localStorage.setItem("currentUser", JSON.stringify(foundUser))

        setIsLoading(false)
        router.push("/sports-selection")
      } catch (error: any) {
        console.log("[v0] Login error:", error.message)
        setIsLoading(false)
        setLoginError(error.message || "Login failed. Please check your credentials.")
      }
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const getIdentifierPlaceholder = () => {
    const value = formData.identifier.replace(/\s/g, "")
    if (/^\d+$/.test(value)) {
      return "Aadhaar number"
    }
    return "First name or Aadhaar number"
  }

  const inputStyles = "bg-black/20 border-white/20 text-[#FAFDF6] focus:ring-[#DDD92A] focus:border-[#DDD92A]"

  return (
    <div className="min-h-screen bg-[#2D2A32] flex items-center justify-center py-8">
      <div className="max-w-md w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center space-x-2 text-[#EAE151] hover:text-[#DDD92A]">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center space-x-2">
            <Trophy className="h-6 w-6 text-[#DDD92A]" />
            <span className="font-bold text-[#FAFDF6]">Team Sankalp</span>
          </div>
        </div>

        <Card className="border-white/10 bg-[#2D2A32] shadow-lg">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl font-bold text-[#FAFDF6]">Welcome Back</CardTitle>
            <CardDescription className="text-[#EEEFA8]">Sign in to your athlete performance account</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="identifier" className="text-[#EEEFA8]">First Name or Aadhaar Number</Label>
                <Input
                  id="identifier"
                  value={formData.identifier}
                  onChange={(e) => handleInputChange("identifier", e.target.value)}
                  className={`${inputStyles} ${errors.identifier ? "border-red-500" : ""}`}
                  placeholder={getIdentifierPlaceholder()}
                />
                {errors.identifier && <p className="text-sm text-red-500">{errors.identifier}</p>}
                <p className="text-xs text-gray-400">You can login using either your first name or Aadhaar number</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#EEEFA8]">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className={`${inputStyles} ${errors.password ? "border-red-500" : ""} pr-10`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#FAFDF6]"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
              </div>

              {loginError && (
                <div className="bg-red-900/50 border border-red-500/50 rounded-lg p-4">
                  <p className="text-sm text-red-400">{loginError}</p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <Link href="/forgot-password" className="text-sm text-[#EAE151] hover:underline hover:text-[#DDD92A]">
                  Forgot your password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#DDD92A] hover:bg-[#c8c426] text-[#2D2A32] font-semibold py-3"
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <div className="text-center pt-4 border-t border-white/10">
              <p className="text-gray-400">
                Don't have an account?{" "}
                <Link href="/register" className="text-[#DDD92A] hover:underline font-medium">
                  Create one here
                </Link>
              </p>
            </div>

            <div className="bg-black/20 border border-white/10 rounded-lg p-4 space-y-2">
              <h4 className="font-medium text-[#FAFDF6] text-sm">Login Instructions</h4>
              <div className="text-xs text-[#EEEFA8] space-y-1">
                <p>
                  <strong>Aadhaar Login:</strong> Enter your 12-digit Aadhaar number and password
                </p>
                <p>
                  <strong>First Name Login:</strong> Enter your registered first name and password
                </p>
                <p className="text-[#DDD92A]">Both login methods are now supported</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}