'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { PlayCircle, PauseCircle, StopCircle, MessageCircle, Volume2, VolumeX, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react'
import Image from 'next/image'
import { TrainingSlide } from '@/types/training'
import { cn } from '@/lib/utils'

interface TrainingTheaterProps {
  trainingId: string
  title: string
  slides: TrainingSlide[]
  onComplete: (trainingId: string) => void
  onAskQuestion: (trainingId: string, slideId: number, question: string) => void
}

export default function TrainingTheater({
  trainingId,
  title,
  slides,
  onComplete,
  onAskQuestion
}: TrainingTheaterProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [questionAsked, setQuestionAsked] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isMuted, setIsMuted] = useState(false)
  const [isTheaterMode, setIsTheaterMode] = useState(false)

  useEffect(() => {
    if (isPlaying) {
      const timer = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(timer)
            onComplete(trainingId)
            return 100
          }
          
          // Calculate if we should advance to next slide
          const progressPerSlide = 100 / slides.length
          const nextProgress = prevProgress + 1
          const currentSlideIndex = Math.floor((prevProgress) / progressPerSlide)
          const nextSlideIndex = Math.floor(nextProgress / progressPerSlide)
          
          if (nextSlideIndex > currentSlideIndex) {
            setCurrentSlide(nextSlideIndex)
          }
          
          return nextProgress
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [isPlaying, trainingId, slides.length, onComplete])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault()
        isPlaying ? pauseTraining() : startTraining()
      } else if (e.code === 'ArrowLeft') {
        handlePreviousSlide()
      } else if (e.code === 'ArrowRight') {
        handleNextSlide()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isPlaying])

  const startTraining = () => {
    setIsPlaying(true)
    if (audioRef.current) {
      audioRef.current.play()
    }
  }

  const pauseTraining = () => {
    setIsPlaying(false)
    if (audioRef.current) {
      audioRef.current.pause()
    }
  }

  const endTraining = () => {
    setIsPlaying(false)
    setProgress(0)
    setCurrentSlide(0)
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }

  const handleAskQuestion = () => {
    const question = prompt('Please enter your question:')
    if (question) {
      onAskQuestion(trainingId, slides[currentSlide].id, question)
      setQuestionAsked(true)
    }
  }

  const handlePreviousSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1)
      const progressPerSlide = 100 / slides.length
      setProgress(currentSlide * progressPerSlide)
    }
  }

  const handleNextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1)
      const progressPerSlide = 100 / slides.length
      setProgress((currentSlide + 2) * progressPerSlide)
    }
  }

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted
    }
  }, [isMuted])

  return (
    <Card className={cn(
      "bg-white shadow-xl transition-all duration-300",
      isTheaterMode && "fixed inset-0 z-50 rounded-none"
    )}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsTheaterMode(!isTheaterMode)}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* AI Coach Avatar and Audio */}
        <div className="flex items-center justify-center">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center relative">
            <Image
              src="/assets/ai-coach-avatar.png"
              alt="AI Safety Coach"
              width={96}
              height={96}
              className="rounded-full"
            />
            {isPlaying && (
              <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1">
                <Volume2 className="h-4 w-4 text-white" />
              </div>
            )}
          </div>
        </div>
        <audio ref={audioRef} src={slides[currentSlide].audioUrl} />

        {/* Presentation Window */}
        <div className="relative bg-gray-100 p-6 rounded-lg aspect-video">
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100"
            onClick={handlePreviousSlide}
            disabled={currentSlide === 0}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">{slides[currentSlide].title}</h3>
            {slides[currentSlide].imageUrl && (
              <Image
                src={slides[currentSlide].imageUrl}
                alt={slides[currentSlide].title}
                width={300}
                height={200}
                className="mx-auto object-cover"
              />
            )}
            <p className="mt-4 text-lg">{slides[currentSlide].content}</p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100"
            onClick={handleNextSlide}
            disabled={currentSlide === slides.length - 1}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>

        {/* Training Controls */}
        <div className="flex justify-center space-x-4">
          {!isPlaying ? (
            <Button onClick={startTraining} variant="default">
              <PlayCircle className="mr-2 h-4 w-4" /> Start Training
            </Button>
          ) : (
            <Button onClick={pauseTraining} variant="outline">
              <PauseCircle className="mr-2 h-4 w-4" /> Pause Training
            </Button>
          )}
          <Button onClick={endTraining} variant="destructive">
            <StopCircle className="mr-2 h-4 w-4" /> End Training
          </Button>
          <Button onClick={handleAskQuestion} variant={questionAsked ? "secondary" : "outline"}>
            <MessageCircle className="mr-2 h-4 w-4" /> {questionAsked ? "Question Asked" : "Ask Question"}
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="w-full">
          <Progress value={progress} className="w-full" />
        </div>
        <p className="text-sm text-gray-500 text-center">
          Progress: {Math.round(progress)}% | Slide {currentSlide + 1} of {slides.length}
        </p>
      </CardFooter>
    </Card>
  )
} 