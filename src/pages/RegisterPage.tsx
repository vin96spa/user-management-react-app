import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { type RegisterFormData, registerSchema } from "@/validations/registerSchema";
import { createUser } from "@/api/users";
import { useAuthStore } from "@/store/authStore";
import UserForm from "@/components/UserForm";
import { FormProvider } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";



export default function RegisterPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);
    const [apiError, setApiError] = useState<string | null>(null);

    const generateEmail = (name: string) => {
        const normalized = name.toLowerCase().replace(/\s+/g, ".");
        return `${normalized}.${Math.floor(Math.random() * 10000)}@/test.com`;
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
            toast.success(t("common.registerSuccess"));

            login(newUser.id, token, newUser.name, newUser.email);
            navigate("/posts");
        } catch (error) {
            setApiError(JSON.stringify(error));
        }
    };

    return (
        <Card className="w-full max-w-md shadow-sm p-8">
            <CardHeader>
                <CardTitle className="text-xl font-semibold">{t("register.title")}</CardTitle>
                {apiError && (
                    <div className="mt-2 p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-sm">
                        {apiError}
                    </div>
                )}
            </CardHeader>
            <CardContent className="py-2">
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
                        <UserForm />
                        <Button
                            type="submit"
                            size="lg"
                            disabled={isSubmitting}
                            className="w-full bg-gray-900 text-white hover:bg-gray-700 disabled:opacity-50 transition-colors cursor-pointer"
                        >
                            {isSubmitting ?
                                <>
                                    <Loader2 className="animate-spin" />
                                    {t("register.submitting")}
                                </>
                                : t("register.submit")}
                        </Button>
                    </form>
                </FormProvider>
            </CardContent>

            <CardFooter className="border-t -mx-8 px-8 py-5 flex items-center justify-center gap-0.5">
                {/* link login */}
                <span className="text-xs text-muted-foreground">{t("register.haveAccount")} </span>
                <Link
                    to="/login"
                    className="text-xs font-medium text-gray-900 hover:underline"
                >
                    {t("register.login")}
                </Link>
            </CardFooter>
        </Card>

    );
}