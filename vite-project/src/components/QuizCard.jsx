import React from 'react'

export default function QuizCard({ quiz, onDelete, onToggleLike, onPlay }) {
  return (
    <div className="quiz-card">
      {quiz.imageUrl && (
        <img
          src={quiz.imageUrl}
          alt={quiz.title}
          style={{ cursor: 'pointer' }}
          onClick={onPlay}
        />
      )}
      <h2 style={{ cursor: 'pointer' }} onClick={onPlay}>
        {quiz.title}
      </h2>
      <p>{quiz.description}</p>
      <p>
        <strong>Questions:</strong> {quiz.questions.length}
      </p>
      <div className="card-actions">
        <button onClick={onToggleLike}>
          {quiz.liked ? 'Unlike' : 'Like'} ({quiz.likes})
        </button>
        <button onClick={onPlay}>Play</button>
        <button onClick={onDelete}>Delete</button>
      </div>
    </div>
  )
}
