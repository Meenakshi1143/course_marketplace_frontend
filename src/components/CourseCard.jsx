import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { enrollCourse } from "../features/enrollmentSlice";
import { FALLBACK_IMAGE, formatPrice, imageUrl, isAdmin } from "../services/api";

function CourseCard({ course }) {
  const dispatch = useDispatch();

  const enrolledIds = useSelector((state) => state.enrollments.ids);

  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState("");

  const admin = isAdmin();
  const enrolled = enrolledIds.includes(String(course.id));

  const handleEnroll = async () => {
    try {
      setError("");
      setEnrolling(true);
      await dispatch(enrollCourse(course)).unwrap();
    } catch (err) {
      console.error("Error enrolling:", err);
      setError("Could not enroll. Please try again.");
    } finally {
      setEnrolling(false);
    }
  };

  return (
    <article className="course-card">
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

        <span className="course-category">
          {course.category || "General"}
        </span>

        {course.status === "draft" && <span className="draft-tag">Draft</span>}
      </div>

      <div className="course-content">
        <div className="course-meta">
          <span className="course-level">{course.level || "Beginner"}</span>
          <span className="course-rating">★ {course.rating != null ? course.rating : "New"}</span>
        </div>

        <h3 className="course-title">{course.title}</h3>

        <p className="course-description">{course.description}</p>

        <p className="course-instructor">By {course.instructor || "Expert Instructor"}</p>

        <div className="course-info">
          {course.duration && <span>🕒 {course.duration}</span>}
          {(course.lessons || course.lectures) && (
            <span>📖 {course.lessons || course.lectures} lessons</span>
          )}
        </div>

        {!admin &&
          (enrolled ? (
            <Link to={`/courses/${course.id}`} className="card-enrolled">
              ✓ Enrolled · Continue
            </Link>
          ) : (
            <button
              type="button"
              className="card-enroll-btn"
              onClick={handleEnroll}
              disabled={enrolling}
            >
              {enrolling ? "Enrolling..." : "Enroll now"}
            </button>
          ))}

        {error && <p className="card-error">{error}</p>}

        <div className="course-bottom">
          <span className="course-price">{formatPrice(course.price)}</span>

          <Link to={`/courses/${course.id}`} className="view-course-btn">
            View course →
          </Link>
        </div>
      </div>
    </article>
  );
}

export default CourseCard;