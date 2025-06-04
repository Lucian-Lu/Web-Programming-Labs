import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("VISITOR");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Read theme so text color matches
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
      const res = await fetch("http://localhost:8000/api/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
          role,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || JSON.stringify(data));
      }
      navigate("/login");
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
        backgroundColor: "transparent", // transparent to show underlying theme
      }}
    >
      <div
        style={{
          background: "transparent", // remove white card
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
          Register
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1.25rem" }}>
            <label
              htmlFor="reg-username"
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
              id="reg-username"
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
              htmlFor="reg-password"
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
              id="reg-password"
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

          <div style={{ marginBottom: "1.25rem" }}>
            <label
              htmlFor="reg-role"
              style={{
                display: "block",
                marginBottom: "0.5rem",
                color: textColor,
                fontSize: "0.9rem",
                fontWeight: "500",
              }}
            >
              Role
            </label>
            <select
              id="reg-role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{
                width: "100%",
                padding: "0.6rem 0.75rem",
                border: "1px solid var(--border, #ccc)",
                borderRadius: "0.25rem",
                fontSize: "1rem",
                outline: "none",
                backgroundColor: "var(--background, transparent)",
                color: textColor,
              }}
            >
              <option value="VISITOR">VISITOR (read-only)</option>
              <option value="WRITER">WRITER (read + write)</option>
              <option value="ADMIN">ADMIN (all permissions)</option>
            </select>
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
            Register
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
          Already have an account?{" "}
          <Link
            to="/login"
            style={{
              color: textColor,
              textDecoration: "underline",
            }}
          >
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
}
