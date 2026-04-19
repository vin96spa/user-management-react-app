import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { commentSchema, type CommentFormData } from "@/validations/postSchema";
import { getPostComments, createComment } from "@/api/posts";
import { useAuthStore } from "@/store/authStore";
import type { Comment } from "@/types/Post";
import { useTranslation } from "react-i18next";
import { useLoader } from "@/context/LoaderContext";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface Props {
    postId: number;
}

export default function CommentSection({ postId }: Props) {
    const { t } = useTranslation();
    const token = useAuthStore((state) => state.token);
    const [comments, setComments] = useState<Comment[]>([]);
    const name = useAuthStore((state) => state.userName);
    const email = useAuthStore((state) => state.userEmail);
    const { showLoader, hideLoader } = useLoader();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CommentFormData>({
        resolver: zodResolver(commentSchema),
    });

    // load comments when the component mounts
    useEffect(() => {
        if (!token) return;
        showLoader();
        getPostComments(postId, token)
            .then(setComments)
            .finally(() => hideLoader());
    }, [postId, token]);

    const onSubmit = async (data: CommentFormData) => {
        if (!token) return;
        const payload = {
            ...data,
            name: name || "Anonymous",
            email: email || "",
        };
        const newComment = await createComment(postId, payload, token);
        setComments((prev) => [newComment, ...prev]);
        reset();
    };

    return (
        <div className="mt-4 border-t pt-4">
            {/* comment list */}
            {
                comments.length === 0 ? (
                    <p className="text-sm text-muted-foreground font-semibold mb-3">{t("comments.noComments")}</p>
                ) : (
                            <ul className="flex flex-col gap-2 mb-4 max-h-40 overflow-y-auto pr-1">
                        {
                            comments.map((comment) => (
                                <li key={comment.id} className="text-sm bg-muted rounded-lg px-3 py-2">
                                    <p className="font-medium"> {comment.name} </p>
                                    <p className="font-muted-foreground"> {comment.body} </p>
                                </li>
                            ))
                        }
                    </ul>
                )
            }

            {/* new comment form */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2" >
                <div>
                    <Textarea
                        {...register("body")}
                        placeholder={t("comments.bodyPlaceholder")}
                        rows={2}
                        className="resize-none text-sm"
                    />
                    {
                        errors.body && (
                            <p className="text-destructive text-xs mt-1"> {errors.body.message} </p>
                        )
                    }
                </div>

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="self-end cursor-pointer py-4 bg-gray-900 hover:bg-gray-800"
                >
                    {isSubmitting && <Loader2 size={13} className="animate-spin" />}
                    {isSubmitting ? t("comments.submitting") : t("comments.submit")}
                </Button>
            </form>
        </div>
    );
}