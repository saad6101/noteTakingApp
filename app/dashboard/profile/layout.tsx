"use client";
import { useRouter } from 'next/navigation';
import { MdDashboard } from "react-icons/md";
import { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
    const router = useRouter();

    return (
            <div>
            <div className="flex justify-start mt-4">
            <button onClick={() => router.push('/dashboard')}>
                <MdDashboard  className="fixed top-4 left-4 w-5 h-5 rounded" />
            </button>
                </div>
            {children}
        </div>
    );
}