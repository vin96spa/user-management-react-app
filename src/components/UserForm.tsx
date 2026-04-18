import { useFormContext } from "react-hook-form";
import type { RegisterFormData } from "../validations/registerSchema";

// useFormContext reads the form from context instead of receiving it as a prop
// this allows using the component inside any useForm
export default function UserForm() {
    const { register, formState: { errors } } = useFormContext<RegisterFormData>();

    return (
        <div className="flex flex-col gap-4">
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
        </div>
    );
}