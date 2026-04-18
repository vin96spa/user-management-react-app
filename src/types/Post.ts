export interface Post {
    id: number;
    user_id: number;
    title: string;
    body: string;
}

export interface Comment {
    id: number;
    post_id: number;
    name: string;
    email: string;
    body: string;
}

export type CreatePostPayload = Omit<Post, "id">;