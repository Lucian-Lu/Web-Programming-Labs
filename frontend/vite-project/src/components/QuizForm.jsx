import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function QuizForm({ onSave, onCancel }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [questions, setQuestions] = useState([
    {
      id: uuidv4(),
      text: "",
      correctAnswer: "",
      wrongAnswers: ["", "", ""],
    },
  ]);

  const handleQuestionChange = (id, field, value) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const handleWrongAnswerChange = (id, idx, value) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id
          ? {
              ...q,
              wrongAnswers: q.wrongAnswers.map((wa, i) =>
                i === idx ? value : wa
              ),
            }
          : q
      )
    );
  };

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        id: uuidv4(),
        text: "",
        correctAnswer: "",
        wrongAnswers: ["", "", ""],
      },
    ]);
  };

  const removeQuestion = (id) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const filteredQuestions = questions
      .filter((q) => q.text.trim())
      .map((q) => ({
        text: q.text.trim(),
        correct_answer: q.correctAnswer.trim(),
        wrong_answers: q.wrongAnswers
          .map((w) => w.trim())
          .filter((w) => w),
      }))
      .filter((q) => q.correct_answer && q.wrong_answers.length >= 1);

    const newQuiz = {
      title: title.trim(),
      description: description.trim(),
      image_url: imageUrl.trim(),
      questions: filteredQuestions,
    };

    onSave(newQuiz);
  };

  return (
    <form className="quiz-form" onSubmit={handleSubmit}>
      <h2>Add New Quiz</h2>

      <div className="form-group">
        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Image URL</label>
        <input
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
      </div>

      <h3>Questions</h3>
      {questions.map((q, idx) => (
        <div key={q.id} className="question-group">
          <h4>Question {idx + 1}</h4>

          <div className="form-group">
            <label>Question Text</label>
            <input
              type="text"
              placeholder="Enter question..."
              value={q.text}
              onChange={(e) =>
                handleQuestionChange(q.id, "text", e.target.value)
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Correct Answer</label>
            <input
              type="text"
              placeholder="Enter correct answer"
              value={q.correctAnswer}
              onChange={(e) =>
                handleQuestionChange(q.id, "correctAnswer", e.target.value)
              }
              required
            />
          </div>

          {q.wrongAnswers.map((wa, i) => (
            <div key={i} className="form-group">
              <label>Wrong Answer {i + 1}</label>
              <input
                type="text"
                placeholder={`Wrong answer #${i + 1}`}
                value={wa}
                onChange={(e) =>
                  handleWrongAnswerChange(q.id, i, e.target.value)
                }
                required={i === 0}
              />
            </div>
          ))}

          {questions.length > 1 && (
            <button
              type="button"
              className="remove-btn"
              onClick={() => removeQuestion(q.id)}
            >
              Remove Question
            </button>
          )}
        </div>
      ))}

      <button type="button" className="add-btn" onClick={addQuestion}>
        Add Another Question
      </button>

      <div className="form-actions">
        <button type="submit">Save Quiz</button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
