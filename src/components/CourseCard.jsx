import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { addFavorite, removeFavorite } from "../features/favoriteSlice";
import { FALLBACK_IMAGE, formatPrice, imageUrl } from "../services/api";

function CourseCard({ course }) {
  const dispatch = useDispatch();

  const favorites = useSelector((state) => state.favorites?.items || []);

  const isFavorite = favorites.some(
    (item) => String(item.id) === String(course.id)
  );

  const handleFavorite = () => {
    if (isFavorite) {
      dispatch(removeFavorite(course.id));
    } else {
      dispatch(addFavorite(course));
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

        <button
          type="button"
          className={`favorite-btn ${isFavorite ? "favorite-active" : ""}`}
          onClick={handleFavorite}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? "♥" : "♡"}
        </button>
      </div>

      <div className="course-content">
        <div className="course-meta">
          <span className="course-level">{course.level || "Beginner"}</span>
          <span className="course-rating">★ {course.rating ?? "New"}</span>
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
