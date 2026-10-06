import { useEffect, useMemo, useState } from "react";

import {
  courseProgress,
  deleteUser,
  formatDate,
  getCourses,
  getUserId,
  getUsers,
  updateUser,
} from "../services/api";

function AdminUsers() {
  const myId = getUserId();

  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    let active = true;

    Promise.all([getUsers(), getCourses()])
      .then(([userData, courseData]) => {
        if (!active) return;
        setUsers(userData);
        setCourses(courseData);
      })
      .catch((err) => {
        console.error("Error loading users:", err);
        if (active) setError("Unable to load users. Please try again.");
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
    return users.filter(
      (user) =>
        !term || `${user.name || ""} ${user.email || ""}`.toLowerCase().includes(term)
    );
  }, [users, search]);

  const handleToggleRole = async (user) => {
    const next = user.role === "admin" ? "user" : "admin";
    const message =
      next === "admin"
        ? `Make ${user.name || user.email} an admin?`
        : `Remove admin access from ${user.name || user.email}?`;

    if (!window.confirm(message)) return;

    try {
      setError("");
      await updateUser(user.id, { role: next });
      setUsers(users.map((item) => (item.id === user.id ? { ...item, role: next } : item)));
    } catch (err) {
      console.error("Error updating role:", err);
      setError("Could not change the role. Please try again.");
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Delete ${user.name || user.email}? This cannot be undone.`)) return;

    try {
      setError("");
      await deleteUser(user.id);
      setUsers(users.filter((item) => item.id !== user.id));
    } catch (err) {
      console.error("Error deleting user:", err);
      setError("Could not delete the user. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <p className="state-message">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="courses-header">
        <div>
          <span className="section-label">ADMIN</span>
          <h1>Users</h1>
          <p>{users.length} accounts. Open a row to see what a user is learning.</p>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="admin-toolbar single">
        <input
          type="text"
          className="course-search"
          placeholder="🔍 Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="admin-card no-pad">
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Enrolled</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => {
                const isMe = String(user.id) === String(myId);
                const enrollments = user.enrollments || [];
                const isOpen = openId === user.id;

                return [
                  <tr key={user.id}>
                    <td>
                      <div className="table-user">
                        <span className="nav-avatar">
                          {(user.name || user.email || "U").charAt(0).toUpperCase()}
                        </span>
                        <div>
                          <strong>
                            {user.name || "No name"} {isMe && <em>(you)</em>}
                          </strong>
                          <span>{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={user.role === "admin" ? "badge admin" : "badge live"}>
                        {user.role === "admin" ? "Admin" : "User"}
                      </span>
                    </td>
                    <td>{enrollments.length}</td>
                    <td>
                      <div className="row-actions">
                        <button
                          type="button"
                          className="row-btn"
                          onClick={() => setOpenId(isOpen ? null : user.id)}
                        >
                          {isOpen ? "Hide" : "View"}
                        </button>
                        {!isMe && (
                          <>
                            <button type="button" className="row-btn" onClick={() => handleToggleRole(user)}>
                              {user.role === "admin" ? "Remove admin" : "Make admin"}
                            </button>
                            <button type="button" className="row-btn danger" onClick={() => handleDelete(user)}>
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>,
                  isOpen && (
                    <tr key={`${user.id}-details`} className="detail-row">
                      <td colSpan={4}>
                        {enrollments.length === 0 ? (
                          <p className="muted-text">This user has not enrolled in any course yet.</p>
                        ) : (
                          <ul className="enrolled-list">
                            {enrollments.map((item) => {
                              const course = courses.find(
                                (c) => String(c.id) === String(item.courseId)
                              );
                              return (
                                <li key={item.courseId}>
                                  <strong>{course ? course.title : "Deleted course"}</strong>
                                  <span>
                                    Enrolled {formatDate(item.enrolledAt)} ·{" "}
                                    {course ? `${courseProgress(course, item)}% complete` : "—"}
                                  </span>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </td>
                    </tr>
                  ),
                ];
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && <p className="table-empty">No users match your search.</p>}
      </div>
    </div>
  );
}

export default AdminUsers;