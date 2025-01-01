"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MdDashboard } from "react-icons/md";
import { getCookie } from '../cookieHandler';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuthToken = () => {
      const authToken = getCookie('authTokenGHF');
      if (authToken) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    };
    checkAuthToken();
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-2xl md:text-4xl font-bold fascinate-inline-regular text-center">
        Note Taking The Art
      </h1>
      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        {isLoggedIn ? (
          <Link href="/dashboard">
            <button className="w-full sm:w-auto px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <MdDashboard />
              Dashboard
            </button>
          </Link>
        ) : (
          <>
            <Link href="/login">
              <button className="w-full sm:w-auto px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-700">
                Login
              </button>
            </Link>
            <Link href="/login">
              <button className="w-full sm:w-auto px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-700">
                Sign Up
              </button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}