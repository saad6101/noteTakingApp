'use client';
import { getCookie } from '@/cookieHandler';
import CryptoJS from 'crypto-js';
import React from 'react';

export function submitNote(SECRET_KEY: string, setNoteHeading: React.Dispatch<React.SetStateAction<string>>, setNoteContent: React.Dispatch<React.SetStateAction<string>>) {
    return async (noteData: { heading: string; type: string; content: any; duration?: number; }) => {
        const encryptedAuthToken = getCookie('authTokenGHF');
        if (!encryptedAuthToken) {
            console.error('No auth token found');
            return;
        }
        const authToken = CryptoJS.AES.decrypt(encryptedAuthToken, SECRET_KEY).toString(CryptoJS.enc.Utf8);

        const response = await fetch('/api/notes', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(noteData),
        });

        if (response.ok) {
            console.log('Note submitted successfully');
            setNoteHeading('');
            setNoteContent('');
        } else {
            console.error('Failed to submit note');
        }
    };
}
