import fs from 'fs';
import path from 'path';
import CryptoJS from 'crypto-js';
import { v4 as uuidv4 } from 'uuid';
import { parse } from 'cookie';

const filePath = path.join(process.cwd(), 'storage.json');
const SECRET_KEY = process.env.SECRET_KEY;

export default async function handler(req, res) {
    try {
        if (req.method === 'POST') {
            const { name, email, password, phoneNumber, bioRemark} = req.body;
            const users = readFromFile(filePath);
            if (users[email]) {
                res.status(400).json({ message: 'Email already exists' });
            } else {
                const encryptedPassword = CryptoJS.AES.encrypt(password, SECRET_KEY).toString();
                const encryptedName = CryptoJS.AES.encrypt(name, SECRET_KEY).toString();
                const encryptedPhoneNumber = CryptoJS.AES.encrypt(phoneNumber, SECRET_KEY).toString();
                const authToken = uuidv4();
                const encryptedFolderName = CryptoJS.AES.encrypt(uuidv4(), SECRET_KEY).toString();
                users[email] = { name: encryptedName, password: encryptedPassword, phoneNumber: encryptedPhoneNumber, bioRemark, verified: true, authToken, folderName: encryptedFolderName };
                saveToFile(users);
                res.status(200).json({ message: 'User registered successfully.' });
            }
        } else if (req.method === 'GET') {
            const cookies = parse(req.headers.cookie || '');
            const encryptedAuthToken = cookies['authTokenGHF'];
            if (!encryptedAuthToken) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            const authToken = CryptoJS.AES.decrypt(encryptedAuthToken, SECRET_KEY).toString(CryptoJS.enc.Utf8);
            if (!authToken) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            const users = readFromFile(filePath);
            const user = Object.values(users).find(user => user.authToken === authToken);
            if (!user) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            const decryptedName = CryptoJS.AES.decrypt(user.name, SECRET_KEY).toString(CryptoJS.enc.Utf8);
            const decryptedPhoneNumber = CryptoJS.AES.decrypt(user.phoneNumber, SECRET_KEY).toString(CryptoJS.enc.Utf8);
            res.status(200).json({ name: decryptedName, email: user.email, phoneNumber: decryptedPhoneNumber, bioRemark: user.bioRemark,folderName: user.folderName, password: user.password });
        
        } else if (req.method === 'PUT') {
            const cookies = parse(req.headers.cookie || '');
            const encryptedAuthToken = cookies['authTokenGHF'];
            if (!encryptedAuthToken) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            const authToken = CryptoJS.AES.decrypt(encryptedAuthToken, SECRET_KEY).toString(CryptoJS.enc.Utf8);
            if (!authToken) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            const { name, phoneNumber, bioRemark } = req.body;
            const users = readFromFile(filePath);
            const user = Object.values(users).find(user => user.authToken === authToken);
            if (!user) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            user.name = CryptoJS.AES.encrypt(name, SECRET_KEY).toString();
            user.phoneNumber = CryptoJS.AES.encrypt(phoneNumber, SECRET_KEY).toString();
            user.bioRemark = bioRemark;
            saveToFile(users);

            const decryptedName = CryptoJS.AES.decrypt(user.name, SECRET_KEY).toString(CryptoJS.enc.Utf8);
            const decryptedPhoneNumber = CryptoJS.AES.decrypt(user.phoneNumber, SECRET_KEY).toString(CryptoJS.enc.Utf8);
            res.status(200).json({ name: decryptedName, email: user.email, phoneNumber: decryptedPhoneNumber, bioRemark: user.bioRemark });
        } else {
            res.status(405).json({ message: 'Method not allowed' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

function saveToFile(data) {
    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, jsonData);
}

export function readFromFile(filePath) {
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf-8');
        if (data.trim() === '') {
            return {};
        }
        return JSON.parse(data);
    }
    return {};
}