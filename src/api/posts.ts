import { apiClient } from "./client";
import { type CreatePostPayload } from "@/types/Post";
import { type Comment } from "@/types/Post";

export const getAllPosts = (token: string) =>
    apiClient("/posts", { method: "GET" }, token);

export const getUserPosts = (userId: number, token: string) =>
    apiClient(`/users/${userId}/posts`, { method: "GET" }, token);

export const createPost = (payload: CreatePostPayload, token: string) =>
    apiClient(`/posts`, { method: "POST", body: JSON.stringify(payload) }, token);

export const getPostComments = (postId: number, token: string) =>
    apiClient(`/posts/${postId}/comments`, { method: "GET" }, token);

export const createComment = (
    postId: number,
    payload: Omit<Comment, "id" | "post_id">,
    token: string
) =>
    apiClient(`/posts/${postId}/comments`, { method: "POST", body: JSON.stringify(payload) }, token);