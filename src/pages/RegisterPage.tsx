import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { type RegisterFormData, registerSchema } from "../validations/registerSchema";
import { createUser } from "../api/users";
import { useAuthStore } from "../store/authStore";

export default function RegisterPage() {
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);
    const [apiError, setApiError] = useState<string | null>(null);

    const generateEmail = (name: string) => {
        const normalized = name.toLowerCase().replace(/\s+/g, ".");
        return `${normalized}.${Math.floor(Math.random() * 10000)}@test.com`;
    };

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        mode: "onTouched",
        defaultValues: {
            name: "Test User",
            gender: "male",
            status: "active",
            email: generateEmail("Test User"),
            token: import.meta.env.VITE_API_TOKEN || "",
        },
    });

    

    const onSubmit = async (data: RegisterFormData) => {
        setApiError(null);

        try {
            const { token, ...userData } = data;
            const newUser = await createUser(userData, token);
            login(newUser.id, token, newUser.name);
            navigate("/posts");
        } catch (error) {
            setApiError(JSON.stringify(error));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6">Create Account</h1>

                {apiError && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
                        {apiError}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

                    <div>
                        <label className="block text-sm font-medium mb-1">Full Name</label>
                        <input
                            {...register("name")}
                            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.name && (
                            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                        )}
                    </div>

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

                    <div>
                        <label className="block text-sm font-medium mb-1">Gender</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    value="male"
                                    {...register("gender")}
                                />
                                Male
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    value="female"
                                    {...register("gender")}
                                />
                                Female
                            </label>
                        </div>
                        {errors.gender && (
                            <p className="text-red-500 text-xs mt-1">{errors.gender.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">GoRest Token</label>
                        <input
                            {...register("token")}
                            type="password"
                            placeholder="Paste your GoRest token here"
                            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.token && (
                            <p className="text-red-500 text-xs mt-1">{errors.token.message}</p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                            Get your token at{" "}
                        <a
                            href="https://gorest.co.in"
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-500 underline"
                        >
                            gorest.co.in
                        </a>
                    </p>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
                {isSubmitting ? "Creating account..." : "Register"}
            </button>

        </form>
      </div >
    </div >
  );
}