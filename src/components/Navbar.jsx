import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchEnrollments } from "../features/enrollmentSlice";
import { SITE_NAME } from "../services/api";

function Navbar() {
  // useLocation makes the navbar re-check login state after every page change
  useLocation();

  const [open, setOpen] = useState(false);

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const isAdminUser = localStorage.getItem("userRole") === "admin";
  const userName = localStorage.getItem("userName") || "";

  const dispatch = useDispatch();
  const enrolledCount = useSelector((state) => state.enrollments.ids.length);
  const loaded = useSelector((state) => state.enrollments.loaded);

  // load the user's enrollments once after login / page refresh
  useEffect(() => {
    if (isLoggedIn && !isAdminUser && !loaded) {
      dispatch(fetchEnrollments());
    }
  }, [isLoggedIn, isAdminUser, loaded, dispatch]);

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

              {isAdminUser ? (
                <>
                  <NavLink to="/admin" end className={linkClass} onClick={closeMenu}>
                    Dashboard
                  </NavLink>
                  <NavLink to="/admin/courses" className={linkClass} onClick={closeMenu}>
                    Manage Courses
                  </NavLink>
                  <NavLink to="/admin/users" className={linkClass} onClick={closeMenu}>
                    Users
                  </NavLink>
                </>
              ) : (
                <>
                  <NavLink to="/my-courses" className={linkClass} onClick={closeMenu}>
                    My Courses
                    {enrolledCount > 0 && <span className="nav-badge">{enrolledCount}</span>}
                  </NavLink>
                </>
              )}

              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  isActive ? "nav-profile active" : "nav-profile"
                }
                onClick={closeMenu}
              >
                <span className="nav-avatar">
                  {(userName || "U").charAt(0).toUpperCase()}
                </span>
                {isAdminUser ? "Admin" : userName ? userName.split(" ")[0] : "Profile"}
              </NavLink>

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