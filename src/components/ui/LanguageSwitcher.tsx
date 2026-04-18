import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();

    const toggleLanguage = () => {
        const next = i18n.language.startsWith("it") ? "en" : "it";
        i18n.changeLanguage(next);
    };

    return (
        <button
            onClick={toggleLanguage}
            className="text-sm px-3 py-1 rounded border transition-colors cursor-pointer hover:bg-gray-50 hover:text-gray-700"
        >
            {i18n.language.startsWith("it") ? "🇬🇧 EN" : "🇮🇹 IT"}
        </button>
    );
}