export function loadQuizzes() {
  try {
    const data = localStorage.getItem("kachoo.quizzes");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveQuizzes(quizzes) {
  localStorage.setItem("kachoo.quizzes", JSON.stringify(quizzes));
}

export function loadTheme() {
  return localStorage.getItem("kachoo.theme") || "light";
}

export function saveTheme(theme) {
  localStorage.setItem("kachoo.theme", theme);
}
