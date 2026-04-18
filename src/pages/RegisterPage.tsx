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
        <div className="bg-white p-8 rounded shadow w-full max-w-md">
            <div className="flex center items-center justify-between mb-6">
                <h1 className="text-2xl font-bold mb-6">{t("register.title")}</h1>
                <Link to="/login" className="text-sm text-blue-600 hover:underline mb-4 inline-block">
                    {t("register.haveAccount")}
                </Link>
            </div>

            {apiError && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
                    {apiError}
                </div>
            )}

            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <UserForm />
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors cursor-pointer disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? t("register.submitting") : t("register.submit")}
                    </button>
                </form>
            </FormProvider>

        </div >
    );
}