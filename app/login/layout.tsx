"use client";
import { useRouter } from 'next/navigation';
import { MdHome } from "react-icons/md";

import { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
    const router = useRouter();

    return (
        <div>
            <button
                onClick={() => router.push('/')}
                className="absolute top-4 left-4 text-4xl text-customTextColor hover:text-blue-500 transition-colors duration"
            >
                <MdHome />
            </button>
            {children}
        </div>
    );
}