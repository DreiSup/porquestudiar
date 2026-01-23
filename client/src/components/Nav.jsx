import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from '@/context/AuthContext'
import { logoutUser } from '@/services/api'


const NavBar = () => {

  const auth = useAuth()

  console.log("ESTO ES AUTH DESDE NAVBAR: ", auth)

  const handleLogOut = async (e) => {
        e.preventDefault()

        try {
          const res = await logoutUser()
          return res
        } catch (error) {
          console.log(error)        
        }
      }
  

  return (
    <>

    {auth?.isLoggedIn 
    ? 
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Avatar>
              <AvatarImage src={auth?.user.profilePic} alt="shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-32">
          <DropdownMenuGroup>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
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
    </>
  )
}

export default NavBar