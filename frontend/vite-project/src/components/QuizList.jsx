import React from "react";
import QuizCard from "./QuizCard.jsx";

export default function QuizList({
  quizzes,
  onDelete,
  onLike,
  onUnlike,
  onPlay,
}) {
  if (!Array.isArray(quizzes) || quizzes.length === 0) {
    return <p className="no-quizzes">No quizzes found. Add a new quiz!</p>;
  }

  return (
    <div className="quiz-list">
      {quizzes.map((quiz) => (
        <QuizCard
          key={quiz.id}
          quiz={quiz}
          onDelete={onDelete}
          onLike={onLike}
          onUnlike={onUnlike}
          onPlay={() => onPlay(quiz)}
        />
      ))}
    </div>
  );
}
