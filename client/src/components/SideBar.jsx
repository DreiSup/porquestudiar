import { Calendar, Home, Inbox, MessageSquare, Plus, Search, Settings } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { createNewChat } from "@/services/chat-api"
import { useChat } from "@/context/ChatContext"

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
        chatContext?.setChats((prevChats) => [...prevChats, data.chat])
        chatContext?.setSelectedChatID(data.chat._id)
        chatContext?.setMessages([])
      }

    } catch (error) {
      console.log(error)
    }
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
                    onClick={()=> chatContext?.selectChat(chat._id)}
                    isActive={chatContext?.selectedChatId === chat._id}
                    className="cursor-pointer"
                  >
                    <MessageSquare className="size-4" />
                    <span className="truncate font-medium">
                        {chat.title || "Conversación sin título"}
                    </span>
                  </SidebarMenuButton>
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

