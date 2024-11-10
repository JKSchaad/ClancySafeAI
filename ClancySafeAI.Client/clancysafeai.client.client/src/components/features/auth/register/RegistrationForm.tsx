import { useState } from 'react';
import axios from 'axios';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post<RegistrationResponse>('/api/auth/register', formData);
      if (response.data.success) {
        setOtpReference(response.data.otpReference);
        setIsVerifying(true);
        setMessage('Please enter the OTP sent to your phone');
      }
    } catch (error) {
      setMessage('Registration failed. Please try again.');
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/verify', {
        reference: otpReference,
        otp
      });
      if (response.data.success) {
        setMessage('Registration completed successfully!');
        // Handle successful registration (e.g., redirect to dashboard)
      }
    } catch (error) {
      setMessage('Verification failed. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      {!isVerifying ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-2xl font-bold mb-6">Register New User</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Company Name</label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => setFormData({...formData, companyName: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Job Title</label>
            <input
              type="text"
              value={formData.jobTitle}
              onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Register
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerify} className="space-y-4">
          <h2 className="text-2xl font-bold mb-6">Verify OTP</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Enter OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Verify OTP
          </button>
        </form>
      )}

      {message && (
        <div className="mt-4 p-3 rounded bg-gray-100">
          {message}
        </div>
      )}
    </div>
  );
}; 