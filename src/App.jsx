import { Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";
import { SITE_NAME } from "./services/api";
import "./App.css";

function App() {
  return (
    <div className="app">
      <Navbar />

      <main className="app-main">
        <AppRoutes />
      </main>

      <footer className="footer">
        <div className="footer-container">
          <div>
            <Link to="/" className="logo">
              <span className="logo-mark">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M22 10 12 5 2 10l10 5 10-5z" />
              <path d="M6 12v5c3 2 9 2 12 0v-5" />
              <path d="M22 10v6" />
            </svg>
          </span>
              {SITE_NAME}
            </Link>
            <p>Discover, save and share courses that move your career forward.</p>
          </div>
          <p className="footer-copy">
            © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;