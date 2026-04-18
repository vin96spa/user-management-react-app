import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { deleteUser } from "../api/users";

export default function UserSettingsPage() {
    const navigate = useNavigate();
    const userId = useAuthStore((state) => state.userId);
    const token = useAuthStore((state) => state.token);
    const logout = useAuthStore((state) => state.logout);

    const onDeleteAccount = async () => {
        if (!userId || !token) {
            console.error("User ID or token not found in auth store");
            return;
        }

        try {
            await deleteUser(userId, token);
            logout();
            navigate("/register");
        } catch (error) {
            console.error("Error deleting user account:", error);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
            <h1 className="text-2xl font-bold mb-4">User Settings</h1>
            <button
                onClick={onDeleteAccount}
                className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition cursor-pointer"
            >
                Delete Account
            </button>
        </div>
    );
}