import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { SITE_NAME } from "../services/api";

function Navbar() {
  // useLocation makes the navbar re-check login state after every page change
  useLocation();

  const [open, setOpen] = useState(false);

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const userName = localStorage.getItem("userName") || "";

  const favoriteCount = useSelector(
    (state) => state.favorites?.items?.length || 0
  );

  const closeMenu = () => setOpen(false);

  const linkClass = ({ isActive }) =>
    isActive ? "nav-link active" : "nav-link";

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo" onClick={closeMenu}>
          <span className="logo-mark">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M22 10 12 5 2 10l10 5 10-5z" />
              <path d="M6 12v5c3 2 9 2 12 0v-5" />
              <path d="M22 10v6" />
            </svg>
          </span>
          {SITE_NAME}
        </Link>

        <button
          type="button"
          className="menu-toggle"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? "✕" : "☰"}
        </button>

        <nav className={open ? "nav-links open" : "nav-links"}>
          <NavLink to="/" end className={linkClass} onClick={closeMenu}>
            Home
          </NavLink>

          {isLoggedIn ? (
            <>
              <NavLink to="/courses" className={linkClass} onClick={closeMenu}>
                Courses
              </NavLink>

              <NavLink to="/add-course" className={linkClass} onClick={closeMenu}>
                Add Course
              </NavLink>

              <NavLink to="/favorites" className={linkClass} onClick={closeMenu}>
                Favorites
                {favoriteCount > 0 && (
                  <span className="nav-badge">{favoriteCount}</span>
                )}
              </NavLink>

              {userName && (
                <span className="nav-user">Hi, {userName.split(" ")[0]}</span>
              )}

              <Link to="/logout" className="nav-btn nav-logout" onClick={closeMenu}>
                Logout
              </Link>
            </>
          ) : (
            <>
              <NavLink to="/register" className={linkClass} onClick={closeMenu}>
                Register
              </NavLink>

              <Link to="/login" className="nav-btn nav-login" onClick={closeMenu}>
                Login
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;

