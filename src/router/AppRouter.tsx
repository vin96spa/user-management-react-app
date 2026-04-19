import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "@/layout/MainLayout";
import PublicLayout from "@/layout/PublicLayout";
import PostsPage from "@/pages/PostsPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import UserSettingsPage from "@/pages/UserSettingsPage";
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import ProtectedRoute from "./ProtectedRoute";

function withMainLayout(page: React.ReactNode) {
    return <MainLayout>{page}</MainLayout>;
}

function withPublicLayout(page: React.ReactNode) {
    return <PublicLayout>{page}</PublicLayout>;
}

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Redirect root a /register */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                
                {/* Public routes */}
                <Route path="/login" element={withPublicLayout(<LoginPage />)} />
                <Route path="/register" element={withPublicLayout(<RegisterPage />)} />

                {/* Protected routes with MainLayout */}
                {/* User */}
                <Route path="/posts" element={
                    <ProtectedRoute>{withMainLayout(<PostsPage />)}</ProtectedRoute>
                } />
                <Route path="/settings" element={
                    <ProtectedRoute>{withMainLayout(<UserSettingsPage />)}</ProtectedRoute>
                } />

                {/* Admin */}
                <Route path="/admin/dashboard" element={
                    <ProtectedRoute requireAdmin>{withMainLayout(<AdminDashboardPage />)}</ProtectedRoute>
                } />
            </Routes>
        </BrowserRouter>
    );
}