import { persist } from "zustand/middleware";
import { create } from "zustand";

interface AuthState {
    userId: number | null;
    token: string | null;
    isAdmin: boolean;
    login: (userId: number, token: string) => void;
}


export const useAuthStore = create<AuthState>()(
    persist((set) => ({
        userId: null,
        token: null,
        isAdmin: false,
        login: (userId, token) => set({ userId, token }),
    }),
        { name: "auth-storage" }
    )
);