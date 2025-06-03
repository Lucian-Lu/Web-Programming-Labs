import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

export default function QuizForm({ onSave, onCancel }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [questions, setQuestions] = useState([
    {
      id: uuidv4(),
      text: '',
      correctAnswer: '',
      wrongAnswers: ['', '', ''],
    },
  ])

  const handleQuestionChange = (id, field, value) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id
          ? {
              ...q,
              [field]: value,
            }
          : q
      )
    )
  }

  const handleWrongAnswerChange = (id, idx, value) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id
          ? {
              ...q,
              wrongAnswers: q.wrongAnswers.map((wa, wIndex) =>
                wIndex === idx ? value : wa
              ),
            }
          : q
      )
    )
  }

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        id: uuidv4(),
        text: '',
        correctAnswer: '',
        wrongAnswers: ['', '', ''],
      },
    ])
  }

  const removeQuestion = (id) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim() || !description.trim()) return

    const filteredQuestions = questions
      .filter((q) => q.text.trim())
      .map((q) => ({
        id: q.id,
        text: q.text.trim(),
        correctAnswer: q.correctAnswer.trim(),
        wrongAnswers: q.wrongAnswers.map((w) => w.trim()).filter((w) => w),
      }))
      .filter((q) => q.correctAnswer && q.wrongAnswers.length >= 1)

    const newQuiz = {
      id: uuidv4(),
      title: title.trim(),
      description: description.trim(),
      imageUrl: imageUrl.trim(),
      questions: filteredQuestions,
      likes: 0,
      liked: false,
    }
    onSave(newQuiz)
  }

  return (
    <form className="quiz-form" onSubmit={handleSubmit}>
      <h2>Add New Quiz</h2>

      <label>Title</label>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <label>Description</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      <label>Image URL</label>
      <input
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
      />

      <h3>Questions</h3>
      {questions.map((q, idx) => (
        <div key={q.id} className="question-group">
          <label>Question {idx + 1}</label>
          <input
            placeholder="Question text"
            value={q.text}
            onChange={(e) =>
              handleQuestionChange(q.id, 'text', e.target.value)
            }
            required
          />

          <label>Correct Answer</label>
          <input
            placeholder="Correct answer"
            value={q.correctAnswer}
            onChange={(e) =>
              handleQuestionChange(q.id, 'correctAnswer', e.target.value)
            }
            required
          />

          <label>Wrong Answer 1</label>
          <input
            placeholder="Wrong answer #1"
            value={q.wrongAnswers[0]}
            onChange={(e) =>
              handleWrongAnswerChange(q.id, 0, e.target.value)
            }
            required
          />

          <label>Wrong Answer 2</label>
          <input
            placeholder="Wrong answer #2"
            value={q.wrongAnswers[1]}
            onChange={(e) =>
              handleWrongAnswerChange(q.id, 1, e.target.value)
            }
          />

          <label>Wrong Answer 3</label>
          <input
            placeholder="Wrong answer #3"
            value={q.wrongAnswers[2]}
            onChange={(e) =>
              handleWrongAnswerChange(q.id, 2, e.target.value)
            }
          />

          {questions.length > 1 && (
            <button
              type="button"
              onClick={() => removeQuestion(q.id)}
              style={{ backgroundColor: 'crimson', color: 'white' }}
            >
              Remove Question
            </button>
          )}
        </div>
      ))}

      <button type="button" onClick={addQuestion}>
        Add Another Question
      </button>

      <div className="form-actions">
        <button type="submit">Save Quiz</button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  )
}
