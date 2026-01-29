import { useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const ProtectedRoute = ({ children }) => {
    const { isLoggedIn, loading } = useAuth();
    const navigate = useNavigate()

    const wasLoggedIn = useRef(isLoggedIn);

    useEffect(() => {
        // 1. Si todavía está cargando, no hacemos nada
        if (loading) return;

        // 2. CASO: Acceso denegado (No estaba logueado y sigue sin estarlo)
        if (!isLoggedIn && !wasLoggedIn.current) {
            console.log("Acceso no autorizado");
            
            toast.error("Access denied", {
                description: "You have to log in first. Redirecting...",
                duration: 4000
            });

            const timer = setTimeout(() => {
                navigate("/login");
            }, 2000);

            return () => clearTimeout(timer);
        }

        // 3. CASO: Logout manual (Estaba logueado y ahora no)
        if (!isLoggedIn && wasLoggedIn.current) {
            console.log("Logout detectado, redirigiendo sin error");
            navigate("/login");
            return;
        }

        // Actualizamos el ref para la próxima ejecución
        wasLoggedIn.current = isLoggedIn;

    }, [isLoggedIn, loading, navigate]);


    // 1. ESTADO DE CARGA: Mientras verificamos la cookie/token
    // Es vital mostrar esto para que no redirija a login erróneamente mientras carga
    /* if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-slate-950">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
            </div>
        );
    } */

    // 2. NO LOGUEADO: Redirigir al Login
    // 'replace' evita que el usuario pueda volver atrás con el botón del navegador
    if (!isLoggedIn) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-black">
                <div className="text-center">
                    <p className="text-gray-300 font-mono animate-pulse text-2xl">
                        ...
                    </p>
                </div>
            </div>
        );
    }

    // 3. LOGUEADO: Renderizar el contenido protegido
    // Si pasamos un hijo directo (children) lo renderiza, si usamos Outlet (para layouts) renderiza el Outlet
    return children ? children : <Outlet />;
};