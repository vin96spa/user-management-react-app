import { useFormContext } from "react-hook-form";
import type { RegisterFormData } from "@/validations/registerSchema";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Controller } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const GENDER_OPTIONS = [
    { value: "male", labelKey: "register.genderMale" },
    { value: "female", labelKey: "register.genderFemale" },
] as const;

// useFormContext reads the form from context instead of receiving it as a prop
// this allows using the component inside any useForm
export default function UserForm({ isAdmin }: { isAdmin: boolean }) {
    const {t} = useTranslation();
    const { register, control, formState: { errors } } = useFormContext<RegisterFormData>();

    return (
        <div className="flex flex-col gap-4">
            {/* Name */}
            <div className="flex flex-col gap-2">
                <Label htmlFor="name">{t("register.name")}</Label>
                <Input id="name" {...register("name")} autoComplete="name" />
                {errors.name && (
                    <p className="text-destructive text-xs" role="alert">
                        {errors.name.message}
                    </p>
                )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
                <Label htmlFor="email">{t("register.email")}</Label>
                <Input id="email" type="email" {...register("email")} autoComplete="email" disabled={isAdmin} />
                {errors.email && (
                    <p className="text-destructive text-xs" role="alert">
                        {errors.email.message}
                    </p>
                )}
            </div>

            {/* Gender */}
            <div className="flex flex-col gap-2">
                <Label>{t("register.gender")}</Label>
                <Controller
                    name="gender"
                    control={control}
                    render={({ field }) => (
                        <RadioGroup
                            value={field.value}
                            onValueChange={field.onChange}
                            className="flex gap-4"
                        >
                            {GENDER_OPTIONS.map(({ value, labelKey }) => (
                                <div key={value} className="flex items-center gap-2">
                                    <RadioGroupItem value={value} id={`gender-${value}`} className="cursor-pointer" />
                                    <Label htmlFor={`gender-${value}`} className="cursor-pointer font-normal">
                                        {t(labelKey)}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                    )}
                />
                {errors.gender && (
                    <p className="text-destructive text-xs" role="alert">
                        {errors.gender.message}
                    </p>
                )}
            </div>
        </div>
    );
}