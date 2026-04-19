import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/store/authStore";
import { type Post } from "@/types/Post";
import { createPost } from "@/api/posts";
import { type PostFormData, postSchema } from "@/validations/postSchema";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

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
        <Card className="mb-4 p-5">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg">{t("posts.newPostCardTitle")}</CardTitle>
            </CardHeader>
            <CardContent>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-4"
                >
                    <div className="flex flex-col gap-1.5">
                        <Input
                            {...register("title")}
                            placeholder={t("posts.newPostTitle")}
                        />
                        {errors.title && (
                            <p className="text-destructive text-xs">{errors.title.message}</p>
                        )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Textarea
                            {...register("body")}
                            placeholder={t("posts.newPostBody")}
                            rows={4}
                            className="resize-none"
                        />
                        {errors.body && (
                            <p className="text-destructive text-xs">{errors.body.message}</p>
                        )}
                    </div>

                    <div className="flex gap-2 justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                            className="cursor-pointer"
                        >
                            {t("posts.cancel")}
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-gray-900 cursor-pointer hover:bg-gray-800 disabled:opacity-50 transition-colors"
                        >
                            {isSubmitting && <Loader2 size={13} className="animate-spin" />}
                            {isSubmitting ? t("posts.publishing") : t("posts.publish")}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}