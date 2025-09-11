"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Trophy,
  ArrowLeft,
  Upload,
  Play,
  BarChart3,
  Target,
  Zap,
  TrendingUp,
  Medal,
  Star,
  Clock,
  Ruler,
  Activity,
} from "lucide-react"
import Link from "next/link"

interface AnalysisResult {
  jumpHeight: number
  strideLength: number
  jointAngles: {
    knee: number
    ankle: number
    hip: number
  }
  speed: number
  balance: number
  technique: number
  overallScore: number
  summary: string
  recommendations: string[]
}

interface LeaderboardEntry {
  rank: number
  name: string
  sport: string
  score: number
  tier: "Beginner" | "Intermediate" | "Advanced"
  location: string
}

const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, name: "Arjun Kumar", sport: "Athletics", score: 95, tier: "Advanced", location: "Delhi" },
  { rank: 2, name: "Priya Sharma", sport: "Swimming", score: 92, tier: "Advanced", location: "Mumbai" },
  { rank: 3, name: "Rohit Singh", sport: "Boxing", score: 89, tier: "Advanced", location: "Punjab" },
  { rank: 4, name: "Anita Patel", sport: "Badminton", score: 85, tier: "Intermediate", location: "Gujarat" },
  { rank: 5, name: "Vikram Reddy", sport: "Tennis", score: 82, tier: "Intermediate", location: "Hyderabad" },
  { rank: 6, name: "Sneha Gupta", sport: "Athletics", score: 78, tier: "Intermediate", location: "Bangalore" },
  { rank: 7, name: "Rajesh Kumar", sport: "Wrestling", score: 75, tier: "Intermediate", location: "Haryana" },
  { rank: 8, name: "Meera Joshi", sport: "Archery", score: 72, tier: "Beginner", location: "Rajasthan" },
  { rank: 9, name: "Amit Verma", sport: "Cycling", score: 68, tier: "Beginner", location: "UP" },
  { rank: 10, name: "Kavya Nair", sport: "Gymnastics", score: 65, tier: "Beginner", location: "Kerala" },
]

export default function VideoAnalysisPage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [currentStep, setCurrentStep] = useState("")

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      setAnalysisResult(null)
    }
  }, [])

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file && file.type.startsWith("video/")) {
      setUploadedFile(file)
      setAnalysisResult(null)
    }
  }, [])

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }, [])

  const startAnalysis = () => {
    if (!uploadedFile) return

    setIsAnalyzing(true)
    setAnalysisProgress(0)
    setCurrentStep("Initializing AI analysis...")

    const steps = [
      "Loading video frames...",
      "Detecting human pose with MediaPipe...",
      "Analyzing joint movements...",
      "Calculating biomechanics with OpenCV...",
      "Processing performance metrics...",
      "Generating recommendations...",
      "Finalizing analysis report...",
    ]

    let stepIndex = 0
    const interval = setInterval(() => {
      stepIndex++
      const progress = (stepIndex / steps.length) * 100

      if (stepIndex < steps.length) {
        setCurrentStep(steps[stepIndex])
        setAnalysisProgress(progress)
      } else {
        clearInterval(interval)
        setAnalysisProgress(100)
        setCurrentStep("Analysis complete!")

        setTimeout(() => {
          const mockResult: AnalysisResult = {
            jumpHeight: Math.round((Math.random() * 30 + 40) * 10) / 10,
            strideLength: Math.round((Math.random() * 0.5 + 1.2) * 100) / 100,
            jointAngles: {
              knee: Math.round(Math.random() * 20 + 140),
              ankle: Math.round(Math.random() * 15 + 85),
              hip: Math.round(Math.random() * 25 + 160),
            },
            speed: Math.round((Math.random() * 5 + 8) * 10) / 10,
            balance: Math.round(Math.random() * 20 + 75),
            technique: Math.round(Math.random() * 25 + 70),
            overallScore: Math.round(Math.random() * 20 + 75),
            summary:
              "Your performance analysis shows good fundamental technique with room for improvement in specific areas. Your biomechanical efficiency is above average, indicating solid training foundation.",
            recommendations: [
              "Focus on improving knee drive during acceleration phase",
              "Work on maintaining consistent stride length throughout the movement",
              "Strengthen core muscles to improve overall balance and stability",
              "Practice landing mechanics to optimize joint angles",
              "Incorporate plyometric exercises to enhance explosive power",
            ],
          }
          setAnalysisResult(mockResult)
          setIsAnalyzing(false)

          const newEntry: LeaderboardEntry = {
            rank: mockLeaderboard.length + 1,
            name: "You",
            sport: "Athletics",
            score: mockResult.overallScore,
            tier:
              mockResult.overallScore >= 85 ? "Advanced" : mockResult.overallScore >= 70 ? "Intermediate" : "Beginner",
            location: "Current User",
          }
          mockLeaderboard.push(newEntry)
          mockLeaderboard.sort((a, b) => b.score - a.score)
          mockLeaderboard.forEach((entry, index) => {
            entry.rank = index + 1
          })
        }, 1000)
      }
    }, 800)
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Advanced":
        return "bg-[#DDD92A] text-[#2D2A32] border-[#DDD92A]/50"
      case "Intermediate":
        return "bg-[#EAE151] text-[#2D2A32] border-[#EAE151]/50"
      case "Beginner":
        return "bg-white/10 text-[#EEEFA8] border-white/20"
      default:
        return "bg-white/10 text-gray-300 border-white/20"
    }
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-[#DDD92A]" />
    if (rank === 2) return <Medal className="h-5 w-5 text-[#EEEFA8]" />
    if (rank === 3) return <Medal className="h-5 w-5 text-[#EAE151]" />
    return <Star className="h-5 w-5 text-gray-500" />
  }

  return (
    <div className="min-h-screen bg-[#2D2A32] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/fitness-details" className="flex items-center space-x-2 text-[#EAE151] hover:text-[#DDD92A]">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Fitness Details</span>
          </Link>
          <div className="flex items-center space-x-2">
            <Trophy className="h-6 w-6 text-[#DDD92A]" />
            <span className="font-bold text-[#FAFDF6]">Video Performance Analysis</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Analysis Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upload Section */}
            <Card className="border-white/10 bg-[#2D2A32] shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-[#FAFDF6]">Upload Performance Video</CardTitle>
                <CardDescription className="text-[#EEEFA8]">
                  Upload a video of your athletic performance for AI-powered analysis using MediaPipe and OpenCV
                  technology.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {!uploadedFile ? (
                  <div
                    className="border-2 border-dashed border-[#EAE151]/50 rounded-lg p-8 text-center hover:border-[#DDD92A] transition-colors cursor-pointer"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onClick={() => document.getElementById("video-upload")?.click()}
                  >
                    <Upload className="h-12 w-12 text-[#EAE151] mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-[#FAFDF6] mb-2">Upload Video File</h3>
                    <p className="text-[#EEEFA8] mb-4">Drag and drop your video here, or click to browse files</p>
                    <p className="text-sm text-gray-400">Supported formats: MP4, MOV, AVI, WMV (Max size: 100MB)</p>
                    <input
                      id="video-upload"
                      type="file"
                      accept="video/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-black/20 border border-[#DDD92A]/50 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <Play className="h-6 w-6 text-[#DDD92A]" />
                        <div>
                          <h4 className="font-medium text-[#FAFDF6]">{uploadedFile.name}</h4>
                          <p className="text-sm text-[#EEEFA8]">
                            Size: {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                    </div>

                    {!isAnalyzing && !analysisResult && (
                      <Button onClick={startAnalysis} className="w-full bg-[#DDD92A] hover:bg-[#c8c426] text-[#2D2A32] font-semibold">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Start AI Analysis
                      </Button>
                    )}
                  </div>
                )}

                {/* Analysis Progress */}
                {isAnalyzing && (
                  <div className="space-y-4">
                    <div className="bg-black/20 border border-white/10 rounded-lg p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <Activity className="h-6 w-6 text-[#EAE151] animate-pulse" />
                        <h3 className="text-lg font-medium text-[#FAFDF6]">
                          AI Analyzing Video with MediaPipe + OpenCV
                        </h3>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-[#EEEFA8]">{currentStep}</span>
                          <span className="text-[#EAE151]">{Math.round(analysisProgress)}%</span>
                        </div>
                        <Progress value={analysisProgress} className="h-3 [&>div]:bg-[#DDD92A]" />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Analysis Results */}
            {analysisResult && (
              <Card className="border-white/10 bg-[#2D2A32] shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-[#FAFDF6]">Performance Analysis Results</CardTitle>
                  <CardDescription className="text-[#EEEFA8]">
                    AI-powered biomechanical analysis of your athletic performance
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Overall Score */}
                  <div className="text-center space-y-2">
                    <div className="text-4xl font-bold text-[#DDD92A]">{analysisResult.overallScore}/100</div>
                    <Badge
                      className={getTierColor(
                        analysisResult.overallScore >= 85
                          ? "Advanced"
                          : analysisResult.overallScore >= 70
                          ? "Intermediate"
                          : "Beginner",
                      )}
                    >
                      {analysisResult.overallScore >= 85
                        ? "Advanced"
                        : analysisResult.overallScore >= 70
                        ? "Intermediate"
                        : "Beginner"}{" "}
                      Level
                    </Badge>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { icon: Zap, value: `${analysisResult.jumpHeight} cm`, label: "Jump Height" },
                      { icon: Ruler, value: `${analysisResult.strideLength} m`, label: "Stride Length" },
                      { icon: TrendingUp, value: `${analysisResult.speed} m/s`, label: "Average Speed" },
                      { icon: Target, value: `${analysisResult.balance}%`, label: "Balance Score" },
                      { icon: Activity, value: `${analysisResult.technique}%`, label: "Technique Score" },
                      { icon: Clock, value: `K: ${analysisResult.jointAngles.knee}°`, label: "Knee Angle" },
                    ].map((metric, index) => (
                      <div key={index} className="bg-black/20 rounded-lg p-4 text-center">
                        <metric.icon className="h-6 w-6 text-[#DDD92A] mx-auto mb-2" />
                        <div className="text-2xl font-bold text-[#FAFDF6]">{metric.value}</div>
                        <div className="text-sm text-[#EEEFA8]">{metric.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Joint Angles */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-[#FAFDF6]">Joint Angle Analysis</h4>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <div className="font-medium text-[#FAFDF6]">{analysisResult.jointAngles.knee}°</div>
                        <div className="text-gray-400">Knee</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-[#FAFDF6]">{analysisResult.jointAngles.ankle}°</div>
                        <div className="text-gray-400">Ankle</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-[#FAFDF6]">{analysisResult.jointAngles.hip}°</div>
                        <div className="text-gray-400">Hip</div>
                      </div>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-[#FAFDF6]">Performance Summary</h4>
                    <p className="text-[#EEEFA8] leading-relaxed">{analysisResult.summary}</p>
                  </div>

                  {/* Recommendations */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-[#FAFDF6]">Training Recommendations</h4>
                    <ul className="space-y-2">
                      {analysisResult.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <Target className="h-4 w-4 text-[#DDD92A] mt-0.5 flex-shrink-0" />
                          <span className="text-[#EEEFA8] text-sm">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex space-x-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setUploadedFile(null)
                        setAnalysisResult(null)
                      }}
                      className="flex-1 bg-transparent border-[#EAE151] text-[#EAE151] hover:bg-white/10"
                    >
                      Analyze Another Video
                    </Button>
                    <Link href="/admin" className="flex-1">
                      <Button className="w-full bg-[#DDD92A] hover:bg-[#c8c426] text-[#2D2A32] font-semibold">
                        View Full Report
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Leaderboard Sidebar */}
          <div className="space-y-6">
            <Card className="border-white/10 bg-[#2D2A32] shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg text-[#FAFDF6] flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-[#DDD92A]" />
                  <span>Performance Leaderboard</span>
                </CardTitle>
                <CardDescription className="text-[#EEEFA8]">Top athletes across all sports categories</CardDescription>
              </CardHeader>

              <CardContent>
                <Tabs defaultValue="all" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-4 bg-black/20">
                    <TabsTrigger value="all" className="text-gray-400 data-[state=active]:bg-[#2D2A32] data-[state=active]:text-[#DDD92A]">All</TabsTrigger>
                    <TabsTrigger value="advanced" className="text-gray-400 data-[state=active]:bg-[#2D2A32] data-[state=active]:text-[#DDD92A]">Advanced</TabsTrigger>
                    <TabsTrigger value="intermediate" className="text-gray-400 data-[state=active]:bg-[#2D2A32] data-[state=active]:text-[#DDD92A]">Inter</TabsTrigger>
                    <TabsTrigger value="beginner" className="text-gray-400 data-[state=active]:bg-[#2D2A32] data-[state=active]:text-[#DDD92A]">Begin</TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="space-y-3">
                    {mockLeaderboard.slice(0, 10).map((entry) => (
                      <div
                        key={entry.rank}
                        className={`flex items-center space-x-3 p-3 rounded-lg border ${
                          entry.name === "You" ? "bg-black/20 border-[#DDD92A]" : "border-white/10"
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          {getRankIcon(entry.rank)}
                          <span className="font-medium text-[#FAFDF6]">#{entry.rank}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-[#FAFDF6] truncate">{entry.name}</div>
                          <div className="text-xs text-gray-400">
                            {entry.sport} • {entry.location}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-[#DDD92A]">{entry.score}</div>
                          <Badge variant="outline" className={`text-xs font-semibold ${getTierColor(entry.tier)}`}>
                            {entry.tier}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </TabsContent>

                  {/* Other Tabs Content similar to 'all' */}
                  <TabsContent value="advanced" className="space-y-3">
                    {mockLeaderboard
                      .filter((entry) => entry.tier === "Advanced")
                      .map((entry) => (
                        <div
                          key={entry.rank}
                          className={`flex items-center space-x-3 p-3 rounded-lg border ${
                            entry.name === "You" ? "bg-black/20 border-[#DDD92A]" : "border-white/10"
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            {getRankIcon(entry.rank)}
                            <span className="font-medium text-[#FAFDF6]">#{entry.rank}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-[#FAFDF6] truncate">{entry.name}</div>
                            <div className="text-xs text-gray-400">
                              {entry.sport} • {entry.location}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-[#DDD92A]">{entry.score}</div>
                            <Badge variant="outline" className={`text-xs font-semibold ${getTierColor(entry.tier)}`}>
                              {entry.tier}
                            </Badge>
                          </div>
                        </div>
                      ))}
                  </TabsContent>
                  <TabsContent value="intermediate" className="space-y-3">
                    {mockLeaderboard
                      .filter((entry) => entry.tier === "Intermediate")
                      .map((entry) => (
                        <div
                          key={entry.rank}
                          className={`flex items-center space-x-3 p-3 rounded-lg border ${
                            entry.name === "You" ? "bg-black/20 border-[#DDD92A]" : "border-white/10"
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            {getRankIcon(entry.rank)}
                            <span className="font-medium text-[#FAFDF6]">#{entry.rank}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-[#FAFDF6] truncate">{entry.name}</div>
                            <div className="text-xs text-gray-400">
                              {entry.sport} • {entry.location}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-[#DDD92A]">{entry.score}</div>
                            <Badge variant="outline" className={`text-xs font-semibold ${getTierColor(entry.tier)}`}>
                              {entry.tier}
                            </Badge>
                          </div>
                        </div>
                      ))}
                  </TabsContent>
                  <TabsContent value="beginner" className="space-y-3">
                    {mockLeaderboard
                      .filter((entry) => entry.tier === "Beginner")
                      .map((entry) => (
                        <div
                          key={entry.rank}
                          className={`flex items-center space-x-3 p-3 rounded-lg border ${
                            entry.name === "You" ? "bg-black/20 border-[#DDD92A]" : "border-white/10"
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            {getRankIcon(entry.rank)}
                            <span className="font-medium text-[#FAFDF6]">#{entry.rank}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-[#FAFDF6] truncate">{entry.name}</div>
                            <div className="text-xs text-gray-400">
                              {entry.sport} • {entry.location}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-[#DDD92A]">{entry.score}</div>
                            <Badge variant="outline" className={`text-xs font-semibold ${getTierColor(entry.tier)}`}>
                              {entry.tier}
                            </Badge>
                          </div>
                        </div>
                      ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="border-white/10 bg-[#2D2A32] shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg text-[#FAFDF6]">Platform Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-[#DDD92A]">1,247</div>
                    <div className="text-sm text-[#EEEFA8]">Videos Analyzed</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[#DDD92A]">856</div>
                    <div className="text-sm text-[#EEEFA8]">Active Athletes</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[#DDD92A]">16</div>
                    <div className="text-sm text-[#EEEFA8]">Sports Covered</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[#DDD92A]">95%</div>
                    <div className="text-sm text-[#EEEFA8]">Accuracy Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}