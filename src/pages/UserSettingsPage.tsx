import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getUserById, updateUser, deleteUser } from "../api/users";
import { useAuthStore } from "../store/authStore";
import { type RegisterFormData, registerSchema } from "../validations/registerSchema";

export default function UserSettingsPage() {
    const navigate = useNavigate();
    const userId = useAuthStore((state) => state.userId);
    const token = useAuthStore((state) => state.token);
    const logout = useAuthStore((state) => state.logout);
    const login = useAuthStore((state) => state.login);

    const [isLoadingUser, setIsLoadingUser] = useState(true);
    const [apiError, setApiError] = useState<string | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting, isDirty },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    // load user data and pre-populate the form
    useEffect(() => {
        if (!userId || !token) return;

        getUserById(userId, token)
            .then((user: RegisterFormData) => {
                // reset() with values pre-populates the form
                reset({
                    name: user.name,
                    email: user.email,
                    gender: user.gender,
                });
            })
            .finally(() => setIsLoadingUser(false));
    }, [userId, token, reset]);

    const onSubmit = async (data: RegisterFormData) => {
        if (!userId || !token) return;
        setApiError(null);

        try {
            const updatedUser = await updateUser(userId, data, token);
            login(userId, token, updatedUser.name, updatedUser.email); // update auth store with new name/email
            // use reset() to update the form with the latest saved data and also mark it as not dirty
            reset({
                name: updatedUser.name,
                email: updatedUser.email,
                gender: updatedUser.gender,
            });
        } catch {
            setApiError("Failed to update account. Please try again.");
        }
    };

    const handleDelete = async () => {
        if (!userId || !token) return;

        try {
            await deleteUser(userId, token);
            logout();
            navigate("/login");
        } catch {
            setApiError("Failed to delete account. Please try again.");
        }
    };

    if (isLoadingUser) {
        return <p className="text-gray-400">Loading your account...</p>;
    }

    return (
        <div className="max-w-lg">
            <h2 className="text-2xl font-bold mb-6">My Account</h2>

            {apiError && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
                    {apiError}
                </div>
            )}

            {/* Edit Form */}
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
                                className="cursor-pointer"
                                type="radio"
                                value="male"
                                {...register("gender")}
                            />
                            Male
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                className="cursor-pointer"
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

                <button
                    type="submit"
                    disabled={isSubmitting || !isDirty}
                    className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors cursor-pointer disabled:cursor-not-allowed"
                >
                    {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
            </form>

            {/* Delete section — visually separated */}
            <div className="mt-10 border-t pt-6">
                <h3 className="text-lg font-semibold text-red-600 mb-1">
                    Danger Zone
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                    Once you delete your account, there is no going back.
                </p>

                {!showDeleteConfirm ? (
                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="px-4 py-2 text-sm rounded border border-red-500 text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                        Delete Account
                    </button>
                ) : (
                    <div className="flex flex-col gap-2">
                        <p className="text-sm font-medium text-red-600">
                            Are you sure? This action cannot be undone.
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 text-sm rounded bg-red-600 text-white hover:bg-red-700 transition-colors cursor-pointer"
                            >
                                Yes, delete my account
                            </button>
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="px-4 py-2 text-sm rounded border hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}