import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/store/authStore";
import { getPostById } from "@/api/posts";
import { useLoader } from "@/context/LoaderContext";
import type { Post } from "@/types/Post";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageSquare } from "lucide-react";
import CommentSection from "@/components/CommentSection";

export default function PostDetailPage() {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const token = useAuthStore((state) => state.token);
    const { showLoader, hideLoader } = useLoader();

    const [post, setPost] = useState<Post | null>(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!id || !token) return;
        showLoader();
        getPostById(Number(id), token)
            .then(setPost)
            .catch(() => setError(true))
            .finally(() => hideLoader());
    }, [id, token]);

    if (error) {
        return (
            <div className="max-w-2xl mx-auto flex flex-col items-center gap-4 mt-10">
                <p className="text-gray-900 text-lg font-semibold">{t("posts.notFound")}</p>
                <Button onClick={() => navigate("/posts")} className="bg-gray-900 hover:bg-gray-800 cursor-pointer">
                    <ArrowLeft size={14} />
                    {t("posts.backToPosts")}
                </Button>
            </div>
        );
    }

    if (!post) return null;

    return (
        <div className="max-w-2xl mx-auto flex flex-col gap-6">
            <Button
                size="sm"
                onClick={() => navigate("/posts")}
                className="cursor-pointer bg-gray-900 hover:bg-gray-800 text-white w-fit"
            >
                <ArrowLeft size={14} />
                {t("posts.backToPosts")}
            </Button>

            <Card className="p-8">
                <CardHeader>
                    <CardTitle className="text-xl">{post.title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-sm leading-relaxed">{post.body}</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2 text-sm font-medium">
                        <MessageSquare size={15} />
                        {t("posts.comments")}
                    </div>
                </CardHeader>
                <CardContent>
                    <CommentSection postId={post.id} />
                </CardContent>
            </Card>
        </div>
    );
}