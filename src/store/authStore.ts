import { persist } from "zustand/middleware";
import { create } from "zustand";

interface AuthState {
    userId: number | null;
    token: string | null;
    isAdmin: boolean;
}


export const useAuthStore = create<AuthState>()(
    persist((set) => ({
        userId: null,
        token: null,
        isAdmin: false,
    }),
        { name: "auth-storage" }
    )
);