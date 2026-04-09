const API_URL = "https://gorest.co.in/public/v2";

export const getUsers = async () => {
    const res = await fetch(`${API_URL}/users`, {
        headers: {
            Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
        },
    });
    return res.json();
};