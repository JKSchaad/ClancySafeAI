import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Bell, Settings, PlaySquare, PauseCircle, RotateCcw, LogOut, MessageCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TrainingTheaterProps {
    moduleId: number;
    moduleName: string;
    progress: number;
    onExit: () => void;
}

const TrainingTheater: React.FC<TrainingTheaterProps> = ({
    moduleName,
    progress: initialProgress,
    onExit
}) => {
    const [notifications] = useState(2);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress] = useState(initialProgress);

    const totalSlides = 20; // Mock value for now
    const currentSlide = Math.floor(progress / 100 * totalSlides);

    // Mock transcript data
    const transcript = [
        { text: "Welcome to the Fire Safety Training module. ", isCurrent: false },
        { text: "Today we'll be covering essential fire prevention techniques and emergency response procedures. ", isCurrent: true },
        { text: "Let's start by understanding the basic types of fires and their classifications. ", isCurrent: false }
    ];

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
            <main className="flex-1 overflow-hidden p-6 z-10">
                <div className="max-w-6xl mx-auto space-y-6">
                    {/* Module Title */}
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold text-gray-900">{moduleName}</h1>
                        <Button variant="outline" className="text-gray-600 hover:text-gray-900">
                            <MessageCircle className="h-5 w-5 mr-2" />
                            Ask a Question
                        </Button>
                    </div>

                    {/* Theater Screen */}
                    <Card className="bg-white shadow-xl border-2 border-gray-200">
                        <CardContent className="p-0">
                            {/* Presentation Window */}
                            <div className="relative bg-gray-900 aspect-video w-full flex items-center justify-center">
                                <div className="text-white text-lg">Presentation Content</div>
                            </div>

                            {/* Controls Bar */}
                            <div className="p-4 bg-gray-800">
                                {/* Progress Bar */}
                                <div className="mb-4">
                                    <Progress value={progress} className="w-full h-2" />
                                </div>

                                {/* Control Buttons */}
                                <div className="flex items-center justify-between px-4">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-white hover:bg-gray-700"
                                    >
                                        <RotateCcw className="h-6 w-6" />
                                    </Button>
                                    <div className="flex items-center space-x-2 text-white">
                                        <span className="text-sm">{`Slide ${currentSlide} of ${totalSlides}`}</span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-white hover:bg-gray-700"
                                        onClick={() => setIsPlaying(!isPlaying)}
                                    >
                                        {isPlaying ? (
                                            <PauseCircle className="h-8 w-8" />
                                        ) : (
                                            <PlaySquare className="h-8 w-8" />
                                        )}
                                    </Button>
                                    <div className="flex items-center space-x-2 text-white">
                                        <span className="text-sm">{Math.round(progress)}% Complete</span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-white hover:bg-gray-700"
                                        onClick={onExit}
                                    >
                                        <LogOut className="h-6 w-6" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Transcript Box */}
                    <Card className="bg-white shadow-lg">
                        <CardContent className="p-4">
                            <div className="flex justify-between items-center mb-2">
                                <h2 className="text-lg font-semibold text-gray-900">Transcript</h2>
                                <span className="text-sm text-gray-500">Auto-scrolling</span>
                            </div>
                            <ScrollArea className="h-40 rounded border border-gray-200 bg-gray-50">
                                <div className="p-4 text-gray-600 space-y-2">
                                    {transcript.map((segment, index) => (
                                        <span
                                            key={index}
                                            className={segment.isCurrent ? "bg-yellow-100 text-gray-900" : ""}
                                        >
                                            {segment.text}
                                        </span>
                                    ))}
                                </div>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
};

export default TrainingTheater;