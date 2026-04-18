import { useState } from "react";
import { deleteUser } from "../../api/users";
import { useAuthStore } from "../../store/authStore";
import type { User } from "../../types/User";

interface Props {
    user: User;
    onClose: () => void;
    onDeleted: (userId: number) => void;
}

export default function DeleteUserModal({ user, onClose, onDeleted }: Props) {
    const token = useAuthStore((state) => state.token);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDelete = async () => {
        setIsDeleting(true);
        setError(null);

        try {
            await deleteUser(user.id, token || "");
            onDeleted(user.id);
            onClose();
        } catch {
            setError("Failed to delete user. Please try again.");
            setIsDeleting(false);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-white rounded shadow-lg w-full max-w-sm p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-lg font-bold mb-2">Delete User</h3>
                <p className="text-sm text-gray-600 mb-1">
                    Are you sure you want to delete:
                </p>
                <p className="font-semibold mb-4">{user.name}</p>
                <p className="text-xs text-gray-400 mb-6">
                    This action cannot be undone.
                </p>

                {error && (
                    <p className="text-red-500 text-sm mb-4">{error}</p>
                )}

                <div className="flex gap-2 justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm rounded border hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="px-4 py-2 text-sm rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 transition-colors cursor-pointer disabled:cursor-not-allowed"
                    >
                        {isDeleting ? "Deleting..." : "Yes, delete"}
                    </button>
                </div>
            </div>
        </div>
    );
}