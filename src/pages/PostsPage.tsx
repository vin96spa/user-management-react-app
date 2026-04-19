import { useState } from "react";
import MyPostsTab from "@/components/MyPostsTab";
import AllPostsTab from "@/components/AllPostsTab";
import { useTranslation } from "react-i18next";

type Tab = "mine" | "all";

export default function PostsPage() {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<Tab>("mine");

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">{t("posts.title")}</h2>

            {/* Tab switcher */}
            <div className="flex gap-1 mb-6 bg-gray-200 p-1 rounded w-fit">
                <button
                    onClick={() => setActiveTab("mine")}
                    className={`px-4 py-2 text-sm rounded transition-colors cursor-pointer ${activeTab === "mine"
                            ? "bg-white text-blue-600 font-semibold shadow"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                >
                    {t("posts.myPosts")}
                </button>
                <button
                    onClick={() => setActiveTab("all")}
                    className={`px-4 py-2 text-sm rounded transition-colors cursor-pointer ${activeTab === "all"
                            ? "bg-white text-blue-600 font-semibold shadow"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                >
                    {t("posts.allPosts")}
                </button>
            </div>

            {/* Contenuto tab attiva */}
            {activeTab === "mine" ? <MyPostsTab /> : <AllPostsTab />}
        </div>
    );
}