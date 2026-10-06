import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  courseProgress,
  getCourses,
  getMyEnrollments,
  isAdmin,
} from "../services/api";

function Profile() {
  const name = localStorage.getItem("userName") || "Learner";
  const email = localStorage.getItem("userEmail") || "";
  const admin = isAdmin();

  const [items, setItems] = useState([]);

  useEffect(() => {
    if (admin) return undefined;

    let active = true;

    Promise.all([getMyEnrollments(), getCourses()])
      .then(([enrollments, courses]) => {
        if (!active) return;

        const list = enrollments
          .map((enrollment) => {
            const course = courses.find(
              (item) => String(item.id) === String(enrollment.courseId)
            );
            return course
              ? { course, progress: courseProgress(course, enrollment) }
              : null;
          })
          .filter(Boolean);

        setItems(list);
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [admin]);

  const completed = items.filter((item) => item.progress === 100).length;

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-cover" />

        <div className="profile-body">
          <div className="profile-avatar">{name.charAt(0).toUpperCase()}</div>

          <h1>{name}</h1>
          <p className="profile-email">{email}</p>

          <div className="profile-stats">
            <div className="profile-stat">
              <strong>{admin ? "Admin" : "Learner"}</strong>
              <span>Account type</span>
            </div>
            {!admin && (
              <>
                <div className="profile-stat">
                  <strong>{items.length}</strong>
                  <span>Enrolled courses</span>
                </div>
                <div className="profile-stat">
                  <strong>{completed}</strong>
                  <span>Completed</span>
                </div>
              </>
            )}
          </div>

          {!admin && (
            <div className="profile-learning">
              <h3>My enrolled courses</h3>

              {items.length === 0 ? (
                <p className="muted-text">
                  You have not enrolled in any course yet.{" "}
                  <Link to="/courses" className="auth-link">
                    Browse courses
                  </Link>
                </p>
              ) : (
                items.map(({ course, progress }) => (
                  <Link key={course.id} to={`/courses/${course.id}`} className="learning-item">
                    <div className="learning-top">
                      <span>{course.title}</span>
                      <strong>{progress}%</strong>
                    </div>
                    <div className="progress-bar">
                      <span style={{ width: `${progress}%` }} />
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}

          <div className="profile-actions">
            {admin ? (
              <>
                <Link to="/admin" className="primary-btn">
                  Open dashboard
                </Link>
                <Link to="/admin/courses" className="secondary-btn">
                  Manage courses
                </Link>
              </>
            ) : (
              <>
                <Link to="/my-courses" className="primary-btn">
                  Go to My Courses
                </Link>
                <Link to="/courses" className="secondary-btn">
                  Browse courses
                </Link>
              </>
            )}
            <Link to="/logout" className="danger-btn">
              Logout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;