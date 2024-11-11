import { UserData } from './types';

export const fetchUserDashboardData = async (): Promise<UserData> => {
  console.log('Fetching dashboard data...');
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const mockData: UserData = {
    name: 'John Doe',
    phoneNumber: '+1 (555) 123-4567',
    safePassStatus: 'Active',
    additionalTraining: 'Fire Safety Refresher Course required',
    lastActive: '2024-11-10T15:30:00',
    trainingModules: [
      {
        id: 1,
        name: 'Fire Safety',
        completed: true,
        progress: 100,
        dueDate: '2024-12-01',
        description: 'Basic fire prevention and response protocols'
      },
      {
        id: 2,
        name: 'First Aid',
        completed: false,
        progress: 60,
        dueDate: '2024-11-15',
        description: 'Emergency medical response training'
      }
    ]
  };

  console.log('Returning mock data:', mockData);
  return mockData;
}; 