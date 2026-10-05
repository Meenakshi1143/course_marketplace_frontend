import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function Profile() {
  const name = localStorage.getItem("userName") || "Learner";
  const email = localStorage.getItem("userEmail") || "";

  const favorites = useSelector((state) => state.favorites?.items || []);

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
              <strong>{favorites.length}</strong>
              <span>Saved courses</span>
            </div>
            <div className="profile-stat">
              <strong>Learner</strong>
              <span>Account type</span>
            </div>
          </div>

          {favorites.length > 0 && (
            <div className="profile-saved">
              <h3>Recently saved</h3>
              {favorites.slice(0, 3).map((course) => (
                <Link key={course.id} to={`/courses/${course.id}`}>
                  <span>{course.title}</span>
                  <span>→</span>
                </Link>
              ))}
            </div>
          )}

          <div className="profile-actions">
            <Link to="/favorites" className="primary-btn">
              View favorites
            </Link>
            <Link to="/courses" className="secondary-btn">
              Browse courses
            </Link>
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