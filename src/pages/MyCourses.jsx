import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  FALLBACK_IMAGE,
  courseProgress,
  formatDate,
  getCourses,
  getMyEnrollments,
  imageUrl,
} from "../services/api";

function MyCourses() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    Promise.all([getMyEnrollments(), getCourses()])
      .then(([enrollments, courses]) => {
        if (!active) return;

        const list = enrollments
          .map((enrollment) => {
            const course = courses.find(
              (item) => String(item.id) === String(enrollment.courseId)
            );
            return course ? { enrollment, course } : null;
          })
          .filter(Boolean)
          .sort((a, b) => new Date(b.enrollment.enrolledAt) - new Date(a.enrollment.enrolledAt));

        setItems(list);
      })
      .catch((err) => {
        console.error("Error loading my courses:", err);
        if (active) setError("Unable to load your courses. Please try again.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="favorites-page">
        <p className="state-message">Loading your courses...</p>
      </div>
    );
  }

  const withProgress = items.map((item) => ({
    ...item,
    progress: courseProgress(item.course, item.enrollment),
  }));
  const finished = withProgress.filter((item) => item.progress === 100).length;

  return (
    <div className="favorites-page">
      <div className="favorites-header">
        <div>
          <span className="section-label">MY LEARNING</span>
          <h1>My courses</h1>
          <p>
            {items.length > 0
              ? "Pick up where you left off."
              : "Courses you enroll in will appear here."}
          </p>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {items.length > 0 && (
        <div className="mini-stats">
          <div>
            <strong>{items.length}</strong>
            <span>Enrolled</span>
          </div>
          <div>
            <strong>{items.length - finished}</strong>
            <span>In progress</span>
          </div>
          <div>
            <strong>{finished}</strong>
            <span>Completed</span>
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎓</div>
          <h2>You have not enrolled yet</h2>
          <p>Open any course and press Enroll to start learning.</p>
          <Link to="/courses" className="primary-btn">
            Browse courses
          </Link>
        </div>
      ) : (
        <div className="courses-grid">
          {withProgress.map(({ course, enrollment, progress }) => (
            <article className="course-card" key={course.id}>
              <div className="course-image-wrapper">
                <img
                  src={imageUrl(course.image)}
                  alt={course.title}
                  className="course-image"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = FALLBACK_IMAGE;
                  }}
                />
                <span className="course-category">{course.category || "General"}</span>
              </div>

              <div className="course-content">
                <h3 className="course-title">{course.title}</h3>
                <p className="course-instructor">By {course.instructor || "Expert Instructor"}</p>

                <div className="progress-block compact">
                  <div className="progress-top">
                    <span>{progress === 100 ? "Completed" : "Progress"}</span>
                    <strong>{progress}%</strong>
                  </div>
                  <div className="progress-bar">
                    <span style={{ width: `${progress}%` }} />
                  </div>
                </div>

                <div className="course-bottom">
                  <span className="course-info">Enrolled {formatDate(enrollment.enrolledAt)}</span>
                  <Link to={`/courses/${course.id}`} className="view-course-btn">
                    {progress > 0 ? "Continue →" : "Start →"}
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyCourses;