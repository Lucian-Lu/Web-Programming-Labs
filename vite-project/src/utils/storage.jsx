export function loadQuizzes() {
  try {
    const data = localStorage.getItem("kahootClone.quizzes");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveQuizzes(quizzes) {
  localStorage.setItem("kahootClone.quizzes", JSON.stringify(quizzes));
}

export function loadTheme() {
  return localStorage.getItem("kahootClone.theme") || "light";
}

export function saveTheme(theme) {
  localStorage.setItem("kahootClone.theme", theme);
}
