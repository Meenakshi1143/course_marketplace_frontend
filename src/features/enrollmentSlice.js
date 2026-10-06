import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { enrollInCourse, getMyEnrollments } from "../services/api";

// Loads the ids of the courses the logged-in user is enrolled in
export const fetchEnrollments = createAsyncThunk("enrollments/fetch", async() => {
    const list = await getMyEnrollments();
    return list.map((item) => String(item.courseId));
});

// Enrolls the logged-in user in a course (saved in the backend)
export const enrollCourse = createAsyncThunk("enrollments/enroll", async(course) => {
    await enrollInCourse(course);
    return String(course.id);
});

const enrollmentSlice = createSlice({
    name: "enrollments",

    initialState: {
        ids: [],
        loaded: false,
    },

    reducers: {
        // called on logout so the next login loads its own data
        resetEnrollments: () => ({ ids: [], loaded: false }),
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchEnrollments.fulfilled, (state, action) => {
                state.ids = action.payload;
                state.loaded = true;
            })
            .addCase(fetchEnrollments.rejected, (state) => {
                state.loaded = true;
            })
            .addCase(enrollCourse.fulfilled, (state, action) => {
                if (!state.ids.includes(action.payload)) {
                    state.ids.push(action.payload);
                }
            });
    },
});

export const { resetEnrollments } = enrollmentSlice.actions;

export default enrollmentSlice.reducer;