"use client";

// This is a client-side mock for demonstration. 
// In a real app, this would be a server-side service with Redis/DB storage.

type IdentifierType = 'phone' | 'email';

export const otpService = {
    sendOTP: async (identifier: string, type: IdentifierType = 'email') => {
        try {
            const response = await fetch('/api/otp/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identifier, type }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Failed to send OTP");
            return { success: true, message: data.message };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    },

    verifyOTP: async (identifier: string, code: string, type: IdentifierType = 'email') => {
        try {
            const response = await fetch('/api/otp/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identifier, code, type }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Invalid OTP code");

            // Keep the verification status in local storage for the final signup step UI
            localStorage.setItem(`verified_${type}_${identifier}`, "true");
            return { success: true };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    },

    isVerified: (identifier: string, type: IdentifierType): boolean => {
        return localStorage.getItem(`verified_${type}_${identifier}`) === "true";
    },

    clearVerifications: (email: string, phone: string) => {
        localStorage.removeItem(`verified_email_${email}`);
        localStorage.removeItem(`verified_phone_${phone}`);
    }
};
