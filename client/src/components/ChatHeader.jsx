import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/context/AuthContext"
import { Skeleton } from "./ui/skeleton"

const ChatHeader = () => {

    const auth = useAuth()

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
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">Porquéestudiar</h1>

        {auth?.isLoading && (
          <Skeleton className="h-8 w-8 rounded-full bg-slate-200"/>
        )}
        {!auth?.isLoading && auth?.isLoggedIn && auth?.user
            ? 
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar>
                    <AvatarImage src={auth?.user?.profilePic} alt="shadcn" />
                    <AvatarFallback>{getInitials()}</AvatarFallback>
                    </Avatar>
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-32">
                <DropdownMenuGroup>
                    <DropdownMenuItem>{auth?.user?.name}</DropdownMenuItem>
                    <DropdownMenuItem>{auth?.user?.email}</DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem className="text-red-500 focus:bg-red-900/20 focus:text-red-500"
                    onClick={handleLogOut}
                    variant="destructive">Log out</DropdownMenuItem>
                </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
            : <></>}
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <a
              href="https://github.com/DreiSup/porquestudiar"
              rel="noopener noreferrer"
              target="_blank"
              className="dark:text-foreground"
            >
              GitHub
            </a>
          </Button>
        </div>
      </div>
    </header>
  )
}

export default ChatHeader