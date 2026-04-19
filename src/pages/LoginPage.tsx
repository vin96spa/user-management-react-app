import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getUserByEmail } from "@/api/users";
import { useAuthStore } from "@/store/authStore";
import { type LoginFormData, loginSchema } from "@/validations/loginSchema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Card, CardTitle, CardDescription, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";

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
            toast.info(t("common.loginSuccess"));
            login(user[0].id, token, user[0].name, user[0].email, isAdmin);
            navigate(isAdmin ? "/admin/dashboard" : "/posts");

        } catch {
            toast.error(t("common.error"));
            setApiError(t("login.genericError"));
        }
    };

    return (
        <Card className="w-full max-w-md shadow-sm p-8">
            <CardHeader>
                <CardTitle className="text-xl font-semibold">{t("login.title")}</CardTitle>
                <CardDescription>{t("login.subtitle")}</CardDescription>
                {/* API errors */}
                {apiError && (
                    <div className="mt-2 p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-sm">
                        {apiError}
                    </div>
                )}
            </CardHeader>

            <CardContent className="py-2">
                {/* form */}
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    {/* Email */}
                    <div className="flex flex-col gap-2 py-2">
                        <Label htmlFor="email">{t("login.email")}</Label>
                        <Input id="email" type="email" {...register("email")} autoComplete="email" />
                        {errors.email && (
                            <p className="text-destructive text-xs" role="alert">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        size="lg"
                        disabled={isSubmitting}
                        className="w-full bg-gray-900 text-white hover:bg-gray-700 disabled:opacity-50 transition-colors cursor-pointer"
                    >
                        {isSubmitting ?
                            <>
                                <Loader2 className="animate-spin" />
                                {t("login.submitting")}
                            </>
                            : t("login.submit")}
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="border-t -mx-8 px-8 py-5 flex items-center justify-center gap-0.5">
                {/* link register */}
                <span className="text-xs text-muted-foreground">{t("login.noAccount")}</span>
                <Link
                    to="/register"
                    className="text-xs font-medium text-foreground hover:underline"
                >
                    {t("login.register")}
                </Link>
            </CardFooter>

        </Card>
    );
}