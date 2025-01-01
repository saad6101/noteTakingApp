import { serialize, parse } from 'cookie';

export const setCookie = async (name: string, value: string) => {
    const res = await fetch('/api/setCookie', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, value }),
    });
    return res.json();
};

export const getCookie = (name: string) => {
    if (typeof document !== 'undefined') {
        const cookies = parse(document.cookie);
        return cookies[name] || null;
    }
    return null;
};

export default function cookieHandler() {
    return { setCookie, getCookie };
}