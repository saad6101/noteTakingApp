'use client';
import React from 'react';

export function initializeMediaRecorder(setRecording: React.Dispatch<React.SetStateAction<boolean>>, mediaRecorderRef: React.RefObject<MediaRecorder | null>, handleNoteSubmit: (noteData: { heading: string; type: string; content: any; duration?: number; }) => Promise<void>, noteHeading: string, setAudioChunks: React.Dispatch<React.SetStateAction<Blob[]>>) {
    const startRecording = () => {
        setRecording(true);
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                const mediaRecorder = new MediaRecorder(stream);
                mediaRecorderRef.current = mediaRecorder;
                mediaRecorder.start();

                const chunks: Blob[] = [];
                mediaRecorder.addEventListener('dataavailable', event => {
                    chunks.push(event.data);
                });

                mediaRecorder.addEventListener('stop', async () => {
                    const audioBlob = new Blob(chunks, { type: 'audio/mp3' });
                    const reader = new FileReader();
                    reader.readAsDataURL(audioBlob);
                    reader.onloadend = async () => {
                        const base64data = typeof reader.result === 'string' ? reader.result.split(',')[1] : '';
                        const audioDuration = audioBlob.size / (128 * 1024 / 8); // Approximate duration in seconds
                        await handleNoteSubmit({ heading: noteHeading, type: 'voice', content: base64data, duration: audioDuration });
                        setRecording(false);
                        setAudioChunks([]);
                    };
                });

                setAudioChunks(chunks);
            });
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
        }
    };
    return { startRecording, stopRecording };
}
