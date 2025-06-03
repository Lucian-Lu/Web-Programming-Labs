import React from 'react';

export default function ThemeToggle({ theme, setTheme }) {
  const toggle = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <button onClick={toggle} className="theme-toggle">
      {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
    </button>
  );
}
