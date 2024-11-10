// src/store/slices/authSlice.ts

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AuthService } from '../../services/auth/authService';

interface AuthState {
    isAuthenticated: boolean;
    user: any | null;
    token: string | null;
    loading: boolean;
    error: string | null;
    otpSessionId: string | null;
}

const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
    token: localStorage.getItem('token'),
    loading: false,
    error: null,
    otpSessionId: null,
};

export const sendOTP = createAsyncThunk(
    'auth/sendOTP',
    async (phoneNumber: string) => {
        const response = await AuthService.sendOTP(phoneNumber);
        return response;
    }
);

export const verifyOTP = createAsyncThunk(
    'auth/verifyOTP',
    async ({ phoneNumber, otp, sessionId }: { phoneNumber: string; otp: string; sessionId: string }) => {
        const response = await AuthService.verifyOTP(phoneNumber, otp, sessionId);
        return response;
    }
);

export const logout = createAsyncThunk(
    'auth/logout',
    async () => {
        await AuthService.logout();
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Send OTP
            .addCase(sendOTP.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(sendOTP.fulfilled, (state, action) => {
                state.loading = false;
                state.otpSessionId = action.payload.sessionId;
            })
            .addCase(sendOTP.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to send OTP';
            })
            // Verify OTP
            .addCase(verifyOTP.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyOTP.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.token = action.payload.token;
                localStorage.setItem('token', action.payload.token);
            })
            .addCase(verifyOTP.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Invalid OTP';
            })
            // Logout
            .addCase(logout.fulfilled, (state) => {
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
                state.otpSessionId = null;
                localStorage.removeItem('token');
            });
    },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;