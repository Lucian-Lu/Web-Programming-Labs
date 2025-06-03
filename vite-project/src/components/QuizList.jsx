import React from "react";
import QuizCard from "./QuizCard";

export default function QuizList({ quizzes, onDelete, onToggleLike, onPlay }) {
  if (quizzes.length === 0) {
    return <p>No quizzes found. Add a new quiz!</p>;
  }

  return (
    <div className="quiz-list">
      {quizzes.map((quiz) => (
        <QuizCard
          key={quiz.id}
          quiz={quiz}
          onDelete={() => onDelete(quiz.id)}
          onToggleLike={() => onToggleLike(quiz.id)}
          onPlay={() => onPlay(quiz)}
        />
      ))}
    </div>
  );
}
