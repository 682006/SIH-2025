"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Trophy, ArrowLeft, CheckCircle, XCircle, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

interface FAQOption {
  text: string
  points: number
}

interface FAQ {
  id: string
  question: string
  options: FAQOption[]
}

// MODIFIED SECTION: Added questions for all requested sports
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
    // ... other athletics questions
  ],
  swimming: [
    {
      id: "experience",
      question: "What is your experience level in swimming?",
      options: [
        { text: "Professional/National team level", points: 10 },
        { text: "State/National level competition", points: 8 },
        { text: "Club/Regional level competition", points: 6 },
        { text: "School/Local level competition", points: 4 },
        { text: "Recreational/Beginner swimmer", points: 2 },
      ],
    },
    // ... other swimming questions
  ],
  boxing: [
    {
      id: "experience",
      question: "What is your experience level in boxing?",
      options: [
        { text: "Professional fighter", points: 10 },
        { text: "National/Golden Gloves amateur competitor", points: 8 },
        { text: "Regional/Local amateur competitor", points: 6 },
        { text: "Consistent gym training and sparring", points: 4 },
        { text: "Beginner/Fitness boxer", points: 2 },
      ],
    },
    // ... other boxing questions
  ],
  gymnastics: [
    {
      id: "experience",
      question: "What is your experience level in gymnastics?",
      options: [
        { text: "Elite/International Competitor", points: 10 },
        { text: "National Level (DP 9-10)", points: 8 },
        { text: "Regional Level (DP 6-8)", points: 6 },
        { text: "Club/Recreational Competitor (Xcel, DP 1-5)", points: 4 },
        { text: "Beginner/Tumbling Classes", points: 2 },
      ],
    },
    // ... other gymnastics questions
  ],
  archery: [
    {
      id: "experience",
      question: "What is your experience level in archery?",
      options: [
        { text: "Professional/International competitor", points: 10 },
        { text: "National/State level competitor", points: 8 },
        { text: "Local club competitor", points: 6 },
        { text: "Frequent recreational archer", points: 4 },
        { text: "Beginner/Have shot a few times", points: 2 },
      ],
    },
    // ... other archery questions
  ],
  wrestling: [
    {
      id: "experience",
      question: "What is your experience level in wrestling?",
      options: [
        { text: "Olympic/Senior National level", points: 10 },
        { text: "NCAA/College level", points: 8 },
        { text: "State/High School level", points: 6 },
        { text: "Youth/Club level", points: 4 },
        { text: "Beginner/Just started", points: 2 },
      ],
    },
    // ... other wrestling questions
  ],
  tennis: [
    {
      id: "experience",
      question: "What is your experience level in tennis?",
      options: [
        { text: "Professional ATP/WTA/ITF circuit", points: 10 },
        { text: "National/Collegiate (NCAA) level", points: 8 },
        { text: "Competitive league/Tournament player (e.g., USTA)", points: 6 },
        { text: "Regular club/Recreational player", points: 4 },
        { text: "Beginner/Learning the basics", points: 2 },
      ],
    },
    {
      id: "scoring",
      question: "In a standard game, what score comes after '30'?",
      options: [
        { text: "40", points: 10 },
        { text: "45", points: 4 },
        { text: "Deuce", points: 6 },
        { text: "Game", points: 2 },
      ],
    },
    {
      id: "grand_slams",
      question: "Which of the following is NOT one of the four Grand Slam tournaments?",
      options: [
        { text: "Indian Wells Masters", points: 10 },
        { text: "Wimbledon", points: 2 },
        { text: "US Open", points: 4 },
        { text: "French Open (Roland-Garros)", points: 6 },
      ],
    },
    {
      id: "let_call",
      question: "What does a 'let' call on a serve mean?",
      options: [
        { text: "The serve hit the net and landed in the correct service box; the point is replayed", points: 10 },
        { text: "The serve was a fault", points: 2 },
        { text: "The receiver was not ready", points: 6 },
        { text: "The serve was an ace", points: 0 },
      ],
    },
    {
      id: "set_win",
      question: "To win a standard set, a player must win at least 6 games and...",
      options: [
        { text: "Lead by a margin of two games", points: 10 },
        { text: "Win the next game regardless of the score", points: 4 },
        { text: "Win a 7-point tiebreaker if the score is 6-5", points: 2 },
        { text: "Also win the coin toss", points: 0 },
      ],
    },
    {
      id: "tiebreak_score",
      question: "In a standard 7-point tiebreak, how many points must you win by?",
      options: [
        { text: "2 points", points: 10 },
        { text: "1 point", points: 6 },
        { text: "3 points", points: 4 },
        { text: "The margin does not matter", points: 2 },
      ],
    },
    {
      id: "surface_speed",
      question: "Which court surface is generally considered the fastest?",
      options: [
        { text: "Grass", points: 10 },
        { text: "Clay", points: 8 },
        { text: "Hard Court", points: 6 },
        { text: "Carpet", points: 4 },
      ],
    },
    {
      id: "ace_definition",
      question: "What is an 'ace' in tennis?",
      options: [
        { text: "A legal serve that the receiver does not touch with their racquet", points: 10 },
        { text: "Any serve that wins the point", points: 6 },
        { text: "A serve faster than 100 mph", points: 4 },
        { text: "Winning a point with an overhead smash", points: 2 },
      ],
    },
    {
      id: "faults",
      question: "How many chances does a server get to make a legal serve for one point?",
      options: [
        { text: "Two", points: 10 },
        { text: "One", points: 6 },
        { text: "Three", points: 4 },
        { text: "Unlimited, as long as they are 'lets'", points: 2 },
      ],
    },
    {
      id: "deuce",
      question: "What is the score when the umpire announces 'deuce'?",
      options: [
        { text: "40-40", points: 10 },
        { text: "30-30", points: 2 },
        { text: "The game is tied at 5-5", points: 4 },
        { text: "The set is tied at 6-6", points: 6 },
      ],
    },
  ],
  badminton: [
    {
      id: "experience",
      question: "What is your experience level in badminton?",
      options: [
        { text: "Professional/International circuit", points: 10 },
        { text: "National/State level competitor", points: 8 },
        { text: "Club/District level tournament player", points: 6 },
        { text: "Regular social/Recreational player", points: 4 },
        { text: "Beginner/Casual player", points: 2 },
      ],
    },
    {
      id: "scoring_system",
      question: "A standard game of badminton is played to how many points?",
      options: [
        { text: "21 points", points: 10 },
        { text: "15 points", points: 6 },
        { text: "11 points", points: 4 },
        { text: "25 points", points: 2 },
      ],
    },
    {
      id: "serving_rule",
      question: "When serving, the shuttlecock must be struck...",
      options: [
        { text: "Below the waist in an underarm action", points: 10 },
        { text: "From above the shoulder (overarm)", points: 2 },
        { text: "From any height as long as it goes over the net", points: 4 },
        { text: "After it bounces once", points: 0 },
      ],
    },
    {
      id: "match_win",
      question: "To win a standard badminton match, a player must win...",
      options: [
        { text: "The best of 3 games", points: 10 },
        { text: "The best of 5 games", points: 6 },
        { text: "A single game to 21", points: 4 },
        { text: "The most points after 30 minutes", points: 2 },
      ],
    },
    {
      id: "fault_net",
      question: "It is a fault if a player's body or racquet touches what during play?",
      options: [
        { text: "The net or its supports", points: 10 },
        { text: "The floor on the opponent's side", points: 6 },
        { text: "The ceiling", points: 8 },
        { text: "The back boundary line", points: 2 },
      ],
    },
    {
      id: "let_call",
      question: "A 'let' is called, and the rally is replayed, if...",
      options: [
        { text: "The shuttlecock gets caught on top of the net after passing over it", points: 10 },
        { text: "The server serves before the receiver is ready", points: 8 },
        { text: "Both of the above are correct", points: 10 },
        { text: "A player shouts during a point to distract the opponent", points: 4 },
      ],
    },
    {
      id: "doubles_serve_court",
      question: "In doubles, from which service court does a player serve if their team's score is an even number (e.g., 0, 2, 4)?",
      options: [
        { text: "The right service court", points: 10 },
        { text: "The left service court", points: 6 },
        { text: "Either service court", points: 4 },
        { text: "The center of the court", points: 2 },
      ],
    },
    {
      id: "shuttlecock_name",
      question: "What is the official name for the object hit in badminton?",
      options: [
        { text: "Shuttlecock", points: 10 },
        { text: "Birdie", points: 8 },
        { text: "Shuttle", points: 6 },
        { text: "All of the above are commonly used", points: 10 },
      ],
    },
    {
      id: "clear_shot",
      question: "A shot hit deep into the opponent's back court is called a...",
      options: [
        { text: "Clear", points: 10 },
        { text: "Drop shot", points: 6 },
        { text: "Smash", points: 4 },
        { text: "Drive", points: 2 },
      ],
    },
    {
      id: "game_point_cap",
      question: "If the score reaches 20-20, a player must lead by two points to win. What is the absolute final point a game can be won at?",
      options: [
        { text: "30 (the first to 30 wins, 30-29)", points: 10 },
        { text: "25 (the first to 25 wins, 25-24)", points: 4 },
        { text: "There is no limit or cap", points: 6 },
        { text: "22 (the first to 22 wins, 22-20)", points: 2 },
      ],
    },
  ],
  "table-tennis": [
    {
      id: "experience",
      question: "What is your experience level in Table Tennis?",
      options: [
        { text: "Professional/International competitor", points: 10 },
        { text: "National/State level tournament player", points: 8 },
        { text: "Competitive league/Club player", points: 6 },
        { text: "Skilled recreational player", points: 4 },
        { text: "Beginner/Basement player", points: 2 },
      ],
    },
    {
      id: "scoring_system",
      question: "A standard game of table tennis is played to how many points?",
      options: [
        { text: "11 points", points: 10 },
        { text: "21 points", points: 8 },
        { text: "15 points", points: 6 },
        { text: "25 points", points: 2 },
      ],
    },
    {
      id: "serve_rule_toss",
      question: "How high must the ball be tossed from a flat, open palm during a legal serve?",
      options: [
        { text: "At least 16 cm (about 6 inches)", points: 10 },
        { text: "Above the server's head", points: 6 },
        { text: "At least 30 cm (about 12 inches)", points: 4 },
        { text: "There is no height requirement", points: 2 },
      ],
    },
    {
      id: "let_serve",
      question: "A 'let' is called on a serve if the served ball...",
      options: [
        { text: "Touches the net assembly and then lands in the opponent's correct court", points: 10 },
        { text: "Lands on the edge of the opponent's side of the table", points: 4 },
        { text: "Is hit by the receiver before it bounces", points: 2 },
        { text: "Bounces twice on the opponent's side", points: 0 },
      ],
    },
    {
      id: "penhold_grip",
      question: "Which of these is a common style of holding the paddle?",
      options: [
        { text: "Penhold grip", points: 10 },
        { text: "Hammer grip", points: 2 },
        { text: "Fist grip", points: 0 },
        { text: "Two-handed grip", points: 4 },
      ],
    },
    {
      id: "doubles_serve_rule",
      question: "In doubles, where must the serve travel?",
      options: [
        { text: "From the server's right-hand box diagonally to the receiver's right-hand box", points: 10 },
        { text: "Anywhere from the server's side to the receiver's side", points: 6 },
        { text: "Straight across to the player directly opposite", points: 4 },
        { text: "Anywhere, as long as it bounces on both sides", points: 2 },
      ],
    },
    {
      id: "win_by_margin",
      question: "If a game score reaches 10-10 (deuce), how many consecutive points must a player win to take the game?",
      options: [
        { text: "2", points: 10 },
        { text: "1", points: 6 },
        { text: "3", points: 4 },
        { text: "The first to 15 wins", points: 2 },
      ],
    },
    {
      id: "volleying_illegal",
      question: "What happens if a player hits the ball before it has bounced on their side of the table?",
      options: [
        { text: "They lose the point", points: 10 },
        { text: "They win the point, as it's a 'volley'", points: 2 },
        { text: "A 'let' is called and the point is replayed", points: 6 },
        { text: "It is legal as long as they are behind the end line", points: 4 },
      ],
    },
    {
      id: "edge_ball",
      question: "If a ball hits the top edge of the playing surface, it is considered...",
      options: [
        { text: "In play", points: 10 },
        { text: "Out of play, a fault", points: 6 },
        { text: "A let, the point is replayed", points: 4 },
        { text: "Legal only if it was a serve", points: 2 },
      ],
    },
    {
      id: "serving_rotation",
      question: "In singles, how many serves does a player get before the serve switches to the opponent?",
      options: [
        { text: "Two serves", points: 10 },
        { text: "Five serves", points: 8 },
        { text: "One serve", points: 4 },
        { text: "Three serves", points: 2 },
      ],
    },
  ],
  judo: [
    {
      id: "experience",
      question: "What is your experience level in Judo?",
      options: [
        { text: "Black belt (Dan grade) competitor", points: 10 },
        { text: "Brown/Blue/Green belt (senior Kyu grade) competitor", points: 8 },
        { text: "Yellow/Orange belt (junior Kyu grade) competitor", points: 6 },
        { text: "White belt with competition experience", points: 4 },
        { text: "Beginner/White belt in training", points: 2 },
      ],
    },
    {
      id: "ippon_win",
      question: "What is an 'Ippon' in Judo?",
      options: [
        { text: "A full point that wins the match instantly", points: 10 },
        { text: "A half point", points: 6 },
        { text: "A penalty", points: 4 },
        { text: "A type of throw", points: 2 },
      ],
    },
    {
      id: "waza_ari",
      question: "How many 'Waza-ari' (half points) are needed to win a match?",
      options: [
        { text: "Two", points: 10 },
        { text: "One", points: 6 },
        { text: "Three", points: 4 },
        { text: "Waza-ari no longer add up to win the match", points: 8 },
      ],
    },
    {
      id: "uniform_name",
      question: "What is the name of the uniform worn in Judo?",
      options: [
        { text: "Judogi", points: 10 },
        { text: "Dobok", points: 4 },
        { text: "Kimono", points: 6 },
        { text: "Singlet", points: 2 },
      ],
    },
    {
      id: "meaning_of_judo",
      question: "The word 'Judo' translates to...",
      options: [
        { text: "The Gentle Way", points: 10 },
        { text: "The Way of the Sword", points: 2 },
        { text: "The Art of Kicking and Punching", points: 0 },
        { text: "The Hard Fist", points: 4 },
      ],
    },
    {
      id: "founder",
      question: "Who is the founder of Judo?",
      options: [
        { text: "Jigoro Kano", points: 10 },
        { text: "Gichin Funakoshi", points: 4 },
        { text: "Morihei Ueshiba", points: 6 },
        { text: "Masutatsu Oyama", points: 2 },
      ],
    },
    {
      id: "illegal_moves",
      question: "Which of the following actions is illegal in Judo competition?",
      options: [
        { text: "Striking, kicking, or attacking joints", points: 10 },
        { text: "Choking the opponent", points: 6 },
        { text: "Applying an armbar", points: 4 },
        { text: "Throwing the opponent", points: 2 },
      ],
    },
    {
      id: "pinning_techniques",
      question: "What is the Japanese term for pinning techniques (hold-downs)?",
      options: [
        { text: "Osaekomi-waza", points: 10 },
        { text: "Nage-waza", points: 8 },
        { text: "Katame-waza", points: 6 },
        { text: "Atemi-waza", points: 4 },
      ],
    },
    {
      id: "golden_score",
      question: "If a match is tied at the end of regulation time, it goes into a period called...",
      options: [
        { text: "Golden Score", points: 10 },
        { text: "Overtime", points: 8 },
        { text: "Sudden Death", points: 6 },
        { text: "Hantei (Judge's Decision)", points: 4 },
      ],
    },
    {
      id: "leg_grabs",
      question: "In modern competition Judo, grabbing the opponent's legs directly is...",
      options: [
        { text: "Illegal and results in a penalty (Shido)", points: 10 },
        { text: "Legal and a common takedown method", points: 4 },
        { text: "Legal only as a counter-attack", points: 6 },
        { text: "Legal only in the last minute of the match", points: 2 },
      ],
    },
  ],
  taekwondo: [
    {
      id: "experience",
      question: "What is your experience level in Taekwondo?",
      options: [
        { text: "Black belt (Dan grade) competitor", points: 10 },
        { text: "Red/Brown belt (senior Kup grade) competitor", points: 8 },
        { text: "Green/Blue belt (intermediate Kup grade) competitor", points: 6 },
        { text: "Yellow/Orange belt (junior Kup grade) competitor", points: 4 },
        { text: "Beginner/White belt in training", points: 2 },
      ],
    },
    {
      id: "origin_country",
      question: "Taekwondo is a martial art that originated in which country?",
      options: [
        { text: "Korea", points: 10 },
        { text: "Japan", points: 6 },
        { text: "China", points: 4 },
        { text: "Thailand", points: 2 },
      ],
    },
    {
      id: "meaning",
      question: "The term 'Taekwondo' translates to...",
      options: [
        { text: "The Way of the Foot and Fist", points: 10 },
        { text: "The Gentle Way", points: 4 },
        { text: "The Art of the Empty Hand", points: 6 },
        { text: "The Way of the Warrior", points: 2 },
      ],
    },
    {
      id: "scoring_priority",
      question: "In Olympic (WT) sparring, which techniques score the most points?",
      options: [
        { text: "Spinning kicks to the head", points: 10 },
        { text: "Punches to the body", points: 4 },
        { text: "Regular kicks to the body", points: 6 },
        { text: "All techniques score the same", points: 2 },
      ],
    },
    {
      id: "uniform_name",
      question: "What is the name of the uniform worn in Taekwondo?",
      options: [
        { text: "Dobok", points: 10 },
        { text: "Judogi", points: 4 },
        { text: "Gi", points: 6 },
        { text: "Hogu", points: 2 },
      ],
    },
    {
      id: "poomsae",
      question: "What are the choreographed patterns of movements called in Taekwondo?",
      options: [
        { text: "Poomsae (or Hyung/Tul)", points: 10 },
        { text: "Kata", points: 8 },
        { text: "Sparring", points: 2 },
        { text: "Grading", points: 4 },
      ],
    },
    {
      id: "protective_gear",
      question: "What is the name of the padded chest protector worn in sparring?",
      options: [
        { text: "Hogu", points: 10 },
        { text: "Helmet", points: 4 },
        { text: "Dobok", points: 2 },
        { text: "Shin guard", points: 6 },
      ],
    },
    {
      id: "illegal_target",
      question: "In most competition rules, which of the following is an illegal target?",
      options: [
        { text: "The back of the head or spine", points: 10 },
        { text: "The front of the body (trunk)", points: 2 },
        { text: "The front of the face", points: 4 },
        { text: "The legs", points: 6 },
      ],
    },
    {
      id: "punching_rules",
      question: "In Olympic sparring, punches are only legal when aimed at the...",
      options: [
        { text: "Trunk/body protector", points: 10 },
        { text: "Head/face", points: 4 },
        { text: "Anywhere above the waist", points: 6 },
        { text: "Punches are not allowed", points: 2 },
      ],
    },
    {
      id: "point_gap",
      question: "A sparring match can end early if one competitor gains a large point lead. This is called a...",
      options: [
        { text: "Win by Point Gap", points: 10 },
        { text: "Technical Knockout", points: 8 },
        { text: "Sudden Death", points: 6 },
        { text: "Golden Point", points: 4 },
      ],
    },
  ],
  weightlifting: [
    {
      id: "experience",
      question: "What is your experience level in Olympic Weightlifting?",
      options: [
        { text: "National/International level competitor", points: 10 },
        { text: "State/Regional level competitor", points: 8 },
        { text: "Local competition participant", points: 6 },
        { text: "Regularly train the snatch and clean & jerk", points: 4 },
        { text: "Beginner/CrossFit participant", points: 2 },
      ],
    },
    {
      id: "main_lifts",
      question: "What are the two competition lifts in Olympic Weightlifting?",
      options: [
        { text: "The Snatch and the Clean & Jerk", points: 10 },
        { text: "The Squat, Bench Press, and Deadlift", points: 4 },
        { text: "The Deadlift and the Overhead Press", points: 2 },
        { text: "The Power Clean and the Push Press", points: 6 },
      ],
    },
    {
      id: "snatch_description",
      question: "The Snatch involves lifting the barbell from the floor to overhead...",
      options: [
        { text: "In one single, continuous movement", points: 10 },
        { text: "In two separate movements (to shoulders, then overhead)", points: 6 },
        { text: "With a pause at the hips", points: 2 },
        { text: "Using a narrow grip", points: 4 },
      ],
    },
    {
      id: "clean_jerk_description",
      question: "The Clean & Jerk is a two-part lift. What are the two parts?",
      options: [
        { text: "The 'clean' to the shoulders, and the 'jerk' overhead", points: 10 },
        { text: "The 'pull' from the floor, and the 'press' overhead", points: 6 },
        { text: "The 'squat' under the bar, and the 'stand' up", points: 4 },
        { text: "The 'dip' and the 'drive'", points: 2 },
      ],
    },
    {
      id: "attempts",
      question: "How many attempts does a lifter have for each of the two lifts?",
      options: [
        { text: "Three", points: 10 },
        { text: "Two", points: 4 },
        { text: "Four", points: 6 },
        { text: "One", points: 2 },
      ],
    },
    {
      id: "no_lift_reason",
      question: "Which of the following would result in a 'no lift' (red lights)?",
      options: [
        { text: "Pressing out the arms to finish the lift overhead", points: 10 },
        { text: "Using a hook grip", points: 2 },
        { text: "Dropping the bar after the down signal", points: 4 },
        { text: "Shouting during the lift", points: 6 },
      ],
    },
    {
      id: "barbell_weight",
      question: "What are the standard weights for a men's and women's competition barbell?",
      options: [
        { text: "20 kg for men, 15 kg for women", points: 10 },
        { text: "45 lbs for both", points: 6 },
        { text: "25 kg for men, 20 kg for women", points: 4 },
        { text: "The weight varies by lifter preference", points: 2 },
      ],
    },
    {
      id: "tie_breaker",
      question: "If two lifters have the same total, how is the winner decided?",
      options: [
        { text: "The lifter with the lower bodyweight wins", points: 10 },
        { text: "The lifter who made the total first wins", points: 8 },
        { text: "They share the placing", points: 4 },
        { text: "There is a fourth 'lift-off' attempt", points: 2 },
      ],
    },
    {
      id: "commands",
      question: "A lifter must wait for what signal from the referees before dropping the bar?",
      options: [
        { text: "A 'down' signal or buzzer", points: 10 },
        { text: "A tap on the shoulder", points: 2 },
        { text: "Three green lights", points: 6 },
        { text: "There is no signal, they can drop it when stable", points: 4 },
      ],
    },
    {
      id: "weight_classes",
      question: "The main purpose of weight classes is to...",
      options: [
        { text: "Ensure fair competition between lifters of similar size", points: 10 },
        { text: "Group lifters by their total strength", points: 6 },
        { text: "Separate professional and amateur lifters", points: 4 },
        { text: "Determine the order of lifting", points: 2 },
      ],
    },
  ],
  shooting: [
    {
      id: "experience",
      question: "What is your experience level in competitive shooting?",
      options: [
        { text: "International (ISSF, Olympic) level competitor", points: 10 },
        { text: "National/State level competitor", points: 8 },
        { text: "Regular club-level match participant", points: 6 },
        { text: "Frequent recreational target shooter", points: 4 },
        { text: "Beginner/Have taken a safety course", points: 2 },
      ],
    },
    {
      id: "main_disciplines",
      question: "What are the three main categories of firearms used in Olympic shooting?",
      options: [
        { text: "Rifle, Pistol, and Shotgun", points: 10 },
        { text: "Handgun, Carbine, and Long Rifle", points: 4 },
        { text: "Air, Rimfire, and Centerfire", points: 6 },
        { text: "Manual, Semi-Automatic, and Automatic", points: 2 },
      ],
    },
    {
      id: "shotgun_events",
      question: "Trap and Skeet are events in which discipline?",
      options: [
        { text: "Shotgun", points: 10 },
        { text: "Rifle", points: 6 },
        { text: "Pistol", points: 4 },
        { text: "Action Shooting", points: 2 },
      ],
    },
    {
      id: "three_positions",
      question: "The 50m Rifle '3 Positions' event consists of shooting from which stances?",
      options: [
        { text: "Kneeling, Prone, and Standing", points: 10 },
        { text: "Sitting, Kneeling, and Standing", points: 4 },
        { text: "Prone, Sitting, and Standing", points: 6 },
        { text: "Standing, moving, and from a barricade", points: 2 },
      ],
    },
    {
      id: "perfect_score_rifle",
      question: "In the final round of many Olympic events, what is the highest score for a single shot?",
      options: [
        { text: "10.9", points: 10 },
        { text: "10.0", points: 8 },
        { text: "12.0", points: 2 },
        { text: "100", points: 4 },
      ],
    },
    {
      id: "safety_first",
      question: "What is the most important rule in all shooting sports?",
      options: [
        { text: "Always keep the firearm pointed in a safe direction", points: 10 },
        { text: "Always wear eye and ear protection", points: 8 },
        { text: "Always keep your finger off the trigger until ready to shoot", points: 8 },
        { text: "All safety rules are equally important", points: 10 },
      ],
    },
    {
      id: "range_commands",
      question: "What does the range command 'Cease Fire' mean?",
      options: [
        { text: "Immediately stop shooting, unload the firearm, and await instructions", points: 10 },
        { text: "Finish your current shot and then stop", points: 4 },
        { text: "The competition is over", points: 2 },
        { text: "A 5-minute break is starting", points: 0 },
      ],
    },
    {
      id: "air_pistol_distance",
      question: "From what distance is the 10m Air Pistol event shot?",
      options: [
        { text: "10 meters", points: 10 },
        { text: "25 meters", points: 6 },
        { text: "50 meters", points: 4 },
        { text: "15 meters", points: 2 },
      ],
    },
    {
      id: "misfire_procedure",
      question: "If your firearm fails to fire when you pull the trigger (a misfire), what should you do first?",
      options: [
        { text: "Keep the firearm pointed safely downrange for at least 30 seconds", points: 10 },
        { text: "Immediately open the action to see what's wrong", points: 2 },
        { text: "Put the firearm down and raise your hand for help", points: 6 },
        { text: "Try pulling the trigger again", points: 0 },
      ],
    },
    {
      id: "equipment_check",
      question: "Before a competition, shooters must present their equipment for...",
      options: [
        { text: "An equipment control check to ensure it meets regulations", points: 10 },
        { text: "A safety inspection by the range officer", points: 8 },
        { text: "Registration and photography", points: 2 },
        { text: "Sighting-in on a practice range", points: 6 },
      ],
    },
  ],
  cycling: [
    {
      id: "experience",
      question: "What is your experience level in competitive cycling?",
      options: [
        { text: "Professional/UCI ProTeam rider", points: 10 },
        { text: "Elite/Category 1-2 amateur racer", points: 8 },
        { text: "Category 3-5 amateur racer", points: 6 },
        { text: "Regular Gran Fondo/Century rider", points: 4 },
        { text: "Recreational/Commuter cyclist", points: 2 },
      ],
    },
    {
      id: "main_disciplines",
      question: "Which of these is NOT an Olympic cycling discipline?",
      options: [
        { text: "Cyclo-cross", points: 10 },
        { text: "Track Cycling", points: 4 },
        { text: "Mountain Bike (MTB)", points: 6 },
        { text: "BMX Racing", points: 2 },
      ],
    },
    {
      id: "peloton",
      question: "What is the main group of riders in a road race called?",
      options: [
        { text: "The Peloton", points: 10 },
        { text: "The Echelon", points: 8 },
        { text: "The Breakaway", points: 6 },
        { text: "The Gruppetto", points: 4 },
      ],
    },
    {
      id: "drafting",
      question: "The act of riding closely behind another rider to save energy is called...",
      options: [
        { text: "Drafting or Slipstreaming", points: 10 },
        { text: "Pacing", points: 6 },
        { text: "Blocking", points: 2 },
        { text: "Attacking", points: 4 },
      ],
    },
    {
      id: "grand_tours",
      question: "Which of these races is one of the three 'Grand Tours'?",
      options: [
        { text: "Tour de France", points: 10 },
        { text: "Paris-Roubaix", points: 6 },
        { text: "Tour of California", points: 4 },
        { text: "World Championships", points: 2 },
      ],
    },
    {
      id: "time_trial",
      question: "A race where individuals or teams start at intervals and race against the clock is a...",
      options: [
        { text: "Time Trial", points: 10 },
        { text: "Criterium", points: 6 },
        { text: "Road Race", points: 4 },
        { text: "Keirin", points: 2 },
      ],
    },
    {
      id: "track_cycling_keirin",
      question: "In which track event do riders follow a motorized pacer before a final sprint?",
      options: [
        { text: "Keirin", points: 10 },
        { text: "Madison", points: 6 },
        { text: "Omnium", points: 4 },
        { text: "Individual Pursuit", points: 2 },
      ],
    },
    {
      id: "tour_de_france_yellow",
      question: "In the Tour de France, what does the yellow jersey signify?",
      options: [
        { text: "The overall race leader by time", points: 10 },
        { text: "The best sprinter (points leader)", points: 8 },
        { text: "The best climber (King of the Mountains)", points: 6 },
        { text: "The best young rider", points: 4 },
      ],
    },
    {
      id: "bmx_racing",
      question: "BMX (Bicycle Moto Cross) races primarily involve...",
      options: [
        { text: "Sprinting over a short dirt track with jumps and banked turns", points: 10 },
        { text: "Performing technical tricks on ramps and flat ground", points: 6 },
        { text: "Long-distance cross-country riding on dirt trails", points: 4 },
        { text: "Riding on a steeply banked indoor velodrome", points: 2 },
      ],
    },
    {
      id: "mountain_biking_xc",
      question: "The Olympic Mountain Bike discipline is primarily which format?",
      options: [
        { text: "Cross-Country (XC)", points: 10 },
        { text: "Downhill (DH)", points: 8 },
        { text: "Enduro", points: 6 },
        { text: "Freeride", points: 4 },
      ],
    },
  ],
  triathlon: [
    {
      id: "experience",
      question: "What is your experience level in Triathlon?",
      options: [
        { text: "Professional/Elite competitor", points: 10 },
        { text: "Ironman/70.3 age group competitor", points: 8 },
        { text: "Olympic/Sprint distance age group competitor", points: 6 },
        { text: "Have completed at least one triathlon", points: 4 },
        { text: "In training for my first event/Beginner", points: 2 },
      ],
    },
    {
      id: "discipline_order",
      question: "What is the correct order of the three disciplines in a standard triathlon?",
      options: [
        { text: "Swim, Bike, Run", points: 10 },
        { text: "Run, Bike, Swim", points: 2 },
        { text: "Bike, Swim, Run", points: 0 },
        { text: "Swim, Run, Bike", points: 4 },
      ],
    },
    {
      id: "olympic_distance",
      question: "What are the distances for an Olympic distance triathlon?",
      options: [
        { text: "1.5km swim, 40km bike, 10km run", points: 10 },
        { text: "750m swim, 20km bike, 5km run", points: 8 },
        { text: "3.8km swim, 180km bike, 42.2km run", points: 6 },
        { text: "1km swim, 50km bike, 15km run", points: 4 },
      ],
    },
    {
      id: "transition_area",
      question: "The area where athletes change between disciplines is called...",
      options: [
        { text: "The Transition Area", points: 10 },
        { text: "The Change Zone", points: 4 },
        { text: "The Pit Stop", points: 2 },
        { text: "The Exchange Area", points: 6 },
      ],
    },
    {
      id: "ironman_distance",
      question: "A full distance Ironman triathlon consists of a 2.4-mile swim, a 112-mile bike, and a...",
      options: [
        { text: "26.2-mile run (marathon)", points: 10 },
        { text: "13.1-mile run (half-marathon)", points: 6 },
        { text: "10-mile run", points: 4 },
        { text: "20-mile run", points: 2 },
      ],
    },
    {
      id: "drafting_rules",
      question: "In many age-group triathlons, drafting on the bike (riding in another's slipstream) is...",
      options: [
        { text: "Illegal and results in a time penalty", points: 10 },
        { text: "Legal and encouraged for energy saving", points: 4 },
        { text: "Legal only for professional athletes", points: 8 },
        { text: "Legal only within your designated age group", points: 6 },
      ],
    },
    {
      id: "fourth_discipline",
      question: "What is often referred to as the 'fourth discipline' of triathlon?",
      options: [
        { text: "Nutrition", points: 10 },
        { text: "Mental strength", points: 8 },
        { text: "Transition speed", points: 6 },
        { text: "Gear selection", points: 4 },
      ],
    },
    {
      id: "bonking",
      question: "The term for depleting your body's glycogen stores and running out of energy is...",
      options: [
        { text: "Bonking or Hitting the wall", points: 10 },
        { text: "Cramping", points: 4 },
        { text: "Dehydrating", points: 6 },
        { text: "Pacing", points: 2 },
      ],
    },
    {
      id: "transition_penalty",
      question: "Which of the following actions in the transition area can result in a penalty?",
      options: [
        { text: "Touching your bike before your helmet is on and buckled", points: 10 },
        { text: "Leaving your swim goggles outside your designated spot", points: 6 },
        { text: "Running too fast through the transition area", points: 4 },
        { text: "All of the above", points: 10 },
      ],
    },
    {
      id: "sprint_distance",
      question: "A 'Sprint' triathlon is approximately what distance?",
      options: [
        { text: "Half the Olympic distance (750m swim, 20km bike, 5km run)", points: 10 },
        { text: "Twice the Olympic distance", points: 2 },
        { text: "The same as the Olympic distance but with no transitions", points: 4 },
        { text: "A 100m swim, 1km bike, and 1km run", points: 0 },
      ],
    },
  ],
};


const sportNames: Record<string, string> = {
  athletics: "Athletics",
  swimming: "Swimming",
  boxing: "Boxing",
  gymnastics: "Gymnastics",
  archery: "Archery",
  wrestling: "Wrestling",
  tennis: "Tennis",
  badminton: "Badminton",
  "table-tennis": "Table Tennis",
  judo: "Judo",
  taekwondo: "Taekwondo",
  weightlifting: "Weightlifting",
  shooting: "Shooting",
  cycling: "Cycling",
  triathlon: "Triathlon",
};


export default function ExcellencePage() {
  const params = useParams()
  const sport = params.sport as string
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [eligibilityPercentage, setEligibilityPercentage] = useState(0)

  const faqs = sportFAQs[sport] || sportFAQs.athletics
  const maxScore = faqs.reduce((acc, faq) => acc + Math.max(...faq.options.map(opt => opt.points)), 0);
  const passingScore = Math.ceil(maxScore * 0.4)

  useEffect(() => {
    calculateScore()
  }, [answers])

  const calculateScore = () => {
    let totalScore = 0
    Object.entries(answers).forEach(([questionId, selectedOption]) => {
      const question = faqs.find((faq) => faq.id === questionId)
      if (question) {
        const option = question.options.find((opt) => opt.text === selectedOption)
        if (option) {
          totalScore += option.points
        }
      }
    })
    setScore(totalScore)
    setEligibilityPercentage(maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0)
  }

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const handleNext = () => {
    if (currentQuestion < faqs.length - 1) {
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

  const isCurrentAnswered = answers[faqs[currentQuestion]?.id]
  const passed = score >= passingScore

  if (showResults) {
    return (
      <div className="min-h-screen bg-[#2D2A32] py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Trophy className="h-8 w-8 text-[#DDD92A]" />
              <span className="text-2xl font-bold text-[#FAFDF6]">Excellence Assessment Results</span>
            </div>
            <p className="text-[#EEEFA8]">Your performance in {sportNames[sport]} excellence evaluation</p>
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
                <p className="text-lg text-[#EEEFA8]">Eligibility Score</p>
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
                    Your Score: {score}/{maxScore}
                  </span>
                  <span>
                    Required: {passingScore}/{maxScore} (40%)
                  </span>
                </div>
                <Progress value={eligibilityPercentage} className="h-3 [&>div]:bg-[#DDD92A]" />
              </div>

              {passed ? (
                <div className="bg-black/20 border border-[#DDD92A]/50 rounded-lg p-6 space-y-4">
                  <h3 className="text-lg font-semibold text-[#FAFDF6]">Congratulations!</h3>
                  <p className="text-[#EEEFA8]">
                    You have successfully met the minimum excellence threshold for {sportNames[sport]}. You demonstrate
                    sufficient knowledge and experience to proceed to the next stage of the athlete performance
                    analysis.
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-medium text-[#FAFDF6]">Next Steps:</h4>
                    <ul className="text-sm text-[#EEEFA8] space-y-1">
                      <li>• Complete fitness details and health questionnaire</li>
                      <li>• Upload performance videos for AI analysis</li>
                      <li>• Receive personalized training recommendations</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="bg-red-900/50 border border-red-500/50 rounded-lg p-6 space-y-4">
                  <h3 className="text-lg font-semibold text-red-300">Excellence Threshold Not Met</h3>
                  <p className="text-red-400">
                    You do not meet the minimum excellence threshold (40%). You cannot proceed further at this time.
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-medium text-red-300">Suggestions to Improve:</h4>
                    <ul className="text-sm text-red-400 space-y-1">
                      <li>• Gain more training experience in {sportNames[sport]}</li>
                      <li>• Study sport-specific techniques and rules</li>
                      <li>• Participate in local competitions to build experience</li>
                      <li>• Work with a qualified coach to improve skills</li>
                      <li>• Focus on physical conditioning and mental preparation</li>
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
                    Continue to Fitness Details
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Link href="/sports-selection" className="flex-1">
                    <Button
                      variant="outline"
                      className="w-full bg-transparent border-[#EAE151] text-[#EAE151] hover:bg-white/10"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Go back to Sports Selection
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
            <span>Back to Sports</span>
          </Link>
          <div className="flex items-center space-x-2">
            <Trophy className="h-6 w-6 text-[#DDD92A]" />
            <span className="font-bold text-[#FAFDF6]">Excellence Assessment</span>
          </div>
        </div>

        <div className="mb-8 space-y-4">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-[#FAFDF6]">{sportNames[sport]} Excellence Assessment</h1>
            <p className="text-[#EEEFA8]">Answer {faqs.length} questions to evaluate your knowledge and experience level</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm text-[#EEEFA8]">
              <span>
                Question {currentQuestion + 1} of {faqs.length}
              </span>
            </div>
            <Progress value={((currentQuestion + 1) / faqs.length) * 100} className="h-2 bg-black/20 [&>div]:bg-[#DDD92A]" />
          </div>
        </div>

        <Card className="border-white/10 bg-[#2D2A32] shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-[#FAFDF6]">{faqs[currentQuestion]?.question}</CardTitle>
            <CardDescription className="text-[#EEEFA8]">Select the option that best describes your current level</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <RadioGroup
              value={answers[faqs[currentQuestion]?.id] || ""}
              onValueChange={(value) => handleAnswerChange(faqs[currentQuestion]?.id, value)}
              className="text-[#EEEFA8]"
            >
              {faqs[currentQuestion]?.options.map((option, index) => (
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
            Previous
          </Button>

          <Button
            onClick={handleNext}
            disabled={!isCurrentAnswered}
            className="bg-[#DDD92A] hover:bg-[#c8c426] text-[#2D2A32] font-semibold"
          >
            {currentQuestion === faqs.length - 1 ? "View Results" : "Next"}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        <div className="mt-8 bg-black/20 rounded-lg p-4 border border-white/10">
          <div className="flex justify-between items-center text-sm">
            <span className="text-[#EEEFA8]">Current Progress:</span>
            <span className="font-medium text-[#FAFDF6]">
              {Object.keys(answers).length}/{faqs.length} questions answered
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
