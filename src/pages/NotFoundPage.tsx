import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const isLoggedIn = useAuthStore((state) => state.token);
    const isAdmin = useAuthStore((state) => state.isAdmin);

    const handleBack = () => {
        if (!isLoggedIn) {
            navigate("/login");
        } else if (isAdmin) {
            navigate("/admin/dashboard");
        } else {
            navigate("/posts");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center gap-4 text-center">
            <p className="text-8xl font-bold text-gray-900">404</p>
            <div className="flex flex-col gap-1">
                <h1 className="text-xl font-semibold text-white">{t("notFound.title")}</h1>
                <p className="text-sm text-gray-300">{t("notFound.description")}</p>
            </div>
            <Button
                variant="outline"
                onClick={handleBack}
                className="cursor-pointer gap-1.5 mt-2"
            >
                <ArrowLeft size={14} />
                {t("notFound.back")}
            </Button>
        </div>
    );
}