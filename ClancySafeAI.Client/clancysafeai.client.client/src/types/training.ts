export interface TrainingSlide {
  id: number
  title: string
  content: string
  imageUrl?: string
  audioUrl?: string
  duration: number
}

export interface Training {
  id: string
  title: string
  description: string
  slides: TrainingSlide[]
  status: 'not_started' | 'in_progress' | 'completed'
  completedAt?: string
} 