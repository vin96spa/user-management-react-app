import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import UsersPage from "../pages/UsersPage";
import PostsPage from "../pages/PostsPage";
import UserSettingsPage from "../pages/UserSettingsPage";

function withLayout(page: React.ReactNode) {
    return <MainLayout>{page}</MainLayout>;
}

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={withLayout(<UsersPage />)} />
                <Route path="/posts" element={withLayout(<PostsPage />)} />
                <Route path="/settings" element={withLayout(<UserSettingsPage />)} />
            </Routes>
        </BrowserRouter>
    );
}