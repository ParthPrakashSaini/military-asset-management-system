// /client/src/store/authStore.js

import { create } from "zustand";
import { persist } from "zustand/middleware";

// 'persist' saves the state to localStorage, so you stay logged in after a refresh
export const useAuthStore = create(
  persist(
    (set) => ({
      user: null, // Will store { id, name, email, role }
      token: null, // Will store the JWT string

      // Action to log in
      login: (userData, token) =>
        set({
          user: userData,
          token: token,
        }),

      // Action to log out
      logout: () =>
        set({
          user: null,
          token: null,
        }),

      // Helper function to quickly check auth status
      isAuthenticated: () => {
        const token = useAuthStore.getState().token;
        return !!token; // True if token exists, false if null
      },
    }),
    {
      name: "mams-auth-storage", // The name of the item in localStorage
    }
  )
);
