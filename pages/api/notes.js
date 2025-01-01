import fs from 'fs';
import path from 'path';
import CryptoJS from 'crypto-js';
import { parse } from 'cookie';
import { readFromFile } from './storage';

const SECRET_KEY = process.env.SECRET_KEY;
const notesDirectory = path.join(process.cwd(), 'notes');
const storageFilePath = path.join(process.cwd(), 'storage.json');

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb', // Adjust as needed
        },
    },
};

function base64UrlEncode(str) {
    return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(str) {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    while (str.length % 4) {
        str += '=';
    }
    return str;
}

export default async function handler(req, res) {
    try {
        const cookies = parse(req.headers.cookie || '');
        const encryptedAuthToken = cookies['authTokenGHF'];
        if (!encryptedAuthToken) {
            console.log('No auth token found in cookies');
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const authToken = CryptoJS.AES.decrypt(encryptedAuthToken, SECRET_KEY).toString(CryptoJS.enc.Utf8);
        if (!authToken) {
            console.log('Invalid auth token');
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const users = readFromFile(storageFilePath);
        const user = Object.values(users).find(user => user.authToken === authToken);
        if (!user) {
            console.log('No user found with the provided auth token');
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const decryptedFolderName = CryptoJS.AES.decrypt(user.folderName, SECRET_KEY).toString(CryptoJS.enc.Utf8);
        const userDirectory = path.join(notesDirectory, decryptedFolderName);

        if (req.method === 'POST') {
            const { heading, type, content, duration } = req.body;
            const date = new Date().getTime();
            let noteId = date;
            noteId = CryptoJS.AES.encrypt(authToken, noteId.toString()).toString();
            noteId = base64UrlEncode(noteId);

            const noteFilePath = path.join(userDirectory, `${noteId}.${type === 'voice' ? 'mp3' : 'json'}`);
            const metadataFilePath = path.join(userDirectory, `${noteId}.json`);

            if (!fs.existsSync(userDirectory)) {
                fs.mkdirSync(userDirectory, { recursive: true });
            }

            if (type === 'voice') {
                const audioBuffer = Buffer.from(content, 'base64');
                fs.writeFileSync(noteFilePath, audioBuffer);

                const metadata = {
                    heading: CryptoJS.AES.encrypt(heading, SECRET_KEY).toString(),
                    type,
                    date: date,
                    duration: duration,
                    fileName: `${noteId}.mp3`
                };
                fs.writeFileSync(metadataFilePath, JSON.stringify(metadata));
            } else {
                const encryptedContent = CryptoJS.AES.encrypt(content, SECRET_KEY).toString();
                const noteData = {
                    heading: CryptoJS.AES.encrypt(heading, SECRET_KEY).toString(),
                    content: encryptedContent,
                    type,
                    date: date,
                };
                fs.writeFileSync(noteFilePath, JSON.stringify(noteData));
            }

            console.log(`Note saved successfully: ${noteFilePath}`);
            return res.status(200).json({ message: 'Note saved successfully' });
        } else if (req.method === 'GET') {
            if (!fs.existsSync(userDirectory)) {
                console.log('User directory does not exist');
                return res.status(200).json([]);
            }
            
            console.log('Fetching notes... Checkpoint 1 ');

            const noteFiles = fs.readdirSync(userDirectory);
            const notes = noteFiles.filter(file => file.endsWith('.json')).map(file => {
                const filePath = path.join(userDirectory, file);
                const noteData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
                if (noteData.type === 'voice') {
                    const audioFilePath = path.join(userDirectory, noteData.fileName);
                    noteData.content = fs.readFileSync(audioFilePath, 'base64');
                } else {
                    noteData.content = CryptoJS.AES.decrypt(noteData.content, SECRET_KEY).toString(CryptoJS.enc.Utf8);
                }
                const dateA = new Date(noteData.date).toISOString();
                console.log('Fetching notes... Checkpoint 2 ');
                return {
                    id: path.basename(file, '.json'),
                    heading: CryptoJS.AES.decrypt(noteData.heading, SECRET_KEY).toString(CryptoJS.enc.Utf8),
                    content: noteData.content,
                    type: noteData.type,
                    date: dateA,
                    duration: noteData.duration || 0
                };
            });

            console.log('Notes fetched successfully');
            return res.status(200).json(notes);
        } else if (req.method === 'DELETE') {
            const { id } = req.query;
            const decodedId = id;
            console.log(`Received delete request for note ID: ${id}`);
            const noteFilePath = path.join(userDirectory, `${decodedId}.json`);
            const audioFilePath = path.join(userDirectory, `${decodedId}.mp3`);
            console.log(`Note file path: ${noteFilePath}`);
            console.log(`Audio file path: ${audioFilePath}`);
            if (fs.existsSync(noteFilePath)) {
                fs.unlinkSync(noteFilePath);
                if (fs.existsSync(audioFilePath)) {
                    fs.unlinkSync(audioFilePath);
                }
                console.log(`Note deleted successfully: ${noteFilePath}`);
                return res.status(200).json({ message: 'Note deleted successfully' });
            } else {
                console.log('Note not found');
                return res.status(404).json({ message: 'Note not found' });
            }
        } else {
            console.log('Method not allowed');
            return res.status(405).json({ message: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Error handling request:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}