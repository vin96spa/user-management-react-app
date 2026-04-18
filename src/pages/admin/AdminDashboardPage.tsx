import { useEffect, useState } from "react";
import { getUsers, blockUser, unblockUser } from "../../api/users";
import { useAuthStore } from "../../store/authStore";
import type { User } from "../../types/User";
import EditUserModal from "../../components/admin/EditUserModal";
import DeleteUserModal from "../../components/admin/DeleteUserModal";

export default function AdminDashboardPage() {
    const token = useAuthStore((state) => state.token);
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;

    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [loadingUserId, setLoadingUserId] = useState<number | null>(null);

    // null = modal closed, User = modal open for that user
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [deletingUser, setDeletingUser] = useState<User | null>(null);

    useEffect(() => {
        getUsers()
            .then(setUsers)
            .catch(() => setError("Failed to load users."))
            .finally(() => setIsLoading(false));
    }, []);

    const handleToggleStatus = async (user: User) => {
        setLoadingUserId(user.id);
        setError(null);

        try {
            const updatedUser = user.status === "active"
                ? await blockUser(user.id, token || "")
                : await unblockUser(user.id, token || "");

            // update only that user in the local list
            setUsers((prev) =>
                prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
            );
        } catch {
            setError("Failed to update user status.");
        } finally {
            setLoadingUserId(null);
        }
    };

    // called from EditUserModal when saving is successful
    const handleUserUpdated = (updatedUser: User) => {
        setUsers((prev) =>
            prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
        );
    };

    // called from DeleteUserModal when deletion is successful
    const handleUserDeleted = (userId: number) => {
        setUsers((prev) => prev.filter((u) => u.id !== userId));
    };

    if (isLoading) return <p className="text-gray-400">Loading users...</p>;

    return (
        <div>
            {/* header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Admin Dashboard</h2>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
                    {error}
                </div>
            )}

            <div className="grid gap-3">
                {users.filter((user) => user.email !== adminEmail).map((user) => (
                    <div
                        key={user.id}
                        className="p-4 bg-white shadow rounded flex items-center justify-between"
                    >
                        {/* user info */}
                        <div className="flex flex-col gap-1">
                            <p className="font-semibold">{user.name}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                            <span
                                className={`text-xs font-medium px-2 py-0.5 rounded-full w-fit ${user.status === "active"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-600"
                                    }`}
                            >
                                {user.status}
                            </span>
                        </div>

                        {/* actions */}
                        <div className="flex gap-2">

                            {/* button edit */}
                            <button
                                onClick={() => setEditingUser(user)}
                                className="px-3 py-1.5 text-sm rounded border border-blue-500 text-blue-500 hover:bg-blue-50 transition-colors cursor-pointer"
                            >
                                Edit
                            </button>
                        </div>

                        {/* button block/unblock */}
                        <button
                            onClick={() => handleToggleStatus(user)}
                            disabled={loadingUserId === user.id}
                            className={`px-3 py-1.5 text-sm rounded border transition-colors disabled:opacity-50 cursor-pointer ${user.status === "active"
                                    ? "border-red-500 text-red-500 hover:bg-red-50"
                                    : "border-green-500 text-green-600 hover:bg-green-50"
                                }`}
                        >
                            {loadingUserId === user.id
                                ? "..."
                                : user.status === "active"
                                    ? "Block"
                                    : "Unblock"}
                        </button>

                        {/* button delete */}
                        <button
                            onClick={() => setDeletingUser(user)}
                            className="px-3 py-1.5 text-sm rounded border border-gray-300 text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>

            {/* modals - out of the list */}
            {editingUser && (
                <EditUserModal
                    user={editingUser}
                    onClose={() => setEditingUser(null)}
                    onUpdated={handleUserUpdated}
                />
            )}

            {deletingUser && (
                <DeleteUserModal
                    user={deletingUser}
                    onClose={() => setDeletingUser(null)}
                    onDeleted={handleUserDeleted}
                />
            )}
        </div>
    );
}