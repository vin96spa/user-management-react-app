import MyPostsTab from "@/components/MyPostsTab";
import AllPostsTab from "@/components/AllPostsTab";
import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function PostsPage() {
    const { t } = useTranslation();

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">{t("posts.title")}</h2>

            {/* Tab switcher */}
            <Tabs defaultValue="mine">
                <TabsList className="mb-6 px-3 py-6 bg-gray-200 rounded-lg w-max">
                    <TabsTrigger className="p-4 text-black hover:text-gray-700 data-[state=active]:bg-gray-800 data-[state=active]:text-white" value="mine">{t("posts.myPosts")}</TabsTrigger>
                    <TabsTrigger className="p-4 text-black hover:text-gray-700 data-[state=active]:bg-gray-800 data-[state=active]:text-white" value="all">{t("posts.allPosts")}</TabsTrigger>
                </TabsList>
                <TabsContent value="mine">
                    <MyPostsTab />
                </TabsContent>
                <TabsContent value="all">
                    <AllPostsTab />
                </TabsContent>
            </Tabs>
        </div>
    );
}