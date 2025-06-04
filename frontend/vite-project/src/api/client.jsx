const API_BASE = "http://localhost:8000/api";

export async function apiFetch(path, options = {}) {
  // Normalize path (drop leading slash if present)
  const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
  const url = `${API_BASE}/${normalizedPath}`;

  // Always read from localStorage using the key "token"
  const token = localStorage.getItem("accessToken");


  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Clear the same key "token" and reload
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/";
    throw new Error("Unauthorized (401) — token invalid or expired");
  }

  if (!response.ok) {
    let errMsg = `Request failed: ${response.status}`;
    try {
      const data = await response.json();
      errMsg = data.detail || JSON.stringify(data);
    } catch {}
    const error = new Error(errMsg);
    error.status = response.status;
    throw error;
  }

  if (response.status === 204) return null;
  return response.json();
}
