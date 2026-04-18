export default function Loader() {
    return (
        <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-[100]">
            <div className="flex flex-col items-center gap-4">
                {/* spinner */}
                <div className="w-12 h-12 border-4 border-gray-500 border-t-white rounded-full animate-spin" />
                <p className="text-white text-sm font-medium">Loading...</p>
            </div>
        </div>
    );
}