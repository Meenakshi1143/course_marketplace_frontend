import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";

import { enrollCourse } from "../features/enrollmentSlice";
import {
  FALLBACK_IMAGE,
  courseProgress,
  deleteCourse,
  formatDate,
  formatPrice,
  getCourseById,
  getMyEnrollments,
  imageUrl,
  isAdmin,
  setClassCompleted,
  updateCourse,
} from "../services/api";

// Turns a YouTube link into an embeddable player URL (other links open in a new tab)
const getEmbedUrl = (url = "") => {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/
  );
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
};

function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const admin = isAdmin();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  const [enrollment, setEnrollment] = useState(null);
  const [enrolling, setEnrolling] = useState(false);

  const [classForm, setClassForm] = useState({ title: "", url: "", duration: "" });
  const [savingClass, setSavingClass] = useState(false);
  const [classError, setClassError] = useState("");
  const [playingId, setPlayingId] = useState(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const data = await getCourseById(id);
        if (!active) return;

        // draft courses are hidden from normal users
        if (data.status === "draft" && !isAdmin()) {
          throw new Error("Course not available");
        }

        setCourse(data);

        if (!isAdmin()) {
          try {
            const list = await getMyEnrollments();
            if (active) {
              setEnrollment(
                list.find((item) => String(item.courseId) === String(id)) || null
              );
            }
          } catch (err) {
            console.error("Error loading enrollment:", err);
          }
        }
      } catch (err) {
        console.error("Error loading course:", err);
        if (active) setError("Course not found.");
      } finally {
        if (active) setLoading(false);
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [id]);

  const handleEnroll = async () => {
    try {
      setError("");
      setEnrolling(true);
      await dispatch(enrollCourse(course)).unwrap();
      const list = await getMyEnrollments();
      setEnrollment(list.find((item) => String(item.courseId) === String(id)) || null);
      setCourse({ ...course, students: Number(course.students || 0) + 1 });
    } catch (err) {
      console.error("Error enrolling:", err);
      setError("Could not enroll right now. Please try again.");
    } finally {
      setEnrolling(false);
    }
  };

  const handleToggleDone = async (classId) => {
    const done = ((enrollment && enrollment.completed) || []).includes(classId);

    try {
      const list = await setClassCompleted(id, classId, !done);
      setEnrollment(list.find((item) => String(item.courseId) === String(id)) || null);
    } catch (err) {
      console.error("Error updating progress:", err);
      setError("Could not save your progress. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this course? This cannot be undone.")) return;

    try {
      setDeleting(true);
      await deleteCourse(id);
      navigate("/admin/courses");
    } catch (err) {
      console.error("Error deleting course:", err);
      setError("Failed to delete the course. Please try again.");
      setDeleting(false);
    }
  };

  const saveClasses = async (nextClasses) => {
    const updated = { ...course, classes: nextClasses };
    await updateCourse(id, updated);
    setCourse(updated);
  };

  const handleClassChange = (e) => {
    setClassForm({ ...classForm, [e.target.name]: e.target.value });
  };

  const handleAddClass = async (e) => {
    e.preventDefault();
    setClassError("");

    const title = classForm.title.trim();
    const url = classForm.url.trim();

    if (!title) {
      setClassError("Please enter a class title.");
      return;
    }

    if (url && !/^https?:\/\//i.test(url)) {
      setClassError("The video link must start with http:// or https://");
      return;
    }

    try {
      setSavingClass(true);
      const newClass = {
        id: Date.now(),
        title,
        url,
        duration: classForm.duration.trim(),
      };
      await saveClasses([...(course.classes || []), newClass]);
      setClassForm({ title: "", url: "", duration: "" });
    } catch (err) {
      console.error("Error saving class:", err);
      setClassError("Could not save the class. Please try again.");
    } finally {
      setSavingClass(false);
    }
  };

  const handleDeleteClass = async (classId) => {
    if (!window.confirm("Remove this class?")) return;

    try {
      await saveClasses((course.classes || []).filter((item) => item.id !== classId));
      if (playingId === classId) setPlayingId(null);
    } catch (err) {
      console.error("Error removing class:", err);
      setClassError("Could not remove the class. Please try again.");
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

  const enrolled = Boolean(enrollment);
  const canWatch = admin || enrolled;
  const lessons = course.lessons || course.lectures;
  const classes = course.classes || [];
  const completed = (enrollment && enrollment.completed) || [];
  const progress = courseProgress(course, enrollment);
  const playing = classes.find((item) => item.id === playingId);
  const playingEmbed = playing ? getEmbedUrl(playing.url) : null;

  const learn = course.learn && course.learn.length ? course.learn : course.skills || [];
  const requirements = course.requirements || [];

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
    { label: "Last updated", value: formatDate(course.updatedAt) },
    { label: "Status", value: admin ? (course.status === "draft" ? "Draft" : "Published") : null },
  ].filter((fact) => fact.value);

  return (
    <div className="details-page">
      <Link to={admin ? "/admin/courses" : "/courses"} className="back-link">
        ← {admin ? "Back to manage courses" : "Back to courses"}
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
            <strong>★ {course.rating != null ? course.rating : "New"}</strong>
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

          {course.skills && course.skills.length > 0 && (
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
          </div>

          {!admin && enrolled && (
            <div className="progress-block">
              <div className="progress-top">
                <span>Your progress</span>
                <strong>{progress}%</strong>
              </div>
              <div className="progress-bar">
                <span style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          <div className="details-actions">
            {admin ? (
              <>
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
              </>
            ) : enrolled ? (
              <>
                <span className="enrolled-badge">✓ You are enrolled</span>
                <a href="#classes" className="primary-btn">
                  Go to classes
                </a>
              </>
            ) : (
              <button
                type="button"
                className="primary-btn"
                onClick={handleEnroll}
                disabled={enrolling}
              >
                {enrolling ? "Enrolling..." : `Enroll now · ${formatPrice(course.price)}`}
              </button>
            )}
          </div>
        </div>
      </div>

      {(learn.length > 0 || requirements.length > 0) && (
        <div className="info-grid">
          {learn.length > 0 && (
            <section className="info-card">
              <h2>What you'll learn</h2>
              <ul className="check-list">
                {learn.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          )}

          {requirements.length > 0 && (
            <section className="info-card">
              <h2>Requirements</h2>
              <ul className="dot-list">
                {requirements.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}

      <section className="classes-card" id="classes">
        <span className="section-label">CURRICULUM</span>
        <h2>Course classes ({classes.length})</h2>

        {playingEmbed && (
          <div className="class-player">
            <iframe
              src={playingEmbed}
              title={playing.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        {classes.length === 0 ? (
          <p className="classes-empty">
            {admin ? "No classes added yet. Add the first one below." : "Classes will be added soon."}
          </p>
        ) : (
          <ol className="class-list">
            {classes.map((item, index) => {
              const isDone = completed.includes(item.id);

              return (
                <li
                  key={item.id}
                  className={item.id === playingId ? "class-item playing" : "class-item"}
                >
                  {enrolled ? (
                    <button
                      type="button"
                      className={isDone ? "class-check done" : "class-check"}
                      onClick={() => handleToggleDone(item.id)}
                      aria-label={isDone ? "Mark as not done" : "Mark as done"}
                      title={isDone ? "Mark as not done" : "Mark as done"}
                    >
                      {isDone ? "✓" : index + 1}
                    </button>
                  ) : (
                    <span className="class-number">{index + 1}</span>
                  )}

                  <div className="class-info">
                    <strong>{item.title}</strong>
                    {item.duration && <span>🕒 {item.duration}</span>}
                  </div>

                  {!canWatch && item.url ? (
                    <span className="class-locked">🔒 Enroll to watch</span>
                  ) : getEmbedUrl(item.url) ? (
                    <button type="button" className="class-btn" onClick={() => setPlayingId(item.id)}>
                      ▶ Play
                    </button>
                  ) : (
                    item.url && (
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="class-btn">
                        Open ↗
                      </a>
                    )
                  )}

                  {admin && (
                    <button
                      type="button"
                      className="class-remove"
                      aria-label="Remove class"
                      onClick={() => handleDeleteClass(item.id)}
                    >
                      ✕
                    </button>
                  )}
                </li>
              );
            })}
          </ol>
        )}

        {admin && (
          <form className="class-form" onSubmit={handleAddClass}>
            <h3>Add a class</h3>

            {classError && <div className="error-message">{classError}</div>}

            <div className="class-form-grid">
              <input
                type="text"
                name="title"
                placeholder="Class title (e.g. Lesson 1: Introduction)"
                value={classForm.title}
                onChange={handleClassChange}
              />
              <input
                type="text"
                name="url"
                placeholder="Video link (YouTube, Drive, Vimeo...)"
                value={classForm.url}
                onChange={handleClassChange}
              />
              <input
                type="text"
                name="duration"
                placeholder="Duration (e.g. 12 min)"
                value={classForm.duration}
                onChange={handleClassChange}
              />
              <button type="submit" className="primary-btn" disabled={savingClass}>
                {savingClass ? "Adding..." : "+ Add class"}
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}

export default CourseDetails;