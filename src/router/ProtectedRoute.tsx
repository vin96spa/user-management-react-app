import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

interface Props {
    children: React.ReactNode;
    requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: Props) {
    const userId = useAuthStore((state) => state.userId);
    const isAdmin = useAuthStore((state) => state.isAdmin);
    const userEmail = useAuthStore((state) => state.userEmail);
    const token = useAuthStore((state) => state.token);

    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;

    if (requireAdmin) {
        const isReallyAdmin = isAdmin && userEmail === adminEmail;
        if (!isReallyAdmin) return <Navigate to="/login" replace />;
    } else {
        if (!userId || !token) return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}