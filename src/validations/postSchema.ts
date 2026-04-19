import { z } from "zod";

export const postSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters").max(25, "Comment must be of max 25 characters"),
    body: z.string().min(10, "Body must be at least 10 characters")
});

export type PostFormData = z.infer<typeof postSchema>;

export const commentSchema = z.object({
    body: z.string().min(5, "Comment must be at least 5 characters").max(100, "Comment must be of max 100 characters"),
});

export type CommentFormData = z.infer<typeof commentSchema>;