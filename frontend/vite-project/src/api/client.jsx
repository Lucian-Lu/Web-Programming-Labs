// src/api/client.jsx

const API_BASE = "http://localhost:8000/api";

async function refreshAccessToken() {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) return null;

  try {
    const response = await fetch(`${API_BASE}/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
    });
    if (!response.ok) throw new Error("Refresh failed");

    const data = await response.json();
    if (data.access) {
      localStorage.setItem("accessToken", data.access);
      if (data.refresh) {
        localStorage.setItem("refreshToken", data.refresh);
      }
      return data.access;
    }
    return null;
  } catch {
    return null;
  }
}

export async function apiFetch(path, options = {}) {
  const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
  const url = `${API_BASE}/${normalizedPath}`;
  const isRefreshCall = normalizedPath.startsWith("token/refresh");

  async function doFetch(withAccessToken) {
    const headers = {
      "Content-Type": "application/json",
      ...(withAccessToken ? { Authorization: `Bearer ${withAccessToken}` } : {}),
      ...options.headers,
    };
    return fetch(url, {
      ...options,
      headers,
    });
  }

  let accessToken = localStorage.getItem("accessToken");
  let response = await doFetch(accessToken);

  if (response.status === 401 && !isRefreshCall) {
    const newAccess = await refreshAccessToken();
    if (newAccess) {
      response = await doFetch(newAccess);
    } else {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/";
      throw new Error("Session expired. Please log in again.");
    }
  }

  if (response.status === 401) {
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
