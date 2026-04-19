import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { type RegisterFormData, registerSchema } from "../validations/registerSchema";
import { createUser } from "../api/users";
import { useAuthStore } from "../store/authStore";
import UserForm from "../components/UserForm";
import { FormProvider } from "react-hook-form";
import { useTranslation } from "react-i18next";



export default function RegisterPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);
    const [apiError, setApiError] = useState<string | null>(null);

    const generateEmail = (name: string) => {
        const normalized = name.toLowerCase().replace(/\s+/g, ".");
        return `${normalized}.${Math.floor(Math.random() * 10000)}@test.com`;
    };

    const methods = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        mode: "onTouched",
        defaultValues: {
            name: "Test User",
            gender: "male",
            email: generateEmail("Test User"),
        },
    });

    const { handleSubmit, formState: { isSubmitting } } = methods;



    const onSubmit = async (data: RegisterFormData) => {
        setApiError(null);

        try {
            const token = import.meta.env.VITE_API_TOKEN || "";
            const newUser = await createUser({ ...data, status: "active" }, token);
            login(newUser.id, token, newUser.name, newUser.email);
            navigate("/posts");
        } catch (error) {
            setApiError(JSON.stringify(error));
        }
    };

    return (
        <div className="flex-1 flex items-center justify-center px-4 pb-10">
            <div className="bg-white rounded-2xl p-8 shadow w-full max-w-md">

                {/* header */}
                <div className="mb-6">
                    <p className="text-xl font-semibold text-gray-900 mb-1">
                        {t("register.title")}
                    </p>
                </div>

                {apiError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm">
                        {apiError}
                    </div>
                )}

                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
                        <UserForm />
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-gray-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 disabled:opacity-50 transition-colors cursor-pointer disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? t("register.submitting") : t("register.submit")}
                        </button>
                    </form>
                </FormProvider>

                {/* link login */}
                <div className="mt-6 pt-5 border-t border-gray-100 text-center">
                    <span className="text-xs text-gray-400">{t("register.haveAccount")} </span>
                    <Link
                        to="/login"
                        className="text-xs font-medium text-gray-900 hover:underline"
                    >
                        {t("register.login")}
                    </Link>
                </div>
            </div >
        </div>
    );
}