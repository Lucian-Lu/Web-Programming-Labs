import React, { useState, useEffect } from "react";
import {
  HashRouter as Router,
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

function QuizzesPage({ quizzes, deleteQuiz, toggleLike, searchTerm }) {
  const navigate = useNavigate();

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
          <Route index element={<MainPage />} />

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

          <Route path="create" element={<CreatePage addQuiz={addQuiz} />} />

          <Route path="play/:quizId" element={<QuizPlay quizzes={quizzes} />} />

          <Route path="*" element={<MainPage />} />
        </Route>
      </Routes>
    </Router>
  );
}
