import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

import { loadQuizzes, saveQuizzes, loadTheme, saveTheme } from "./utils/storage";

import Layout from "./components/Layout";
import MainPage from "./pages/MainPage";
import QuizList from "./components/QuizList";
import QuizForm from "./components/QuizForm";
import QuizPlay from "./components/QuizPlay";

/** Wraps QuizForm, then navigates back to /quizzes on save or cancel */
function CreatePage({ addQuiz }) {
  const navigate = useNavigate();

  const handleSave = (quiz) => {
    addQuiz(quiz);
    navigate("/quizzes");
  };

  const handleCancel = () => {
    navigate("/quizzes");
  };

  return <QuizForm onSave={handleSave} onCancel={handleCancel} />;
}

/** Reads searchTerm from props, filters quizzes, then renders QuizList */
function QuizzesPage({ quizzes, deleteQuiz, toggleLike, searchTerm }) {
  const navigate = useNavigate();

  // Filter quizzes by title (case-insensitive)
  const filteredQuizzes = quizzes.filter((q) =>
    q.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePlay = (quiz) => {
    navigate(`/play/${quiz.id}`);
  };

  return (
    <QuizList
      quizzes={filteredQuizzes}
      onDelete={deleteQuiz}
      onToggleLike={toggleLike}
      onPlay={handlePlay}
    />
  );
}

export default function App() {
  const [quizzes, setQuizzes] = useState(() => loadQuizzes());
  const [theme, setTheme] = useState(() => loadTheme());
  const [searchTerm, setSearchTerm] = useState("");

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

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout
              theme={theme}
              setTheme={setTheme}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          }
        >
          {/* Home */}
          <Route index element={<MainPage />} />

          {/* Quizzes List */}
          <Route
            path="quizzes"
            element={
              <QuizzesPage
                quizzes={quizzes}
                deleteQuiz={deleteQuiz}
                toggleLike={toggleLike}
                searchTerm={searchTerm}
              />
            }
          />

          {/* Create Quiz */}
          <Route path="create" element={<CreatePage addQuiz={addQuiz} />} />

          {/* Play Quiz */}
          <Route path="play/:quizId" element={<QuizPlay quizzes={quizzes} />} />

          {/* Fallback: render MainPage if no match */}
          <Route path="*" element={<MainPage />} />
        </Route>
      </Routes>
    </Router>
  );
}
