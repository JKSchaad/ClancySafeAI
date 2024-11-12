import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TrainingTheater from './TrainingTheator';

// Mock training data type - you can expand this later
interface Training {
    id: number;
    name: string;
    progress: number;
    totalSlides: number;
    currentSlide: number;
}

export default function TrainingSection() {
    const { moduleId } = useParams();
    const navigate = useNavigate();
    const [training, setTraining] = useState<Training | null>(null);

    useEffect(() => {
        // Mock loading training data - replace with actual API call later
        setTraining({
            id: Number(moduleId),
            name: "Fire Safety Training",
            progress: 60,
            totalSlides: 20,
            currentSlide: 12
        });
    }, [moduleId]);

    const handleComplete = async () => {
        // Mock completion - replace with actual API call later
        console.log(`Training ${moduleId} completed`);
        navigate('/dashboard');
    };

    const handleQuestion = async (question: string) => {
        // Mock question submission - replace with actual API call later
        console.log(`Question submitted for training ${moduleId}:`, question);
    };

    const handleExit = () => {
        navigate('/dashboard');
    };

    if (!training) {
        return <div>Loading...</div>;
    }

    return (
        <TrainingTheater
            moduleId={training.id}
            moduleName={training.name}
            progress={training.progress}
            onExit={handleExit}
        />
    );
}