import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { formatDate, formatPrice, getCourses, getUsers } from "../services/api";

function AdminDashboard() {
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    Promise.all([getCourses(), getUsers()])
      .then(([courseData, userData]) => {
        if (!active) return;
        setCourses(courseData);
        setUsers(userData);
      })
      .catch((err) => {
        console.error("Error loading dashboard:", err);
        if (active) setError("Unable to load dashboard data. Please try again.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const stats = useMemo(() => {
    const learners = users.filter((user) => user.role !== "admin");

    const enrollments = users.flatMap((user) =>
      (user.enrollments || []).map((item) => ({
        ...item,
        userName: user.name || user.email,
        courseTitle:
          (courses.find((course) => String(course.id) === String(item.courseId)) || {}).title ||
          "Deleted course",
      }))
    );

    const revenue = enrollments.reduce((sum, item) => sum + Number(item.price || 0), 0);
    const drafts = courses.filter((course) => course.status === "draft").length;

    const categoryCount = courses.reduce((acc, course) => {
      const key = course.category || "Other";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    const categories = Object.entries(categoryCount).sort((a, b) => b[1] - a[1]);

    const topCourses = [...courses]
      .sort((a, b) => Number(b.students || 0) - Number(a.students || 0))
      .slice(0, 5);

    const recent = [...enrollments]
      .sort((a, b) => new Date(b.enrolledAt) - new Date(a.enrolledAt))
      .slice(0, 6);

    return {
      learners: learners.length,
      enrollments: enrollments.length,
      revenue,
      drafts,
      published: courses.length - drafts,
      categories,
      topCourses,
      recent,
    };
  }, [courses, users]);

  if (loading) {
    return (
      <div className="admin-page">
        <p className="state-message">Loading dashboard...</p>
      </div>
    );
  }

  const maxCategory = stats.categories[0] ? stats.categories[0][1] : 1;

  return (
    <div className="admin-page">
      <div className="courses-header">
        <div>
          <span className="section-label">ADMIN</span>
          <h1>Dashboard</h1>
          <p>Overview of courses, learners and enrollments.</p>
        </div>

        <Link to="/add-course" className="primary-btn">
          + Add course
        </Link>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="stat-grid">
        <div className="stat-card">
          <span className="stat-icon">📚</span>
          <strong>{courses.length}</strong>
          <span>Total courses</span>
          <small>
            {stats.published} published · {stats.drafts} draft
          </small>
        </div>
        <div className="stat-card">
          <span className="stat-icon">👥</span>
          <strong>{stats.learners}</strong>
          <span>Learners</span>
          <small>registered users</small>
        </div>
        <div className="stat-card">
          <span className="stat-icon">🎓</span>
          <strong>{stats.enrollments}</strong>
          <span>Enrollments</span>
          <small>across all courses</small>
        </div>
        <div className="stat-card">
          <span className="stat-icon">💰</span>
          <strong>{formatPrice(stats.revenue)}</strong>
          <span>Revenue</span>
          <small>from enrollments</small>
        </div>
      </div>

      <div className="admin-grid">
        <section className="admin-card">
          <h2>Courses by category</h2>
          {stats.categories.length === 0 ? (
            <p className="muted-text">No courses yet.</p>
          ) : (
            <ul className="bar-list">
              {stats.categories.map(([name, count]) => (
                <li key={name}>
                  <div className="bar-label">
                    <span>{name}</span>
                    <strong>{count}</strong>
                  </div>
                  <div className="bar-track">
                    <span style={{ width: `${(count / maxCategory) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="admin-card">
          <h2>Top courses</h2>
          <ol className="rank-list">
            {stats.topCourses.map((course) => (
              <li key={course.id}>
                <Link to={`/courses/${course.id}`}>{course.title}</Link>
                <span>{Number(course.students || 0).toLocaleString("en-IN")} students</span>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <section className="admin-card">
        <div className="admin-card-head">
          <h2>Recent enrollments</h2>
          <Link to="/admin/users" className="view-all">
            All users →
          </Link>
        </div>

        {stats.recent.length === 0 ? (
          <p className="muted-text">No enrollments yet. They will show up here.</p>
        ) : (
          <div className="table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Learner</th>
                  <th>Course</th>
                  <th>Date</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent.map((item) => (
                  <tr key={`${item.userName}-${item.courseId}-${item.enrolledAt}`}>
                    <td>{item.userName}</td>
                    <td>{item.courseTitle}</td>
                    <td>{formatDate(item.enrolledAt)}</td>
                    <td>{formatPrice(item.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default AdminDashboard;