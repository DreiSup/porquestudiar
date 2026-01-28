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
import { useEffect, useState } from "react"

const SideBar = () => {

  const auth = useAuth()
  const chatContext = useChat()

  const [editingChatId, setEditingChatId ] = useState(null)
  const [editTitle, setEditTitle] = useState("");

  const startEditing = (chat, e) => {
    e.stopPropagation(); // Evita que se seleccione el chat al dar click en editar
    setEditingChatId(chat._id || chat.id);
    setEditTitle(chat.title || "Title");
  };

  const handleSaveTitle = async (id) => {
    if (!editTitle.trim()) {
        setEditingChatId(null); // Si está vacío, cancelamos
        return;
    }
    
    try {
      // 1. Llamada a tu API (Endpoint PATCH que creamos antes)
      // Asumo que tienes apiClient, si no usa chatContext.updateTitle(id, editTitle)
      // await apiClient.patch(`/chat/title/${id}`, { title: editTitle });
      
      // Si tienes la función en el context:
      await chatContext?.updateChatTitle(id, editTitle); 

      // 2. Actualizar estado local visualmente (para no recargar)
      chatContext?.setChats(prev => prev.map(c => 
        (c._id === id || c.id === id) ? { ...c, title: editTitle } : c
      ));

    } catch (error) {
      console.error("Error actualizando título", error);
    } finally {
      setEditingChatId(null); // Salir del modo edición
    }
  };

  const handleKeyDown = (e, id) => {
    if (e.key === 'Enter') {
      handleSaveTitle(id);
    } else if (e.key === 'Escape') {
      setEditingChatId(null);
    }
  };
  

  const handleNewChat = async () => {
    try {
      console.log("creando nuevo chat")

      const data = await chatContext?.createChat()

      if (data && data.chat) {
        
        chatContext?.setSelectedChatID(data.chat._id)
        chatContext?.setMessages([])
      }

      console.log(chatContext?.selectedChatId)

    } catch (error) {
      console.log(error)
    }
  }

//USEEFECT PARA EL PRIMER LOGIN, SELECCIONAR CHAT POR DEFECTO
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

  const handleDeleteChat = async (id, e) => {
    console.log("Tryng to delete chat...", id)
      e?.stopPropagation();

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
                    {editingChatId === (chat._id || chat.id) ? (
                      <input 
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onBlur={() => handleSaveTitle(chat._id || chat.id)} // Guardar al hacer click fuera
                        onKeyDown={(e) => handleKeyDown(e, chat._id || chat.id)}
                        onClick={(e) => e.stopPropagation()} // Importante: para no disparar el selectChat
                        autoFocus
                        className="bg-transparent border border-gray-600 rounded px-1 w-full text-white focus:outline-none focus:border-amber-600 h-6 text-sm"
                      />
                    ) : (
                      <span className="truncate font-medium">
                          {chat.title || "Conversación sin título"}
                      </span>
                    )}
                  </SidebarMenuButton>
                  <DropdownMenu>
                     <DropdownMenuTrigger asChild>
                        <SidebarMenuAction>
                          <MoreHorizontal/>
                        </SidebarMenuAction>
                     </DropdownMenuTrigger>
                     <DropdownMenuContent side="right" align="start" className="bg-black border-black text-white shadow-xl">
                        <DropdownMenuItem>
                          <span
                            onClick={(e) => startEditing(chat, e)}
                            className="cursor-pointer"
                          >
                            Edit Title
                          </span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <span
                            onClick={(e) => handleDeleteChat(chat.id, e)}
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

