import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    setIsLoading(false);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const themeStyles = {
    light: {
      primary: '#4F46E5',
      secondary: '#818CF8',
      background: '#FFFFFF',
      surface: '#F3F4F6',
      text: '#1F2937',
      textSecondary: '#6B7280',
      border: '#E5E7EB',
      error: '#EF4444',
      success: '#10B981',
      warning: '#F59E0B',
    },
    dark: {
      primary: '#6366F1',
      secondary: '#818CF8',
      background: '#111827',
      surface: '#1F2937',
      text: '#F9FAFB',
      textSecondary: '#D1D5DB',
      border: '#374151',
      error: '#F87171',
      success: '#34D399',
      warning: '#FBBF24',
    },
  };

  if (isLoading) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, themeStyles }}>
      <div className={`app ${theme}`} style={{ 
        '--primary': themeStyles[theme].primary,
        '--secondary': themeStyles[theme].secondary,
        '--background': themeStyles[theme].background,
        '--surface': themeStyles[theme].surface,
        '--text': themeStyles[theme].text,
        '--text-secondary': themeStyles[theme].textSecondary,
        '--border': themeStyles[theme].border,
        '--error': themeStyles[theme].error,
        '--success': themeStyles[theme].success,
        '--warning': themeStyles[theme].warning,
      }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext); 