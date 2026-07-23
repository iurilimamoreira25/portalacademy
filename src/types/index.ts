export interface Message {
  id: string
  role: 'user' | 'customer'
  content: string
  timestamp: Date
}

export interface EvaluationScore {
  empathy: number
  communication: number
  activeListening: number
  persuasion: number
  technicalKnowledge: number
  negotiation: number
  speed: number
  objectionHandling: number
  closure: number
  overall: number
}

export interface FeedbackItem {
  type: 'success' | 'error' | 'improvement'
  title: string
  description: string
  example?: string
}

export interface TrainingResult {
  evaluation: EvaluationScore
  feedback: FeedbackItem[]
  xpEarned: number
  coinsEarned: number
  converted: boolean
}

export interface UserProfile {
  id: string
  name: string
  email: string
  role: string
  xp: number
  level: number
  coins: number
  streak: number
}
