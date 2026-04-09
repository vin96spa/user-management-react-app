import { apiClient } from "./client";

export const getUsers = () => apiClient("/users");

export const createUser = (data: any) =>
    apiClient("/users", {
        method: "POST",
        body: JSON.stringify(data),
    });