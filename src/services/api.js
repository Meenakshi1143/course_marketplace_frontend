import axios from "axios";

// Change this one line if your json-server runs on a different port.
// Live Render backend
const api = axios.create({
    //baseURL: "http://localhost:3005",
    baseURL: "https://course-marketplace-backend-b15q.onrender.com",
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

export const formatDate = (iso) => {
    if (!iso) return "";
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

// Courses saved as "draft" are hidden from normal users.
export const isPublished = (course) => course.status !== "draft";

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

export const patchCourse = async(id, changes) => {
    const response = await api.patch(`/courses/${id}`, changes);
    return response.data;
};

export const deleteCourse = async(id) => {
    await api.delete(`/courses/${id}`);
};

/* ---------- Session & roles ---------- */

// Admin account that is created automatically the first time Admin login is used.
export const DEFAULT_ADMIN = {
    name: "Admin",
    email: "admin@skillnest.com",
    password: "Admin@123",
    role: "admin",
    enrollments: [],
};

export const saveSession = (user) => {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userId", String(user.id));
    localStorage.setItem("userEmail", user.email);
    localStorage.setItem("userName", user.name || "");
    localStorage.setItem("userRole", user.role === "admin" ? "admin" : "user");
};

export const clearSession = () => {
    ["isLoggedIn", "userId", "userEmail", "userName", "userRole"].forEach((key) =>
        localStorage.removeItem(key)
    );
};

export const isAdmin = () => localStorage.getItem("userRole") === "admin";

export const getUserId = () => localStorage.getItem("userId");

/* ---------- Users ---------- */

export const getUsers = async() => {
    const response = await api.get("/users");
    return response.data;
};

export const getUserById = async(id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
};

export const findUserByEmail = async(email) => {
    const response = await api.get("/users", { params: { email } });
    return response.data[0] || null;
};

export const createUser = async(user) => {
    const response = await api.post("/users", user);
    return response.data;
};

export const updateUser = async(id, changes) => {
    const response = await api.patch(`/users/${id}`, changes);
    return response.data;
};

export const deleteUser = async(id) => {
    await api.delete(`/users/${id}`);
};

export const ensureDefaultAdmin = async() => {
    const existing = await findUserByEmail(DEFAULT_ADMIN.email);
    if (!existing) {
        await createUser(DEFAULT_ADMIN);
    }
};

/* ---------- Enrollments (stored on the user record) ---------- */

export const getMyEnrollments = async() => {
    const user = await getUserById(getUserId());
    return user.enrollments || [];
};

export const enrollInCourse = async(course) => {
    const userId = getUserId();
    const user = await getUserById(userId);
    const list = user.enrollments || [];

    if (list.some((item) => String(item.courseId) === String(course.id))) {
        return list;
    }

    const next = [
        ...list,
        {
            courseId: String(course.id),
            enrolledAt: new Date().toISOString(),
            price: Number(course.price) || 0,
            completed: [],
        },
    ];

    await updateUser(userId, { enrollments: next });
    await patchCourse(course.id, { students: Number(course.students || 0) + 1 });

    return next;
};

export const setClassCompleted = async(courseId, classId, done) => {
    const userId = getUserId();
    const user = await getUserById(userId);

    const next = (user.enrollments || []).map((item) => {
        if (String(item.courseId) !== String(courseId)) return item;

        const completed = new Set(item.completed || []);
        if (done) completed.add(classId);
        else completed.delete(classId);

        return {...item, completed: [...completed] };
    });

    await updateUser(userId, { enrollments: next });
    return next;
};

export const courseProgress = (course, enrollment) => {
    const classes = (course && course.classes) || [];
    if (!classes.length || !enrollment) return 0;

    const ids = classes.map((item) => item.id);
    const done = (enrollment.completed || []).filter((id) => ids.includes(id)).length;

    return Math.round((done / classes.length) * 100);
};

export default api;