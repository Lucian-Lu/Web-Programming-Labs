import React, { useState, useEffect } from "react";
import QuizList from "./components/QuizList";
import QuizForm from "./components/QuizForm";
import QuizPlay from "./components/QuizPlay";
import ThemeToggle from "./components/ThemeToggle";
import {
  loadQuizzes,
  saveQuizzes,
  loadTheme,
  saveTheme,
} from "./utils/storage";

export default function App() {
  const [quizzes, setQuizzes] = useState(() => loadQuizzes());
  const [theme, setTheme] = useState(() => loadTheme());
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [playingQuiz, setPlayingQuiz] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    saveQuizzes(quizzes);
  }, [quizzes]);

  useEffect(() => {
    saveTheme(theme);
  }, [theme]);

  const addQuiz = (quiz) => {
    setQuizzes((prev) => [...prev, quiz]);
  };

  const deleteQuiz = (id) => {
    setQuizzes((prev) => prev.filter((q) => q.id !== id));
  };

  const toggleLike = (id) => {
    setQuizzes((prev) =>
      prev.map((q) =>
        q.id === id
          ? { ...q, likes: q.likes + (q.liked ? -1 : 1), liked: !q.liked }
          : q
      )
    );
  };

  const startQuiz = (quiz) => {
    setPlayingQuiz(quiz);
  };

  const filteredQuizzes = quizzes.filter((q) =>
    q.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app-container">
      <header>
        <h1>Kahoot Clone</h1>
        <div className="actions">
          <input
            type="text"
            placeholder="Search quizzes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={() => setShowForm(true)}>Add Quiz</button>
          <ThemeToggle theme={theme} setTheme={setTheme} />
        </div>
      </header>
      <main>
        {playingQuiz ? (
          <QuizPlay quiz={playingQuiz} onExit={() => setPlayingQuiz(null)} />
        ) : showForm ? (
          <QuizForm
            onSave={(quiz) => {
              addQuiz(quiz);
              setShowForm(false);
            }}
            onCancel={() => setShowForm(false)}
          />
        ) : (
          <QuizList
            quizzes={filteredQuizzes}
            onDelete={deleteQuiz}
            onToggleLike={toggleLike}
            onPlay={startQuiz}
          />
        )}
      </main>
    </div>
  );
}
