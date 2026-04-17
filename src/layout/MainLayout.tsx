import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate();
    const logout = useAuthStore((state) => state.logout);
    const userName = useAuthStore((state) => state.userName);

    const onLogout = () => {
        logout();
        navigate("/register");
    };

    return (
        <div className="min-h-screen flex">
            <aside className="w-64 bg-gray-900 text-white p-4 flex flex-col">
                <h1 className="text-xl font-bold mb-6">{ userName }</h1>

                <nav className="flex flex-col gap-3">
                    <Link to="/">Users</Link>
                    <Link to="/posts">Posts</Link>
                    <Link to="/settings">Settings</Link>
                </nav>

                <button
                    onClick={onLogout}
                    className="mt-auto text-white hover:text-red-400 transition cursor-pointer"
                >
                    Logout
                </button>
            </aside>

            <main className="flex-1 p-6 bg-gray-100">
                {children}
            </main>
        </div>
    );
}