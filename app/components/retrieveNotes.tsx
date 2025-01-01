// filepath: /c:/Users/saad6/Main/note_taking_non_profit/app/components/retrieveNotes.tsx
"use client";
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import React from 'react';

interface Note {
    id: string;
    heading: string;
    content: string;
    type: string;
    date: string;
}

export async function retrieveNotes(setNotes: React.Dispatch<React.SetStateAction<Note[]>>, router: AppRouterInstance | string[], token: string) {
    try {
        console.log(token);
        const response = await fetch(`/api/notes`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        if (response.ok) {
            const data = await response.json();
            setNotes(data);
        } else {
            console.error('Failed to fetch notes:', response.statusText);
            router.push('/dashboard');
        }
    } catch (error) {
        console.error('Error fetching notes:', error);
        router.push('/dashboard');
    }
}