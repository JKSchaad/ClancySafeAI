'use client'

import TrainingTheator from '../../components/features/training/TrainingTheator'

// Mock data for testing
const mockSlides = [
  {
    id: 1,
    title: "Introduction to Fire Safety",
    content: "Welcome to the Fire Safety Training module.",
    imageUrl: "/assets/slide1.png",
    audioUrl: "/assets/audio1.mp3"
  },
  {
    id: 2,
    title: "Types of Fires",
    content: "Understanding different fire classifications.",
    imageUrl: "/assets/slide2.png",
    audioUrl: "/assets/audio2.mp3"
  }
]

export default function TrainingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <TrainingTheator 
        moduleName="Fire Safety Training"
        totalSlides={mockSlides.length}
        currentSlide={1}
      />
    </div>
  )
} 