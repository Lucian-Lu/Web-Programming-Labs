import React from 'react'
import ThemeToggle from './ThemeToggle'

export default function Navbar({
  onCreateClick,
  onQuizzesClick,
  searchTerm,
  setSearchTerm,
  theme,
  setTheme,
}) {
  return (
    <nav className="navbar">

      <div className="nav-left">
        <button className="nav-button" onClick={onQuizzesClick}>
          Quizzes
        </button>
        <button className="nav-button" onClick={onCreateClick}>
          Create Quiz
        </button>
      </div>

      <div className="nav-center">
        <h1 className="nav-logo">Kachoo</h1>
      </div>

      <div className="nav-right">
        <input
          type="text"
          className="nav-search"
          placeholder="Search quizzes..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <ThemeToggle theme={theme} setTheme={setTheme} />
      </div>
    </nav>
  )
}
