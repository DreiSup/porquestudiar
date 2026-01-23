import { 
  SidebarProvider, 
  SidebarTrigger, 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarInset
} from "@/components/ui/sidebar"
import { Home, Settings, User, FlaskConical } from "lucide-react"

const Experiment = () => {
  return (
    // SidebarProvider es el contenedor FLEX principal
    <SidebarProvider>
      {/* 1. EL SIDEBAR */}
      <Sidebar collapsible="icon" variant="inset">
        <SidebarContent>
          <SidebarGroup>
            <div className="p-4 flex items-center gap-2">
              <FlaskConical className="text-amber-500" />
              <span className="font-bold group-data-[collapsible=icon]:hidden">Laboratorio</span>
            </div>
            <SidebarGroupContent>
              <SidebarMenu>
                {[
                  { title: "Inicio", icon: Home },
                  { title: "Perfil", icon: User },
                  { title: "Ajustes", icon: Settings },
                ].map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <button className="flex items-center gap-2">
                        <item.icon size={20} />
                        <span>{item.title}</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <SidebarInset className="flex flex-col flex-1 h-screen bg-slate-950">
        <header className="flex h-14 items-center gap-4 border-b border-slate-800 px-4">
          <SidebarTrigger />
          <span className="text-white font-bold">Panel de Control</span>
        </header>
        
        <main className="flex-1 p-6 text-white overflow-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-lg h-[200vh] p-8">
            <h2 className="text-2xl mb-4">¡Ahora funciona!</h2>
            <p className="text-slate-400">
              Al usar SidebarInset, este respeta el ancho de --sidebar-width.
              Cuando cierras el sidebar (collapsible), este componente se ensancha solo.
            </p>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default Experiment