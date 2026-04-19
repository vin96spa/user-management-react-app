import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pencil, Ban, ShieldCheck, Trash2, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { getUsers, blockUser, unblockUser } from "@/api/users";
import { useAuthStore } from "@/store/authStore";
import { useLoader } from "@/context/LoaderContext";
import type { User } from "@/types/User";
import EditUserModal from "@/components/admin/EditUserModal";
import DeleteUserModal from "@/components/admin/DeleteUserModal";
import { getInitials } from "@/utils/formatters";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

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
                        <Button
                            key={filter}
                            size="sm"
                            variant={statusFilter === filter ? "default" : "outline"}
                            onClick={() => handleFilterChange(filter)}
                            className="text-xs cursor-pointer"
                        >
                            {t(`admin.filter.${filter}`)}
                        </Button>
                    ))}
                </div>
                <span className="text-xs text-muted-foreground">
                    {filteredUsers.length} {t("admin.filter.results")}
                </span>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-sm">
                    {error}
                </div>
            )}

            {paginatedUsers.map((user) => (
                <Card
                    key={user.id}
                    className="px-5 py-4 flex flex-row grow items-center justify-between gap-4 mb-4"
                >
                    {/* avatar + info */}
                    <div className="flex items-center gap-4">

                        <Avatar className="w-10 h-10">
                            <AvatarFallback className={user.status === "active"
                                ? "bg-blue-50 text-blue-600"
                                : "bg-gray-100 text-gray-400"
                            }>
                                {getInitials(user.name)}
                            </AvatarFallback>
                        </Avatar>

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
                                <Badge variant={user.status === "active" ? "default" : "destructive"} className="text-[11px] px-2 py-0.5">
                                    {user.status === "active"
                                        ? t("admin.status.active")
                                        : t("admin.status.inactive")}
                                </Badge >
                            </div>
                        </div>
                    </div>

                    {/* actions */}
                    <div className="flex items-center gap-2 shrink-0">

                        {/* edit */}
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingUser(user)}
                            className="text-xs cursor-pointer bg-blue-50 text-blue-600 hover:bg-blue-200 hover:text-blue-700"
                        >
                            <Pencil size={12} />
                            {t("admin.edit")}
                        </Button>

                        {/* block / unblock */}
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleStatus(user)}
                            disabled={loadingUserId === user.id}
                            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors cursor-pointer disabled:opacity-40 ${user.status === "active"
                                ? "border-orange-300 text-orange-500 hover:bg-orange-50 hover:text-orange-600"
                                : "border-black text-black hover:bg-black hover:text-white"
                                }`}
                        >
                            {loadingUserId === user.id ? (
                                <Loader2 size={12} className="animate-spin" />
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
                        </Button>

                        {/* delete */}
                        <Button
                            onClick={() => setDeletingUser(user)}
                            variant="outline"
                            size="sm"
                            className="text-xs cursor-pointer border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
                        >
                            <Trash2 size={12} />
                            {t("admin.delete")}
                        </Button>

                    </div>
                </Card>
            ))}

            {/* pagination */}
            {totalPages > 1 && (
                <Pagination className="mt-6">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={() => setCurrentPage((prev) => prev - 1)}
                                className={currentPage === 1 ? "pointer-events-none opacity-40" : "hover:bg-gray-200 hover:text-gray-700 cursor-pointer"}
                                text={t("admin.pagination.prev")}
                            />
                        </PaginationItem>
                        {/* page numbers */}
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <PaginationItem key={page}>
                                <PaginationLink
                                    isActive={currentPage === page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`cursor-pointer ${currentPage === page
                                        ? "bg-black text-white hover:bg-gray-800 hover:text-white"
                                        : "text-gray-500 hover:bg-gray-500 hover:text-white"
                                        }`}
                                >
                                    {page}
                                </ PaginationLink>
                            </PaginationItem>
                        ))}

                        <PaginationItem>
                            <PaginationNext
                                onClick={() => setCurrentPage((prev) => prev + 1)}
                                className={currentPage === totalPages ? "pointer-events-none opacity-40" : "hover:bg-gray-200 hover:text-gray-700 cursor-pointer"}
                                text={t("admin.pagination.next")}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
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