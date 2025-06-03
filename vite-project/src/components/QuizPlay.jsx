import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function QuizPlay({ quizzes }) {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const quiz = quizzes.find((q) => q.id === quizId);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (!quiz) return;
    const q = quiz.questions[currentIndex];
    if (!q) return;

    const options = [
      { text: q.correctAnswer, isCorrect: true },
      ...q.wrongAnswers.map((w) => ({ text: w, isCorrect: false })),
    ];

    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }

    setShuffledOptions(options);
    setSelectedAnswer(null);
  }, [currentIndex, quiz]);

  const chooseAnswer = (option) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(option);
    if (option.isCorrect) {
      setScore((s) => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIndex + 1 < quiz.questions.length) {
      setCurrentIndex((i) => i + 1);
    } else {
      setShowResult(true);
    }
  };

  const handleExit = () => {
    navigate("/quizzes");
  };

  if (!quiz) {
    return (
      <div className="quiz-play-container">
        <h2>Quiz not found</h2>
        <button onClick={handleExit}>Back to Quizzes</button>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="quiz-play-container">
        <h2>Quiz Completed!</h2>
        <p>
          You scored {score} out of {quiz.questions.length}.
        </p>
        <button onClick={handleExit}>Back to Quizzes</button>
      </div>
    );
  }

  const currentQ = quiz.questions[currentIndex];

  return (
    <div className="quiz-play-container">
      <h2>{quiz.title}</h2>
      <p>{quiz.description}</p>
      <div className="question-block">
        <h3>
          Question {currentIndex + 1} / {quiz.questions.length}
        </h3>
        <p>{currentQ.text}</p>
        <div className="options-container">
          {shuffledOptions.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => chooseAnswer(opt)}
              style={{
                backgroundColor:
                  selectedAnswer === null
                    ? ""
                    : opt.isCorrect
                    ? "seagreen"
                    : selectedAnswer.text === opt.text
                    ? "crimson"
                    : "",
                color: selectedAnswer !== null ? "#fff" : "",
                cursor: selectedAnswer !== null ? "default" : "pointer",
              }}
              disabled={selectedAnswer !== null}
            >
              {opt.text}
            </button>
          ))}
        </div>
        {selectedAnswer !== null && (
          <button onClick={nextQuestion}>
            {currentIndex + 1 < quiz.questions.length
              ? "Next Question"
              : "See Results"}
          </button>
        )}
      </div>
    </div>
  );
}
