import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { getUserByEmail } from "../api/users";
import { useAuthStore } from "../store/authStore";
import { type LoginFormData, loginSchema } from "../validations/loginSchema";

export default function LoginPage() {
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
        defaultValues: {
            token: import.meta.env.VITE_API_TOKEN || "",
        },
    });



    const onSubmit = async (data: LoginFormData) => {
        setApiError(null);

        try {
            const user = await getUserByEmail(data.email, data.token);
            if (data.email == "admin@admin.com") {
                login(user[0].id, data.token, user[0].name);
                useAuthStore.setState({ isAdmin: true });
                navigate("/admin/dashboard");
                return;
            }
            login(user[0].id, data.token, user[0].name);
            navigate("/posts");
        } catch (error) {
            setApiError(JSON.stringify(error));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow w-full max-w-md">
                <div className="flex center items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold mb-6">Login</h1>
                    <Link to="/register" className="text-sm text-blue-600 hover:underline mb-4 inline-block">
                        Don't have an account? Register
                    </Link>
                </div>
                

                {apiError && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
                        {apiError}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
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
                        className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                        {isSubmitting ? "Logging in..." : "Login"}
                    </button>

                </form>
            </div >
        </div >
    );
}