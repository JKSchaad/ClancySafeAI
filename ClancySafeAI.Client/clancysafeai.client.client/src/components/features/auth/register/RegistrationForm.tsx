import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../../ui/card';
import { Button } from '../../../ui/button';
import { Input } from '../../../ui/input';
import { Alert, AlertDescription } from '../../../ui/alert';
import api from '../../../../services/api';

interface RegistrationFormData {
    phoneNumber: string;
    fullName: string;
    email: string;
    companyName: string;
    jobTitle: string;
}

interface RegistrationResponse {
    success: boolean;
    message: string;
    otpReference: string;
}

export const RegistrationForm = () => {
    const [formData, setFormData] = useState<RegistrationFormData>({
        phoneNumber: '',
        fullName: '',
        email: '',
        companyName: '',
        jobTitle: ''
    });
    
    const [otpReference, setOtpReference] = useState<string>('');
    const [otp, setOtp] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.post<RegistrationResponse>('/api/auth/register', formData);
            if (response.data.success) {
                setOtpReference(response.data.otpReference);
                setIsVerifying(true);
                setMessage('Please enter the OTP sent to your phone');
            }
        } catch (error: any) {
            setMessage(error.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.post('/api/auth/verify', {
                reference: otpReference,
                otp
            });
            if (response.data.success) {
                setMessage('Registration completed successfully!');
                // Redirect to login after successful registration
                setTimeout(() => {
                    window.location.href = '/';
                }, 2000);
            }
        } catch (error: any) {
            setMessage(error.response?.data?.message || 'Verification failed. Please try again.');
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
                        {!isVerifying ? 'Create your account' : 'Verify your phone number'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {message && (
                        <Alert variant={message.includes('successfully') ? 'default' : 'destructive'} className="mb-4">
                            <AlertDescription>{message}</AlertDescription>
                        </Alert>
                    )}

                    {!isVerifying ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Input
                                    type="tel"
                                    placeholder="Phone Number"
                                    value={formData.phoneNumber}
                                    onChange={(e) => setFormData({...formData, phoneNumber: formatPhoneNumber(e.target.value)})}
                                    disabled={loading}
                                />
                            </div>
                            <div>
                                <Input
                                    type="text"
                                    placeholder="Full Name"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                    disabled={loading}
                                />
                            </div>
                            <div>
                                <Input
                                    type="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    disabled={loading}
                                />
                            </div>
                            <div>
                                <Input
                                    type="text"
                                    placeholder="Company Name"
                                    value={formData.companyName}
                                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                                    disabled={loading}
                                />
                            </div>
                            <div>
                                <Input
                                    type="text"
                                    placeholder="Job Title"
                                    value={formData.jobTitle}
                                    onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
                                    disabled={loading}
                                />
                            </div>
                            <Button 
                                type="submit" 
                                className="w-full" 
                                disabled={loading}
                            >
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Register
                            </Button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerify} className="space-y-4">
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
                                type="submit" 
                                className="w-full"
                                disabled={otp.length !== 6 || loading}
                            >
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Verify
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => {
                                    setIsVerifying(false);
                                    setOtp('');
                                    setMessage('');
                                }}
                                disabled={loading}
                            >
                                Back
                            </Button>
                        </form>
                    )}
                </CardContent>
                <CardFooter className="flex flex-col space-y-2 text-sm text-gray-500">
                    <div>
                        <Link to="/" className="text-blue-600 hover:text-blue-800">
                            Already have an account? Sign in
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