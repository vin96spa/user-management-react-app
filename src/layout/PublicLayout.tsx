import LanguageSwitcher from "@/components/custom-ui/LanguageSwitcher";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">

            {/* navbar minimale */}
            <header className="flex items-center justify-between px-6 py-4">
                <span className="text-white font-bold text-xl tracking-tight">
                    DEMO SOCIAL NETWORK APP
                </span>
                <LanguageSwitcher variant="dark"/>
            </header>

            {/* contenuto centrato */}
            <main className="flex-1 flex items-center justify-center px-4">
                {children}
            </main>

            {/* footer minimale */}
            <footer className="text-center text-gray-500 text-xs py-4">
                © {new Date().getFullYear()} Vincenzo Spagnolo
            </footer>
        </div>
    );
}