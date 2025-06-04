import { apiFetch } from "./client.jsx";

export async function getQuizzes({ limit = 10, offset = 0, search = "" } = {}) {
  let query = `?limit=${limit}&offset=${offset}`;
  if (search) query += `&search=${encodeURIComponent(search)}`;
  return apiFetch(`/quizzes/${query}`);
}

export async function getQuizById(quizId) {
  return apiFetch(`/quizzes/${quizId}/`);
}

export async function createQuiz(quizData) {
  return apiFetch("/quizzes/", {
    method: "POST",
    body: JSON.stringify(quizData),
  });
}

export async function deleteQuiz(quizId) {
  return apiFetch(`/quizzes/${quizId}/`, { method: "DELETE" });
}

export async function likeQuiz(quizId) {
  return apiFetch(`/quizzes/${quizId}/like/`, { method: "POST" });
}

export async function unlikeQuiz(quizId) {
  return apiFetch(`/quizzes/${quizId}/unlike/`, { method: "DELETE" });
}

export async function updateQuiz(quizId, quizData) {
  return apiFetch(`/quizzes/${quizId}/`, {
    method: "PUT",
    body: JSON.stringify(quizData),
  });
}
