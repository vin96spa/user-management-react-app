import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterFormData } from "../../validations/registerSchema";
import { updateUser } from "../../api/users";
import { useAuthStore } from "../../store/authStore";
import type { User } from "../../types/User";
import UserForm from "../UserForm";
import { useTranslation } from "react-i18next";

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
        onUpdated(updatedUser);
        onClose();
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-white rounded shadow-lg w-full max-w-md p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-lg font-bold mb-4">{t("admin.editModal.title")}</h3>

                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

                        <UserForm />

                        <div className="flex gap-2 justify-end mt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-sm rounded border hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                                {t("admin.editModal.cancel")}
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting || !isDirty}
                                className="px-4 py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors cursor-pointer disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? t("admin.editModal.saving") : t("admin.editModal.save")}
                            </button>
                        </div>
                    </form>
                </FormProvider>
            </div>
        </div>
    );
}