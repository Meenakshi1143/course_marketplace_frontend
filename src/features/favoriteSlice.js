import { createSlice } from "@reduxjs/toolkit";

const savedFavorites = JSON.parse(
    localStorage.getItem("favorites") || "[]"
);

const favoriteSlice = createSlice({
    name: "favorites",

    initialState: {
        items: savedFavorites,
    },

    reducers: {
        addFavorite: (state, action) => {
            const exists = state.items.some(
                (item) =>
                String(item.id) === String(action.payload.id)
            );

            if (!exists) {
                state.items.push(action.payload);
            }

            localStorage.setItem(
                "favorites",
                JSON.stringify(state.items)
            );
        },

        removeFavorite: (state, action) => {
            state.items = state.items.filter(
                (item) =>
                String(item.id) !== String(action.payload)
            );

            localStorage.setItem(
                "favorites",
                JSON.stringify(state.items)
            );
        },

        clearFavorites: (state) => {
            state.items = [];

            localStorage.removeItem("favorites");
        },
    },
});

export const {
    addFavorite,
    removeFavorite,
    clearFavorites,
} = favoriteSlice.actions;

export default favoriteSlice.reducer;