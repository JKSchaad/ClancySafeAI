export type SafePassStatus = 'Active' | 'Suspended' | 'Expired';

export interface TrainingModule {
  id: number;
  name: string;
  completed: boolean;
  progress: number;
  dueDate?: string;
  description?: string;
}

export interface UserData {
  name: string;
  phoneNumber: string;
  safePassStatus: SafePassStatus;
  additionalTraining: string | null;
  trainingModules: TrainingModule[];
  lastActive?: string;
} 