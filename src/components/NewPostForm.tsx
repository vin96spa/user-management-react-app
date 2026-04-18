import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "../store/authStore";
import { type Post } from "../types/Post";
import { createPost } from "../api/posts";
import { type PostFormData, postSchema } from "../validations/postSchema";
import { useTranslation } from "react-i18next";

interface Props {
    onPostCreated: (post: Post) => void;
    onCancel: () => void;
}

export default function NewPostForm({ onPostCreated, onCancel }: Props) {
    const { t } = useTranslation();

    const userId = useAuthStore((state) => state.userId);
    const token = useAuthStore((state) => state.token);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<PostFormData>({
        resolver: zodResolver(postSchema),
    });

    const onSubmit = async (data: PostFormData) => {
        if (!userId || !token) return;

        const newPost = await createPost(
            { ...data, user_id: userId },
            token
        );
        onPostCreated(newPost);
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white p-4 rounded shadow mb-4 flex flex-col gap-3"
        >
            <h2 className="font-semibold text-lg">{t("posts.newPost")}</h2>

            <div>
                <input
                    {...register("title")}
                    placeholder={t("posts.newPostTitle")}
                    className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.title && (
                    <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
                )}
            </div>

            <div>
                <textarea
                    {...register("body")}
                    placeholder={t("posts.newPostBody")}
                    rows={4}
                    className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
                {errors.body && (
                    <p className="text-red-500 text-xs mt-1">{errors.body.message}</p>
                )}
            </div>

            <div className="flex gap-2 justify-end">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-sm rounded border hover:bg-gray-50 transition-colors cursor-pointer"
                >
                    {t("posts.cancel")}
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors cursor-pointer disabled:cursor-not-allowed"
                >
                    {isSubmitting ? t("posts.publishing") : t("posts.publish")}
                </button>
            </div>
        </form>
    );
}