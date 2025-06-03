import React from "react";
import { Outlet, Link } from "react-router-dom";

export default function Layout({ theme, setTheme, searchTerm, setSearchTerm }) {
  return (
    <>
      <header className="site-header">
        <div className="header-content">
          {/* Left side: Home / Quizzes / Create Quiz */}
          <nav className="nav-left">
            <Link to="/" className="nav-link">
              Home
            </Link>
            <Link to="/quizzes" className="nav-link">
              Quizzes
            </Link>
            <Link to="/create" className="nav-link">
              Create Quiz
            </Link>
          </nav>

          {/* Center: “Kachoo” brand */}
          <div className="nav-center">
            <Link to="/" className="brand">
              Kachoo
            </Link>
          </div>

          {/* Right side: Search + Dark Mode toggle */}
          <div className="nav-right">
            <input
              type="text"
              className="nav-search"
              placeholder="Search quizzes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="theme-toggle"
            >
              {theme === "light" ? "Dark Mode" : "Light Mode"}
            </button>
          </div>
        </div>
      </header>

      <main className="site-main">
        <Outlet />
      </main>
    </>
  );
}
