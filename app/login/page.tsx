"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {initializeSecretKey} from '@/initializeSecretKey';
import { useValidateUserInputs } from "../components/validateUserInputs";
import { handleAuthRequest } from '../components/handleAuthRequest';


export default function Login() {
    const [SECRET_KEY, setSecretKey] = useState('');
    const router = useRouter();
    initializeSecretKey(setSecretKey);

    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [bioRemark, setBioRemark] = useState('');
    const [error, setError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [emailError, setEmailError] = useState('');

    useValidateUserInputs(email, setEmailError, password, setPasswordError);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await handleAuthRequest(isLogin, email, password, SECRET_KEY, router, setError, name, phoneNumber, bioRemark);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 font-mono">
            <h1 className="text-xl md:text-4xl font-bold text-center mb-6 fascinate-inline-regular transition-all duration-500 monoton-regular">
                {isLogin ? 'Login' : 'Sign Up'}
            </h1>
            
            <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md transition-all duration-2000">
                {!isLogin && (
                    <div>
                        <label className="block text-sm font-medium mb-1 text-customTextColor transition-all duration-2000">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-2 border  border-customTextColor rounded-md bg-customBackgroundColor
                                     transition-colors
                                     focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                )}
                <div>
                    <label className="block text-sm font-medium mb-1 text-customTextColor transition-all duration-2000 ">Email</label>
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border border-customTextColor rounded-md bg-customBackgroundColor
                                 transition-colors
                                 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
                </div>
                
                <div>
                    <label className="block text-sm font-medium mb-1 text-customTextColor transition-all duration-2000">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border border-customTextColor rounded-md bg-customBackgroundColor
                                 transition-colors
                                 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
                </div>

                {!isLogin && (
                    <>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-customTextColor transition-all duration-2000">Phone Number</label>
                            <input
                                type="text"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className="w-full p-2 border border-customTextColor rounded-md bg-customBackgroundColor
                                         transition-colors
                                         focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-customTextColor transition-all duration-2000">Bio Remark</label>
                            <input
                                type="text"
                                value={bioRemark}
                                onChange={(e) => setBioRemark(e.target.value)}
                                className="w-full p-2 border border-customTextColor rounded-md bg-customBackgroundColor
                                         transition-colors
                                         focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </>
                )}
    
                {error && (
                    <p className="text-red-500 text-sm">{error}</p>
                )}
    
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded-lg 
                             hover:bg-blue-600 transition-colors"
                >
                    {isLogin ? 'Login' : 'Sign Up'}
                </button>
    
                <div className="flex items-center justify-center mt-4">
                    <div className="text-sm">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox"
                                className="sr-only peer"
                                checked={!isLogin}
                                onChange={() => setIsLogin(!isLogin)}
                            />
                            <div className="w-11 h-6 bg-customColor peer-focus:outline-none 
                                          rounded-full peer
                                          peer-checked:after:translate-x-full 
                                          after:content-[''] after:absolute after:top-[2px] 
                                          after:left-[2px] after:bg-white after:rounded-full 
                                          after:h-5 after:w-5 after:transition-all 
                                          peer-checked:bg-blue-600">
                            </div>
                            <span className="ml-3 text-customTextColor transition-all duration-2000">
                                {isLogin ? 'Switch to Sign Up' : 'Switch to Login'}
                            </span>
                        </label>
                    </div>
                </div>
            </form>
        </div>
    );
}