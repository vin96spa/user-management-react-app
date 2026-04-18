import { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { getAllPosts } from "../api/posts";
import type { Post } from "../types/Post";
import PostCard from "./PostCard";

export default function AllPostsTab() {
    const token = useAuthStore((state) => state.token);
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!token) return;
        getAllPosts(token)
            .then(setPosts)
            .finally(() => setIsLoading(false));
    }, [token]);

    return (
        <div>
            <p className="text-sm text-gray-500 mb-4">
                Posts from all users
            </p>

            {isLoading ? (
                <p className="text-gray-400">Loading posts...</p>
            ) : posts.length === 0 ? (
                <p className="text-gray-400">No posts found.</p>
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