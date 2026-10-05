import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { addFavorite, removeFavorite } from "../features/favoriteSlice";
import {
  FALLBACK_IMAGE,
  deleteCourse,
  formatPrice,
  getCourseById,
  imageUrl,
} from "../services/api";

function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  const favorites = useSelector((state) => state.favorites?.items || []);
  const isFavorite = favorites.some((item) => String(item.id) === String(id));

  useEffect(() => {
    let active = true;

    getCourseById(id)
      .then((data) => {
        if (active) setCourse(data);
      })
      .catch((err) => {
        console.error("Error loading course:", err);
        if (active) setError("Course not found.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  const handleFavorite = () => {
    if (isFavorite) {
      dispatch(removeFavorite(course.id));
    } else {
      dispatch(addFavorite(course));
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this course? This cannot be undone.")) return;

    try {
      setDeleting(true);
      await deleteCourse(id);
      dispatch(removeFavorite(id));
      navigate("/courses");
    } catch (err) {
      console.error("Error deleting course:", err);
      setError("Failed to delete the course. Please try again.");
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="details-page">
        <p className="state-message">Loading course...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="details-page">
        <div className="empty-state">
          <div className="empty-icon">🔎</div>
          <h2>{error || "Course not found"}</h2>
          <Link to="/courses" className="primary-btn">
            Back to courses
          </Link>
        </div>
      </div>
    );
  }

  const lessons = course.lessons || course.lectures;

  const facts = [
    { label: "Instructor", value: course.instructor },
    { label: "Level", value: course.level },
    { label: "Duration", value: course.duration },
    { label: "Lessons", value: lessons },
    { label: "Language", value: course.language },
    {
      label: "Students",
      value: course.students ? Number(course.students).toLocaleString("en-IN") : null,
    },
  ].filter((fact) => fact.value);

  return (
    <div className="details-page">
      <Link to="/courses" className="back-link">
        ← Back to courses
      </Link>

      {error && <div className="error-message">{error}</div>}

      <div className="course-details-card">
        <img
          src={imageUrl(course.image, 1200)}
          alt={course.title}
          className="course-details-image"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = FALLBACK_IMAGE;
          }}
        />

        <div className="course-details-content">
          <span className="course-category static">{course.category || "General"}</span>

          <h1>{course.title}</h1>

          <div className="details-rating">
            <strong>★ {course.rating ?? "New"}</strong>
            {course.students > 0 && (
              <span>{Number(course.students).toLocaleString("en-IN")} learners</span>
            )}
          </div>

          <p className="course-description full">{course.description}</p>

          <div className="details-facts">
            {facts.map((fact) => (
              <div key={fact.label}>
                <span>{fact.label}</span>
                <strong>{fact.value}</strong>
              </div>
            ))}
          </div>

          {course.skills?.length > 0 && (
            <div className="skills-block">
              <h3>Skills you will gain</h3>
              <div className="skills">
                {course.skills.map((skill) => (
                  <span key={skill} className="skill-chip">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="price-box">
            <div>
              <span>Course price</span>
              <h2>{formatPrice(course.price)}</h2>
            </div>

            <button
              type="button"
              className={`save-btn ${isFavorite ? "saved" : ""}`}
              onClick={handleFavorite}
            >
              {isFavorite ? "♥ Saved to favorites" : "♡ Save to favorites"}
            </button>
          </div>

          <div className="details-actions">
            <Link to={`/edit-course/${course.id}`} className="secondary-btn">
              ✏️ Edit course
            </Link>

            <button
              type="button"
              className="danger-btn"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "🗑 Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDetails;
