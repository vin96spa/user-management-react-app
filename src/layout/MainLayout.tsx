import { Link } from "react-router-dom";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex">
            <aside className="w-64 bg-gray-900 text-white p-4">
                <h1 className="text-xl font-bold mb-6">User Manager</h1>

                <nav className="flex flex-col gap-3">
                    <Link to="/">Users</Link>
                    <Link to="/posts">Posts</Link>
                    <Link to="/settings">Settings</Link>
                </nav>
            </aside>

            <main className="flex-1 p-6 bg-gray-100">
                {children}
            </main>
        </div>
    );
}