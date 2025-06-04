import React, { useState } from "react";

export default function ObtainToken({ onTokenObtained }) {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("VISITOR");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim()) {
      setError("Username is required.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/token/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          role,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || JSON.stringify(data));
      }
      localStorage.setItem("accessToken", data.access);
      if (data.refresh) {
        localStorage.setItem("refreshToken", data.refresh);
      }
      onTokenObtained(data.access);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "400px", margin: "auto" }}>
      <h2>Enter Username & Choose Role</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{ width: "100%", padding: "0.5rem" }}
          >
            <option value="VISITOR">VISITOR (read-only)</option>
            <option value="WRITER">WRITER (read + write)</option>
            <option value="ADMIN">ADMIN (all permissions)</option>
          </select>
        </div>

        <button type="submit" style={{ padding: "0.5rem 1rem" }}>
          Get Token
        </button>
      </form>

      {error && (
        <p style={{ color: "crimson", marginTop: "1rem" }}>{error}</p>
      )}
    </div>
  );
}
