const BASE_URL = "https://gorest.co.in/public/v2";

export const apiClient = async (endpoint: string, options?: RequestInit) => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
            ...options?.headers,
        },
    });

    if (!res.ok) {
        throw new Error("API error");
    }

    return res.json();
};