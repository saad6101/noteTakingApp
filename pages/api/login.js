import path from 'path';
import CryptoJS from 'crypto-js';
import cookie from 'cookie';
import {readFromFile} from './storage';
const filePath = path.join(process.cwd(), 'storage.json');
const SECRET_KEY = process.env.SECRET_KEY;

export default async function handler(req, res) {
    try {
        if (req.method === 'POST') {
            const { email, password } = req.body;
            const users = await readFromFile(filePath);
            const user = users[email];

            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const decryptedPassword = CryptoJS.AES.decrypt(user.password, SECRET_KEY).toString(CryptoJS.enc.Utf8);

            if (decryptedPassword === password) {
                if (user.verified) {
                    let authToken = user.authToken;
                    return res.status(200).json({ authToken, name: user.name, email: user.email });
                } else {
                    return res.status(401).json({ message: 'Please verify your email before logging in.' });
                }
            } else {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
        } else {
            res.status(405).json({ message: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Error handling request:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}