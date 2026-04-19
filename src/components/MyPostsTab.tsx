import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { getUserPosts } from "@/api/posts";
import type { Post } from "@/types/Post";
import PostCard from "./PostCard";
import NewPostForm from "./NewPostForm";
import { useTranslation } from "react-i18next";
import { useLoader } from "@/context/LoaderContext";
import { Button } from "@/components/ui/button";

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
                <p className="text-2xl font-semibold">{t("posts.yourPosts")}</p>
                <Button
                    onClick={() => setShowNewPostForm((prev) => !prev)}
                    className="bg-gray-900 hover:bg-gray-800 cursor-pointer py-5 px-6 rounded-lg text-white"
                >
                    {showNewPostForm ? t("posts.cancel") : t("posts.newPost")}
                </Button>
            </div>

            {showNewPostForm && (
                <NewPostForm
                    onPostCreated={handlePostCreated}
                    onCancel={() => setShowNewPostForm(false)}
                />
            )}

            {posts.length === 0 && !showNewPostForm ? (
                <p className="text-lg text-gray-700">{t("posts.noPostsYet")}</p>
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