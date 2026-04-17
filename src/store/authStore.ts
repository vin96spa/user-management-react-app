import { persist } from "zustand/middleware";
import { create } from "zustand";
import { use } from "react";

interface AuthState {
    userId: number | null;
    userName: string | null;
    token: string | null;
    isAdmin: boolean;
    login: (userId: number, token: string, userName: string) => void;
    logout: () => void;
}


export const useAuthStore = create<AuthState>()(
    persist((set) => ({
        userId: null,
        userName: null,
        token: null,
        isAdmin: false,
        login: (userId, token, userName) => set({ userId, token, userName}),
        logout: () => set({ userId: null, token: null, userName: null, isAdmin: false }),
    }),
        { name: "auth-storage" }
    )
);