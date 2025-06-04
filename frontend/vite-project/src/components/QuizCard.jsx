import React from "react";

export default function QuizCard({ quiz, onDelete, onLike, onUnlike, onPlay }) {
  return (
    <div className="quiz-card">
      {quiz.image_url && (
        <img
          src={quiz.image_url}
          alt={quiz.title}
          className="quiz-image"
          onClick={onPlay}
          style={{ cursor: "pointer" }}
        />
      )}

      <h2
        className="quiz-title"
        onClick={onPlay}
        style={{ cursor: "pointer" }}
      >
        {quiz.title}
      </h2>

      <p className="quiz-description">{quiz.description}</p>
      <p className="quiz-meta">
        <strong>Questions:</strong> {quiz.questions.length}
      </p>

      <div className="card-actions">
        {quiz.liked ? (
          <button className="unlike-btn" onClick={() => onUnlike(quiz.id)}>
            Unlike ({quiz.likes})
          </button>
        ) : (
          <button className="like-btn" onClick={() => onLike(quiz.id)}>
            Like ({quiz.likes})
          </button>
        )}

        <button className="play-btn" onClick={onPlay}>
          Play
        </button>

        <button className="delete-btn" onClick={() => onDelete(quiz.id)}>
          Delete
        </button>
      </div>
    </div>
  );
}
