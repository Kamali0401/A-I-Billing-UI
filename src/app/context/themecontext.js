import React, { createContext, useState } from 'react';

export const ThemeContext = createContext();

const themes = {
  light: {
    '--primary-color': '#000',
    '--background-color': '#fff',
  },
  dark: {
    '--primary-color': '#fff',
    '--background-color': '#333',
  },
  blue: {
    '--primary-color': '#fff',
    '--background-color': '#007BFF',
  },
};

export const ThemeProvider = ({ children }) => {
  const [themeName, setThemeName] = useState('light');

  const setTheme = (name) => {
    const theme = themes[name];
    if (theme) {
      Object.entries(theme).forEach(([key, value]) => {
        document.documentElement.style.setProperty(key, value);
      });
      setThemeName(name);
    }
  };

  return (
    <ThemeContext.Provider value={{ themeName, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
