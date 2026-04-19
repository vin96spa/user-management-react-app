import { useTranslation } from "react-i18next";
import { useLoader } from "@/context/LoaderContext";

interface Props {
    variant?: "light" | "dark";
}

export default function LanguageSwitcher({ variant = "light" }: Props) {
    const { i18n } = useTranslation();
    const { showLoader, hideLoader } = useLoader();

    const toggleLanguage = async () => {
        showLoader();
        const next = i18n.language.startsWith("it") ? "en" : "it";
        await new Promise((resolve) => setTimeout(resolve, 600));
        await i18n.changeLanguage(next);
        hideLoader();
    };

    return (
        <button
            onClick={toggleLanguage}
            className={`text-sm px-3 py-1 rounded border transition-colors cursor-pointer ${variant === "dark"
                    ? "border-gray-500 text-gray-300 hover:bg-gray-700"
                    : "border-gray-300 text-gray-600 hover:bg-gray-100"
                }`}
        >
            {i18n.language.startsWith("it") ? "🇬🇧 EN" : "🇮🇹 IT"}
        </button>
    );
}