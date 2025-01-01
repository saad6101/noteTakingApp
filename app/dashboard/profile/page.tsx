// filepath: /c:/Users/saad6/Main/note_taking_non_profit/app/dashboard/profile/page.tsx
"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CryptoJS from 'crypto-js';
import Cookies from 'js-cookie';
import cookieHandler from '../../../cookieHandler';
import NotesList from '../../components/NotesList';
import { initializeSecretKey } from '@/initializeSecretKey';
import { loadingSpinner } from '@/app/components/loadingSpinner';
import { useUserAuth } from '@/app/components/initializeUserAuth';
import { retrieveNotes } from '../../components/retrieveNotes';

export default function Profile() {
    const { getCookie } = cookieHandler();
    const [SECRET_KEY, setSecretKey] = useState('');
    const router = useRouter();
    initializeSecretKey(setSecretKey);

    const [, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [bioRemark, setBioRemark] = useState('');

    interface Note {
        id: string;
        heading: string;
        content: string;
        type: string;
        date: string;
    }

    const [notes, setNotes] = useState<Note[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [activeSection, setActiveSection] = useState('notes'); // Changed from 'settings' to 'notes'
    const authToken = useUserAuth(SECRET_KEY, setLoading, router);

    useEffect(() => {
        const fetchUserData = async (token: string) => {
            try {
                const response = await fetch('/api/storage', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setUserData(data);
                    setName(data.name);
                    setPhoneNumber(data.phoneNumber);
                    setBioRemark(data.bioRemark);
                    fetchNotes(token); // Fetch notes without noteType
                } else {
                    router.push('/dashboard');
                    console.log('Redirecting to dashboard due to failed user data fetch');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                router.push('/dashboard');
            } finally {
                setLoading(false);
            }
        };

        if (authToken) {
            fetchUserData(authToken);
        }
    }, [authToken, router]);

    async function fetchNotes(token: string) {
        await retrieveNotes(setNotes, router, token);
    }

    const handleSaveSettings = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        const confirmUpdate = window.confirm('Are you sure you want to update your settings?');
        if (!confirmUpdate) return;

        const authToken = getCookie('authTokenGHF');

        const response = await fetch('/api/storage', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
            },
            body: JSON.stringify({ name, phoneNumber, bioRemark }),
        });

        if (response.ok) {
            const data = await response.json();
            setUserData(data);
            setIsEditing(false);
            console.log('Settings updated successfully:', data);
        } else {
            console.error('Failed to update settings');
            router.push('/dashboard');
        }
    };

    const handleLogout = () => {
        Cookies.remove('authTokenGHF');
        router.push('/login');
        console.log('Logged out successfully');
    };

    const handleDeleteNote = async (noteId: any) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this note?');
        if (!confirmDelete) return;

        const authToken = getCookie('authTokenGHF');

        try {
            console.log(`Deleting note with ID: ${noteId}`);
            const response = await fetch(`/api/notes?id=${noteId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                },
            });

            if (response.ok) {
                setNotes(notes.filter(note => note.id !== noteId));
                console.log('Note deleted successfully');
            } else {
                console.error('Failed to delete note:', response.statusText);
            }
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    };

    if (loading) {
        return (
            loadingSpinner()
        );
    }

    return (
        <div className="min-h-screen px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-center mt-16">
                <h1 className="text-2xl font-bold mb-4 fascinate-inline-regular">
                    Profile
                </h1>
                <div className="flex space-x-4 mb-8">
                    <button
                        onClick={() => setActiveSection('settings')}
                        className={`px-4 py-2 rounded-md ${activeSection === 'settings' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                        Settings
                    </button>
                    <button
                        onClick={() => setActiveSection('notes')}
                        className={`px-4 py-2 rounded-md ${activeSection === 'notes' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                        Notes
                    </button>
                </div>
                {activeSection === 'settings' ? (
                    isEditing ? (
                        <form onSubmit={handleSaveSettings} className="w-full max-w-md">
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full p-2 border rounded-md"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Phone Number</label>
                                <input
                                    type="text"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    className="w-full p-2 border rounded-md"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Bio Remark</label>
                                <input
                                    type="text"
                                    value={bioRemark}
                                    onChange={(e) => setBioRemark(e.target.value)}
                                    className="w-full p-2 border rounded-md"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-blue-500 text-white py-2 rounded-md"
                            >
                                Save Settings
                            </button>
                        </form>
                    ) : (
                        <div className="w-full max-w-md">
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Name</label>
                                <p className="w-full p-2 border rounded-md">{name}</p>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Phone Number</label>
                                <p className="w-full p-2 border rounded-md">{phoneNumber}</p>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Bio Remark</label>
                                <p className="w-full p-2 border rounded-md">{bioRemark}</p>
                            </div>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="w-full bg-blue-500 text-white py-2 rounded-md"
                            >
                                Edit Settings
                            </button>
                            <button
                                onClick={handleLogout}
                                className="w-full bg-red-500 text-white py-2 rounded-md mt-4"
                            >
                                Logout
                            </button>
                        </div>
                    )
                ) : (
                    <NotesList notes={notes} handleDeleteNote={handleDeleteNote} />
                )}
            </div>
        </div>
    );
}