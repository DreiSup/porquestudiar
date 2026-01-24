import { AuthProvider } from "./AuthContext"
/* import { ChatProvider } from "./ChatContext" */



export const AppProviders = ({ children }) => {
    return (
        <AuthProvider>
            {/* <ChatProvider> */}
                    {children}
            {/* </ChatProvider> */}
        </AuthProvider>
    )
}