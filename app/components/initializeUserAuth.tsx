// filepath: /c:/Users/saad6/Main/note_taking_non_profit/app/components/useUserAuth.tsx
"use client"
import { getCookie } from '@/cookieHandler';
import CryptoJS from 'crypto-js';
import React, { useEffect, useState } from 'react';
import { NextRouter } from 'next/router';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export function useUserAuth(SECRET_KEY: string, setLoading: React.Dispatch<React.SetStateAction<boolean>>, router: AppRouterInstance | NextRouter) {
    const [authToken, setAuthToken] = useState<string>('');

    useEffect(() => {
        const fetchPassword = async () => {
            try {
                const encryptedAuthToken = getCookie('authTokenGHF');
                if (!encryptedAuthToken) {
                    throw new Error('No auth token found');
                }
                const authToken = CryptoJS.AES.decrypt(encryptedAuthToken, SECRET_KEY).toString(CryptoJS.enc.Utf8);
                setAuthToken(authToken);
                const response = await fetch('/api/storage', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    const encryptedPassword = data.password;
                    if (!authToken || !encryptedPassword) {
                        throw new Error('Invalid auth token or password');
                    }
                    setLoading(false);
                } else {
                    throw new Error('Failed to fetch user data');
                }
            } catch (error) {
                console.error('Error during authentication:', error);
                router.push('/login');
            }
        };

        if (SECRET_KEY) {
            fetchPassword();
        }
    }, [SECRET_KEY, setLoading, router]);

    return authToken;
}