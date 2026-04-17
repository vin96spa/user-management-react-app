import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import PostsPage from "../pages/PostsPage";
import RegisterPage from "../pages/RegisterPage";
import UserSettingsPage from "../pages/UserSettingsPage";
import AdminLoginPage from "../pages/admin/AdminLoginPage";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import ProtectedRoute from "./ProtectedRoute";

function withLayout(page: React.ReactNode) {
    return <MainLayout>{page}</MainLayout>;
}

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Redirect root a /register */}
                <Route path="/" element={<Navigate to="/register" replace />} />

                {/* User */}
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/posts" element={
                    <ProtectedRoute>{withLayout(<PostsPage />)}</ProtectedRoute>
                } />
                <Route path="/settings" element={
                    <ProtectedRoute>{withLayout(<UserSettingsPage />)}</ProtectedRoute>
                } />

                {/* Admin */}
                <Route path="/admin" element={<AdminLoginPage />} />
                <Route path="/admin/dashboard" element={
                    <ProtectedRoute requireAdmin>{withLayout(<AdminDashboardPage />)}</ProtectedRoute>
                } />
            </Routes>
        </BrowserRouter>
    );
}