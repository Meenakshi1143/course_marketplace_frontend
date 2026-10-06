// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";

// import { CATEGORIES, LEVELS, createCourse } from "../services/api";

// function AddCourse() {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     title: "",
//     instructor: "",
//     category: "",
//     level: "Beginner",
//     image: "",
//     description: "",
//     price: "",
//     duration: "",
//     lessons: "",
//     language: "English",
//     skills: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       const newCourse = {
//         title: formData.title.trim(),
//         instructor: formData.instructor.trim(),
//         category: formData.category,
//         level: formData.level,
//         image: formData.image.trim(),
//         description: formData.description.trim(),
//         price: Number(formData.price),
//         duration: formData.duration.trim(),
//         lessons: Number(formData.lessons),
//         language: formData.language.trim(),
//         rating: 0,
//         students: 0,
//         skills: formData.skills
//           .split(",")
//           .map((skill) => skill.trim())
//           .filter(Boolean),
//       };

//       await createCourse(newCourse);

//       navigate("/courses");
//     } catch (err) {
//       console.error("Error adding course:", err);
//       setError("Failed to add the course. Make sure the server is running.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <section className="form-container">
//       <Link to="/courses" className="back-link">
//         ← Back to courses
//       </Link>

//       <h1>Add a new course</h1>
//       <p className="form-description">
//         Share a course with the marketplace. All fields are required except skills.
//       </p>

//       {error && <div className="error-message">{error}</div>}

//       <form onSubmit={handleSubmit}>

//         <div className="form-row">
//           <div className="form-group">
//             <label htmlFor="title">Course title</label>
//             <input
//               id="title"
//               type="text"
//               name="title"
//               placeholder="e.g. React JS Complete Course"
//               value={formData.title}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <div className="form-group">
//             <label htmlFor="instructor">Instructor</label>
//             <input
//               id="instructor"
//               type="text"
//               name="instructor"
//               placeholder="Instructor name"
//               value={formData.instructor}
//               onChange={handleChange}
//               required
//             />
//           </div>
//         </div>

//         <div className="form-row">
//           <div className="form-group">
//             <label htmlFor="category">Category</label>
//             <select
//               id="category"
//               name="category"
//               value={formData.category}
//               onChange={handleChange}
//               required
//             >
//               <option value="">Select category</option>
//               {CATEGORIES.map((item) => (
//                 <option key={item} value={item}>
//                   {item}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="form-group">
//             <label htmlFor="level">Level</label>
//             <select
//               id="level"
//               name="level"
//               value={formData.level}
//               onChange={handleChange}
//             >
//               {LEVELS.map((item) => (
//                 <option key={item} value={item}>
//                   {item}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         <div className="form-group">
//           <label htmlFor="image">Course image URL</label>
//           <input
//             id="image"
//             type="url"
//             name="image"
//             placeholder="https://..."
//             value={formData.image}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="description">Description</label>
//           <textarea
//             id="description"
//             name="description"
//             placeholder="What will learners get from this course?"
//             value={formData.description}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="form-row">
//           <div className="form-group">
//             <label htmlFor="price">Price (₹)</label>
//             <input
//               id="price"
//               type="number"
//               name="price"
//               placeholder="999"
//               value={formData.price}
//               onChange={handleChange}
//               min="0"
//               required
//             />
//           </div>

//           <div className="form-group">
//             <label htmlFor="duration">Duration</label>
//             <input
//               id="duration"
//               type="text"
//               name="duration"
//               placeholder="e.g. 20 Hours"
//               value={formData.duration}
//               onChange={handleChange}
//               required
//             />
//           </div>
//         </div>

//         <div className="form-row">
//           <div className="form-group">
//             <label htmlFor="lessons">Number of lessons</label>
//             <input
//               id="lessons"
//               type="number"
//               name="lessons"
//               placeholder="e.g. 30"
//               value={formData.lessons}
//               onChange={handleChange}
//               min="1"
//               required
//             />
//           </div>

//           <div className="form-group">
//             <label htmlFor="language">Language</label>
//             <input
//               id="language"
//               type="text"
//               name="language"
//               placeholder="e.g. English"
//               value={formData.language}
//               onChange={handleChange}
//               required
//             />
//           </div>
//         </div>

//         <div className="form-group">
//           <label htmlFor="skills">Skills (separate with commas)</label>
//           <input
//             id="skills"
//             type="text"
//             name="skills"
//             placeholder="React, JavaScript, HTML, CSS"
//             value={formData.skills}
//             onChange={handleChange}
//           />
//         </div>

//         <button type="submit" className="submit-btn" disabled={loading}>
//           {loading ? "Adding..." : "Add course"}
//         </button>
//       </form>
//     </section>
//   );
// }

// export default AddCourse;


import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { CATEGORIES, LEVELS, createCourse } from "../services/api";

function AddCourse() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    instructor: "",
    category: "",
    level: "Beginner",
    image: "",
    description: "",
    price: "",
    duration: "",
    lessons: "",
    language: "English",
    skills: "",
    learn: "",
    requirements: "",
    status: "published",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const newCourse = {
        title: formData.title.trim(),
        instructor: formData.instructor.trim(),
        category: formData.category,
        level: formData.level,
        image: formData.image.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        duration: formData.duration.trim(),
        lessons: Number(formData.lessons),
        language: formData.language.trim(),
        rating: 0,
        students: 0,
        status: formData.status,
        updatedAt: new Date().toISOString(),
        learn: (formData.learn || "")
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean),
        requirements: (formData.requirements || "")
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean),
        classes: [],
        skills: formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
      };

      await createCourse(newCourse);

      navigate("/courses");
    } catch (err) {
      console.error("Error adding course:", err);
      setError("Failed to add the course. Make sure the server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="form-container">
      <Link to="/courses" className="back-link">
        ← Back to courses
      </Link>

      <h1>Add a new course</h1>
      <p className="form-description">
        Share a course with the marketplace. All fields are required except skills.
      </p>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="title">Course title</label>
            <input
              id="title"
              type="text"
              name="title"
              placeholder="e.g. React JS Complete Course"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="instructor">Instructor</label>
            <input
              id="instructor"
              type="text"
              name="instructor"
              placeholder="Instructor name"
              value={formData.instructor}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select category</option>
              {CATEGORIES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="level">Level</label>
            <select
              id="level"
              name="level"
              value={formData.level}
              onChange={handleChange}
            >
              {LEVELS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="image">Course image URL</label>
          <input
            id="image"
            type="url"
            name="image"
            placeholder="https://..."
            value={formData.image}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            placeholder="What will learners get from this course?"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="price">Price (₹)</label>
            <input
              id="price"
              type="number"
              name="price"
              placeholder="999"
              value={formData.price}
              onChange={handleChange}
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="duration">Duration</label>
            <input
              id="duration"
              type="text"
              name="duration"
              placeholder="e.g. 20 Hours"
              value={formData.duration}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="lessons">Number of lessons</label>
            <input
              id="lessons"
              type="number"
              name="lessons"
              placeholder="e.g. 30"
              value={formData.lessons}
              onChange={handleChange}
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="language">Language</label>
            <input
              id="language"
              type="text"
              name="language"
              placeholder="e.g. English"
              value={formData.language}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="skills">Skills (separate with commas)</label>
          <input
            id="skills"
            type="text"
            name="skills"
            placeholder="React, JavaScript, HTML, CSS"
            value={formData.skills}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="learn">What learners will learn (one point per line)</label>
          <textarea
            id="learn"
            name="learn"
            placeholder={"Build real projects\nUnderstand core concepts"}
            value={formData.learn}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="requirements">Requirements (one per line)</label>
          <textarea
            id="requirements"
            name="requirements"
            placeholder={"A laptop with internet\nNo prior experience needed"}
            value={formData.requirements}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="published">Published (visible to users)</option>
            <option value="draft">Draft (hidden from users)</option>
          </select>
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Adding..." : "Add course"}
        </button>
      </form>
    </section>
  );
}

export default AddCourse;