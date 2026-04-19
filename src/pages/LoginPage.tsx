import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getUserByEmail } from "@/api/users";
import { useAuthStore } from "@/store/authStore";
import { type LoginFormData, loginSchema } from "@/validations/loginSchema";

export default function LoginPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);
    const [apiError, setApiError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        mode: "onTouched",
    });

    const onSubmit = async (data: LoginFormData) => {
        setApiError(null);
        const token = import.meta.env.VITE_API_TOKEN || "";
        const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || "";

        try {
            const user = await getUserByEmail(data.email, token);

            if (!user || user.length === 0) {
                setApiError(t("login.emailNotFoundError"));
                return;
            }

            // block inactive users — only for normal users, not for admin
            if (user[0].status === "inactive" && data.email !== adminEmail) {
                setApiError(t("login.blockedError"));
                return;
            }

            const isAdmin = data.email === adminEmail;
            login(user[0].id, token, user[0].name, user[0].email, isAdmin);
            navigate(isAdmin ? "/admin/dashboard" : "/posts");

        } catch {
            setApiError(t("login.genericError"));
        }
    };

    return (
        
            <div className="flex-1 flex items-center justify-center px-4 pb-10">
                <div className="bg-white rounded-2xl p-8 w-full max-w-sm">

                    {/* header */}
                    <div className="mb-6">
                        <p className="text-xl font-semibold text-gray-900 mb-1">
                            {t("login.title")}
                        </p>
                        <p className="text-sm text-gray-400">
                            {t("login.subtitle")}
                        </p>
                    </div>

                    {/* API errors */}
                    {apiError && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm">
                            {apiError}
                        </div>
                    )}

                    {/* form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1.5">
                                {t("login.email")}
                            </label>
                            <input
                                {...register("email")}
                                type="email"
                                placeholder="you@/example.com"
                                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 placeholder:text-gray-300"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-gray-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 disabled:opacity-50 transition-colors cursor-pointer disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? t("login.submitting") : t("login.submit")}
                        </button>
                    </form>

                    {/* link register */}
                    <div className="mt-6 pt-5 border-t border-gray-100 text-center">
                        <span className="text-xs text-gray-400">{t("login.noAccount")} </span>
                        <Link
                            to="/register"
                            className="text-xs font-medium text-gray-900 hover:underline"
                        >
                            {t("login.register")}
                        </Link>
                    </div>
                </div>
            </div>
    );
}