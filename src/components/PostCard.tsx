import { useState } from "react";
import type { Post } from "../types/Post";
import CommentSection from "./CommentSection";

interface Props {
    post: Post;
}

export default function PostCard({ post }: Props) {
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
        <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold text-lg">{post.title}</h3>
            <p className="text-gray-600 text-sm mt-1">{post.body}</p>

            <div className="flex gap-3 mt-3">
                <button
                    onClick={() => setShowComments((prev) => !prev)}
                    className="text-sm text-blue-600 hover:underline cursor-pointer"
                >
                    {showComments ? "Hide Comments" : "💬 Comments"}
                </button>

                <button
                    onClick={handleShare}
                    className="text-sm text-blue-600 hover:underline cursor-pointer"
                >
                    {copied ? "✅ Copied!" : "🔗 Share"}
                </button>
            </div>

            {/* CommentSection mounts only when showComments is true */}
            {showComments && <CommentSection postId={post.id} />}
        </div>
    );
}