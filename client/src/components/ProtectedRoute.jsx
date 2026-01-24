import { useAuth } from "@/context/AuthContext"
import { Navigate } from "react-router-dom";


const ProtectedRoute = ({children}) => {

    const {isLoggedIn, isLoading} = useAuth()


    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-slate-950">
                <div className="flex flex-col items-center gap-4">
                     {/* Un spinner simple con Tailwind */}
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500 border-t-transparent"></div>
                    <p className="text-amber-500 font-mono animate-pulse">Cargando tus datos...</p>
                </div>
            </div>
        )
    }

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }
  
    return children;
    
}

export default ProtectedRoute