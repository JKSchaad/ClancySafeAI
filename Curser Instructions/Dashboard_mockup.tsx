import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  CheckCircle2,
  XCircle,
  Bell,
  Settings,
  AlertCircle,
  ChevronRight
} from 'lucide-react';

type SafePassStatus = 'Active' | 'Suspended' | 'Expired';

interface TrainingModule {
  id: number;
  name: string;
  completed: boolean;
  progress: number;
  dueDate?: string;
  description?: string;
}

interface UserData {
  name: string;
  phoneNumber: string;
  safePassStatus: SafePassStatus;
  additionalTraining: string | null;
  trainingModules: TrainingModule[];
  lastActive?: string;
}

const SafetyTrainingDashboard: React.FC = () => {
  const [userData, setUserData] = useState<UserData>({
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
      },
      {
        id: 3,
        name: 'Hazardous Materials',
        completed: false,
        progress: 30,
        dueDate: '2024-11-20',
        description: 'Handling and disposal of dangerous substances'
      },
      {
        id: 4,
        name: 'Fall Protection',
        completed: true,
        progress: 100,
        dueDate: '2024-12-15',
        description: 'Height safety and fall prevention measures'
      }
    ]
  });

  const [notifications, setNotifications] = useState(2);

  const getStatusColor = (status: SafePassStatus): string => {
    const colors = {
      Active: 'bg-green-500',
      Suspended: 'bg-yellow-500',
      Expired: 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const getModuleUrgencyStyle = (module: TrainingModule) => {
    if (module.completed) return 'border-green-100 hover:border-green-200';
    if (module.progress < 50) return 'border-red-100 hover:border-red-200';
    return 'border-yellow-100 hover:border-yellow-200';
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Network Background Pattern */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(209 213 219) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Header */}
      <header className="bg-white shadow-sm z-10 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold">ClancySafe</span>
            <div className="flex items-center">
              <span className="text-black text-2xl">A</span>
              <span className="text-red-600 text-2xl">I</span>
              <div className="ml-2 bg-red-600 text-white w-6 h-6 flex items-center justify-center text-sm rounded">
                C
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="relative">
              <Bell className="h-6 w-6 text-gray-600 cursor-pointer hover:text-gray-900" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </div>
            <Settings className="h-6 w-6 text-gray-600 cursor-pointer hover:text-gray-900" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 z-10 max-w-7xl mx-auto w-full">
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {userData.name.split(' ')[0]}
            </h1>
            <p className="text-sm text-gray-500">
              Last active: {new Date(userData.lastActive!).toLocaleDateString()}
            </p>
          </div>

          {/* SafePass Status Card */}
          <Card className="bg-white shadow-lg border-2 border-red-100">
            <CardHeader className="bg-red-600 text-white">
              <CardTitle className="text-2xl font-bold flex items-center justify-between">
                SafePass Status
                <Badge className={`${getStatusColor(userData.safePassStatus)} px-4 py-2`}>
                  {userData.safePassStatus}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="text-lg font-semibold">{userData.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-lg font-semibold">{userData.phoneNumber}</p>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 bg-gray-50 p-4 rounded-lg">
                  <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400">QR Code</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alerts Section */}
          {userData.additionalTraining && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {userData.additionalTraining}
              </AlertDescription>
            </Alert>
          )}

          {/* Training Modules Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">Training Modules</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userData.trainingModules.map((module) => (
                <Card 
                  key={module.id} 
                  className={`bg-white shadow-md border-2 transition-colors ${getModuleUrgencyStyle(module)}`}
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      {module.name}
                    </CardTitle>
                    {module.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Progress 
                      value={module.progress} 
                      className="w-full"
                      indicatorClassName={
                        module.completed ? 'bg-green-500' :
                        module.progress < 50 ? 'bg-red-500' : 'bg-yellow-500'
                      }
                    />
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-600">
                        {module.completed ? 'Completed' : `${module.progress}% Complete`}
                      </p>
                      <p className="text-sm text-gray-500">
                        Due: {new Date(module.dueDate!).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600">{module.description}</p>
                    <Button 
                      variant={module.completed ? "outline" : "default"}
                      className="w-full mt-2"
                    >
                      {module.completed ? 'Review Module' : 'Continue Training'}
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SafetyTrainingDashboard;