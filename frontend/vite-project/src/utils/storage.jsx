export function loadTheme() {
  return localStorage.getItem("kachoo.theme") || "light";
}

export function saveTheme(theme) {
  localStorage.setItem("kachoo.theme", theme);
}
