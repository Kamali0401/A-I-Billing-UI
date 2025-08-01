import React, { useContext } from 'react';
import { ThemeContext } from './themecontext';

const ThemeSwitcher = () => {
  const { setTheme, themeName } = useContext(ThemeContext);

  return (
    <div style={{ padding: '10px' }}>
      <select value={themeName} onChange={(e) => setTheme(e.target.value)}>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="blue">Blue</option>
      </select>
    </div>
  );
};

export default ThemeSwitcher;
