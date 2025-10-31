import React, { createContext, useContext, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// The application is now locked into a light theme.
// This provider maintains the context structure but removes all dynamic theme-switching logic.
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const value = { 
    theme: 'light' as Theme, 
    toggleTheme: () => {} // Toggle function does nothing.
  };

  // Set the class on the root element once to ensure consistency.
  React.useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('dark');
    root.classList.add('light');
  }, []);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};