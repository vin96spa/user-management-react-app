import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterFormData } from "@/validations/registerSchema";
import { updateUser } from "@/api/users";
import { useAuthStore } from "@/store/authStore";
import type { User } from "@/types/User";
import UserForm from "@/components/UserForm";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface Props {
    user: User;
    onClose: () => void;
    onUpdated: (updatedUser: User) => void;
}

export default function EditUserModal({ user, onClose, onUpdated }: Props) {
    const token = useAuthStore((state) => state.token);
    const { t } = useTranslation();

    const methods = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: user.name,
            email: user.email,
            gender: user.gender,
        },
    });

    const { handleSubmit, formState: { isSubmitting, isDirty } } = methods;

    const onSubmit = async (data: RegisterFormData) => {
        const updatedUser = await updateUser(user.id, data, token || "");
        toast.info(t("common.updateUserSuccess"));
        onUpdated(updatedUser);
        onClose();
    };

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent
                className="p-8"
                aria-describedby={undefined}
                onOpenAutoFocus={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">{t("admin.editModal.title")}</DialogTitle>
                </DialogHeader>

                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

                        <UserForm />

                        <div className="flex gap-2 justify-end mt-2">
                            <Button
                                size="lg"
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                className="cursor-pointer"
                            >
                                {t("admin.editModal.cancel")}
                            </Button>
                            <Button
                                size="lg"
                                type="submit"
                                disabled={isSubmitting || !isDirty}
                                className="bg-blue-600 hover:bg-blue-500 cursor-pointer"
                            >
                                {isSubmitting && <Loader2 className="animate-spin" />}
                                {isSubmitting ? t("admin.editModal.saving") : t("admin.editModal.save")}
                            </Button>
                        </div>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    );
}