import { useFormContext } from "react-hook-form";
import type { RegisterFormData } from "../validations/registerSchema";
import { useTranslation } from "react-i18next";

// useFormContext reads the form from context instead of receiving it as a prop
// this allows using the component inside any useForm
export default function UserForm() {
    const {t} = useTranslation();
    const { register, formState: { errors } } = useFormContext<RegisterFormData>();

    return (
        <div className="flex flex-col gap-4">
            <div>
                <label className="block text-sm font-medium mb-1">{t("register.name")}</label>
                <input
                    {...register("name")}
                    className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">{t("register.email")}</label>
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
                <label className="block text-sm font-medium mb-1">{t("register.gender")}</label>
                <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                        <input
                            className="cursor-pointer"
                            type="radio"
                            value="male"
                            {...register("gender")}
                        />
                        {t("register.genderMale")}
                    </label>
                    <label className="flex items-center gap-2">
                        <input
                            className="cursor-pointer"
                            type="radio"
                            value="female"
                            {...register("gender")}
                        />
                        {t("register.genderFemale")}
                    </label>
                </div>
                {errors.gender && (
                    <p className="text-red-500 text-xs mt-1">{errors.gender.message}</p>
                )}
            </div>
        </div>
    );
}