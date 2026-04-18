import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getUserById, updateUser, deleteUser } from "../api/users";
import { useAuthStore } from "../store/authStore";
import { type RegisterFormData, registerSchema } from "../validations/registerSchema";
import UserForm from "../components/UserForm";
import { FormProvider } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useLoader } from "../context/LoaderContext";

export default function UserSettingsPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const userId = useAuthStore((state) => state.userId);
    const token = useAuthStore((state) => state.token);
    const logout = useAuthStore((state) => state.logout);
    const login = useAuthStore((state) => state.login);
    const { showLoader, hideLoader } = useLoader();

    const [apiError, setApiError] = useState<string | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const methods = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const { handleSubmit, reset, formState: { isSubmitting, isDirty } } = methods;

    // load user data and pre-populate the form
    useEffect(() => {
        if (!userId || !token) return;
        showLoader();
        getUserById(userId, token)
            .then((user: RegisterFormData) => {
                // reset() with values pre-populates the form
                reset({
                    name: user.name,
                    email: user.email,
                    gender: user.gender,
                });
            })
            .finally(() => hideLoader());
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
            setApiError(t("settings.updateError"));
        }
    };

    const handleDelete = async () => {
        if (!userId || !token) return;

        try {
            await deleteUser(userId, token);
            logout();
            navigate("/login");
        } catch {
            setApiError(t("settings.deleteError"));
        }
    };

    return (
        <div className="max-w-lg">
            <h2 className="text-2xl font-bold mb-6">{t("settings.title")}</h2>

            {apiError && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
                    {apiError}
                </div>
            )}

            {/* Edit Form */}
            <FormProvider {...methods}>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <UserForm />

                    <button
                        type="submit"
                        disabled={isSubmitting || !isDirty}
                        className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors cursor-pointer disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? t("settings.saving") : t("settings.save")}
                    </button>
                </form>
            </FormProvider>


            {/* Delete section — visually separated */}
            <div className="mt-10 border-t pt-6">
                <h3 className="text-lg font-semibold text-red-600 mb-1">
                    {t("settings.dangerZone")}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                    {t("settings.dangerZoneDesc")}
                </p>

                {!showDeleteConfirm ? (
                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="px-4 py-2 text-sm rounded border border-red-500 text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                        {t("settings.deleteAccount")}
                    </button>
                ) : (
                    <div className="flex flex-col gap-2">
                        <p className="text-sm font-medium text-red-600">
                            {t("settings.confirmDelete")}
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 text-sm rounded bg-red-600 text-white hover:bg-red-700 transition-colors cursor-pointer"
                            >
                                {t("settings.confirmDeleteBtn")}
                            </button>
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="px-4 py-2 text-sm rounded border hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                                {t("settings.cancel")}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}