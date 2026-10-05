import axios from "axios";

// Change this one line if your json-server runs on a different port.
// Live Render backend
const api = axios.create({
    //baseURL: "http://localhost:3005",
    baseURL: "https://course-marketplace-backend-b15q.onrender.com"
});

export const SITE_NAME = "SkillNest";

export const CATEGORIES = [
    "Programming",
    "Web Development",
    "Data Science",
    "Artificial Intelligence",
    "Database",
    "Design",
    "Cloud Computing",
    "Cyber Security",
    "Marketing",
    "Mobile Development",
];

export const LEVELS = ["Beginner", "Intermediate", "Advanced"];

export const FALLBACK_IMAGE =
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=70";

// Unsplash links in db.json have no size, so ask for a web-sized image.
export const imageUrl = (url, width = 900) => {
    if (!url) return FALLBACK_IMAGE;
    if (url.includes("images.unsplash.com") && !url.includes("?")) {
        return `${url}?auto=format&fit=crop&w=${width}&q=70`;
    }
    return url;
};

export const formatPrice = (price) =>
    Number(price) > 0 ? `₹${Number(price).toLocaleString("en-IN")}` : "Free";

/* ---------- Courses ---------- */

export const getCourses = async() => {
    const response = await api.get("/courses");
    return response.data;
};

export const getCourseById = async(id) => {
    const response = await api.get(`/courses/${id}`);
    return response.data;
};

export const createCourse = async(course) => {
    const response = await api.post("/courses", course);
    return response.data;
};

export const updateCourse = async(id, course) => {
    const response = await api.put(`/courses/${id}`, course);
    return response.data;
};

export const deleteCourse = async(id) => {
    await api.delete(`/courses/${id}`);
};

/* ---------- Users ---------- */

export const findUserByEmail = async(email) => {
    const response = await api.get("/users", { params: { email } });
    return response.data[0] || null;
};

export const createUser = async(user) => {
    const response = await api.post("/users", user);
    return response.data;
};

export default api;