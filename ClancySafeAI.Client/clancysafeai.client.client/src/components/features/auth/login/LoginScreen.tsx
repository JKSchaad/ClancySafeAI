import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface LoginScreenProps {
    onLoginSuccess?: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState<'phone' | 'otp'>('phone');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSendOTP = async () => {
        try {
            setLoading(true);
            setError(null);
            // TODO: Integrate with actual API
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
            setStep('otp');
        } catch (err) {
            setError('Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        try {
            setLoading(true);
            setError(null);
            // TODO: Integrate with actual API
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
            // Handle successful login
            onLoginSuccess?.();
        } catch (err) {
            setError('Invalid OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const formatPhoneNumber = (value: string) => {
        return value.replace(/\D/g, '').slice(0, 10);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">ClancySafeAI</CardTitle>
                    <CardDescription className="text-center">
                        {step === 'phone' ?
                            'Enter your phone number to login' :
                            'Enter the verification code sent to your phone'
                        }
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {error && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {step === 'phone' ? (
                        <div className="space-y-4">
                            <div className="relative">
                                <Input
                                    type="tel"
                                    placeholder="(555) 555-5555"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
                                    className="pl-4"
                                    disabled={loading}
                                />
                            </div>
                            <Button
                                className="w-full"
                                onClick={handleSendOTP}
                                disabled={phoneNumber.length !== 10 || loading}
                            >
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Send Verification Code
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <Input
                                type="text"
                                placeholder="Enter verification code"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                className="text-center text-lg tracking-widest"
                                maxLength={6}
                                disabled={loading}
                            />
                            <Button
                                className="w-full"
                                onClick={handleVerifyOTP}
                                disabled={otp.length !== 6 || loading}
                            >
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Verify
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => {
                                    setStep('phone');
                                    setOtp('');
                                    setError(null);
                                }}
                                disabled={loading}
                            >
                                Back
                            </Button>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="justify-center text-sm text-gray-500">
                    Protected by ClancySafeAI
                </CardFooter>
            </Card>
        </div>
    );
};

export default LoginScreen;