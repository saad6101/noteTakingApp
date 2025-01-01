import { NextApiRequest, NextApiResponse } from 'next';
import { parse } from 'cookie';

export default (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
        const { name } = req.query;
        const cookies = parse(req.headers.cookie || '');
        res.status(200).json({ value: cookies[name as string] || null });
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
};