import React from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";

export default function Layout({ theme, setTheme, searchTerm, setSearchTerm }) {
  const location = useLocation();
  const navigate = useNavigate();

  const onSearchChange = (e) => {
    const value = e.target.value;

    if (location.pathname !== "/quizzes") {
      navigate("/quizzes");
    }
    setSearchTerm(value);
  };

  return (
    <>
      <header className="site-header">
        <div className="header-content">

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

          <div className="nav-center">
            <Link to="/" className="brand">
              Kachoo
            </Link>
          </div>

          <div className="nav-right">
            <input
              type="text"
              className="nav-search"
              placeholder="Search quizzes..."
              value={searchTerm}
              onChange={onSearchChange}
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
