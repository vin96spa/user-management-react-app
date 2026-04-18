import { createContext, useContext, useState } from "react";
import Loader from "../components/ui/Loader";

interface LoaderContextType {
    showLoader: () => void;
    hideLoader: () => void;
}

// create the context with a default value
const LoaderContext = createContext<LoaderContextType | null>(null);

// Provider — wraps the app and makes the loader available everywhere
export function LoaderProvider({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(false);

    const showLoader = () => setIsLoading(true);
    const hideLoader = () => setIsLoading(false);

    return (
        <LoaderContext.Provider value={{ showLoader, hideLoader }}>
            {/* the loader is rendered here — always on top */}
            {isLoading && <Loader />}
            {children}
        </LoaderContext.Provider>
    );
}

// custom hook to consume the context
export function useLoader() {
    const context = useContext(LoaderContext);

    if (!context) {
        throw new Error("useLoader must be used within a LoaderProvider");
    }

    return context;
}