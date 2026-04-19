import { useTranslation } from "react-i18next";
import { useLoader } from "@/context/LoaderContext";
import { Button } from "@/components/ui/button";


export default function LanguageSwitcher() {
    const { i18n } = useTranslation();
    const { showLoader, hideLoader } = useLoader();

    const toggleLanguage = async () => {
        showLoader();
        const next = i18n.language.startsWith("it") ? "en" : "it";
        await new Promise((resolve) => setTimeout(resolve, 600));
        await i18n.changeLanguage(next);
        hideLoader();
    };

    const isItalian = i18n.language.startsWith("it");

    return (
        <Button
            size="lg"
            variant="ghost"
            onClick={toggleLanguage}
            className="cursor-pointer text-xs px-3 border-gray-500 text-gray-300 hover:bg-gray-800 hover:text-white"
        >
            {isItalian ? "🇬🇧 EN" : "🇮🇹 IT"}
        </Button>
    );
}