'use client';
import React, { useEffect } from 'react';

export function initializeSecretKey(setSecretKey: React.Dispatch<React.SetStateAction<string>>) {
    useEffect(() => {
        const fetchSecretKey = async () => {
            const res = await fetch('/api/secret');
            const data = await res.json();
            setSecretKey(data.secretKey);
        };
        fetchSecretKey();
    }, []);
}
