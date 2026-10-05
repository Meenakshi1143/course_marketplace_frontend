import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { clearFavorites } from "../features/favoriteSlice";
import CourseCard from "../components/CourseCard";

function Favorites() {
  const dispatch = useDispatch();

  const favorites = useSelector((state) => state.favorites?.items || []);

  const handleClear = () => {
    if (window.confirm("Remove all courses from your favorites?")) {
      dispatch(clearFavorites());
    }
  };

  return (
    <div className="favorites-page">
      <div className="favorites-header">
        <div>
          <span className="section-label">YOUR LEARNING LIST</span>
          <h1>Favorite courses</h1>
          <p>
            {favorites.length > 0
              ? `You have saved ${favorites.length} ${
                  favorites.length === 1 ? "course" : "courses"
                }.`
              : "Keep the courses you like in one place."}
          </p>
        </div>

        {favorites.length > 0 && (
          <button type="button" className="clear-favorites-btn" onClick={handleClear}>
            Clear all
          </button>
        )}
      </div>

      {favorites.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">♡</div>
          <h2>No favorite courses yet</h2>
          <p>Tap the heart on any course to save it here for later.</p>
          <Link to="/courses" className="primary-btn">
            Browse courses
          </Link>
        </div>
      ) : (
        <div className="courses-grid">
          {favorites.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;
