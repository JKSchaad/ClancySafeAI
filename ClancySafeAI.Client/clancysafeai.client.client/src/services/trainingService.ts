import { apiClient } from '@/lib/apiClient'
import { Training } from '@/types/training'

export const trainingService = {
  async getTraining(trainingId: string): Promise<Training> {
    const response = await apiClient.get(`/api/training/${trainingId}`)
    return response.data
  },

  async completeTraining(trainingId: string): Promise<void> {
    await apiClient.post(`/api/training/${trainingId}/complete`)
  },

  async submitQuestion(trainingId: string, slideId: number, question: string): Promise<void> {
    await apiClient.post(`/api/training/${trainingId}/question`, {
      slideId,
      question
    })
  }
} 