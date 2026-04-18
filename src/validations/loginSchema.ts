import { z } from "zod";

export const loginSchema = z.object({
    email: z.email("Invalid email address"),
    token: z.string().min(1, "Token is required"),
});

export type LoginFormData = z.infer<typeof loginSchema>;