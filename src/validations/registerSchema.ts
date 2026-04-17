import { z } from "zod";

export const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.email("Invalid email address"),
    gender: z.enum(["male", "female"], { message: "Select a gender" }),
    status: z.enum(["active", "inactive"]),
    token: z.string().min(1, "Token is required"),
});

export type RegisterFormData = z.infer<typeof registerSchema>;