import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  DEFAULT_ADMIN,
  SITE_NAME,
  ensureDefaultAdmin,
  findUserByEmail,
  saveSession,
} from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [role, setRole] = useState("user"); // "user" or "admin"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const switchRole = (nextRole) => {
    setRole(nextRole);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      // Makes sure the admin account exists the first time admin login is used
      if (role === "admin") {
        await ensureDefaultAdmin();
      }

      const user = await findUserByEmail(email.trim().toLowerCase());

      if (!user) {
        setError(
          role === "admin"
            ? "No admin account found with this email."
            : "No account found with this email. Please register first."
        );
        return;
      }

      if (user.password !== password) {
        setError("Incorrect password. Please try again.");
        return;
      }

      const accountRole = user.role === "admin" ? "admin" : "user";

      if (role === "user" && accountRole === "admin") {
        setError("This is an admin account. Please use the Admin tab to log in.");
        return;
      }

      if (role === "admin" && accountRole !== "admin") {
        setError("This account does not have admin access.");
        return;
      }

      saveSession(user);

      navigate(accountRole === "admin" ? "/admin" : "/courses");
    } catch (err) {
      console.error("Login error:", err);
      setError("Cannot reach the server. Please check the backend and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-icon">{role === "admin" ? "🛠️" : "🔐"}</div>

        <h1>Welcome back</h1>

        <p className="auth-subtitle">
          {role === "admin"
            ? `Log in to manage ${SITE_NAME}.`
            : `Log in to continue learning on ${SITE_NAME}.`}
        </p>

        <div className="role-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={role === "user"}
            className={role === "user" ? "role-tab active" : "role-tab"}
            onClick={() => switchRole("user")}
          >
            🎓 User
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={role === "admin"}
            className={role === "admin" ? "role-tab active" : "role-tab"}
            onClick={() => switchRole("admin")}
          >
            🛠️ Admin
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder={role === "admin" ? DEFAULT_ADMIN.email : "you@example.com"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Logging in..." : role === "admin" ? "Login as admin" : "Login"}
          </button>
        </form>

        {role === "admin" ? (
          <div className="auth-hint">
            Demo admin: <strong>{DEFAULT_ADMIN.email}</strong> /{" "}
            <strong>{DEFAULT_ADMIN.password}</strong>
          </div>
        ) : (
          <div className="auth-footer">
            <p>Don't have an account?</p>
            <Link to="/register" className="auth-link">
              Create an account
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;