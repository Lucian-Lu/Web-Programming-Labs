import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Read theme from localStorage so we can adjust text color:
  const theme = localStorage.getItem("theme") || "light";
  const textColor = theme === "dark" ? "#fff" : "#000";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Username and password are required.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/token/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || JSON.stringify(data));
      }
      onLoginSuccess(data.access, data.refresh);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "80vh",
        // Make background transparent so underlying theme shows through
        backgroundColor: "transparent",
      }}
    >
      <div
        style={{
          // Also transparent card
          background: "transparent",
          borderRadius: "0.5rem",
          padding: "2rem",
          width: "100%",
          maxWidth: "420px",
        }}
      >
        <h2
          style={{
            marginBottom: "1.5rem",
            fontSize: "1.5rem",
            color: textColor,
            textAlign: "center",
          }}
        >
          Log In
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1.25rem" }}>
            <label
              htmlFor="login-username"
              style={{
                display: "block",
                marginBottom: "0.5rem",
                color: textColor,
                fontSize: "0.9rem",
                fontWeight: "500",
              }}
            >
              Username
            </label>
            <input
              id="login-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{
                width: "95%",
                padding: "0.6rem 0.75rem",
                border: "1px solid var(--border, #ccc)",
                borderRadius: "0.25rem",
                fontSize: "1rem",
                outline: "none",
              }}
            />
          </div>

          <div style={{ marginBottom: "1.25rem" }}>
            <label
              htmlFor="login-password"
              style={{
                display: "block",
                marginBottom: "0.5rem",
                color: textColor,
                fontSize: "0.9rem",
                fontWeight: "500",
              }}
            >
              Password
            </label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "95%",
                padding: "0.6rem 0.75rem",
                border: "1px solid var(--border, #ccc)",
                borderRadius: "0.25rem",
                fontSize: "1rem",
                outline: "none",
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "0.75rem",
              backgroundColor: "var(--primary, #2c3e50)",
              color: "#fff",
              border: "none",
              borderRadius: "0.25rem",
              fontSize: "1rem",
              fontWeight: "500",
              cursor: "pointer",
              transition: "background-color 0.2s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--primary-hover, #34495e)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--primary, #2c3e50)")
            }
          >
            Log In
          </button>

          {error && (
            <p
              style={{
                marginTop: "1rem",
                color: "var(--error, #c0392b)",
                fontSize: "0.9rem",
                textAlign: "center",
              }}
            >
              {error}
            </p>
          )}
        </form>

        <p style={{ marginTop: "1rem", textAlign: "center" }}>
          Don’t have an account?{" "}
          <Link
            to="/register"
            style={{ color: textColor, textDecoration: "underline" }}
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
