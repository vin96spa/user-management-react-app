import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { deleteUser } from "../../api/users";
import { useAuthStore } from "../../store/authStore";
import type { User } from "../../types/User";
import { getInitials } from "../../utils/formatters";

interface Props {
    user: User;
    onClose: () => void;
    onDeleted: (userId: number) => void;
}

export default function DeleteUserModal({ user, onClose, onDeleted }: Props) {
    const { t } = useTranslation();
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
            setError(t("common.error"));
            setIsDeleting(false);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-xl border border-gray-100 w-full max-w-sm overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* header rosso */}
                <div className="bg-red-50 border-b border-red-100 px-6 py-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                        <Trash2 size={16} className="text-red-600" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-red-800">
                            {t("admin.deleteModal.title")}
                        </p>
                        <p className="text-xs text-red-600">
                            {t("admin.deleteModal.warning")}
                        </p>
                    </div>
                </div>

                {/* body */}
                <div className="px-6 py-5">
                    <p className="text-sm text-gray-500 mb-3">
                        {t("admin.deleteModal.message")}
                    </p>

                    {/* card utente */}
                    <div className="bg-gray-50 rounded-lg px-4 py-3 flex items-center gap-3 mb-5">
                        <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center text-xs font-semibold text-red-600 flex-shrink-0">
                            {getInitials(user.name)}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                            <p className="text-xs text-gray-400">{user.email}</p>
                        </div>
                    </div>

                    {error && (
                        <p className="text-red-500 text-xs mb-4">{error}</p>
                    )}

                    {/* azioni */}
                    <div className="flex gap-2 justify-end">
                        <button
                            onClick={onClose}
                            className="text-sm px-4 py-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                            {t("admin.deleteModal.cancel")}
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 transition-colors cursor-pointer disabled:cursor-not-allowed"
                        >
                            {isDeleting ? (
                                <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <Trash2 size={13} />
                            )}
                            {isDeleting ? t("admin.deleteModal.deleting") : t("admin.deleteModal.confirm")}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}