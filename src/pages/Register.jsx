// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";

// import { SITE_NAME, createUser, findUserByEmail } from "../services/api";

// function Register() {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });

//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage("");
//     setError("");

//     const name = formData.name.trim();
//     const email = formData.email.trim().toLowerCase();

//     if (!name || !email || !formData.password || !formData.confirmPassword) {
//       setError("Please fill all the fields.");
//       return;
//     }

//     if (formData.password.length < 6) {
//       setError("Password must be at least 6 characters.");
//       return;
//     }

//     if (formData.password !== formData.confirmPassword) {
//       setError("Passwords do not match.");
//       return;
//     }

//     try {
//       setLoading(true);

//       const existing = await findUserByEmail(email);

//       if (existing) {
//         setError("An account with this email already exists. Please login.");
//         return;
//       }

//       await createUser({ name, email, password: formData.password });

//       setMessage("Registration successful! Redirecting to login...");

//       setFormData({ name: "", email: "", password: "", confirmPassword: "" });

//       setTimeout(() => navigate("/login"), 1200);
//     } catch (err) {
//       console.error("Register error:", err);
//       setError("Cannot reach the server. Please start json-server and try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="auth-page">
//       <div className="auth-card">
//         <div className="auth-icon">🎓</div>

//         <h1>Create your account</h1>

//         <p className="auth-subtitle">
//           Start your learning journey with {SITE_NAME}.
//         </p>

//         {message && <div className="success-message">{message}</div>}
//         {error && <div className="error-message">{error}</div>}

//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label htmlFor="name">Full name</label>
//             <input
//               id="name"
//               type="text"
//               name="name"
//               placeholder="Enter your name"
//               value={formData.name}
//               onChange={handleChange}
//               autoComplete="name"
//             />
//           </div>

//           <div className="form-group">
//             <label htmlFor="email">Email</label>
//             <input
//               id="email"
//               type="email"
//               name="email"
//               placeholder="you@example.com"
//               value={formData.email}
//               onChange={handleChange}
//               autoComplete="email"
//             />
//           </div>

//           <div className="form-group">
//             <label htmlFor="password">Password</label>
//             <input
//               id="password"
//               type="password"
//               name="password"
//               placeholder="At least 6 characters"
//               value={formData.password}
//               onChange={handleChange}
//               autoComplete="new-password"
//             />
//           </div>

//           <div className="form-group">
//             <label htmlFor="confirmPassword">Confirm password</label>
//             <input
//               id="confirmPassword"
//               type="password"
//               name="confirmPassword"
//               placeholder="Re-enter your password"
//               value={formData.confirmPassword}
//               onChange={handleChange}
//               autoComplete="new-password"
//             />
//           </div>

//           <button type="submit" className="auth-button" disabled={loading}>
//             {loading ? "Creating account..." : "Register"}
//           </button>
//         </form>

//         <div className="auth-footer">
//           <p>Already have an account?</p>
//           <Link to="/login" className="auth-link">
//             Login here
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Register;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { SITE_NAME, createUser, findUserByEmail } from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();

    if (!name || !email || !formData.password || !formData.confirmPassword) {
      setError("Please fill all the fields.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const existing = await findUserByEmail(email);

      if (existing) {
        setError("An account with this email already exists. Please login.");
        return;
      }

      await createUser({
        name,
        email,
        password: formData.password,
        role: "user",
        enrollments: [],
      });

      setMessage("Registration successful! Redirecting to login...");

      setFormData({ name: "", email: "", password: "", confirmPassword: "" });

      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      console.error("Register error:", err);
      setError("Cannot reach the server. Please start json-server and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-icon">🎓</div>

        <h1>Create your account</h1>

        <p className="auth-subtitle">
          Start your learning journey with {SITE_NAME}.
        </p>

        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full name</label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              autoComplete="name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm password</label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
            />
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account?</p>
          <Link to="/login" className="auth-link">
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;