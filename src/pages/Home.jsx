// import { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";

// import CourseCard from "../components/CourseCard";
// import { SITE_NAME, getCourses } from "../services/api";

// const HERO_IMAGE =
//   "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=75";

// const categories = [
//   { name: "Web Development", icon: "💻", text: "Build modern websites and web apps.", tone: "coral" },
//   { name: "Programming", icon: "🧑‍💻", text: "Python, Java, C and core coding skills.", tone: "green" },
//   { name: "Data Science", icon: "📊", text: "Analyse data and tell stories with it.", tone: "gold" },
//   { name: "Artificial Intelligence", icon: "🤖", text: "Machine learning and generative AI.", tone: "violet" },
//   { name: "Design", icon: "🎨", text: "UI, UX and product design with Figma.", tone: "coral" },
//   { name: "Cloud Computing", icon: "☁️", text: "AWS, Docker, Kubernetes and DevOps.", tone: "green" },
//   { name: "Cyber Security", icon: "🔐", text: "Protect systems and learn ethical hacking.", tone: "gold" },
//   { name: "Mobile Development", icon: "📱", text: "Android and cross-platform apps.", tone: "violet" },
// ];

// const steps = [
//   { number: "01", title: "Browse", text: "Search and filter courses by category, level and rating." },
//   { number: "02", title: "Compare", text: "Check instructors, duration, lessons and the skills you will gain." },
//   { number: "03", title: "Save", text: "Keep your favourites in one list and come back when you are ready." },
// ];

// function Home() {
//   const navigate = useNavigate();
//   const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

//   const [query, setQuery] = useState("");
//   const [courses, setCourses] = useState([]);

//   useEffect(() => {
//     let active = true;

//     getCourses()
//       .then((data) => {
//         if (active && Array.isArray(data)) setCourses(data);
//       })
//       .catch(() => {
//         // Home page still works when the API is offline
//       });

//     return () => {
//       active = false;
//     };
//   }, []);

//   const featured = [...courses]
//     .sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0))
//     .slice(0, 3);

//   const totalStudents = courses.reduce(
//     (sum, course) => sum + Number(course.students || 0),
//     0
//   );
//   const totalInstructors = new Set(courses.map((course) => course.instructor)).size;

//   const handleSearch = (e) => {
//     e.preventDefault();
//     const term = query.trim();
//     navigate(term ? `/courses?search=${encodeURIComponent(term)}` : "/courses");
//   };

//   return (
//     <div className="home-page">
//       {/* ================= HERO ================= */}
//       <section className="home-hero">
//         <div className="hero-left">
//           <span className="hero-badge">✨ Learn. Build. Grow.</span>

//           <h1>
//             Find the course that
//             <br />
//             <span>changes your career.</span>
//           </h1>

//           <p className="hero-description">
//             {SITE_NAME} brings practical courses from experienced instructors
//             into one clear marketplace. Search, compare and save the skills you
//             want to learn next.
//           </p>

//           <form className="home-search" onSubmit={handleSearch}>
//             <span>🔍</span>
//             <input
//               type="text"
//               placeholder="What do you want to learn?"
//               value={query}
//               onChange={(e) => setQuery(e.target.value)}
//             />
//             <button type="submit" className="search-button">
//               Search
//             </button>
//           </form>

//           <div className="hero-buttons">
//             <Link to="/courses" className="primary-btn">
//               Explore courses
//             </Link>

//             {isLoggedIn ? (
//               <Link to="/add-course" className="secondary-btn">
//                 Add a course
//               </Link>
//             ) : (
//               <Link to="/register" className="secondary-btn">
//                 Create free account
//               </Link>
//             )}
//           </div>

//           {courses.length > 0 && (
//             <div className="home-stats">
//               <div className="stat">
//                 <strong>{courses.length}</strong>
//                 <span>Courses</span>
//               </div>
//               <div className="stat">
//                 <strong>{totalInstructors}</strong>
//                 <span>Instructors</span>
//               </div>
//               <div className="stat">
//                 <strong>{totalStudents.toLocaleString("en-IN")}+</strong>
//                 <span>Learners</span>
//               </div>
//             </div>
//           )}
//         </div>

//         <div className="hero-right">
//           <div className="hero-image-wrapper">
//             <img
//               src={HERO_IMAGE}
//               alt="Students learning together"
//               className="hero-image"
//               onError={(e) => {
//                 e.currentTarget.style.display = "none";
//               }}
//             />

//             <div className="floating-card rating-floating">
//               <span>⭐</span>
//               <div>
//                 <strong>4.8 / 5</strong>
//                 <small>Average rating</small>
//               </div>
//             </div>

//             <div className="floating-card students-floating">
//               <span>🎓</span>
//               <div>
//                 <strong>Learn anywhere</strong>
//                 <small>At your own pace</small>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ================= CATEGORIES ================= */}
//       <section className="home-section">
//         <div className="section-heading">
//           <div>
//             <span className="section-label">CATEGORIES</span>
//             <h2>Explore popular categories</h2>
//             <p>Pick a topic and see every course in it.</p>
//           </div>

//           <Link to="/courses" className="view-all">
//             View all courses →
//           </Link>
//         </div>

//         <div className="category-grid">
//           {categories.map((item) => (
//             <Link
//               key={item.name}
//               to={`/courses?category=${encodeURIComponent(item.name)}`}
//               className="category-card"
//             >
//               <div className={`category-icon ${item.tone}`}>{item.icon}</div>
//               <h3>{item.name}</h3>
//               <p>{item.text}</p>
//               <span className="category-link">Explore →</span>
//             </Link>
//           ))}
//         </div>
//       </section>

//       {/* ================= FEATURED ================= */}
//       {featured.length > 0 && (
//         <section className="home-section">
//           <div className="section-heading">
//             <div>
//               <span className="section-label">TOP RATED</span>
//               <h2>Featured courses</h2>
//               <p>Highest rated courses on {SITE_NAME} right now.</p>
//             </div>

//             <Link to="/courses" className="view-all">
//               See more →
//             </Link>
//           </div>

//           <div className="courses-grid">
//             {featured.map((course) => (
//               <CourseCard key={course.id} course={course} />
//             ))}
//           </div>
//         </section>
//       )}

//       {/* ================= HOW IT WORKS ================= */}
//       <section className="home-section">
//         <div className="section-heading">
//           <div>
//             <span className="section-label">HOW IT WORKS</span>
//             <h2>Three simple steps</h2>
//           </div>
//         </div>

//         <div className="steps-grid">
//           {steps.map((step) => (
//             <div className="step-card" key={step.number}>
//               <span className="step-number">{step.number}</span>
//               <h3>{step.title}</h3>
//               <p>{step.text}</p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* ================= CTA ================= */}
//       <section className="home-cta">
//         <div>
//           <span>READY TO START?</span>
//           <h2>Your next skill is waiting.</h2>
//           <p>Create a free account and start saving courses today.</p>
//         </div>

//         <Link to={isLoggedIn ? "/courses" : "/register"} className="cta-button">
//           {isLoggedIn ? "Browse courses →" : "Get started →"}
//         </Link>
//       </section>
//     </div>
//   );
// }

// export default Home;
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import CourseCard from "../components/CourseCard";
import { SITE_NAME, getCourses, isAdmin, isPublished } from "../services/api";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=75";

const categories = [
  { name: "Web Development", icon: "💻", text: "Build modern websites and web apps.", tone: "coral" },
  { name: "Programming", icon: "🧑‍💻", text: "Python, Java, C and core coding skills.", tone: "green" },
  { name: "Data Science", icon: "📊", text: "Analyse data and tell stories with it.", tone: "gold" },
  { name: "Artificial Intelligence", icon: "🤖", text: "Machine learning and generative AI.", tone: "violet" },
  { name: "Design", icon: "🎨", text: "UI, UX and product design with Figma.", tone: "coral" },
  { name: "Cloud Computing", icon: "☁️", text: "AWS, Docker, Kubernetes and DevOps.", tone: "green" },
  { name: "Cyber Security", icon: "🔐", text: "Protect systems and learn ethical hacking.", tone: "gold" },
  { name: "Mobile Development", icon: "📱", text: "Android and cross-platform apps.", tone: "violet" },
];

const steps = [
  { number: "01", title: "Browse", text: "Search and filter courses by category, level and rating." },
  { number: "02", title: "Compare", text: "Check instructors, duration, lessons and the skills you will gain." },
  { number: "03", title: "Save", text: "Keep your favourites in one list and come back when you are ready." },
];

function Home() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  const [query, setQuery] = useState("");
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    let active = true;

    getCourses()
      .then((data) => {
        if (active && Array.isArray(data)) setCourses(data.filter(isPublished));
      })
      .catch(() => {
        // Home page still works when the API is offline
      });

    return () => {
      active = false;
    };
  }, []);

  const featured = [...courses]
    .sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0))
    .slice(0, 3);

  const totalStudents = courses.reduce(
    (sum, course) => sum + Number(course.students || 0),
    0
  );
  const totalInstructors = new Set(courses.map((course) => course.instructor)).size;

  const handleSearch = (e) => {
    e.preventDefault();
    const term = query.trim();
    navigate(term ? `/courses?search=${encodeURIComponent(term)}` : "/courses");
  };

  return (
    <div className="home-page">
      {/* ================= HERO ================= */}
      <section className="home-hero">
        <div className="hero-left">
          <span className="hero-badge">✨ Learn. Build. Grow.</span>

          <h1>
            Find the course that
            <br />
            <span>changes your career.</span>
          </h1>

          <p className="hero-description">
            {SITE_NAME} brings practical courses from experienced instructors
            into one clear marketplace. Search, compare and save the skills you
            want to learn next.
          </p>

          <form className="home-search" onSubmit={handleSearch}>
            <span>🔍</span>
            <input
              type="text"
              placeholder="What do you want to learn?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="search-button">
              Search
            </button>
          </form>

          <div className="hero-buttons">
            <Link to="/courses" className="primary-btn">
              Explore courses
            </Link>

            {isLoggedIn ? (
              <Link
                to={isAdmin() ? "/admin" : "/my-courses"}
                className="secondary-btn"
              >
                {isAdmin() ? "Open dashboard" : "My courses"}
              </Link>
            ) : (
              <Link to="/register" className="secondary-btn">
                Create free account
              </Link>
            )}
          </div>

          {courses.length > 0 && (
            <div className="home-stats">
              <div className="stat">
                <strong>{courses.length}</strong>
                <span>Courses</span>
              </div>
              <div className="stat">
                <strong>{totalInstructors}</strong>
                <span>Instructors</span>
              </div>
              <div className="stat">
                <strong>{totalStudents.toLocaleString("en-IN")}+</strong>
                <span>Learners</span>
              </div>
            </div>
          )}
        </div>

        <div className="hero-right">
          <div className="hero-image-wrapper">
            <img
              src={HERO_IMAGE}
              alt="Students learning together"
              className="hero-image"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />

            <div className="floating-card rating-floating">
              <span>⭐</span>
              <div>
                <strong>4.8 / 5</strong>
                <small>Average rating</small>
              </div>
            </div>

            <div className="floating-card students-floating">
              <span>🎓</span>
              <div>
                <strong>Learn anywhere</strong>
                <small>At your own pace</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CATEGORIES ================= */}
      <section className="home-section">
        <div className="section-heading">
          <div>
            <span className="section-label">CATEGORIES</span>
            <h2>Explore popular categories</h2>
            <p>Pick a topic and see every course in it.</p>
          </div>

          <Link to="/courses" className="view-all">
            View all courses →
          </Link>
        </div>

        <div className="category-grid">
          {categories.map((item) => (
            <Link
              key={item.name}
              to={`/courses?category=${encodeURIComponent(item.name)}`}
              className="category-card"
            >
              <div className={`category-icon ${item.tone}`}>{item.icon}</div>
              <h3>{item.name}</h3>
              <p>{item.text}</p>
              <span className="category-link">Explore →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ================= FEATURED ================= */}
      {featured.length > 0 && (
        <section className="home-section">
          <div className="section-heading">
            <div>
              <span className="section-label">TOP RATED</span>
              <h2>Featured courses</h2>
              <p>Highest rated courses on {SITE_NAME} right now.</p>
            </div>

            <Link to="/courses" className="view-all">
              See more →
            </Link>
          </div>

          <div className="courses-grid">
            {featured.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </section>
      )}

      {/* ================= HOW IT WORKS ================= */}
      <section className="home-section">
        <div className="section-heading">
          <div>
            <span className="section-label">HOW IT WORKS</span>
            <h2>Three simple steps</h2>
          </div>
        </div>

        <div className="steps-grid">
          {steps.map((step) => (
            <div className="step-card" key={step.number}>
              <span className="step-number">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="home-cta">
        <div>
          <span>READY TO START?</span>
          <h2>Your next skill is waiting.</h2>
          <p>Create a free account and start saving courses today.</p>
        </div>

        <Link to={isLoggedIn ? "/courses" : "/register"} className="cta-button">
          {isLoggedIn ? "Browse courses →" : "Get started →"}
        </Link>
      </section>
    </div>
  );
}

export default Home;