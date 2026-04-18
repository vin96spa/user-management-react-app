import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import LanguageSwitcher from "../components/ui/LanguageSwitcher";
import { useTranslation } from "react-i18next";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const logout = useAuthStore((state) => state.logout);
    const userName = useAuthStore((state) => state.userName);
    const isAdmin = useAuthStore((state) => state.isAdmin);

    const onLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="min-h-screen flex">
            <aside className="fixed top-0 left-0 h-screen w-64 bg-gray-900 text-white p-4 flex flex-col">
                <h1 className="text-xl font-bold mb-6">{userName}</h1>

                <nav className="flex flex-col gap-3">
                    {
                        isAdmin ? (
                            <Link to="/admin/dashboard">{t("nav.admin")}</Link>
                        ) : (
                            <><Link to="/posts">{t("nav.posts")}</Link><Link to="/settings">{t("nav.settings")}</Link></>
                        )
                    }

                </nav>

                <div className="flex flex-col gap-3 mt-auto" >
                    <LanguageSwitcher />
                    <button
                        onClick={onLogout}
                        className="mt-auto text-white hover:text-red-400 transition cursor-pointer"
                    >
                        {t("nav.logout")}
                    </button>
                </div>

            </aside>

            <main className="ml-64 flex-1 p-6 bg-gray-100 min-h-screen overflow-y-auto">
                {children}
            </main>
        </div>
    );
}