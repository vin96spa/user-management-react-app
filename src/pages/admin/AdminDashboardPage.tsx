import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pencil, Ban, ShieldCheck, Trash2 } from "lucide-react";
import { getUsers, blockUser, unblockUser } from "@/api/users";
import { useAuthStore } from "@/store/authStore";
import { useLoader } from "@/context/LoaderContext";
import type { User } from "@/types/User";
import EditUserModal from "@/components/admin/EditUserModal";
import DeleteUserModal from "@/components/admin/DeleteUserModal";
import { getInitials } from "@/utils/formatters";
import { ChevronLeft, ChevronRight } from "lucide-react";

type StatusFilter = "all" | "active" | "inactive";

const PAGE_SIZE = 4;


export default function AdminDashboardPage() {
    const { t } = useTranslation();
    const token = useAuthStore((state) => state.token);
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
    const { showLoader, hideLoader } = useLoader();

    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loadingUserId, setLoadingUserId] = useState<number | null>(null);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [deletingUser, setDeletingUser] = useState<User | null>(null);
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
    const [currentPage, setCurrentPage] = useState(1);

    const filteredUsers = users
        .filter((user) => user.email !== adminEmail)
        .filter((user) => statusFilter === "all" || user.status === statusFilter);

    const handleFilterChange = (filter: StatusFilter) => {
        setStatusFilter(filter);
        setCurrentPage(1);
    };

    useEffect(() => {
        if (!token) return;
        showLoader();
        getUsers()
            .then(setUsers)
            .catch(() => setError("Failed to load users."))
            .finally(() => hideLoader());
    }, []);

    const handleToggleStatus = async (user: User) => {
        setLoadingUserId(user.id);
        setError(null);

        try {
            const updatedUser = user.status === "active"
                ? await blockUser(user.id, token || "")
                : await unblockUser(user.id, token || "");

            setUsers((prev) =>
                prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
            );
        } catch {
            setError("Failed to update user status.");
        } finally {
            setLoadingUserId(null);
        }
    };

    const handleUserUpdated = (updatedUser: User) => {
        setUsers((prev) =>
            prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
        );
    };

    const handleUserDeleted = (userId: number) => {
        setUsers((prev) => prev.filter((u) => u.id !== userId));
        if (paginatedUsers.length === 1 && currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);

    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">{t("admin.title")}</h2>

            {/* filter bar */}
            <div className="flex items-center justify-between mb-5">
                <div className="flex gap-2">
                    {(["all", "active", "inactive"] as StatusFilter[]).map((filter) => (
                        <button
                            key={filter}
                            onClick={() => handleFilterChange(filter)}
                            className={`text-xs px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${statusFilter === filter
                                ? "bg-gray-900 text-white border-gray-900"
                                : "border-gray-200 text-gray-500 hover:bg-gray-50"
                                }`}
                        >
                            {t(`admin.filter.${filter}`)}
                        </button>
                    ))}
                </div>
                <span className="text-xs text-gray-400">
                    {filteredUsers.length} {t("admin.filter.results")}
                </span>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
                    {error}
                </div>
            )}

            <div className="flex flex-col gap-3">
                {paginatedUsers.map((user) => (
                    <div
                        key={user.id}
                        className="bg-white border border-gray-100 rounded-xl px-5 py-4 flex items-center justify-between gap-4"
                    >
                        {/* avatar + info */}
                        <div className="flex items-center gap-4">

                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 ${user.status === "active"
                                ? "bg-blue-50 text-blue-600"
                                : "bg-gray-100 text-gray-400"
                                }`}>
                                {getInitials(user.name)}
                            </div>

                            <div className="flex flex-col gap-1">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide w-10">
                                        {t("admin.fields.name")}
                                    </span>
                                    <span className="text-sm font-semibold text-gray-800">
                                        {user.name}
                                    </span>
                                </div>

                                <div className="flex items-baseline gap-2">
                                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide w-10">
                                        {t("admin.fields.email")}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        {user.email}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide w-10">
                                        {t("admin.fields.status")}
                                    </span>
                                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${user.status === "active"
                                        ? "bg-green-50 text-green-700"
                                        : "bg-red-50 text-red-600"
                                        }`}>
                                        {user.status === "active"
                                            ? t("admin.status.active")
                                            : t("admin.status.inactive")}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* actions */}
                        <div className="flex items-center gap-2 flex-shrink-0">

                            {/* edit */}
                            <button
                                onClick={() => setEditingUser(user)}
                                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                                <Pencil size={12} />
                                {t("admin.edit")}
                            </button>

                            {/* block / unblock */}
                            <button
                                onClick={() => handleToggleStatus(user)}
                                disabled={loadingUserId === user.id}
                                className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors cursor-pointer disabled:opacity-40 ${user.status === "active"
                                    ? "border-orange-300 text-orange-500 hover:bg-orange-50"
                                    : "border-green-300 text-green-600 hover:bg-green-50"
                                    }`}
                            >
                                {loadingUserId === user.id ? (
                                    <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                ) : user.status === "active" ? (
                                    <Ban size={12} />
                                ) : (
                                    <ShieldCheck size={12} />
                                )}
                                {loadingUserId === user.id
                                    ? "..."
                                    : user.status === "active"
                                        ? t("admin.block")
                                        : t("admin.unblock")}
                            </button>

                            {/* delete */}
                            <button
                                onClick={() => setDeletingUser(user)}
                                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                            >
                                <Trash2 size={12} />
                                {t("admin.delete")}
                            </button>

                        </div>
                    </div>
                ))}
            </div>

            {/* pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                    <button
                        onClick={() => setCurrentPage((prev) => prev - 1)}
                        disabled={currentPage === 1}
                        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                        <ChevronLeft size={14} />
                        {t("admin.pagination.prev")}
                    </button>

                    {/* page numbers */}
                    <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-7 h-7 text-xs rounded-lg transition-colors cursor-pointer ${currentPage === page
                                    ? "bg-gray-900 text-white"
                                    : "text-gray-500 hover:bg-gray-100"
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                        disabled={currentPage === totalPages}
                        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                        {t("admin.pagination.next")}
                        <ChevronRight size={14} />
                    </button>
                </div>
            )}

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