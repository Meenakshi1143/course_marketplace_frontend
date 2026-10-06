import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Courses from "../pages/Courses";
import CourseDetails from "../pages/CourseDetails";
import AddCourse from "../pages/AddCourse";
import EditCourse from "../pages/EditCourse";
import MyCourses from "../pages/MyCourses";
import Profile from "../pages/Profile";
import AdminDashboard from "../pages/AdminDashboard";
import AdminCourses from "../pages/AdminCourses";
import AdminUsers from "../pages/AdminUsers";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Logout from "../pages/Logout";

import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/logout" element={<Logout />} />

      {/* Any logged-in person */}
      <Route
        path="/courses"
        element={
          <ProtectedRoute>
            <Courses />
          </ProtectedRoute>
        }
      />
      <Route
        path="/courses/:id"
        element={
          <ProtectedRoute>
            <CourseDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Normal users only */}
      <Route
        path="/my-courses"
        element={
          <ProtectedRoute userOnly>
            <MyCourses />
          </ProtectedRoute>
        }
      />

      {/* Admin only */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/courses"
        element={
          <ProtectedRoute adminOnly>
            <AdminCourses />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute adminOnly>
            <AdminUsers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/add-course"
        element={
          <ProtectedRoute adminOnly>
            <AddCourse />
          </ProtectedRoute>
        }
      />
      <Route
        path="/edit-course/:id"
        element={
          <ProtectedRoute adminOnly>
            <EditCourse />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Home />} />
    </Routes>
  );
}

export default AppRoutes;