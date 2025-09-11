"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Trophy, ArrowLeft, ArrowRight, Info, AlertTriangle, CheckCircle, XCircle, Phone, Mail } from "lucide-react"
import Link from "next/link"

interface FitnessData {
  height: string
  weight: string
}

interface HealthAnswers {
  chronicDisease: string
  chronicDiseaseDetails: string
  injury: string
  injuryDetails: string
  substances: string
  stress: string
  medications: string
  medicationDetails: string
}

export default function FitnessDetailsPage() {
  const [fitnessData, setFitnessData] = useState<FitnessData>({
    height: "",
    weight: "",
  })

  const [healthAnswers, setHealthAnswers] = useState<HealthAnswers>({
    chronicDisease: "",
    chronicDiseaseDetails: "",
    injury: "",
    injuryDetails: "",
    substances: "",
    stress: "",
    medications: "",
    medicationDetails: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isBlocked, setIsBlocked] = useState(false)
  const [blockingReasons, setBlockingReasons] = useState<string[]>([])
  const [showResults, setShowResults] = useState(false)

  const validateFitnessData = () => {
    const newErrors: Record<string, string> = {}

    if (
      !fitnessData.height ||
      Number.parseFloat(fitnessData.height) < 100 ||
      Number.parseFloat(fitnessData.height) > 250
    ) {
      newErrors.height = "Height must be between 100-250 cm"
    }

    if (
      !fitnessData.weight ||
      Number.parseFloat(fitnessData.weight) < 30 ||
      Number.parseFloat(fitnessData.weight) > 200
    ) {
      newErrors.weight = "Weight must be between 30-200 kg"
    }

    return newErrors
  }

  const validateHealthQuestionnaire = () => {
    const newErrors: Record<string, string> = {}
    const reasons: string[] = []

    if (!healthAnswers.chronicDisease) {
      newErrors.chronicDisease = "Please answer this question"
    } else if (healthAnswers.chronicDisease === "yes" && !healthAnswers.chronicDiseaseDetails.trim()) {
      newErrors.chronicDiseaseDetails = "Please specify your condition"
    } else if (healthAnswers.chronicDisease === "yes") {
      reasons.push("Chronic disease condition requires medical clearance")
    }

    if (!healthAnswers.injury) {
      newErrors.injury = "Please answer this question"
    } else if (healthAnswers.injury === "yes-recent" && !healthAnswers.injuryDetails.trim()) {
      newErrors.injuryDetails = "Please specify your recent injury"
    } else if (healthAnswers.injury === "yes-past" && !healthAnswers.injuryDetails.trim()) {
      newErrors.injuryDetails = "Please specify your past injury"
    } else if (healthAnswers.injury === "yes-recent") {
      reasons.push("Recent major injury requires medical clearance")
    }

    if (!healthAnswers.substances) {
      newErrors.substances = "Please answer this question"
    } else if (healthAnswers.substances === "yes-regularly") {
      reasons.push("Regular substance use is not compatible with athletic performance programs")
    }

    if (!healthAnswers.stress) {
      newErrors.stress = "Please answer this question"
    } else if (healthAnswers.stress === "often") {
      reasons.push("Frequent stress/anxiety may require professional support before athletic training")
    }

    if (!healthAnswers.medications) {
      newErrors.medications = "Please answer this question"
    } else if (healthAnswers.medications === "yes-daily" && !healthAnswers.medicationDetails.trim()) {
      newErrors.medicationDetails = "Please specify your daily medications"
    } else if (healthAnswers.medications === "yes-occasionally" && !healthAnswers.medicationDetails.trim()) {
      newErrors.medicationDetails = "Please specify your occasional medications"
    } else if (healthAnswers.medications === "yes-daily") {
      reasons.push("Daily medications require medical review for athletic participation")
    }

    return { errors: newErrors, blockingReasons: reasons }
  }

  const handleFitnessChange = (field: keyof FitnessData, value: string) => {
    setFitnessData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleHealthChange = (field: keyof HealthAnswers, value: string) => {
    setHealthAnswers((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const fitnessErrors = validateFitnessData()
    const { errors: healthErrors, blockingReasons: reasons } = validateHealthQuestionnaire()

    const allErrors = { ...fitnessErrors, ...healthErrors }
    setErrors(allErrors)

    if (Object.keys(allErrors).length === 0) {
      setBlockingReasons(reasons)
      setIsBlocked(reasons.length > 0)
      setShowResults(true)
    }
  }

  const calculateBMI = () => {
    if (fitnessData.height && fitnessData.weight) {
      const heightM = Number.parseFloat(fitnessData.height) / 100
      const weightKg = Number.parseFloat(fitnessData.weight)
      return (weightKg / (heightM * heightM)).toFixed(1)
    }
    return null
  }

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: "Underweight", color: "text-[#EAE151]" }
    if (bmi < 25) return { category: "Normal", color: "text-[#DDD92A]" }
    if (bmi < 30) return { category: "Overweight", color: "text-orange-400" }
    return { category: "Obese", color: "text-red-400" }
  }

  const inputStyles = "bg-black/20 border-white/20 text-[#FAFDF6] focus:ring-[#DDD92A] focus:border-[#DDD92A]"

  if (showResults) {
    return (
      <div className="min-h-screen bg-[#2D2A32] py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Trophy className="h-8 w-8 text-[#DDD92A]" />
              <span className="text-2xl font-bold text-[#FAFDF6]">Fitness & Health Assessment Results</span>
            </div>
          </div>

          <Card className="border-white/10 bg-[#2D2A32] shadow-lg">
            <CardHeader className="text-center space-y-4">
              <div
                className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto ${
                  isBlocked ? "bg-red-900/50" : "bg-black/20"
                }`}
              >
                {isBlocked ? (
                  <XCircle className="h-12 w-12 text-red-500" />
                ) : (
                  <CheckCircle className="h-12 w-12 text-[#DDD92A]" />
                )}
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-[#FAFDF6]">
                  {isBlocked ? "Medical Clearance Required" : "Assessment Complete"}
                </h2>
                <Badge
                  variant={isBlocked ? "destructive" : "default"}
                  className={isBlocked ? "bg-red-600 text-white" : "bg-[#DDD92A] text-[#2D2A32] font-semibold"}
                >
                  {isBlocked ? "BLOCKED" : "CLEARED"}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {isBlocked ? (
                <div className="bg-red-900/50 border border-red-500/50 rounded-lg p-6 space-y-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-6 w-6 text-red-400 mt-0.5" />
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-red-300">Cannot Proceed Without Medical Clearance</h3>
                      <p className="text-red-400">
                        Based on your health questionnaire responses, you require medical clearance before participating
                        in our athletic performance program.
                      </p>

                      <div className="space-y-2">
                        <h4 className="font-medium text-red-300">Reasons for Medical Review:</h4>
                        <ul className="text-sm text-red-400 space-y-1">
                          {blockingReasons.map((reason, index) => (
                            <li key={index}>• {reason}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-3 pt-4 border-t border-red-500/30">
                        <h4 className="font-medium text-red-300">Next Steps:</h4>
                        <ol className="text-sm text-red-400 space-y-1">
                          <li>1. Consult with a qualified sports medicine physician</li>
                          <li>2. Obtain medical clearance for athletic participation</li>
                          <li>3. Submit medical clearance certificate to our team</li>
                          <li>4. Return to complete your athlete assessment</li>
                        </ol>
                      </div>

                      <div className="bg-red-900/60 border border-red-500/60 rounded-lg p-4 space-y-2">
                        <h4 className="font-medium text-red-300">Contact Information</h4>
                        <div className="text-sm text-red-400 space-y-1">
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4" />
                            <span>Medical Support: +91 98765 43210</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4" />
                            <span>Email: medical@teamsankalp.in</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-black/20 border border-[#DDD92A]/50 rounded-lg p-6 space-y-4">
                  <h3 className="text-lg font-semibold text-[#FAFDF6]">Health Assessment Passed</h3>
                  <p className="text-[#EEEFA8]">
                    Congratulations! You have successfully completed the fitness and health assessment. You are cleared
                    to proceed to the video analysis and performance evaluation stage.
                  </p>

                  <div className="pt-4">
                    <div className="space-y-2">
                      <h4 className="font-medium text-[#FAFDF6]">Fitness Metrics</h4>
                      <div className="text-sm text-[#EEEFA8] space-y-1">
                        <div className="flex justify-between">
                          <span>Height:</span>
                          <span>{fitnessData.height} cm</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Weight:</span>
                          <span>{fitnessData.weight} kg</span>
                        </div>
                        {calculateBMI() && (
                          <div className="flex justify-between">
                            <span>BMI:</span>
                            <span className={getBMICategory(Number.parseFloat(calculateBMI()!)).color}>
                              {calculateBMI()} ({getBMICategory(Number.parseFloat(calculateBMI()!)).category})
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex space-x-4">
                {isBlocked ? (
                  <>
                    <Link href="/sports-selection" className="flex-1">
                      <Button
                        variant="outline"
                        className="w-full bg-transparent border-[#EAE151] text-[#EAE151] hover:bg-white/10"
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Sports Selection
                      </Button>
                    </Link>
                    <Button
                      onClick={() => {
                        setShowResults(false)
                        setIsBlocked(false)
                        setBlockingReasons([])
                      }}
                      className="flex-1 bg-[#DDD92A] hover:bg-[#c8c426] text-[#2D2A32] font-semibold"
                    >
                      Retake Assessment
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowResults(false)
                      }}
                      className="flex-1 bg-transparent border-[#EAE151] text-[#EAE151] hover:bg-white/10"
                    >
                      Edit Details
                    </Button>
                    <Link href="/video-analysis" className="flex-1">
                      <Button className="w-full bg-[#DDD92A] hover:bg-[#c8c426] text-[#2D2A32] font-semibold">
                        Continue to Video Analysis
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-[#2D2A32] py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/excellence/athletics"
              className="flex items-center space-x-2 text-[#EAE151] hover:text-[#DDD92A]"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Excellence</span>
            </Link>
            <div className="flex items-center space-x-2">
              <Trophy className="h-6 w-6 text-[#DDD92A]" />
              <span className="font-bold text-[#FAFDF6]">Fitness & Health Assessment</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <Card className="border-white/10 bg-[#2D2A32] shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-[#FAFDF6]">Fitness Metrics</CardTitle>
                <CardDescription className="text-[#EEEFA8]">
                  Provide your current fitness measurements. Use the info icons for measurement guidance.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="height" className="text-[#EEEFA8]">Height (cm) *</Label>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-[#2D2A32] border-white/20 text-[#FAFDF6]">
                          <p>Measure height without shoes, standing straight against a wall</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Input
                      id="height"
                      type="number"
                      value={fitnessData.height}
                      onChange={(e) => handleFitnessChange("height", e.target.value)}
                      className={`${inputStyles} ${errors.height ? "border-red-500" : ""}`}
                      placeholder="175"
                    />
                    {errors.height && <p className="text-sm text-red-500">{errors.height}</p>}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="weight" className="text-[#EEEFA8]">Weight (kg) *</Label>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-[#2D2A32] border-white/20 text-[#FAFDF6]">
                          <p>Measure weight in the morning, without heavy clothing</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Input
                      id="weight"
                      type="number"
                      value={fitnessData.weight}
                      onChange={(e) => handleFitnessChange("weight", e.target.value)}
                      className={`${inputStyles} ${errors.weight ? "border-red-500" : ""}`}
                      placeholder="70"
                      step="0.1"
                    />
                    {errors.weight && <p className="text-sm text-red-500">{errors.weight}</p>}
                  </div>
                </div>

                {calculateBMI() && (
                  <div className="bg-black/20 border border-white/10 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#EEEFA8]">Body Mass Index (BMI):</span>
                      <span className={`font-medium ${getBMICategory(Number.parseFloat(calculateBMI()!)).color}`}>
                        {calculateBMI()} - {getBMICategory(Number.parseFloat(calculateBMI()!)).category}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-[#2D2A32] shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-[#FAFDF6]">Health Questionnaire</CardTitle>
                <CardDescription className="text-[#EEEFA8]">
                  Please answer all questions honestly. This information is crucial for your safety and program
                  eligibility.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {[
                  { id: "chronic", question: "1. Do you have any chronic disease (e.g., asthma, diabetes, heart disease)? *", field: "chronicDisease", detailsField: "chronicDiseaseDetails", options: [{ value: "yes", label: "Yes" }, { value: "no", label: "No" }], detailsPlaceholder: "Describe your chronic condition(s)" },
                  { id: "injury", question: "2. Have you ever had any major injury or surgery? *", field: "injury", detailsField: "injuryDetails", options: [{ value: "yes-recent", label: "Yes, in the past year" }, { value: "yes-past", label: "Yes, more than a year ago" }, { value: "no", label: "No" }], detailsPlaceholder: "Describe your injury or surgery" },
                  { id: "substances", question: "3. Do you smoke, drink alcohol, or use any substances? *", field: "substances", options: [{ value: "yes-regularly", label: "Yes (regularly)" }, { value: "yes-occasionally", label: "Yes (occasionally)" }, { value: "no", label: "No" }] },
                  { id: "stress", question: "4. Do you experience stress, anxiety, or fatigue related to sports performance? *", field: "stress", options: [{ value: "often", label: "Often" }, { value: "sometimes", label: "Sometimes" }, { value: "rarely", label: "Rarely" }, { value: "never", label: "Never" }] },
                  { id: "meds", question: "5. Are you currently taking any medications? *", field: "medications", detailsField: "medicationDetails", options: [{ value: "yes-daily", label: "Yes (daily)" }, { value: "yes-occasionally", label: "Yes (occasionally)" }, { value: "no", label: "No" }], detailsPlaceholder: "List your medications and dosages" }
                ].map(item => (
                  <div key={item.id} className="space-y-3">
                    <Label className="text-base font-medium text-[#FAFDF6]">{item.question}</Label>
                    <RadioGroup
                      value={healthAnswers[item.field as keyof HealthAnswers]}
                      onValueChange={(value) => handleHealthChange(item.field as keyof HealthAnswers, value)}
                      className="text-[#EEEFA8]"
                    >
                      {item.options.map(option => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <RadioGroupItem value={option.value} id={`${item.id}-${option.value}`} className="border-white/20 data-[state=checked]:border-[#DDD92A] data-[state=checked]:text-[#DDD92A]" />
                          <Label htmlFor={`${item.id}-${option.value}`}>{option.label}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                    {item.detailsField && (healthAnswers[item.field as keyof HealthAnswers].startsWith('yes')) && (
                      <div className="space-y-2">
                        <Label htmlFor={`${item.id}Details`} className="text-[#EEEFA8]">Please specify details *</Label>
                        <Textarea
                          id={`${item.id}Details`}
                          value={healthAnswers[item.detailsField as keyof HealthAnswers]}
                          onChange={(e) => handleHealthChange(item.detailsField as keyof HealthAnswers, e.target.value)}
                          className={`${inputStyles} ${errors[item.detailsField] ? "border-red-500" : ""}`}
                          placeholder={item.detailsPlaceholder}
                        />
                        {errors[item.detailsField] && <p className="text-sm text-red-500">{errors[item.detailsField]}</p>}
                      </div>
                    )}
                    {errors[item.field] && <p className="text-sm text-red-500">{errors[item.field]}</p>}
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="flex justify-center">
              <Button type="submit" className="bg-[#DDD92A] hover:bg-[#c8c426] text-[#2D2A32] font-semibold px-8 py-3">
                Complete Assessment
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </TooltipProvider>
  )
}
