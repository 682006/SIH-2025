"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Trophy, ArrowLeft, CheckCircle, XCircle, ArrowRight, Languages } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface FAQOption {
  text: string
  points: number
}

interface FAQ {
  id: string
  question: string
  options: FAQOption[]
}

// Define available Indian languages
const availableLanguages = [
  { code: "en", name: "English" },
  { code: "hi", name: "हिंदी" },
  { code: "bn", name: "বাংলা" },
  { code: "te", name: "తెలుగు" },
  { code: "mr", name: "मराठी" },
  { code: "ta", name: "தமிழ்" },
  { code: "ur", name: "اردو" },
  { code: "gu", name: "ગુજરાતી" },
  { code: "kn", name: "ಕನ್ನಡ" },
  { code: "or", name: "ଓଡ଼ିଆ" },
  { code: "ml", name: "മലയാളം" },
  { code: "pa", name: "ਪੰਜਾਬੀ" },
]

// Translation dictionaries
const translations: Record<string, Record<string, string>> = {
  en: {
    // UI elements
    "excellenceAssessment": "Excellence Assessment",
    "answerQuestions": "Answer 10 questions to evaluate your knowledge and experience level",
    "question": "Question",
    "of": "of",
    "previous": "Previous",
    "next": "Next",
    "viewResults": "View Results",
    "currentProgress": "Current Progress:",
    "questionsAnswered": "questions answered",
    "resultsTitle": "Excellence Assessment Results",
    "performanceIn": "Your performance in",
    "excellenceEvaluation": "excellence evaluation",
    "eligibilityScore": "Eligibility Score",
    "yourScore": "Your Score:",
    "required": "Required:",
    "congratulations": "Congratulations!",
    "successMessage": "You have successfully met the minimum excellence threshold for",
    "nextSteps": "Next Steps:",
    "completeFitness": "Complete fitness details and health questionnaire",
    "uploadVideos": "Upload performance videos for AI analysis",
    "receiveRecommendations": "Receive personalized training recommendations",
    "thresholdNotMet": "Excellence Threshold Not Met",
    "failMessage": "You do not meet the minimum excellence threshold (40%). You cannot proceed further at this time.",
    "suggestionsImprove": "Suggestions to Improve:",
    "gainExperience": "Gain more training experience in",
    "studyTechniques": "Study sport-specific techniques and rules",
    "participateCompetitions": "Participate in local competitions to build experience",
    "workWithCoach": "Work with a qualified coach to improve skills",
    "focusConditioning": "Focus on physical conditioning and mental preparation",
    "continueFitness": "Continue to Fitness Details",
    "backToSports": "Go back to Sports Selection",
    "backToSportsShort": "Back to Sports",
    "selectLanguage": "Select Language",
    "selectOption": "Select the option that best describes your current level",
    
    // Athletics questions
    "experience": "What is your experience level in athletics?",
    "professionalLevel": "Professional/Elite level competition",
    "stateLevel": "State/National level competition",
    "districtLevel": "District/Regional level competition",
    "schoolLevel": "School/College level competition",
    "recreationalLevel": "Recreational/Beginner level",
    
    "false_start": "In athletics, how many false starts are allowed before disqualification?",
    "zeroFalse": "Zero - any false start results in disqualification",
    "oneFalse": "One false start allowed, second one disqualifies",
    "twoFalse": "Two false starts allowed",
    "threeFalse": "Three false starts allowed",
    "noLimitFalse": "No limit on false starts",
    
    "relay_baton": "In relay races, what happens if the baton is dropped during the exchange?",
    "disqualifiedImmediately": "The team is disqualified immediately",
    "onlyRunnerPick": "Only the runner who dropped it can pick it up",
    "anyMemberPick": "Any team member can pick it up",
    "raceRestarted": "The race is restarted",
    "timePenalty": "The team gets a time penalty",
    
    "high_jump_attempts": "In high jump, how many consecutive attempts can an athlete make at each height?",
    "threeAttempts": "Three attempts per height",
    "twoAttempts": "Two attempts per height",
    "fourAttempts": "Four attempts per height",
    "unlimitedAttempts": "Unlimited attempts",
    "oneAttempt": "One attempt per height",
    
    "javelin_sector": "What is the landing sector angle for javelin throw?",
    "angle28": "28.96 degrees",
    "angle34": "34.92 degrees",
    "angle40": "40 degrees",
    "angle45": "45 degrees",
    "angle30": "30 degrees",
    
    "lane_violation": "In track events, what happens if a runner steps on the inside lane line?",
    "autoDisqualification": "Automatic disqualification",
    "warningFirst": "Warning for first offense",
    "timePenaltyAdded": "Time penalty added",
    "noPenaltyUnintentional": "No penalty if unintentional",
    "dependsDistance": "Depends on the distance of the race",
    
    "shot_put_foul": "In shot put, which action constitutes a foul?",
    "touchingStopBoard": "Touching the top of the stop board or outside the circle",
    "landsOutsideSector": "Only if the shot lands outside the sector",
    "sixtySeconds": "Taking more than 60 seconds for the attempt",
    "bothACCorrect": "Both A and C are correct",
    "steppingOutside": "Only stepping outside the back of the circle",
    
    "hurdle_rules": "In hurdle races, what happens if a runner deliberately knocks down a hurdle?",
    "disqualificationRace": "Disqualification from the race",
    "twoSecondPenalty": "Time penalty of 2 seconds",
    "warningOfficials": "Warning from officials",
    "noPenaltyAccidental": "No penalty if it's accidental",
    "automaticLast": "Automatic last place finish",
    
    "long_jump_measurement": "In long jump, from where is the distance measured?",
    "nearestMark": "From the take-off line to the nearest mark made by any part of the body",
    "feetLand": "From the take-off line to where the feet land",
    "furthestMark": "From the take-off line to the furthest mark in the sand",
    "startsRunning": "From where the athlete starts running",
    "handsTouch": "From the take-off board to where hands touch",
    
    "marathon_distance": "What is the exact distance of a marathon race?",
    "exactMarathon": "42.195 kilometers (26.2 miles)",
    "fortyTwoKm": "42 kilometers exactly",
    "twentySixMiles": "26 miles exactly",
    "fortyKm": "40 kilometers",
    "twentyFiveMiles": "25 miles",
  },
  hi: {
    // UI elements
    "excellenceAssessment": "उत्कृष्टता मूल्यांकन",
    "answerQuestions": "अपने ज्ञान और अनुभव स्तर का मूल्यांकन करने के लिए 10 प्रश्नों के उत्तर दें",
    "question": "प्रश्न",
    "of": "/",
    "previous": "पिछला",
    "next": "अगला",
    "viewResults": "परिणाम देखें",
    "currentProgress": "वर्तमान प्रगति:",
    "questionsAnswered": "प्रश्नों के उत्तर दिए गए",
    "resultsTitle": "उत्कृष्टता मूल्यांकन परिणाम",
    "performanceIn": "में आपका प्रदर्शन",
    "excellenceEvaluation": "उत्कृष्टता मूल्यांकन",
    "eligibilityScore": "पात्रता स्कोर",
    "yourScore": "आपका स्कोर:",
    "required": "आवश्यक:",
    "congratulations": "बधाई हो!",
    "successMessage": "आपने सफलतापूर्वक न्यूनतम उत्कृष्टता सीमा पार कर ली है",
    "nextSteps": "अगले कदम:",
    "completeFitness": "फिटनेस विवरण और स्वास्थ्य प्रश्नावली पूरी करें",
    "uploadVideos": "एआई विश्लेषण के लिए प्रदर्शन वीडियो अपलोड करें",
    "receiveRecommendations": "व्यक्तिगत प्रशिक्षण सिफारिशें प्राप्त करें",
    "thresholdNotMet": "उत्कृष्टता सीमा पूरी नहीं हुई",
    "failMessage": "आप न्यूनतम उत्कृष्टता सीमा (40%) को पूरा नहीं करते हैं। आप इस समय आगे नहीं बढ़ सकते।",
    "suggestionsImprove": "सुधार के सुझाव:",
    "gainExperience": "अधिक प्रशिक्षण अनुभव प्राप्त करें",
    "studyTechniques": "खेल-विशिष्ट तकनीकों और नियमों का अध्ययन करें",
    "participateCompetitions": "अनुभव बनाने के लिए स्थानीय प्रतियोगिताओं में भाग लें",
    "workWithCoach": "कौशल में सुधार के लिए योग्य कोच के साथ काम करें",
    "focusConditioning": "शारीरिक कंडीशनिंग और मानसिक तैयारी पर ध्यान दें",
    "continueFitness": "फिटनेस विवरण पर जारी रखें",
    "backToSports": "खेल चयन पर वापस जाएं",
    "backToSportsShort": "खेलों पर वापस",
    "selectLanguage": "भाषा चुनें",
    "selectOption": "वह विकल्प चुनें जो आपके वर्तमान स्तर का सबसे अच्छा वर्णन करता है",
    
    // Athletics questions
    "experience": "एथलेटिक्स में आपका अनुभव स्तर क्या है?",
    "professionalLevel": "पेशेवर/अभिजात वर्ग स्तर की प्रतिस्पर्धा",
    "stateLevel": "राज्य/राष्ट्रीय स्तर की प्रतिस्पर्धा",
    "districtLevel": "जिला/क्षेत्रीय स्तर की प्रतिस्पर्धा",
    "schoolLevel": "स्कूल/कॉलेज स्तर की प्रतिस्पर्धा",
    "recreationalLevel": "मनोरंजन/शुरुआती स्तर",
    
    "false_start": "एथलेटिक्स में, अयोग्य घोषित होने से पहले कितने फॉल्स स्टार्ट की अनुमति है?",
    "zeroFalse": "शून्य - कोई भी फॉल्स स्टार्ट अयोग्यता का कारण बनता है",
    "oneFalse": "एक फॉल्स स्टार्ट की अनुमति है, दूसरा अयोग्य घोषित करता है",
    "twoFalse": "दो फॉल्स स्टार्ट की अनुमति है",
    "threeFalse": "तीन फॉल्स स्टार्ट की अनुमति है",
    "noLimitFalse": "फॉल्स स्टार्ट की कोई सीमा नहीं",
    
    "relay_baton": "रिले रेस में, यदि बैटन विनिमय के दौरान गिर जाए तो क्या होता है?",
    "disqualifiedImmediately": "टीम को तुरंत अयोग्य घोषित कर दिया जाता है",
    "onlyRunnerPick": "केवल वह धावक जिसने इसे गिराया है, इसे उठा सकता है",
    "anyMemberPick": "कोई भी टीम सदस्य इसे उठा सकता है",
    "raceRestarted": "दौड़ फिर से शुरू की जाती है",
    "timePenalty": "टीम को समय जुर्माना मिलता है",
    
    "high_jump_attempts": "हाई जंप में, एक एथलीट प्रत्येक ऊंचाई पर कितने लगातार प्रयास कर सकता है?",
    "threeAttempts": "प्रति ऊंचाई तीन प्रयास",
    "twoAttempts": "प्रति ऊंचाई दो प्रयास",
    "fourAttempts": "प्रति ऊंचाई चार प्रयास",
    "unlimitedAttempts": "असीमित प्रयास",
    "oneAttempt": "प्रति ऊंचाई एक प्रयास",
    
    "javelin_sector": "जैवलिन थ्रो के लिए लैंडिंग सेक्टर कोण क्या है?",
    "angle28": "28.96 डिग्री",
    "angle34": "34.92 डिग्री",
    "angle40": "40 डिग्री",
    "angle45": "45 डिग्री",
    "angle30": "30 डिग्री",
    
    "lane_violation": "ट्रैक इवेंट्स में, यदि कोई धावक आंतरिक लेन लाइन पर कदम रखता है तो क्या होता है?",
    "autoDisqualification": "स्वत: अयोग्यता",
    "warningFirst": "पहले अपराध के लिए चेतावनी",
    "timePenaltyAdded": "समय जुर्माना जोड़ा गया",
    "noPenaltyUnintentional": "अनजाने में होने पर कोई जुर्माना नहीं",
    "dependsDistance": "दौड़ की दूरी पर निर्भर करता है",
    
    "shot_put_foul": "शॉट पुट में, कौन सी क्रिया फाउल constitutes करती है?",
    "touchingStopBoard": "स्टॉप बोर्ड के शीर्ष या सर्कल के बाहर छूना",
    "landsOutsideSector": "केवल तभी जब शॉट सेक्टर के बाहर उतरता है",
    "sixtySeconds": "प्रयास के लिए 60 सेकंड से अधिक समय लेना",
    "bothACCorrect": "A और C दोनों सही हैं",
    "steppingOutside": "केवल सर्कल के पीछे बाहर कदम रखना",
    
    "hurdle_rules": "हर्डल रेस में, यदि कोई धावक जानबूझकर हर्डल गिरा देता है तो क्या होता है?",
    "disqualificationRace": "दौड़ से अयोग्यता",
    "twoSecondPenalty": "2 सेकंड का समय जुर्माना",
    "warningOfficials": "अधिकारियों से चेतावनी",
    "noPenaltyAccidental": "अनजाने में होने पर कोई जुर्माना नहीं",
    "automaticLast": "स्वत: अंतिम स्थान समाप्ति",
    
    "long_jump_measurement": "लॉन्ग जंप में, दूरी कहाँ से मापी जाती है?",
    "nearestMark": "टेक-ऑफ लाइन से शरीर के किसी भी हिस्से द्वारा बनाए गए निकटतम निशान तक",
    "feetLand": "टेक-ऑफ लाइन से जहाँ पैर उतरते हैं",
    "furthestMark": "टेक-ऑफ लाइन से रेत में सबसे दूर के निशान तक",
    "startsRunning": "जहाँ से एथलीट दौड़ना शुरू करता है",
    "handsTouch": "टेक-ऑफ बोर्ड से जहाँ हाथ छूते हैं",
    
    "marathon_distance": "मैराथन रेस की सटीक दूरी क्या है?",
    "exactMarathon": "42.195 किलोमीटर (26.2 मील)",
    "fortyTwoKm": "बिल्कुल 42 किलोमीटर",
    "twentySixMiles": "बिल्कुल 26 मील",
    "fortyKm": "40 किलोमीटर",
    "twentyFiveMiles": "25 मील",
  },
  // Add minimal translations for other languages (UI elements only)
  bn: {
    "excellenceAssessment": "এক্সিলেন্স অ্যাসেসমেন্ট",
    "backToSportsShort": "স্পোর্টসে ফিরে যান",
    "selectLanguage": "ভাষা নির্বাচন করুন",
  },
  te: {
    "excellenceAssessment": "ఎక్సలెన్స్ అసెస్మెంట్",
    "backToSportsShort": "క్రీడలకు తిరిగి వెళ్లండి",
    "selectLanguage": "భాషను ఎంచుకోండి",
  },
  mr: {
    "excellenceAssessment": "एक्सीलन्स अॅसेसमेंट",
    "backToSportsShort": "क्रीडा निवड परत जा",
    "selectLanguage": "भाषा निवडा",
  },
  ta: {
    "excellenceAssessment": "சிறப்பு மதிப்பீடு",
    "backToSportsShort": "விளையாட்டுக்குத் திரும்பு",
    "selectLanguage": "மொழியைத் தேர்ந்தெடுக்கவும்",
  },
  ur: {"excellenceAssessment": "ایکسیلینس اسسمنٹ", "selectLanguage": "زبان منتخب کریں"},
  gu: {"excellenceAssessment": "એક્સેલન્સ અસેસમેન્ટ", "selectLanguage": "ભાષા પસંદ કરો"},
  kn: {"excellenceAssessment": "ಎಕ್ಸಲೆನ್ಸ್ ಅಸೆಸ್ಮೆಂಟ್", "selectLanguage": "ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ"},
  or: {"excellenceAssessment": "ଏକ୍ସଲେନ୍ସ ଆସେସମେଣ୍ଟ", "selectLanguage": "ଭାଷା ଚୟନ କରନ୍ତୁ"},
  ml: {"excellenceAssessment": "എക്സലൻസ് അസസ്മെന്റ്", "selectLanguage": "ഭാഷ തിരഞ്ഞെടുക്കുക"},
  pa: {"excellenceAssessment": "ਐਕਸੀਲੈਂਸ ਅਸੈਸਮੈਂਟ", "selectLanguage": "ਭਾਸ਼ਾ ਚੁਣੋ"},
}

// Sport names in different languages
const sportNamesTranslations: Record<string, Record<string, string>> = {
  athletics: {
    en: "Athletics",
    hi: "एथलेटिक्स",
    bn: "অ্যাথলেটিক্স",
    te: "ఆథ్లెటిక్స్",
    mr: "अॅथलेटिक्स",
    ta: "தடகள விளையாட்டுகள்",
    ur: "ایتھلیٹکس",
    gu: "એથલેટિક્સ",
    kn: "ಅಥ್ಲೆಟಿಕ್ಸ್",
    or: "ଆଥଲେଟିକ୍ସ",
    ml: "അഥ്ലറ്റിക്സ್",
    pa: "ਐਥਲੈਟਿਕਸ",
  },
  swimming: {
    en: "Swimming",
    hi: "तैराकी",
    bn: "সাঁতার",
    te: "ఈత",
    mr: "जलतरण",
    ta: "நீச்சல்",
    ur: "تیراکی",
    gu: "તરણ",
    kn: "ಈಜು",
    or: "ପହଁରା",
    ml: "നീന്തൽ",
    pa: "ਤੈਰਾਕੀ",
  },
  boxing: {
    en: "Boxing",
    hi: "बॉक्सिंग",
    bn: "বক্সিং",
    te: "బాక్సింగ్",
    mr: "बॉक्सिंग",
    ta: "குத்துச்சண்டை",
    ur: "باکسنگ",
    gu: "બોક્સિંગ",
    kn: "ಬಾಕ್ಸಿಂಗ್",
    or: "ବକ୍ସିଂ",
    ml: "ബോക്സിംഗ്",
    pa: "ਬਾਕਸਿੰਗ",
  },
}

// Helper function to get translated FAQ
const getTranslatedFAQ = (sport: string, language: string): FAQ[] => {
  const baseFAQs = sportFAQs[sport] || sportFAQs.athletics;
  
  return baseFAQs.map(faq => ({
    ...faq,
    question: translations[language]?.[faq.id] || faq.question,
    options: faq.options.map(option => ({
      ...option,
      text: translations[language]?.[option.text] || option.text
    }))
  }));
};

const sportFAQs: Record<string, FAQ[]> = {
  athletics: [
    {
      id: "experience",
      question: "What is your experience level in athletics?",
      options: [
        { text: "Professional/Elite level competition", points: 10 },
        { text: "State/National level competition", points: 8 },
        { text: "District/Regional level competition", points: 6 },
        { text: "School/College level competition", points: 4 },
        { text: "Recreational/Beginner level", points: 2 },
      ],
    },
    {
      id: "false_start",
      question: "In athletics, how many false starts are allowed before disqualification?",
      options: [
        { text: "Zero - any false start results in disqualification", points: 10 },
        { text: "One false start allowed, second one disqualifies", points: 8 },
        { text: "Two false starts allowed", points: 4 },
        { text: "Three false starts allowed", points: 2 },
        { text: "No limit on false starts", points: 0 },
      ],
    },
    {
      id: "relay_baton",
      question: "In relay races, what happens if the baton is dropped during the exchange?",
      options: [
        { text: "The team is disqualified immediately", points: 2 },
        { text: "Only the runner who dropped it can pick it up", points: 10 },
        { text: "Any team member can pick it up", points: 4 },
        { text: "The race is restarted", points: 0 },
        { text: "The team gets a time penalty", points: 6 },
      ],
    },
    {
      id: "high_jump_attempts",
      question: "In high jump, how many consecutive attempts can an athlete make at each height?",
      options: [
        { text: "Three attempts per height", points: 10 },
        { text: "Two attempts per height", points: 6 },
        { text: "Four attempts per height", points: 4 },
        { text: "Unlimited attempts", points: 2 },
        { text: "One attempt per height", points: 0 },
      ],
    },
    {
      id: "javelin_sector",
      question: "What is the landing sector angle for javelin throw?",
      options: [
        { text: "28.96 degrees", points: 10 },
        { text: "34.92 degrees", points: 8 },
        { text: "40 degrees", points: 4 },
        { text: "45 degrees", points: 2 },
        { text: "30 degrees", points: 6 },
      ],
    },
    {
      id: "lane_violation",
      question: "In track events, what happens if a runner steps on the inside lane line?",
      options: [
        { text: "Automatic disqualification", points: 10 },
        { text: "Warning for first offense", points: 6 },
        { text: "Time penalty added", points: 4 },
        { text: "No penalty if unintentional", points: 2 },
        { text: "Depends on the distance of the race", points: 0 },
      ],
    },
    {
      id: "shot_put_foul",
      question: "In shot put, which action constitutes a foul?",
      options: [
        { text: "Touching the top of the stop board or outside the circle", points: 10 },
        { text: "Only if the shot lands outside the sector", points: 6 },
        { text: "Taking more than 60 seconds for the attempt", points: 8 },
        { text: "Both A and C are correct", points: 10 },
        { text: "Only stepping outside the back of the circle", points: 4 },
      ],
    },
    {
      id: "hurdle_rules",
      question: "In hurdle races, what happens if a runner deliberately knocks down a hurdle?",
      options: [
        { text: "Disqualification from the race", points: 10 },
        { text: "Time penalty of 2 seconds", points: 4 },
        { text: "Warning from officials", points: 2 },
        { text: "No penalty if it's accidental", points: 6 },
        { text: "Automatic last place finish", points: 0 },
      ],
    },
    {
      id: "long_jump_measurement",
      question: "In long jump, from where is the distance measured?",
      options: [
        { text: "From the take-off line to the nearest mark made by any part of the body", points: 10 },
        { text: "From the take-off line to where the feet land", points: 6 },
        { text: "From the take-off line to the furthest mark in the sand", points: 4 },
        { text: "From where the athlete starts running", points: 0 },
        { text: "From the take-off board to where hands touch", points: 2 },
      ],
    },
    {
      id: "marathon_distance",
      question: "What is the exact distance of a marathon race?",
      options: [
        { text: "42.195 kilometers (26.2 miles)", points: 10 },
        { text: "42 kilometers exactly", points: 6 },
        { text: "26 miles exactly", points: 4 },
        { text: "40 kilometers", points: 2 },
        { text: "25 miles", points: 0 },
      ],
    },
  ],
  swimming: [
    {
      id: "swim_experience",
      question: "What is your experience level in swimming?",
      options: [
        { text: "Professional/Elite level competition", points: 10 },
        { text: "State/National level competition", points: 8 },
        { text: "District/Regional level competition", points: 6 },
        { text: "School/College level competition", points: 4 },
        { text: "Recreational/Beginner level", points: 2 },
      ],
    },
    {
      id: "freestyle_technique",
      question: "In freestyle swimming, which part of the body should break the water surface first during the stroke?",
      options: [
        { text: "Fingertips", points: 10 },
        { text: "Wrist", points: 8 },
        { text: "Forearm", points: 6 },
        { text: "Elbow", points: 4 },
        { text: "Shoulder", points: 2 },
      ],
    },
    {
      id: "butterfly_kick",
      question: "In butterfly stroke, how many kicks are typically performed per arm cycle?",
      options: [
        { text: "Two kicks", points: 10 },
        { text: "One kick", points: 8 },
        { text: "Three kicks", points: 6 },
        { text: "Four kicks", points: 4 },
        { text: "It varies with each swimmer", points: 2 },
      ],
    },
    {
      id: "backstroke_start",
      question: "In backstroke, how do swimmers start the race?",
      options: [
        { text: "In the water, facing the starting end", points: 10 },
        { text: "On the starting block, facing the water", points: 8 },
        { text: "On the starting block, with back to water", points: 6 },
        { text: "In the water, with back to starting end", points: 4 },
        { text: "Diving from the side of the pool", points: 2 },
      ],
    },
    {
      id: "breaststroke_turn",
      question: "In breaststroke, what is required during turns and at the finish?",
      options: [
        { text: "Touch with both hands simultaneously", points: 10 },
        { text: "Touch with one hand", points: 8 },
        { text: "Touch with either hand", points: 6 },
        { text: "Touch with head", points: 4 },
        { text: "No specific touch requirement", points: 2 },
      ],
    },
    {
      id: "medley_order",
      question: "What is the correct order of strokes in an individual medley race?",
      options: [
        { text: "Butterfly, Backstroke, Breaststroke, Freestyle", points: 10 },
        { text: "Backstroke, Breaststroke, Butterfly, Freestyle", points: 8 },
        { text: "Freestyle, Backstroke, Breaststroke, Butterfly", points: 6 },
        { text: "Butterfly, Breaststroke, Backstroke, Freestyle", points: 4 },
        { text: "Any order the swimmer prefers", points: 2 },
      ],
    },
    {
      id: "relay_takeover",
      question: "In relay races, when can the next swimmer leave the starting block?",
      options: [
        { text: "When the incoming swimmer touches the wall", points: 10 },
        { text: "When the incoming swimmer is 5m from the wall", points: 8 },
        { text: "When the incoming swimmer is 2m from the wall", points: 6 },
        { text: "When the incoming swimmer finishes their stroke", points: 4 },
        { text: "Any time after the previous swimmer starts", points: 2 },
      ],
    },
    {
      id: "pool_length",
      question: "What is the standard length of an Olympic-sized swimming pool?",
      options: [
        { text: "50 meters", points: 10 },
        { text: "25 meters", points: 8 },
        { text: "100 meters", points: 6 },
        { text: "33.3 meters", points: 4 },
        { text: "40 meters", points: 2 },
      ],
    },
    {
      id: "false_start_swim",
      question: "What happens if a swimmer false starts in a swimming race?",
      options: [
        { text: "Immediate disqualification", points: 10 },
        { text: "Warning on first offense", points: 8 },
        { text: "5-second penalty", points: 6 },
        { text: "10-second penalty", points: 4 },
        { text: "Restart of the race", points: 2 },
      ],
    },
    {
      id: "open_turn",
      question: "Which stroke uses an open turn rather than a flip turn?",
      options: [
        { text: "Breaststroke", points: 10 },
        { text: "Freestyle", points: 8 },
        { text: "Backstroke", points: 6 },
        { text: "Butterfly", points: 4 },
        { text: "All strokes use flip turns", points: 2 },
      ],
    },
  ],
  boxing: [
    {
      id: "boxing_experience",
      question: "What is your experience level in boxing?",
      options: [
        { text: "Professional/Elite level competition", points: 10 },
        { text: "State/National level competition", points: 8 },
        { text: "District/Regional level competition", points: 6 },
        { text: "School/College level competition", points: 4 },
        { text: "Recreational/Beginner level", points: 2 },
      ],
    },
    {
      id: "ring_dimensions",
      question: "What are the standard dimensions of a professional boxing ring?",
      options: [
        { text: "16 to 24 feet square", points: 10 },
        { text: "12 to 16 feet square", points: 8 },
        { text: "20 to 30 feet square", points: 6 },
        { text: "24 to 32 feet square", points: 4 },
        { text: "No standard size", points: 2 },
      ],
    },
    {
      id: "round_duration",
      question: "How long is a round in professional boxing?",
      options: [
        { text: "3 minutes", points: 10 },
        { text: "2 minutes", points: 8 },
        { text: "4 minutes", points: 6 },
        { text: "5 minutes", points: 4 },
        { text: "Varies by weight class", points: 2 },
      ],
    },
    {
      id: "knockdown_rule",
      question: "What happens when a boxer is knocked down?",
      options: [
        { text: "Referee counts to 8, then continues if boxer is ready", points: 10 },
        { text: "Referee counts to 10 for automatic knockout", points: 8 },
        { text: "Boxer has 5 seconds to get up", points: 6 },
        { text: "Boxer is immediately disqualified", points: 4 },
        { text: "The round ends immediately", points: 2 },
      ],
    },
    {
      id: "weight_classes",
      question: "How many weight classes are there in professional boxing?",
      options: [
        { text: "17", points: 10 },
        { text: "12", points: 8 },
        { text: "8", points: 6 },
        { text: "10", points: 4 },
        { text: "15", points: 2 },
      ],
    },
    {
      id: "foul_punch",
      question: "Which of these is considered a foul in boxing?",
      options: [
        { text: "Hitting below the belt", points: 10 },
        { text: "Jab to the body", points: 8 },
        { text: "Cross to the head", points: 6 },
        { text: "Hook to the ribs", points: 4 },
        { text: "Uppercut to the chin", points: 2 },
      ],
    },
    {
      id: "referee_stop",
      question: "When can a referee stop a boxing match?",
      options: [
        { text: "When a boxer is unable to defend themselves", points: 10 },
        { text: "Only when a boxer is knocked out", points: 8 },
        { text: "After 3 knockdowns in one round", points: 6 },
        { text: "When a boxer requests to stop", points: 4 },
        { text: "Only between rounds", points: 2 },
      ],
    },
    {
      id: "scoring_system",
      question: "How is boxing typically scored?",
      options: [
        { text: "10-point must system", points: 10 },
        { text: "5-point system", points: 8 },
        { text: "Round winner system", points: 6 },
        { text: "Total punches landed", points: 4 },
        { text: "Judge's discretion only", points: 2 },
      ],
    },
    {
      id: "glove_weight",
      question: "What is the standard weight of gloves in professional boxing?",
      options: [
        { text: "8-10 ounces", points: 10 },
        { text: "12-14 ounces", points: 8 },
        { text: "6-8 ounces", points: 6 },
        { text: "10-12 ounces", points: 4 },
        { text: "14-16 ounces", points: 2 },
      ],
    },
    {
      id: "mouthguard_rule",
      question: "When is a boxer required to wear a mouthguard?",
      options: [
        { text: "At all times during the match", points: 10 },
        { text: "Only during sparring", points: 8 },
        { text: "Only for amateur matches", points: 6 },
        { text: "Only when requested by the referee", points: 4 },
        { text: "Not required in professional boxing", points: 2 },
      ],
    },
  ],
}

export default function ExcellencePage() {
  const params = useParams()
  const sport = params.sport as string
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [eligibilityPercentage, setEligibilityPercentage] = useState(0)
  const [language, setLanguage] = useState("en")

  const baseFAQs = sportFAQs[sport] || sportFAQs.athletics
  const translatedFAQs = getTranslatedFAQ(sport, language)
  const maxScore = baseFAQs.length * 10
  const passingScore = Math.ceil(maxScore * 0.4)

  // Get translation function
  const t = (key: string): string => {
    return translations[language]?.[key] || translations["en"][key] || key
  }

  // Get sport name in selected language
  const getSportName = (): string => {
    return sportNamesTranslations[sport]?.[language] || sportNamesTranslations[sport]?.["en"] || sport
  }

  useEffect(() => {
    calculateScore()
  }, [answers])

  const calculateScore = () => {
    let totalScore = 0
    Object.entries(answers).forEach(([questionId, selectedOption]) => {
      const question = baseFAQs.find((faq) => faq.id === questionId)
      if (question) {
        const option = question.options.find((opt) => {
          // Find the original option text to match points
          const originalOption = question.options.find(
            o => translations[language]?.[o.text] === selectedOption || o.text === selectedOption
          )
          return originalOption?.text === opt.text
        })
        if (option) {
          totalScore += option.points
        }
      }
    })
    setScore(totalScore)
    setEligibilityPercentage(Math.round((totalScore / maxScore) * 100))
  }

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const handleNext = () => {
    if (currentQuestion < baseFAQs.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowResults(true)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleProceed = () => {
    window.location.href = "/fitness-details"
  }

  const isCurrentAnswered = answers[baseFAQs[currentQuestion]?.id]
  const passed = score >= passingScore

  if (showResults) {
    return (
      <div className="min-h-screen bg-[#2D2A32] py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Trophy className="h-8 w-8 text-[#DDD92A]" />
              <span className="text-2xl font-bold text-[#FAFDF6]">{t("resultsTitle")}</span>
            </div>
            <p className="text-[#EEEFA8]">{t("performanceIn")} {getSportName()} {t("excellenceEvaluation")}</p>
          </div>

          <Card className="border-white/10 bg-[#2D2A32] shadow-lg">
            <CardHeader className="text-center space-y-4">
              <div
                className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto ${
                  passed ? "bg-black/20" : "bg-red-900/50"
                }`}
              >
                {passed ? (
                  <CheckCircle className="h-12 w-12 text-[#DDD92A]" />
                ) : (
                  <XCircle className="h-12 w-12 text-red-500" />
                )}
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-[#FAFDF6]">{eligibilityPercentage}%</h2>
                <p className="text-lg text-[#EEEFA8]">{t("eligibilityScore")}</p>
                <Badge
                  variant={passed ? "default" : "destructive"}
                  className={passed ? "bg-[#DDD92A] text-[#2D2A32] font-semibold" : "bg-red-600 text-white"}
                >
                  {passed ? "PASSED" : "FAILED"}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-[#EEEFA8]">
                  <span>
                    {t("yourScore")} {score}/{maxScore}
                  </span>
                  <span>
                    {t("required")} {passingScore}/{maxScore} (40%)
                  </span>
                </div>
                <Progress value={eligibilityPercentage} className="h-3 [&>div]:bg-[#DDD92A]" />
              </div>

              {passed ? (
                <div className="bg-black/20 border border-[#DDD92A]/50 rounded-lg p-6 space-y-4">
                  <h3 className="text-lg font-semibold text-[#FAFDF6]">{t("congratulations")}</h3>
                  <p className="text-[#EEEFA8]">
                    {t("successMessage")} {getSportName()}. You demonstrate sufficient knowledge and experience to proceed to the next stage of the athlete performance analysis.
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-medium text-[#FAFDF6]">{t("nextSteps")}</h4>
                    <ul className="text-sm text-[#EEEFA8] space-y-1">
                      <li>• {t("completeFitness")}</li>
                      <li>• {t("uploadVideos")}</li>
                      <li>• {t("receiveRecommendations")}</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="bg-red-900/50 border border-red-500/50 rounded-lg p-6 space-y-4">
                  <h3 className="text-lg font-semibold text-red-300">{t("thresholdNotMet")}</h3>
                  <p className="text-red-400">
                    {t("failMessage")}
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-medium text-red-300">{t("suggestionsImprove")}</h4>
                    <ul className="text-sm text-red-400 space-y-1">
                      <li>• {t("gainExperience")} {getSportName()}</li>
                      <li>• {t("studyTechniques")}</li>
                      <li>• {t("participateCompetitions")}</li>
                      <li>• {t("workWithCoach")}</li>
                      <li>• {t("focusConditioning")}</li>
                    </ul>
                  </div>
                </div>
              )}

              <div className="flex space-x-4">
                {passed ? (
                  <Button
                    onClick={handleProceed}
                    className="flex-1 bg-[#DDD92A] hover:bg-[#c8c426] text-[#2D2A32] font-semibold"
                  >
                    {t("continueFitness")}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Link href="/sports-selection" className="flex-1">
                    <Button
                      variant="outline"
                      className="w-full bg-transparent border-[#EAE151] text-[#EAE151] hover:bg-white/10"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      {t("backToSports")}
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#2D2A32] py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/sports-selection"
            className="flex items-center space-x-2 text-[#EAE151] hover:text-[#DDD92A]"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>{t("backToSportsShort")}</span>
          </Link>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Languages className="h-4 w-4 text-[#DDD92A]" />
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-[140px] bg-transparent border-[#EAE151] text-[#EAE151]">
                  <SelectValue placeholder={t("selectLanguage")} />
                </SelectTrigger>
                <SelectContent className="bg-[#2D2A32] border-[#EAE151] text-[#EAE151]">
                  {availableLanguages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Trophy className="h-6 w-6 text-[#DDD92A]" />
              <span className="font-bold text-[#FAFDF6]">{t("excellenceAssessment")}</span>
            </div>
          </div>
        </div>

        <div className="mb-8 space-y-4">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-[#FAFDF6]">{getSportName()} {t("excellenceAssessment")}</h1>
            <p className="text-[#EEEFA8]">{t("answerQuestions")}</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm text-[#EEEFA8]">
              <span>
                {t("question")} {currentQuestion + 1} {t("of")} {baseFAQs.length}
              </span>
            </div>
            <Progress value={((currentQuestion + 1) / baseFAQs.length) * 100} className="h-2 bg-black/20 [&>div]:bg-[#DDD92A]" />
          </div>
        </div>

        <Card className="border-white/10 bg-[#2D2A32] shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-[#FAFDF6]">{translatedFAQs[currentQuestion]?.question}</CardTitle>
            <CardDescription className="text-[#EEEFA8]">{t("selectOption")}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <RadioGroup
              value={answers[baseFAQs[currentQuestion]?.id] || ""}
              onValueChange={(value) => handleAnswerChange(baseFAQs[currentQuestion]?.id, value)}
              className="text-[#EEEFA8]"
            >
              {translatedFAQs[currentQuestion]?.options.map((option, index) => (
                <Label
                  htmlFor={`option-${index}`}
                  key={index}
                  className="flex items-center space-x-2 p-3 rounded-lg hover:bg-black/20 border border-transparent hover:border-white/10 cursor-pointer has-[[data-state=checked]]:border-[#DDD92A] has-[[data-state=checked]]:bg-black/20"
                >
                  <RadioGroupItem value={option.text} id={`option-${index}`} className="border-white/20 data-[state=checked]:border-[#DDD92A] data-[state=checked]:text-[#DDD92A]" />
                  <span>{option.text}</span>
                </Label>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="border-[#EAE151] text-[#EAE151] hover:bg-white/10 bg-transparent"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("previous")}
          </Button>

          <Button
            onClick={handleNext}
            disabled={!isCurrentAnswered}
            className="bg-[#DDD92A] hover:bg-[#c8c426] text-[#2D2A32] font-semibold"
          >
            {currentQuestion === baseFAQs.length - 1 ? t("viewResults") : t("next")}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        <div className="mt-8 bg-black/20 rounded-lg p-4 border border-white/10">
          <div className="flex justify-between items-center text-sm">
            <span className="text-[#EEEFA8]">{t("currentProgress")}</span>
            <span className="font-medium text-[#FAFDF6]">
              {Object.keys(answers).length}/{baseFAQs.length} {t("questionsAnswered")}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}