import { configureStore } from "@reduxjs/toolkit";
import favoriteReducer from "../features/favoriteSlice";

export const store = configureStore({
    reducer: {
        favorites: favoriteReducer,
    },
});