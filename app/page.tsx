"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trophy, Target, Users, Award } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { LanguageSelector } from "@/components/language-selector"

export default function HomePage() {
  const { t } = useLanguage()

  // Color Palette:
  // Raisin Black: #2D2A32
  // Citrine: #DDD92A
  // Maize: #EAE151
  // Vanilla: #EEEFA8
  // Baby Powder: #FAFDF6

  return (
    <div className="min-h-screen bg-[#2D2A32]">
      {/* Navigation */}
      <nav className="bg-[#2D2A32]/80 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Trophy className="h-8 w-8 text-[#DDD92A]" />
              <span className="text-xl font-bold text-[#FAFDF6]">AthleteX</span>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSelector />
              <Link href="/login">
                <Button
                  variant="outline"
                  className="border-[#EAE151] text-[#EAE151] hover:bg-white/10 bg-transparent"
                >
                  {t("nav.login")}
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-[#DDD92A] hover:bg-[#c8c426] text-[#2D2A32] font-semibold">
                  {t("nav.register")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#FAFDF6] leading-tight">
                  {t("home.title")}
                  <span className="text-[#DDD92A] block">{t("home.titleHighlight")}</span>
                </h1>
                <p className="text-xl text-[#EEEFA8] leading-relaxed max-w-2xl">{t("home.tagline")}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register">
                  <Button
                    size="lg"
                    className="bg-[#DDD92A] hover:bg-[#c8c426] text-[#2D2A32] px-8 py-4 text-lg font-semibold"
                  >
                    {t("home.getStarted")}
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-[#EAE151] text-[#EAE151] hover:bg-white/10 px-8 py-4 text-lg bg-transparent"
                >
                  {t("home.learnMore")}
                </Button>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              {/* MODIFIED LINE: Changed aspect-square to aspect-video */}
              <div className="aspect-video rounded-2xl bg-black/20 border border-white/10 p-8 flex items-center justify-center">
                <img
                  src="/olympic-athlete-in-action--dynamic-sports-pose--pr.jpg"
                  alt="Athlete in action"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              {/* Floating cards */}
              <div className="absolute -top-4 -left-4 bg-[#2D2A32] rounded-lg shadow-lg p-4 border border-white/10">
                <div className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-[#DDD92A]" />
                  <span className="text-sm font-medium text-[#FAFDF6]">Performance Tracking</span>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-[#2D2A32] rounded-lg shadow-lg p-4 border border-white/10">
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-[#DDD92A]" />
                  <span className="text-sm font-medium text-[#FAFDF6]">Excellence Analysis</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#FAFDF6]">{t("home.featuresTitle")}</h2>
            <p className="text-xl text-[#EEEFA8] max-w-3xl mx-auto">{t("home.featuresSubtitle")}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-white/10 bg-[#2D2A32] hover:border-[#DDD92A]/50 transition-colors">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-black/20 rounded-lg flex items-center justify-center mx-auto">
                  <Trophy className="h-6 w-6 text-[#DDD92A]" />
                </div>
                <h3 className="text-lg font-semibold text-[#FAFDF6]">{t("home.sportSelection")}</h3>
                <p className="text-[#EEEFA8] text-sm">{t("home.sportSelectionDesc")}</p>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-[#2D2A32] hover:border-[#DDD92A]/50 transition-colors">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-black/20 rounded-lg flex items-center justify-center mx-auto">
                  <Target className="h-6 w-6 text-[#DDD92A]" />
                </div>
                <h3 className="text-lg font-semibold text-[#FAFDF6]">{t("home.excellenceTesting")}</h3>
                <p className="text-[#EEEFA8] text-sm">{t("home.excellenceTestingDesc")}</p>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-[#2D2A32] hover:border-[#DDD92A]/50 transition-colors">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-black/20 rounded-lg flex items-center justify-center mx-auto">
                  <Users className="h-6 w-6 text-[#DDD92A]" />
                </div>
                <h3 className="text-lg font-semibold text-[#FAFDF6]">{t("home.fitnessAnalysis")}</h3>
                <p className="text-[#EEEFA8] text-sm">{t("home.fitnessAnalysisDesc")}</p>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-[#2D2A32] hover:border-[#DDD92A]/50 transition-colors">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-black/20 rounded-lg flex items-center justify-center mx-auto">
                  <Award className="h-6 w-6 text-[#DDD92A]" />
                </div>
                <h3 className="text-lg font-semibold text-[#FAFDF6]">{t("home.aiVideoAnalysis")}</h3>
                <p className="text-[#EEEFA8] text-sm">{t("home.aiVideoAnalysisDesc")}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#DDD92A]">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#2D2A32] mb-6">{t("home.ctaTitle")}</h2>
          <p className="text-xl text-[#2D2A32]/90 mb-8 max-w-2xl mx-auto">{t("home.ctaSubtitle")}</p>
          <Link href="/register">
            <Button
              size="lg"
              className="bg-[#2D2A32] text-[#FAFDF6] hover:bg-black px-8 py-4 text-lg font-semibold"
            >
              {t("home.startAnalysis")}
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2D2A32] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Trophy className="h-6 w-6 text-[#DDD92A]" />
                <span className="text-lg font-bold text-[#FAFDF6]">Team Sankalp</span>
              </div>
              <p className="text-gray-400 text-sm">
                Empowering athletes through advanced performance analysis and talent identification.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-[#FAFDF6] mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/register" className="hover:text-[#DDD92A]">
                    Register
                  </Link>
                </li>
                <li>
                  <Link href="/sports" className="hover:text-[#DDD92A]">
                    Sports Selection
                  </Link>
                </li>
                <li>
                  <Link href="/analysis" className="hover:text-[#DDD92A]">
                    Performance Analysis
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-[#FAFDF6] mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/help" className="hover:text-[#DDD92A]">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-[#DDD92A]">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-[#DDD92A]">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-[#FAFDF6] mb-4">Connect</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Email: info@teamsankalp.in</li>
                <li>Phone: +91 7684940568</li>
                <li>Address: Gunupur, Odisha</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 Team Sankalp. All rights reserved. Athlete Performance Analysis System.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
