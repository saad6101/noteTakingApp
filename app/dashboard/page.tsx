'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import CryptoJS from 'crypto-js';
import { CgProfile } from 'react-icons/cg';
import { getCookie } from '../../cookieHandler';
import {initializeSecretKey} from '@/initializeSecretKey';
import { initializeMediaRecorder } from '../components/initializeMediaRecorder';
import { submitNote } from '../components/submitNote';
import { useUserAuth } from '../components/initializeUserAuth';

export default function Main() {
    const [SECRET_KEY, setSecretKey] = useState('');
    const router = useRouter();
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const [, setAudioChunks] = useState<Blob[]>([]);
    const [fontSize, setFontSize] = useState('16px');
    const [fontFamily, setFontFamily] = useState('Arial');
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);

    initializeSecretKey(setSecretKey);

    const [loading, setLoading] = useState(true);
    const [noteHeading, setNoteHeading] = useState('');
    const [noteContent, setNoteContent] = useState('');
    const [noteType, setNoteType] = useState('Text');
    const [, setPassword] = useState('');
    const [recording, setRecording] = useState(false);
    const authToken = useUserAuth(SECRET_KEY, setLoading, router);

    const handleNoteChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setNoteContent(e.target.value);
    };

    const handleNoteSubmit = submitNote(SECRET_KEY, setNoteHeading, setNoteContent);

    const handleNoteTypeChange = (type: React.SetStateAction<string>) => {
        setNoteType(type);
    };

    const { startRecording, stopRecording } = initializeMediaRecorder(setRecording, mediaRecorderRef, handleNoteSubmit, noteHeading, setAudioChunks);

    const applyFormatting = () => {
        let style = '';
        if (isBold) style += 'font-bold ';
        if (isItalic) style += 'italic ';
        if (isUnderline) style += 'underline ';
        return style;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen px-4 sm:px-6 lg:px-8">
            {/* Top Menu Bar */}
            <div className="flex justify-center mt-4 space-x-4">
                {['Text', 'Voice'].map((type) => (
                    <button
                        key={type}
                        className={`px-4 py-2 rounded-md transition-transform transform hover:scale-110 text-decentColor ${
                            noteType === type ? 'bg-blue-500 text-white' : 'bg-customTextColor'
                        }`}
                        onClick={() => handleNoteTypeChange(type)}
                    >
                        {type}
                    </button>
                ))}
            </div>
            {/* Profile Icon */}
            <div className="flex justify-start mt-1">
                <button onClick={() => router.push('/dashboard/profile')}>
                    <CgProfile className="w-10 h-10 rounded-full" />
                </button>
            </div>
            {/* Note-Taking Section */}
            <div className="flex flex-col items-center justify-center mt-16">
                <h1 className="text-3xl font-bold mb-4 fascinate-inline-regular">
                    Welcome to your Dashboard                <form onSubmit={(e) => { e.preventDefault(); handleNoteSubmit({ heading: noteHeading, type: noteType.toLowerCase(), content: noteContent }); }} className="w-full max-w-md">
                    <input
                        type="text"
                        value={noteHeading}
                        onChange={(e) => setNoteHeading(e.target.value)}
                        className="w-full bg-customColor2 p-2 mb-4 border rounded-md font-mono text-xl"
                        placeholder="Note Heading"
                    />
                    {noteType === 'Voice' ? (
                        <div>
                            <button
                                type="button"
                                onClick={startRecording}
                                className="w-full bg-blue-500 text-white py-2 rounded-md font-mono"
                                disabled={recording}
                            >
                                {recording ? 'Recording...' : 'Start Recording'}
                            </button>
                            {recording && (
                                <button
                                    type="button"
                                    onClick={stopRecording}
                                    className="w-full bg-red-500 text-white py-2 rounded-md mt-2 font-mono"
                                >
                                    Stop Recording
                                </button>
                            )}
                        </div>
                    ) : (
                        <textarea
                            value={noteContent}
                            onChange={handleNoteChange}
                            className={`w-full h-40 p-2 border bg-customBackgroundColor rounded-md ${applyFormatting()}`}
                            style={{ fontSize, fontFamily }}
                            placeholder={`Write your ${noteType.toLowerCase()} notes here...`}
                        ></textarea>
                    )}
                    {noteType !== 'Voice' && (
                        <button
                            type="submit"
                            className="mt-2 w-full bg-blue-500 text-white py-2 rounded-md text-xl font-mono"
                        >
                            Save Note
                        </button>
                    )}
                </form>
                </h1>
            </div>
        </div>
    );
}