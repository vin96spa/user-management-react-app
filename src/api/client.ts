const BASE_URL = "https://gorest.co.in/public/v2";

export const apiClient = async (endpoint: string, options?: RequestInit, token?: string) => {
    const authToken = token ?? import.meta.env.VITE_API_TOKEN;

    const res = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
            ...options?.headers,
        },
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error?.message ?? "API error");
    }

    // 204 No Content (e.g. DELETE) has no body, so return null instead of attempting to parse res.json()
    if (res.status === 204) return null;

    return res.json();
};