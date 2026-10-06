// import { Navigate } from "react-router-dom";

// function ProtectedRoute({ children }) {

//     const isLoggedIn =
//         localStorage.getItem("isLoggedIn") === "true";

//     if (!isLoggedIn) {
//         return <Navigate to="/login" replace />;
//     }

//     return children;
// }

// export default ProtectedRoute;

import { Navigate } from "react-router-dom";

// adminOnly: only admins can open the page
// userOnly:  only normal users can open the page (admins are sent to the dashboard)
function ProtectedRoute({ children, adminOnly = false, userOnly = false }) {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const hasUserId = Boolean(localStorage.getItem("userId"));
  const isAdmin = localStorage.getItem("userRole") === "admin";

  // Older sessions without a user id must log in again
  if (!isLoggedIn || !hasUserId) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/courses" replace />;
  }

  if (userOnly && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}

export default ProtectedRoute;