import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../../ui/card';
import { Button } from '../../../ui/button';
import { Input } from '../../../ui/input';
import { Alert, AlertDescription } from '../../../ui/alert';
import api from '../../../../services/api';

interface LoginScreenProps {
    onLoginSuccess?: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [otpReference, setOtpReference] = useState('');
    const [step, setStep] = useState<'phone' | 'otp'>('phone');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSendOTP = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await api.post('/api/auth/login', {
                phoneNumber
            });

            if (response.data.success) {
                setOtpReference(response.data.otpReference);
                setStep('otp');
            } else {
                setError('Failed to send OTP. Please try again.');
            }
        } catch (err: any) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (otp: string) => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await api.post('/api/auth/login/verify', {
                reference: otpReference,
                otp
            });

            if (response.data.success) {
                localStorage.setItem('isAuthenticated', 'true');
                
                onLoginSuccess?.();
                
                navigate('/dashboard');
            } else {
                setError('Invalid OTP. Please try again.');
            }
        } catch (err: any) {
            console.error('Verification error:', err);
            setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
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
                                onClick={() => handleVerifyOTP(otp)}
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
                <CardFooter className="flex flex-col space-y-2 text-sm text-gray-500">
                    <div>
                        <Link to="/register" className="text-blue-600 hover:text-blue-800">
                            Create new account
                        </Link>
                    </div>
                    <div>
                        Protected by ClancySafeAI
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

export default LoginScreen;