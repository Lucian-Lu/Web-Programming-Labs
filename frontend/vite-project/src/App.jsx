import React, { useState, useEffect } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  useNavigate,
  useParams,
} from "react-router-dom";

import Layout from "./components/Layout.jsx";
import MainPage from "./pages/MainPage.jsx";
import QuizList from "./components/QuizList.jsx";
import QuizForm from "./components/QuizForm.jsx";
import QuizPlay from "./components/QuizPlay.jsx";
import ObtainToken from "./components/ObtainToken.jsx";

import {
  getQuizzes,
  createQuiz,
  deleteQuiz,
  likeQuiz,
  unlikeQuiz,
  getQuizById,
} from "./api/quizService.jsx";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("accessToken") || null);
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
        prev.map((q) =>
          q.id === id ? { ...q, likes: resp.likes, liked: true } : q
        )
      );
    } catch (err) {
      console.error("Error liking quiz:", err);
    }
  };

  const handleUnlikeQuiz = async (id) => {
    try {
      const resp = await unlikeQuiz(id);
      setQuizzes((prev) =>
        prev.map((q) =>
          q.id === id ? { ...q, likes: resp.likes, liked: false } : q
        )
      );
    } catch (err) {
      console.error("Error unliking quiz:", err);
    }
  };

  if (!loadingTokenCheck && !token) {
    return <ObtainToken onTokenObtained={(tok) => setToken(tok)} />;
  }

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

      <div style={{ marginTop: "1rem", textAlign: "center" }}>
        <button onClick={handlePrev} disabled={offset === 0}>
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={offset + limit >= totalCount}
          style={{ marginLeft: "1rem" }}
        >
          Next
        </button>
        <p>
          Showing {quizzes.length} of {totalCount} (limit={limit}, offset=
          {offset})
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
