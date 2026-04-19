import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LogOut } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { getInitials } from "@/utils/formatters";
import LanguageSwitcher from "@/components/custom-ui/LanguageSwitcher";
import { useLoader } from "@/context/LoaderContext";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const { showLoader, hideLoader } = useLoader();
    const logout = useAuthStore((state) => state.logout);
    const userName = useAuthStore((state) => state.userName);
    const isAdmin = useAuthStore((state) => state.isAdmin);

    const onLogout = () => {
        showLoader();
        setTimeout(() => {
            hideLoader();}, 500);
        logout();
        toast.info(t("common.logoutSuccess"));
        navigate("/login");
    };

    const isActive = (path: string) => location.pathname === path;

    const userLinks = [
        { to: "/posts", label: t("nav.posts") },
        { to: "/settings", label: t("nav.settings") },
    ];

    const adminLinks = [
        { to: "/admin/dashboard", label: t("nav.admin") },
        { to: "/posts", label: t("nav.posts") },
        { to: "/settings", label: t("nav.settings") },
    ];

    const links = isAdmin ? adminLinks : userLinks;

    return (
        <div className="min-h-screen flex flex-col">
            {/* navbar */}
            <nav className="bg-gray-900 text-white h-14 flex items-center justify-between px-6 fixed top-0 left-0 right-0 z-40">

                <span className="text-sm font-medium tracking-tight">
                    DEMO SOCIAL NETWORK APP
                </span>

                <div className="flex items-center gap-1">
                    {links.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className={`text-sm px-3 py-1.5 rounded-md transition-color ${isActive(link.to)
                                    ? "bg-gray-800 text-white"
                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-3">

                    <LanguageSwitcher />

                    <Separator orientation="vertical" className="h-5 bg-white/15 m-auto" />

                    <Link to="/settings" className="flex items-center gap-2">
                        <Avatar className="w-7 h-7">
                            <AvatarFallback className="bg-gray-700 text-gray-300 text-[11px]">
                                {userName ? getInitials(userName) : "?"}
                            </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-gray-300">{userName}</span>
                    </Link>

                    <Separator orientation="vertical" className="h-5 bg-white/15 m-auto" />

                    <Button
                        size="sm"
                        onClick={onLogout}
                        className="flex items-center gap-1.5 text-gray-400 hover:text-red-400 bg-gray-900 transition-colors cursor-pointer px-0"
                    >
                        <LogOut size={14} />
                        {t("nav.logout")}
                    </Button>

                </div>
            </nav>

            <main className="mt-14 flex-1 p-6 bg-gray-200 min-h-screen">
                {children}
            </main>
        </div>
    );
}