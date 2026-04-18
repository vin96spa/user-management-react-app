import { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { getUserPosts } from "../api/posts";
import type { Post } from "../types/Post";
import PostCard from "./PostCard";
import NewPostForm from "./NewPostForm";
import { useTranslation } from "react-i18next";
import { useLoader } from "../context/LoaderContext";

export default function MyPostsTab() {
    const { t } = useTranslation();
    const userId = useAuthStore((state) => state.userId);
    const token = useAuthStore((state) => state.token);
    const { showLoader, hideLoader } = useLoader();

    const [posts, setPosts] = useState<Post[]>([]);
    const [showNewPostForm, setShowNewPostForm] = useState(false);

    useEffect(() => {
        if (!userId || !token) return;
        showLoader();
        getUserPosts(userId, token)
            .then(setPosts)
            .finally(() => hideLoader());
    }, [userId, token]);

    const handlePostCreated = (newPost: Post) => {
        setPosts((prev) => [newPost, ...prev]);
        setShowNewPostForm(false);
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-500">{t("posts.yourPosts")}</p>
                <button
                    onClick={() => setShowNewPostForm((prev) => !prev)}
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors cursor-pointer"
                >
                    {showNewPostForm ? t("posts.cancel") : t("posts.newPost")}
                </button>
            </div>

            {showNewPostForm && (
                <NewPostForm
                    onPostCreated={handlePostCreated}
                    onCancel={() => setShowNewPostForm(false)}
                />
            )}

            {posts.length === 0 ? (
                <p className="text-gray-400">{t("posts.noPostsYet")}</p>
            ) : (
                <div className="flex flex-col gap-4">
                    {posts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
            )}
        </div>
    );
}