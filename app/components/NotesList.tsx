import React, { useState, useRef, useEffect } from 'react';
import { MdDelete, MdPlayArrow, MdPause, MdVolumeUp } from 'react-icons/md';

interface Note {
    id: string;
    heading: string;
    content: string;
    type: string;
    date: string;
    duration?: number;
}

interface NotesListProps {
    notes: Note[];
    handleDeleteNote: (noteId: string) => void;
}

const NotesList: React.FC<NotesListProps> = ({ notes, handleDeleteNote }) => {
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);

    const getNoteSize = (content: string) => {
        if (content.length < 50) return 'small';
        if (content.length < 200) return 'medium';
        return 'large';
    };

    const togglePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
            return () => {
                audioRef.current?.removeEventListener('timeupdate', handleTimeUpdate);
            };
        }
    }, [selectedNote]);

    return (
        <div className="w-full max-w-md mt-8">
            <h2 className="text-xl font-bold mb-4 text-customTextColor">Saved Notes</h2>
            <div className="grid grid-cols-3 gap-4">
                {notes.length > 0 ? (
                    notes.map(note => {
                        const size = getNoteSize(note.content);
                        return (
                            <div key={note.id} 
                                className="relative group cursor-pointer"
                                onClick={() => setSelectedNote(note)}
                            >
                                <div className={`flex flex-col items-center p-4 rounded-md bg-customBackgroundColor shadow-md hover:shadow-lg transition-all ${size}`}>
                                    <h3 className="text-customTextColor font-bold">{note.heading}</h3>
                                    <p className="text-xs text-customTextColor mt-2 font-['Space_Mono']">
                                        {new Date(note.date).toLocaleDateString()}
                                    </p>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteNote(note.id);
                                        }}
                                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <MdDelete className="text-red-500 hover:text-red-700" />
                                    </button>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p className="text-customTextColor col-span-3">No notes found.</p>
                )}
            </div>

            {/* Modal */}
            {selectedNote && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-customBackgroundColor rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                        <h3 className="text-customTextColor font-bold mb-4">{selectedNote.heading}</h3>
                        {selectedNote.type === 'voice' ? (
                            <div className="space-y-4">
                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={togglePlayPause}
                                        className="bg-customTextColor text-customBackgroundColor p-2 rounded"
                                    >
                                        {isPlaying ? <MdPause size={24} /> : <MdPlayArrow size={24} />}
                                    </button>
                                    <audio ref={audioRef} className="w-full">
                                        <source src={`data:audio/mp3;base64,${selectedNote.content}`} type="audio/mp3" />
                                    </audio>
                                </div>
                                <div className="flex justify-between text-customTextColor">
                                    <span>{formatTime(currentTime)}</span>
                                    <span>{formatTime(selectedNote.duration || 0)}</span>
                                </div>
                            </div>
                        ) : (
                            <p className="text-customTextColor">{selectedNote.content}</p>
                        )}
                        <div className="mt-4 flex justify-between items-center">
                            <p className="text-sm text-customTextColor font-['Space_Mono']">
                                {new Date(selectedNote.date).toLocaleString()}
                            </p>
                            <button
                                onClick={() => setSelectedNote(null)}
                                className="text-customTextColor hover:opacity-75"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotesList;