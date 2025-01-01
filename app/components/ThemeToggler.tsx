"use client";

import React, { useEffect, useState } from 'react';
import { MdDarkMode, MdLightMode } from 'react-icons/md';

const ThemeToggler = () => {
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const darkModeEnabled = savedTheme ? savedTheme === 'dark' : true;
    setIsDarkMode(darkModeEnabled);

    if (darkModeEnabled) {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }
  }, []);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);

    if (newMode) {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <button onClick={toggleTheme} className="text-2xl fixed top-4 right-4">
      {isDarkMode ? <MdLightMode /> : <MdDarkMode />}
    </button>
  );
};

export default ThemeToggler;