import { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';

export default (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        const { name, value } = req.body;
        res.setHeader('Set-Cookie', serialize(name, value, { path: '/' }));
        res.status(200).json({ message: 'Cookie set successfully' });
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
};