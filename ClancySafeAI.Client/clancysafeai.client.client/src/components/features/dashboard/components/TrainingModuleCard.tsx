import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TrainingModule {
    id: number;
    name: string;
    completed: boolean;
    progress: number;
    dueDate?: string;
    description?: string;
}

interface TrainingModuleCardProps {
    module: TrainingModule;
}

const TrainingModuleCard: React.FC<TrainingModuleCardProps> = ({ module }) => {
    const navigate = useNavigate();

    const getModuleUrgencyStyle = () => {
        if (module.completed) return 'border-green-100 hover:border-green-200';
        if (module.progress < 50) return 'border-red-100 hover:border-red-200';
        return 'border-yellow-100 hover:border-yellow-200';
    };

    const handleStartTraining = () => {
        navigate(`/training/${module.id}`);
    };

    return (
        <Card
            className={`bg-white shadow-md border-2 transition-colors ${getModuleUrgencyStyle()}`}
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
                    onClick={handleStartTraining}
                >
                    {module.completed ? 'Review Module' : 'Continue Training'}
                    <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
            </CardContent>
        </Card>
    );
};

export default TrainingModuleCard;