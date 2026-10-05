import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import CourseCard from "../components/CourseCard";
import { LEVELS, getCourses } from "../services/api";

const SORT_OPTIONS = [
  { value: "rating", label: "Top rated" },
  { value: "popular", label: "Most popular" },
  { value: "price-low", label: "Price: low to high" },
  { value: "price-high", label: "Price: high to low" },
];

function Courses() {
  const [searchParams] = useSearchParams();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "All");
  const [level, setLevel] = useState("All");
  const [sort, setSort] = useState("rating");

  useEffect(() => {
    let active = true;

    getCourses()
      .then((data) => {
        if (active) setCourses(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Error loading courses:", err);
        if (active) setError("Unable to load courses. Is the server running?");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const categories = useMemo(
    () => [...new Set(courses.map((course) => course.category).filter(Boolean))].sort(),
    [courses]
  );

  const filteredCourses = useMemo(() => {
    const term = search.trim().toLowerCase();

    return courses
      .filter((course) => {
        if (!term) return true;
        const text = [course.title, course.instructor, course.category, ...(course.skills || [])]
          .join(" ")
          .toLowerCase();
        return text.includes(term);
      })
      .filter((course) => category === "All" || course.category === category)
      .filter((course) => level === "All" || course.level === level)
      .sort((a, b) => {
        if (sort === "popular") return Number(b.students || 0) - Number(a.students || 0);
        if (sort === "price-low") return Number(a.price || 0) - Number(b.price || 0);
        if (sort === "price-high") return Number(b.price || 0) - Number(a.price || 0);
        return Number(b.rating || 0) - Number(a.rating || 0);
      });
  }, [courses, search, category, level, sort]);

  const hasFilters = search || category !== "All" || level !== "All";

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setLevel("All");
  };

  if (loading) {
    return (
      <div className="courses-page">
        <p className="state-message">Loading courses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="courses-page">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="courses-page">
      <section className="courses-header">
        <div>
          <span className="section-label">COURSE LIBRARY</span>
          <h1>Explore courses</h1>
          <p>Learn practical skills from expert instructors.</p>
        </div>

        <Link to="/add-course" className="primary-btn">
          + Add course
        </Link>
      </section>

      <section className="course-filters">
        <input
          type="text"
          placeholder="🔍 Search by title, instructor or skill..."
          className="course-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="course-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Category"
        >
          <option value="All">All categories</option>
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          className="course-select"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          aria-label="Level"
        >
          <option value="All">All levels</option>
          {LEVELS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          className="course-select"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          aria-label="Sort"
        >
          {SORT_OPTIONS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </section>

      <div className="course-count">
        <span>
          <strong>{filteredCourses.length}</strong> courses found
        </span>

        {hasFilters && (
          <button type="button" className="text-btn" onClick={clearFilters}>
            Clear filters
          </button>
        )}
      </div>

      {filteredCourses.length > 0 ? (
        <section className="courses-grid">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </section>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">📚</div>
          <h2>No courses found</h2>
          <p>Try changing your search or filters.</p>
        </div>
      )}
    </div>
  );
}

export default Courses;
