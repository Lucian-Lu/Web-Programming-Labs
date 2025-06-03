// src/components/QuizCard.jsx
import React from "react";

export default function QuizCard({ quiz, onDelete, onToggleLike, onPlay }) {
  return (
    <div className="quiz-card">
      {quiz.imageUrl && (
        <img
          src={quiz.imageUrl}
          alt={quiz.title}
          className="quiz-image"
          onClick={onPlay}
          style={{ cursor: "pointer" }}
        />
      )}

      <h2 className="quiz-title" onClick={onPlay} style={{ cursor: "pointer" }}>
        {quiz.title}
      </h2>

      <p className="quiz-description">{quiz.description}</p>
      <p className="quiz-meta">
        <strong>Questions:</strong> {quiz.questions.length}
      </p>

      <div className="card-actions">
        <button className="like-btn" onClick={onToggleLike}>
          {quiz.liked ? "Unlike" : "Like"} ({quiz.likes})
        </button>

        <button className="play-btn" onClick={onPlay}>
          Play
        </button>

        <button className="delete-btn" onClick={onDelete}>
          Delete
        </button>
      </div>
    </div>
  );
}
