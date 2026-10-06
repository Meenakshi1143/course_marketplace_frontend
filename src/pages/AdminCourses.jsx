import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  FALLBACK_IMAGE,
  deleteCourse,
  formatPrice,
  getCourses,
  imageUrl,
  patchCourse,
} from "../services/api";

function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  useEffect(() => {
    let active = true;

    getCourses()
      .then((data) => {
        if (active) setCourses(data);
      })
      .catch((err) => {
        console.error("Error loading courses:", err);
        if (active) setError("Unable to load courses. Please try again.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return courses.filter((course) => {
      const matchesText =
        !term ||
        [course.title, course.instructor, course.category]
          .join(" ")
          .toLowerCase()
          .includes(term);

      const isDraft = course.status === "draft";
      const matchesStatus =
        status === "all" || (status === "draft" ? isDraft : !isDraft);

      return matchesText && matchesStatus;
    });
  }, [courses, search, status]);

  const handleToggleStatus = async (course) => {
    const next = course.status === "draft" ? "published" : "draft";

    try {
      setError("");
      await patchCourse(course.id, { status: next });
      setCourses(courses.map((item) => (item.id === course.id ? { ...item, status: next } : item)));
    } catch (err) {
      console.error("Error updating status:", err);
      setError("Could not change the course status. Please try again.");
    }
  };

  const handleDelete = async (course) => {
    if (!window.confirm(`Delete "${course.title}"? This cannot be undone.`)) return;

    try {
      setError("");
      await deleteCourse(course.id);
      setCourses(courses.filter((item) => item.id !== course.id));
    } catch (err) {
      console.error("Error deleting course:", err);
      setError("Could not delete the course. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <p className="state-message">Loading courses...</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="courses-header">
        <div>
          <span className="section-label">ADMIN</span>
          <h1>Manage courses</h1>
          <p>{courses.length} courses in total.</p>
        </div>

        <Link to="/add-course" className="primary-btn">
          + Add course
        </Link>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="admin-toolbar">
        <input
          type="text"
          className="course-search"
          placeholder="🔍 Search by title, instructor or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="course-select"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          aria-label="Status"
        >
          <option value="all">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      <div className="admin-card no-pad">
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Course</th>
                <th>Category</th>
                <th>Price</th>
                <th>Students</th>
                <th>Classes</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((course) => (
                <tr key={course.id}>
                  <td>
                    <div className="table-course">
                      <img
                        src={imageUrl(course.image, 160)}
                        alt=""
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = FALLBACK_IMAGE;
                        }}
                      />
                      <div>
                        <strong>{course.title}</strong>
                        <span>{course.instructor}</span>
                      </div>
                    </div>
                  </td>
                  <td>{course.category}</td>
                  <td>{formatPrice(course.price)}</td>
                  <td>{Number(course.students || 0).toLocaleString("en-IN")}</td>
                  <td>{(course.classes || []).length}</td>
                  <td>
                    <span className={course.status === "draft" ? "badge draft" : "badge live"}>
                      {course.status === "draft" ? "Draft" : "Published"}
                    </span>
                  </td>
                  <td>
                    <div className="row-actions">
                      <Link to={`/courses/${course.id}`} className="row-btn">
                        View / classes
                      </Link>
                      <Link to={`/edit-course/${course.id}`} className="row-btn">
                        Edit
                      </Link>
                      <button type="button" className="row-btn" onClick={() => handleToggleStatus(course)}>
                        {course.status === "draft" ? "Publish" : "Unpublish"}
                      </button>
                      <button type="button" className="row-btn danger" onClick={() => handleDelete(course)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && <p className="table-empty">No courses match your search.</p>}
      </div>
    </div>
  );
}

export default AdminCourses;