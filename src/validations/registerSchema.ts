import { z } from "zod";

export const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.email("Invalid email address"),
    gender: z.enum(["male", "female"], { message: "Select a gender" }),
});

export type RegisterFormData = z.infer<typeof registerSchema>;