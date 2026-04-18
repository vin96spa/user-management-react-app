import { persist } from "zustand/middleware";
import { create } from "zustand";

interface AuthState {
    userId: number | null;
    userName: string | null;
    userEmail: string | null;
    token: string | null;
    isAdmin: boolean;
    login: (userId: number, token: string, userName: string, userEmail: string, isAdmin?: boolean) => void;
    logout: () => void;
}


export const useAuthStore = create<AuthState>()(
    persist((set) => ({
        userId: null,
        userName: null,
        userEmail: null,
        token: null,
        isAdmin: false,
        login: (userId, token, userName, userEmail, isAdmin = false) => set({ userId, token, userName, userEmail, isAdmin }),
        logout: () => set({ userId: null, token: null, userName: null, userEmail: null, isAdmin: false }),
    }),
        { name: "auth-storage" }
    )
);