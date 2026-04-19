import { Loader2 } from "lucide-react";

export default function Loader() {
    return (
        <div className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm flex items-center justify-center z-100">
            <div className="bg-white/10 rounded-2xl p-6">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
        </div>
    );
}