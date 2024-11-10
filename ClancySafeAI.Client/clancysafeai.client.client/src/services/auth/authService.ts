// src/services/auth/authService.ts

import axios from 'axios';

const API_BASE_URL = '/api/auth'; // This will be proxied through Vite

interface AuthResponse {
    token: string;
    refreshToken: string;
}

interface OTPResponse {
    sessionId: string;
    expiresIn: number;
}

export class AuthService {
    static async sendOTP(phoneNumber: string): Promise<OTPResponse> {
        const response = await axios.post(`${API_BASE_URL}/send-otp`, { phoneNumber });
        return response.data;
    }

    static async verifyOTP(phoneNumber: string, otp: string, sessionId: string): Promise<AuthResponse> {
        const response = await axios.post(`${API_BASE_URL}/verify-otp`, {
            phoneNumber,
            otp,
            sessionId
        });
        return response.data;
    }

    static async refreshToken(refreshToken: string): Promise<AuthResponse> {
        const response = await axios.post(`${API_BASE_URL}/refresh-token`, { refreshToken });
        return response.data;
    }

    static async logout(): Promise<void> {
        await axios.post(`${API_BASE_URL}/logout`);
    }
}