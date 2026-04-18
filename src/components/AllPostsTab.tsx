import { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { getAllPosts } from "../api/posts";
import type { Post } from "../types/Post";
import PostCard from "./PostCard";
import { useTranslation } from "react-i18next";
import { useLoader } from "../context/LoaderContext";

export default function AllPostsTab() {
    const { t } = useTranslation();
    const token = useAuthStore((state) => state.token);
    const [posts, setPosts] = useState<Post[]>([]);
    const { showLoader, hideLoader } = useLoader();

    useEffect(() => {
        if (!token) return;
        showLoader();
        getAllPosts(token)
            .then(setPosts)
            .finally(() => hideLoader());
    }, [token]);

    return (
        <div>
            <p className="text-sm text-gray-500 mb-4">
                {t("posts.othersPosts")}
            </p>

            {posts.length === 0 ? (
                <p className="text-gray-400">{t("posts.noPosts")}</p>
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