import { apiClient } from "./client";
import { type CreateUserPayload } from "../types/User";

export const getUsers = () => apiClient("/users");

export const createUser = (payload: CreateUserPayload, token: string) =>
    apiClient("/users", { method: "POST", body: JSON.stringify(payload) }, token).then((res) => res);