import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { commentSchema, type CommentFormData } from "../validations/postSchema";
import { getPostComments, createComment } from "../api/posts";
import { useAuthStore } from "../store/authStore";
import type { Comment } from "../types/Post";

interface Props {
    postId: number;
}

export default function CommentSection({ postId }: Props) {
    const token = useAuthStore((state) => state.token);
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const name = useAuthStore((state) => state.userName);
    const email = useAuthStore((state) => state.userEmail);

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
        getPostComments(postId, token)
            .then(setComments)
            .finally(() => setIsLoading(false));
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
        <div className="mt-3 border-t pt-3">
            {/* comment list */}
            {
                isLoading ? (
                    <p className="text-sm text-gray-400"> Loading comments...</p>
                ) : comments.length === 0 ? (
                    <p className="text-sm text-gray-400"> No comments yet.</p>
                ) : (
                            <ul className="flex flex-col gap-2 mb-3 max-h-40 overflow-y-auto pr-1">
                        {
                            comments.map((comment) => (
                                <li key={comment.id} className="text-sm bg-gray-50 rounded p-2">
                                    <p className="font-medium"> {comment.name} </p>
                                    <p className="text-gray-600"> {comment.body} </p>
                                </li>
                            ))
                        }
                    </ul>
                )
            }

            {/* new comment form */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2" >
                <div>
                    <textarea
                        {...register("body")}
                        placeholder="Write a comment..."
                        rows={2}
                        className="w-full border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                    {
                        errors.body && (
                            <p className="text-red-500 text-xs mt-1"> {errors.body.message} </p>
                        )
                    }
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="self-end px-3 py-1.5 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                    {isSubmitting ? "Posting..." : "Post Comment"}
                </button>
            </form>
        </div>
    );
}