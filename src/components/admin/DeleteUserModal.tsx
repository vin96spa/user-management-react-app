import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { deleteUser } from "@/api/users";
import { useAuthStore } from "@/store/authStore";
import type { User } from "@/types/User";
import { getInitials } from "@/utils/formatters";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

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
        <Dialog open onOpenChange={onClose}>
            <DialogContent
                className="p-8"
                aria-describedby={undefined}
                onOpenAutoFocus={(e) => e.preventDefault()}
            >
                <div className="bg-red-50 border-b border-red-100 -mx-1 px-6 py-4 flex items-center gap-3 rounded-2xl">
                    <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                        <Trash2 size={16} className="text-red-600" />
                    </div>
                    <DialogHeader>
                        <DialogTitle className="text-sm font-semibold text-red-800">
                            {t("admin.deleteModal.title")}
                        </DialogTitle>
                        <DialogDescription className="text-xs text-red-600">
                            {t("admin.deleteModal.warning")}
                        </DialogDescription>
                    </DialogHeader>
                </div>

                {/* body */}
                <div>
                    <p className="text-sm text-muted-foreground mb-3">
                        {t("admin.deleteModal.message")}
                    </p>

                    {/*user card */}
                    <div className="bg-muted rounded-lg px-4 py-3 flex items-center gap-3 mb-5">
                        <Avatar className="w-9 h-9 shrink-0">
                            <AvatarFallback className="bg-red-100 text-red-600 text-xs font-semibold">
                                {getInitials(user.name)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-sm font-semibold">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                    </div>

                    {error && (
                        <p className="text-red-500 text-xs mb-4">{error}</p>
                    )}

                    {/* actions */}
                    <div className="flex gap-2 justify-end">
                        <Button
                            size="lg"
                            variant="outline"
                            onClick={onClose}
                            className="cursor-pointer"
                        >
                            {t("admin.deleteModal.cancel")}
                        </Button>
                        <Button
                            size="lg"
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="cursor-pointer bg-red-600 hover:bg-red-700 text-white"
                        >
                            {isDeleting ? (
                                <Loader2 size={13} className="animate-spin" />
                            ) : (
                                <Trash2 size={13} />
                            )}
                            {isDeleting ? t("admin.deleteModal.deleting") : t("admin.deleteModal.confirm")}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}