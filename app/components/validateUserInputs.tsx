"use client";
import { SetStateAction, useEffect } from 'react';

export function useValidateUserInputs(email: string, setEmailError: (value: SetStateAction<string>) => void, password: string, setPasswordError: (value: SetStateAction<string>) => void) {
    useEffect(() => {
        if (email && !validateEmail(email)) {
            setEmailError('Invalid email format');
        } else {
            setEmailError('');
        }
    }, [email, setEmailError]);

    useEffect(() => {
        if (password && !validatePassword(password)) {
            setPasswordError('Password must be at least 8 characters long and contain both letters and numbers');
        } else {
            setPasswordError('');
        }
    }, [password, setPasswordError]);

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password: string) => {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        return passwordRegex.test(password);
    };
}