import React, { useState, useEffect } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useParams,
} from "react-router-dom";

import Layout from "./components/Layout.jsx";
import MainPage from "./pages/MainPage.jsx";
import QuizList from "./components/QuizList.jsx";
import QuizForm from "./components/QuizForm.jsx";
import QuizPlay from "./components/QuizPlay.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";

import {
  getQuizzes,
  createQuiz,
  deleteQuiz,
  likeQuiz,
  unlikeQuiz,
  getQuizById,
} from "./api/quizService.jsx";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("accessToken"));
  const [loadingTokenCheck, setLoadingTokenCheck] = useState(true);

  const [quizzes, setQuizzes] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  useEffect(() => {
    setLoadingTokenCheck(false);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const fetchQuizzes = async ({ limit, offset, search }) => {
    try {
      const data = await getQuizzes({ limit, offset, search });
      setQuizzes(data.results);
      setTotalCount(data.count);
    } catch (err) {
      console.error("Failed to fetch quizzes:", err);
    }
  };

  useEffect(() => {
    if (!token) return;
    fetchQuizzes({ limit, offset, search: searchTerm });
  }, [token, limit, offset, searchTerm]);

  const handleAddQuiz = async (quiz) => {
    try {
      await createQuiz(quiz);
      setOffset(0);
      fetchQuizzes({ limit, offset: 0, search: searchTerm });
    } catch (err) {
      console.error("Error creating quiz:", err);
    }
  };

  const handleDeleteQuiz = async (id) => {
    try {
      await deleteQuiz(id);
      setQuizzes((prev) => prev.filter((q) => q.id !== id));
      setTotalCount((c) => c - 1);
    } catch (err) {
      console.error("Error deleting quiz:", err);
    }
  };

  const handleLikeQuiz = async (id) => {
    try {
      const resp = await likeQuiz(id);
      setQuizzes((prev) =>
        prev.map((q) => (q.id === id ? { ...q, likes: resp.likes, liked: true } : q))
      );
    } catch (err) {
      console.error("Error liking quiz:", err);
    }
  };

  const handleUnlikeQuiz = async (id) => {
    try {
      const resp = await unlikeQuiz(id);
      setQuizzes((prev) =>
        prev.map((q) => (q.id === id ? { ...q, likes: resp.likes, liked: false } : q))
      );
    } catch (err) {
      console.error("Error unliking quiz:", err);
    }
  };

  const onLoginSuccess = (accessToken, refreshToken) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    setToken(accessToken);
  };

  const onLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setToken(null);
  };

  if (loadingTokenCheck) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        {!token ? (
          <>
            <Route
              path="/login"
              element={<Login onLoginSuccess={onLoginSuccess} />}
            />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        ) : (
          <>
            <Route
              path="/"
              element={
                <Layout
                  theme={theme}
                  setTheme={setTheme}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  onLogout={onLogout}
                />
              }
            >
              <Route index element={<MainPage />} />

              <Route
                path="quizzes"
                element={
                  <QuizzesPage
                    quizzes={quizzes}
                    deleteQuiz={handleDeleteQuiz}
                    onLike={handleLikeQuiz}
                    onUnlike={handleUnlikeQuiz}
                    searchTerm={searchTerm}
                    totalCount={totalCount}
                    limit={limit}
                    offset={offset}
                    setOffset={setOffset}
                    setLimit={setLimit}
                  />
                }
              />

              <Route path="create" element={<CreatePage addQuiz={handleAddQuiz} />} />

              <Route path="play/:quizId" element={<PlayWrapper />} />

              <Route path="*" element={<MainPage />} />
            </Route>
          </>
        )}
      </Routes>
    </Router>
  );
}

function CreatePage({ addQuiz }) {
  const navigate = useNavigate();
  const handleSave = (quiz) => {
    addQuiz(quiz);
    navigate("/quizzes");
  };
  const handleCancel = () => navigate("/quizzes");
  return <QuizForm onSave={handleSave} onCancel={handleCancel} />;
}

function QuizzesPage({
  quizzes,
  deleteQuiz,
  onLike,
  onUnlike,
  searchTerm,
  totalCount,
  limit,
  offset,
  setOffset,
  setLimit,
}) {
  const navigate = useNavigate();

  const handlePlay = (quiz) => {
    navigate(`/play/${quiz.id}`);
  };

  const handlePrev = () => {
    if (offset - limit >= 0) {
      setOffset(offset - limit);
    }
  };
  const handleNext = () => {
    if (offset + limit < totalCount) {
      setOffset(offset + limit);
    }
  };

  return (
    <div>
      <QuizList
        quizzes={quizzes}
        onDelete={deleteQuiz}
        onLike={onLike}
        onUnlike={onUnlike}
        onPlay={handlePlay}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "1.5rem",
        }}
      >
        <button
          onClick={handlePrev}
          disabled={offset === 0}
          style={{
            padding: "0.5rem 1rem",
            marginRight: "1rem",
            backgroundColor: offset === 0 ? "#ccc" : "#2c3e50",
            color: offset === 0 ? "#666" : "#fff",
            border: "none",
            borderRadius: "0.25rem",
            cursor: offset === 0 ? "not-allowed" : "pointer",
            transition: "background-color 0.2s ease",
          }}
          onMouseEnter={(e) => {
            if (offset !== 0) e.currentTarget.style.backgroundColor = "#34495e";
          }}
          onMouseLeave={(e) => {
            if (offset !== 0) e.currentTarget.style.backgroundColor = "#2c3e50";
          }}
        >
          Previous
        </button>

        <button
          onClick={handleNext}
          disabled={offset + limit >= totalCount}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor:
              offset + limit >= totalCount ? "#ccc" : "#2c3e50",
            color: offset + limit >= totalCount ? "#666" : "#fff",
            border: "none",
            borderRadius: "0.25rem",
            cursor:
              offset + limit >= totalCount ? "not-allowed" : "pointer",
            transition: "background-color 0.2s ease",
          }}
          onMouseEnter={(e) => {
            if (offset + limit < totalCount)
              e.currentTarget.style.backgroundColor = "#34495e";
          }}
          onMouseLeave={(e) => {
            if (offset + limit < totalCount)
              e.currentTarget.style.backgroundColor = "#2c3e50";
          }}
        >
          Next
        </button>

        <p style={{ marginLeft: "1.5rem", color: "#555" }}>
          Showing {quizzes.length} of {totalCount}
        </p>
      </div>
    </div>
  );
}

function PlayWrapper() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOne() {
      try {
        const q = await getQuizById(quizId);
        setCurrentQuiz(q);
      } catch (err) {
        console.error("Quiz not found, redirecting:", err);
        if (localStorage.getItem("accessToken")) {
          navigate("/quizzes");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchOne();
  }, [quizId, navigate]);

  if (loading) return <p>Loading quiz...</p>;
  if (!currentQuiz) return null;

  return <QuizPlay quizzes={[currentQuiz]} />;
}
