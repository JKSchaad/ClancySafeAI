import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Bell, Settings, CheckCircle2, XCircle, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useDashboardData } from '@/services/dashboard/dashboardHooks';
import { TrainingModule } from '@/services/dashboard/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const DashboardScreen: React.FC = () => {
  console.log('DashboardScreen rendering');

  const [notifications] = useState(2);
  const { data: userData, loading, error } = useDashboardData();

  console.log('Dashboard state:', { userData, loading, error });

  useEffect(() => {
    console.log('DashboardScreen mounted');
  }, []);

  const getModuleUrgencyStyle = (module: TrainingModule) => {
    if (module.completed) return 'border-green-100 hover:border-green-200';
    if (module.progress < 50) return 'border-red-100 hover:border-red-200';
    return 'border-yellow-100 hover:border-yellow-200';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-xl text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-xl text-red-600">Error loading dashboard data</div>
      </div>
    );
  }

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
            {userData.lastActive && (
              <p className="text-sm text-gray-500">
                Last active: {new Date(userData.lastActive).toLocaleDateString()}
              </p>
            )}
          </div>

          {/* SafePass Card */}
          <Card className="bg-white shadow-lg border-2 border-red-100">
            <CardHeader className="bg-red-600 text-white">
              <CardTitle className="text-2xl font-bold flex items-center justify-between">
                SafePass Status
                <Badge 
                  className={`${
                    userData.safePassStatus === 'Active' ? 'bg-green-500' : 
                    userData.safePassStatus === 'Suspended' ? 'bg-yellow-500' : 
                    'bg-red-500'
                  } px-4 py-2`}
                >
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
              {userData.trainingModules.map((module: TrainingModule) => (
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
                      className={cn(
                        "w-full",
                        module.completed ? "[&>div]:bg-green-500" :
                        module.progress < 50 ? "[&>div]:bg-red-500" : "[&>div]:bg-yellow-500"
                      )}
                    />
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-600">
                        {module.completed ? 'Completed' : `${module.progress}% Complete`}
                      </p>
                      {module.dueDate && (
                        <p className="text-sm text-gray-500">
                          Due: {new Date(module.dueDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    {module.description && (
                      <p className="text-sm text-gray-600">{module.description}</p>
                    )}
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

export default DashboardScreen; 