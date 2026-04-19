import { useState } from "react";
import type { Post } from "@/types/Post";
import CommentSection from "./CommentSection";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Share2, Check } from "lucide-react";

interface Props {
    post: Post;
}

export default function PostCard({ post }: Props) {
    const { t } = useTranslation();
    const [showComments, setShowComments] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        // copy a simulated link to the clipboard
        await navigator.clipboard.writeText(
            `${window.location.origin}/posts/${post.id}`
        );
        setCopied(true);
        // reset feedback after 2 seconds
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Card>
            <CardContent>
                <h3 className="font-semibold text-lg">{post.title}</h3>
                <p className="text-muted-foreground text-sm mt-1">{post.body}</p>

                <div className="flex gap-2 mt-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowComments((prev) => !prev)}
                        className="cursor-pointer text-muted-foreground hover:text-foreground gap-1.5"
                    >
                        <MessageSquare size={14} />
                        {showComments ? t("posts.hideComments") : t("posts.comments")}
                    </Button>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleShare}
                        className="cursor-pointer text-muted-foreground hover:text-foreground gap-1.5"
                    >
                        {copied ? <Check size={14} className="text-green-500" /> : <Share2 size={14} />}
                        {copied ? t("posts.copied") : t("posts.share")}
                    </Button>
                </div>

                {showComments && <CommentSection postId={post.id} />}
            </CardContent>
        </Card>
    );
}