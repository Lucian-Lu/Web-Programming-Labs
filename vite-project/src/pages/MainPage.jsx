// src/pages/MainPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function MainPage() {
  const navigate = useNavigate();

  return (
    <div className="main-page">
      {/* Hero Section (≈70vh) */}
      <section className="section hero-section">
        <div className="hero-content">
          <h2 className="hero-title">Welcome to Kachoo</h2>
          <p className="hero-subtitle">Create a quiz or take one today.</p>

          {/* First button: View All Quizzes */}
          <button
            className="hero-cta"
            onClick={() => navigate("/quizzes")}
          >
            View All Quizzes
          </button>

          {/* Second button: Create Quiz */}
          <button
            className="hero-cta"
            onClick={() => navigate("/create")}
            style={{ marginLeft: "1rem" }}
          >
            Create Quiz
          </button>
        </div>
      </section>

      {/* Description Section (≈70vh) */}
      <section className="section desc-section">
        <div className="desc-content">
          <h2>How Kachoo Works</h2>
          <p>
            Whether you’re a teacher, student, or trivia fan, Kachoo makes it easy
            to build interactive quizzes in seconds. Simply click “Create Quiz” in
            the top bar, add your questions, and share the link. You can also
            browse existing quizzes and challenge yourself or your friends!
          </p>
          {/* Keep only Create Quiz here */}
          <button
            className="desc-cta"
            onClick={() => navigate("/create")}
          >
            Create Quiz
          </button>
        </div>
      </section>

      {/* Footer Section (≈30vh) */}
      <section className="section footer-section">
        <div className="footer-content">
          <p>© {new Date().getFullYear()} Kachoo. All rights reserved.</p>
        </div>
      </section>
    </div>
  );
}
