import { apiClient } from "./client";
import { type CreateUserPayload } from "@/types/User";

export const getUsers = () => apiClient("/users");

export const createUser = (payload: CreateUserPayload, token: string) =>
    apiClient("/users", { method: "POST", body: JSON.stringify(payload) }, token);

export const getUser = (id: number, token: string) => apiClient(`/users/${id}`, { method: "GET" }, token);

export const getUserByEmail = (email: string, token: string) =>
    apiClient(`/users?email=${encodeURIComponent(email)}`, { method: "GET" }, token);

export const getUserById = (id: number, token: string) => apiClient(`/users/${id}`, { method: "GET" }, token);

export const updateUser = (id: number, payload: Partial<CreateUserPayload>, token: string) =>
    apiClient(`/users/${id}`, { method: "PUT", body: JSON.stringify(payload) }, token);

export const deleteUser = (id: number, token: string) =>
    apiClient(`/users/${id}`, { method: "DELETE" }, token);

export const blockUser = (id: number, token: string) =>
    apiClient(`/users/${id}`, { method: "PATCH", body: JSON.stringify({ status: "inactive" }) }, token);

export const unblockUser = (id: number, token: string) =>
    apiClient(`/users/${id}`, { method: "PATCH", body: JSON.stringify({ status: "active" }) }, token);