import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getUserById, updateUser, deleteUser } from "@/api/users";
import { useAuthStore } from "@/store/authStore";
import { type RegisterFormData, registerSchema } from "@/validations/registerSchema";
import UserForm from "@/components/UserForm";
import { FormProvider } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useLoader } from "@/context/LoaderContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

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
        <div className="max-w-lg flex flex-col mx-auto">
            <h2 className="text-2xl font-bold mb-6">{t("settings.title")}</h2>

            {apiError && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-sm">
                    {apiError}
                </div>
            )}

            {/* Edit Form */}
            <Card className="p-8">
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold">
                        {t("settings.editProfile")}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <FormProvider {...methods}>
                        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                            <UserForm />
                            <Button
                                type="submit"
                                size="lg"
                                disabled={isSubmitting || !isDirty}
                                className="w-full mt-2 cursor-pointer bg-gray-900 hover:bg-gray-800 text-white transition-colors"
                            >
                                {isSubmitting && <Loader2 className="animate-spin" />}
                                {isSubmitting ? t("settings.saving") : t("settings.save")}
                            </Button>
                        </form>
                    </FormProvider>
                </CardContent>
            </Card>


            {/* Delete section — visually separated */}
            <Card className="mt-2 p-8 border-red-300">
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold text-red-600">
                        {t("settings.dangerZone")}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                        {t("settings.dangerZoneDesc")}
                    </CardDescription>
                </CardHeader>
                <CardContent>

                    {!showDeleteConfirm ? (
                        <Button
                            variant="outline"
                            onClick={() => setShowDeleteConfirm(true)}
                            className="cursor-pointer border-red-300 text-red-500 hover:bg-red-50 hover:text-red-600"

                        >
                            {t("settings.deleteAccount")}
                        </Button>
                    ) : (
                        <div className="flex flex-col gap-3">
                            <p className="text-sm font-medium text-red-600">
                                {t("settings.confirmDelete")}
                            </p>
                            <div className="flex gap-2">
                                <Button
                                    onClick={handleDelete}
                                    className="cursor-pointer bg-red-600 hover:bg-red-700 text-white"
                                >
                                    {t("settings.confirmDeleteBtn")}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="cursor-pointer"

                                >
                                    {t("settings.cancel")}
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}