"use client";
import { setCookie, getCookie } from '@/cookieHandler';
import CryptoJS from 'crypto-js';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { SetStateAction } from 'react';

export async function handleAuthRequest(isLogin: boolean, email: string, password: string, SECRET_KEY: string, router: AppRouterInstance | string[], setError: { (value: SetStateAction<string>): void; (arg0: string): void; }, name: string, phoneNumber: string, bioRemark: string) {
    if (isLogin) {
        try {
            const loginResponse = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (loginResponse.ok) {
                const responseData = await loginResponse.json();
                const { authToken } = responseData;
                console.log('User logged in:', authToken);
                // Encrypt the auth token
                const encryptedAuthToken = CryptoJS.AES.encrypt(authToken, SECRET_KEY).toString();
                console.log('Encrypted Auth Token:', encryptedAuthToken);

                // Store the encrypted auth token in a session cookie using API
                await setCookie('authTokenGHF', encryptedAuthToken);
                const cookieData = getCookie('authTokenGHF');
                if (cookieData) {
                    console.log('Cookie set:', cookieData);
                } else {
                    console.error('Failed to retrieve cookie');
                }

                setTimeout(() => {
                    router.push('/dashboard');
                }, 200);
            } else {
                const { message } = await loginResponse.json();
                setError(message);
            }
        } catch (error) {
            console.error('Error during login:', error);
            setError('An error occurred during login.');
        }
    } else {
        try {
            const registerResponse = await fetch('/api/storage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password, phoneNumber, bioRemark, verified: false }),
            });

            if (registerResponse.ok) {
                setError('User registered successfully. Please check your email to verify your account.');
            } else {
                setError('Email already exists');
            }
        } catch (error) {
            console.error('Error during registration:', error);
            setError('An error occurred during registration.');
        }
    }
}
