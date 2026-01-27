import { BadgeCheckIcon, Calendar, Home, Inbox, LogOutIcon, MessageSquare, MoreHorizontal, Plus, PlusCircle, Search, Settings } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useChat } from "@/context/ChatContext"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator } from "./ui/dropdown-menu"
import { DropdownMenuTrigger } from "./ui/dropdown-menu"
import { useAuth } from "@/context/AuthContext"
import { Button } from "./ui/button"
import { useEffect } from "react"

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

  const auth = useAuth()
  const chatContext = useChat()
  

  const handleNewChat = async () => {
    try {
      console.log("creando nuevo chat")

      const data = await chatContext?.createChat()

      if (data && data.chat) {
        
        chatContext?.setSelectedChatID(data.chat._id)
        chatContext?.setMessages([])
      }

    } catch (error) {
      console.log(error)
    }
  }


  useEffect(() => {
    console.log(chatContext?.chats)
    if (auth?.isLoggedIn && auth?.user) {

      const fetchAndSelectChats = async () => {
        try {
          
          const res = await chatContext?.getAllChats();

          console.log("!!!!!",res)

          let chatsFromServer = res.sortedChats

          if (chatsFromServer.length > 0) {
            const lastChat = chatsFromServer[0];
            console.log("last chat: ", lastChat.id)
            chatContext?.setSelectedChatId(lastChat.id)
            chatContext?.setChats(chatsFromServer)
          } else {
          // B) Si NO existen chats, creamos uno nuevo automáticamente
          console.log("No hay chats, creando uno por defecto...");
          handleNewChat(); // Reutilizamos tu función de crear
        } 

        } catch (error) {
          console.log("Error loading chats at sidebar", error)
        }
      }

      fetchAndSelectChats()
    }
    //eslint-disable-next-line
  },[auth?.isLoggedIn, auth?.user])


  const handleDeleteChat = async (id) => {
    console.log("Tryng to delete chat...", id)

    try {
      const data = await chatContext?.deleteChat(id)
      console.log(data)
    } catch (error) {
      console.log(error)
    }
  }

  const handleLogOut = async (e) => {
        e.preventDefault()

        try {
          const res = await auth?.logout()
          console.log(res)
          return res
        } catch (error) {
          console.log(error)        
        }
    }

    const getInitials = () => {
        if (!auth?.user || !auth?.user.name) return "U"; // U de User por defecto
        return auth?.user.name.substring(0, 2).toUpperCase();
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
                  <Plus className="text-white" /> {/* Icono destacado */}
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
              {chatContext?.chats?.map((chat) => (
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
                          <span
                            onClick={() => handleDeleteChat(chat.id)}
                          >
                            Delete
                          </span>
                        </DropdownMenuItem>
                     </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {!auth?.isLoading && auth?.isLoggedIn && auth?.user
          ? 
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar>
                    <AvatarImage src={auth?.user?.profilePic} alt="shadcn" />
                    <AvatarFallback>LR</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <BadgeCheckIcon />
                    {auth?.user?.name}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <BadgeCheckIcon />
                    {auth?.user?.email}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogOut}>
                  <LogOutIcon />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

          : <></>}
      </SidebarFooter>              
    </Sidebar>
  )
}

export default SideBar

