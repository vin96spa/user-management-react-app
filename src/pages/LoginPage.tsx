import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { getUserByEmail } from "../api/users";
import { useAuthStore } from "../store/authStore";
import { type LoginFormData, loginSchema } from "../validations/loginSchema";
import { useTranslation } from "react-i18next";

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
            const isAdmin = data.email === adminEmail;
            if (isAdmin) {
                login(user[0].id, token, user[0].name, user[0].email, isAdmin);
                navigate("/admin/dashboard");
                return;
            }
            login(user[0].id, token, user[0].name, user[0].email, isAdmin);
            navigate("/posts");
        } catch (error) {
            setApiError(JSON.stringify(error));
        }
    };

    return (
        <div className="bg-white p-8 rounded shadow shadow-blue-100 w-full max-w-md">
            <div className="flex center items-center justify-between mb-6">
                <h1 className="text-2xl font-bold mb-6">{t("login.title")}</h1>
                <Link to="/register" className="text-sm text-blue-600 hover:underline mb-4 inline-block">
                    {t("login.noAccount")}
                </Link>
            </div>


            {apiError && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
                    {apiError}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

                <div>
                    <label className="block text-sm font-medium mb-1">{t("login.email")}</label>
                    <input
                        {...register("email")}
                        type="email"
                        className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.email && (
                        <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors cursor-pointer disabled:cursor-not-allowed"
                >
                    {isSubmitting ? t("login.submitting") : t("login.submit")}
                </button>

            </form>
        </div >
    );
}