import { Calendar, Home, Inbox, MessageSquare, MoreHorizontal, Plus, PlusCircle, Search, Settings } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { createNewChat } from "@/services/chat-api"
import { useChat } from "@/context/ChatContext"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from "./ui/dropdown-menu"
import { DropdownMenuTrigger } from "./ui/dropdown-menu"

const SideBar = () => {

  /*   const items = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
  {
    title: "Add new chat",
    url:"#",
    icon: Settings,
  }
] */

  const chatContext = useChat()

  /* console.log(chatContext) */

  const handleNewChat = async () => {
    try {
      console.log("creando nuevo chat")

      const data = await createNewChat()

      if (data && data.chat) {
        
        chatContext?.setSelectedChatID(data.chat._id)
        chatContext?.setMessages([])
      }

    } catch (error) {
      console.log(error)
    }
  }

  const handleDeleteChat = async (id) => {
    console.log("Tryng to delete chat...", id)
  }

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Acciones</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                    onClick={handleNewChat} 
                    className="border border-sidebar-border shadow-sm hover:bg-sidebar-accent"
                >
                  <Plus className="text-amber-500" /> {/* Icono destacado */}
                  <span className="font-bold">Nuevo Chat</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {chatContext?.chats.map((chat) => (
                <SidebarMenuItem key={chat._id}>
                  <SidebarMenuButton 
                    onClick={()=> chatContext?.selectChat(chat.id)}
                    isActive={chatContext?.selectedChatId === chat._id}
                    className="cursor-pointer"
                  >
                    <MessageSquare className="size-4" />
                    <span className="truncate font-medium">
                        {chat.title || "Conversación sin título"}
                    </span>
                  </SidebarMenuButton>
                  <DropdownMenu>
                     <DropdownMenuTrigger asChild>
                        <SidebarMenuAction>
                          <MoreHorizontal/>
                        </SidebarMenuAction>
                     </DropdownMenuTrigger>
                     <DropdownMenuContent side="right" align="start" className="bg-black border-black text-white shadow-xl">
                        <DropdownMenuItem>
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <span onClick={() => handleDeleteChat(chat.id)}>Delete</span>
                        </DropdownMenuItem>
                     </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

export default SideBar

