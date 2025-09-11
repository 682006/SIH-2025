"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, ArrowLeft, ArrowRight, Target, Zap, Award } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const olympicSports = [
  {
    id: "athletics",
    name: "Athletics",
    description: "Track and field events including running, jumping, and throwing disciplines",
    icon: "🏃‍♂️",
    category: "Track & Field",
    events: ["100m Sprint", "Marathon", "Long Jump", "Shot Put", "Javelin"],
  },
  {
    id: "swimming",
    name: "Swimming",
    description: "Individual swimming events across all four strokes and distances",
    icon: "🏊‍♂️",
    category: "Aquatic",
    events: ["Freestyle", "Backstroke", "Breaststroke", "Butterfly", "Individual Medley"],
  },
  {
    id: "tennis",
    name: "Tennis (Singles)",
    description: "Individual tennis competition with precision, strategy, and endurance",
    icon: "🎾",
    category: "Racquet Sports",
    events: ["Singles Match Play", "Tournament Format"],
  },
  {
    id: "badminton",
    name: "Badminton (Singles)",
    description: "Fast-paced racquet sport requiring agility and quick reflexes",
    icon: "🏸",
    category: "Racquet Sports",
    events: ["Singles Match Play", "Tournament Format"],
  },
  {
    id: "table-tennis",
    name: "Table Tennis (Singles)",
    description: "High-speed precision sport with exceptional hand-eye coordination",
    icon: "🏓",
    category: "Racquet Sports",
    events: ["Singles Match Play", "Tournament Format"],
  },
  {
    id: "boxing",
    name: "Boxing",
    description: "Combat sport emphasizing technique, strategy, and physical conditioning",
    icon: "🥊",
    category: "Combat Sports",
    events: ["Weight Categories", "Amateur Boxing Rules"],
  },
  {
    id: "judo",
    name: "Judo",
    description: "Martial art focusing on throws, grappling, and ground techniques",
    icon: "🥋",
    category: "Combat Sports",
    events: ["Weight Categories", "Kata & Randori"],
  },
  {
    id: "taekwondo",
    name: "Taekwondo",
    description: "Korean martial art emphasizing high kicks and fast techniques",
    icon: "🦵",
    category: "Combat Sports",
    events: ["Weight Categories", "Poomsae & Sparring"],
  },
  {
    id: "wrestling",
    name: "Wrestling",
    description: "Grappling sport requiring strength, technique, and mental toughness",
    icon: "🤼‍♂️",
    category: "Combat Sports",
    events: ["Freestyle", "Greco-Roman", "Weight Categories"],
  },
  {
    id: "weightlifting",
    name: "Weightlifting",
    description: "Olympic lifting focusing on snatch and clean & jerk techniques",
    icon: "🏋️‍♂️",
    category: "Strength Sports",
    events: ["Snatch", "Clean & Jerk", "Weight Categories"],
  },
  {
    id: "archery",
    name: "Archery",
    description: "Precision sport requiring focus, consistency, and mental discipline",
    icon: "🏹",
    category: "Precision Sports",
    events: ["Recurve Bow", "Target Archery", "Individual & Team"],
  },
  {
    id: "shooting",
    name: "Shooting",
    description: "Precision marksmanship in various disciplines and distances",
    icon: "🎯",
    category: "Precision Sports",
    events: ["Air Rifle", "Air Pistol", "Sport Pistol", "Trap", "Skeet"],
  },
  {
    id: "golf",
    name: "Golf",
    description: "Individual stroke play requiring precision, strategy, and mental focus",
    icon: "⛳",
    category: "Precision Sports",
    events: ["Stroke Play", "Individual Competition"],
  },
  {
    id: "cycling",
    name: "Cycling (Individual)",
    description: "Individual cycling events including road, track, and time trials",
    icon: "🚴‍♂️",
    category: "Endurance Sports",
    events: ["Road Race", "Time Trial", "Track Cycling", "Mountain Bike"],
  },
  {
    id: "gymnastics",
    name: "Gymnastics (Individual)",
    description: "Artistic gymnastics showcasing strength, flexibility, and precision",
    icon: "🤸‍♂️",
    category: "Artistic Sports",
    events: ["Floor Exercise", "Vault", "Parallel Bars", "Rings", "Pommel Horse"],
  },
  {
    id: "triathlon",
    name: "Triathlon",
    description: "Multi-discipline endurance sport combining swimming, cycling, and running",
    icon: "🏊‍♂️🚴‍♂️🏃‍♂️",
    category: "Endurance Sports",
    events: ["Olympic Distance", "Sprint Distance"],
  },
]

const categories = [
  "All Sports",
  "Track & Field",
  "Aquatic",
  "Racquet Sports",
  "Combat Sports",
  "Strength Sports",
  "Precision Sports",
  "Endurance Sports",
  "Artistic Sports",
]

const skillLevels = ["Beginner", "Intermediate", "Advanced"]

export default function SportsSelectionPage() {
  const [selectedCategory, setSelectedCategory] = useState("All Sports")
  const [selectedSport, setSelectedSport] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const checkUser = () => {
      const currentUser = localStorage.getItem("currentUser")

      if (!currentUser) {
        router.push("/login")
        return
      }

      setUser(JSON.parse(currentUser))
    }

    checkUser()
  }, [router])

  const filteredSports =
    selectedCategory === "All Sports"
      ? olympicSports
      : olympicSports.filter((sport) => sport.category === selectedCategory)

  const handleConfirmSelection = async (sportId: string, level: string) => {
    if (!user || isLoading) return

    setIsLoading(true)

    try {
      const selectedSportData = olympicSports.find((sport) => sport.id === sportId)
      if (!selectedSportData) throw new Error("Sport not found")

      const sportSelection = {
        userId: user.aadhaar,
        sportName: selectedSportData.name,
        sportCategory: selectedSportData.category,
        skillLevel: level, // Added skill level
        selectedAt: new Date().toISOString(),
      }

      const existingSelections = JSON.parse(localStorage.getItem("sportsSelections") || "[]")
      const filteredSelections = existingSelections.filter((selection: any) => selection.userId !== user.aadhaar)

      filteredSelections.push(sportSelection)
      localStorage.setItem("sportsSelections", JSON.stringify(filteredSelections))

      router.push(`/excellence/${sportId}`)
    } catch (error) {
      console.error("Error:", error)
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#2D2A32] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#DDD92A] mx-auto mb-4"></div>
          <p className="text-[#FAFDF6]">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#2D2A32]">
      {/* Header */}
      <div className="bg-[#2D2A32]/80 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/register" className="flex items-center space-x-2 text-[#EAE151] hover:text-[#DDD92A]">
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Registration</span>
            </Link>
            <div className="flex items-center space-x-2">
              <Trophy className="h-6 w-6 text-[#DDD92A]" />
              <span className="font-bold text-[#FAFDF6]">Team Sankalp</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-12">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl font-bold text-[#FAFDF6]">
              Choose Your
              <span className="text-[#DDD92A] block">Olympic Sport</span>
            </h1>
            <p className="text-xl text-[#EEEFA8] max-w-3xl mx-auto leading-relaxed">
              Select from 16 individual Olympic sports. Each sport has specialized analysis and performance metrics tailored to help you excel in your chosen discipline.
            </p>
          </div>

          {/* Stats */}
          <div className="flex justify-center space-x-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#DDD92A]">16</div>
              <div className="text-sm text-[#EEEFA8]">Olympic Sports</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#DDD92A]">8</div>
              <div className="text-sm text-[#EEEFA8]">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#DDD92A]">100%</div>
              <div className="text-sm text-[#EEEFA8]">Individual Events</div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={
                  selectedCategory === category
                    ? "bg-[#DDD92A] hover:bg-[#c8c426] text-[#2D2A32] font-semibold"
                    : "border-[#EAE151] text-[#EAE151] hover:bg-white/10"
                }
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Sports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {filteredSports.map((sport) => (
            <Card
              key={sport.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-[#2D2A32] border border-white/10 ${
                selectedSport === sport.id ? "ring-2 ring-[#DDD92A] bg-black/20" : "hover:border-[#DDD92A]/50"
              } ${isLoading ? "opacity-50 pointer-events-none" : ""}`}
              onClick={() => {
                if (isLoading) return
                setSelectedSport((prev) => (prev === sport.id ? null : sport.id))
              }}
            >
              <CardHeader className="text-center space-y-3">
                <div className="text-4xl mx-auto">{sport.icon}</div>
                <div className="space-y-2">
                  <CardTitle className="text-lg font-semibold text-[#FAFDF6]">{sport.name}</CardTitle>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {selectedSport === sport.id ? (
                  <div className="flex flex-col items-center space-y-3 py-2">
                    <h4 className="font-semibold text-[#FAFDF6]">Select Your Pace</h4>
                    <div className="flex flex-col gap-2 w-full">
                      {skillLevels.map((level) => (
                        <Button
                          key={level}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleConfirmSelection(sport.id, level)
                          }}
                          className="w-full bg-[#DDD92A] hover:bg-[#c8c426] text-[#2D2A32] font-semibold"
                        >
                          {level}
                        </Button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    <CardDescription className="text-sm text-[#EEEFA8] leading-relaxed h-12">{sport.description}</CardDescription>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-[#FAFDF6]">Key Events:</h4>
                      <div className="flex flex-wrap gap-1">
                        {sport.events.slice(0, 2).map((event, index) => (
                          <Badge key={index} variant="outline" className="text-xs border-[#EAE151]/50 text-[#EAE151]">
                            {event}
                          </Badge>
                        ))}
                        {sport.events.length > 2 && (
                          <Badge variant="outline" className="text-xs border-white/20 text-gray-400">
                            +{sport.events.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </>
                )}

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-gray-400">{sport.category}</span>
                  {selectedSport === sport.id && isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#DDD92A]"></div>
                  ) : (
                    <ArrowRight className="h-4 w-4 text-[#DDD92A]" />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Information Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="border-white/10 bg-black/20">
            <CardContent className="p-6 text-center space-y-3">
              <div className="w-12 h-12 bg-[#2D2A32] rounded-lg flex items-center justify-center mx-auto">
                <Target className="h-6 w-6 text-[#DDD92A]" />
              </div>
              <h3 className="font-semibold text-[#FAFDF6]">Specialized Analysis</h3>
              <p className="text-sm text-[#EEEFA8]">Each sport has custom performance metrics and analysis techniques designed for optimal results.</p>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-black/20">
            <CardContent className="p-6 text-center space-y-3">
              <div className="w-12 h-12 bg-[#2D2A32] rounded-lg flex items-center justify-center mx-auto">
                <Zap className="h-6 w-6 text-[#DDD92A]" />
              </div>
              <h3 className="font-semibold text-[#FAFDF6]">Excellence Testing</h3>
              <p className="text-sm text-[#EEEFA8]">Sport-specific questionnaires and benchmarks to assess your potential and readiness.</p>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-black/20">
            <CardContent className="p-6 text-center space-y-3">
              <div className="w-12 h-12 bg-[#2D2A32] rounded-lg flex items-center justify-center mx-auto">
                <Award className="h-6 w-6 text-[#DDD92A]" />
              </div>
              <h3 className="font-semibold text-[#FAFDF6]">Olympic Standards</h3>
              <p className="text-sm text-[#EEEFA8]">All sports follow official Olympic guidelines and international competition standards.</p>
            </CardContent>
          </Card>
        </div>

        {/* Next Steps */}
        <div className="bg-[#DDD92A] rounded-2xl p-8 text-center text-[#2D2A32]">
          <h2 className="text-2xl font-bold mb-4">What Happens Next?</h2>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div className="space-y-2">
              <div className="w-8 h-8 bg-[#2D2A32]/20 rounded-full flex items-center justify-center mx-auto text-lg font-bold">1</div>
              <h3 className="font-semibold">Excellence Assessment</h3>
              <p className="text-[#2D2A32]/80">Complete sport-specific questions to evaluate your knowledge and experience</p>
            </div>
            <div className="space-y-2">
              <div className="w-8 h-8 bg-[#2D2A32]/20 rounded-full flex items-center justify-center mx-auto text-lg font-bold">2</div>
              <h3 className="font-semibold">Fitness Evaluation</h3>
              <p className="text-[#2D2A32]/80">Provide fitness metrics and complete health questionnaire</p>
            </div>
            <div className="space-y-2">
              <div className="w-8 h-8 bg-[#2D2A32]/20 rounded-full flex items-center justify-center mx-auto text-lg font-bold">3</div>
              <h3 className="font-semibold">Performance Analysis</h3>
              <p className="text-[#2D2A32]/80">Upload videos for AI-powered technique and performance analysis</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}