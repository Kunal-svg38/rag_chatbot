"use client"

import { BotMessageSquare, Dot, Folder, Forward, LogInIcon, MoreHorizontal, MoreVertical, Trash2, User, User2, UserCircle } from "lucide-react"
 
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Separator } from "./ui/separator"
import Link from "next/link"
import CreateWorkspace from "./CreateWorkspace"
import {signOut, useSession} from "next-auth/react"
import { useEffect, useState } from "react"
import { deleteWorkspace, getWorkspacesByUserId } from "@/actions/workspace.actions"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"

type Item = {
  id: string
  name: string;
  url: string;
}

const SideBar = () => {
  const session = useSession()
  const [items, setItems] = useState<Item[]>([])
  const router = useRouter()

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try{
        const res = await getWorkspacesByUserId(session?.data?.user?.id as string)
        const ws = res.map((item) => ({
          id: item.id,
          name: item.name,
          url: `/${item.name}`,
        }))
        setItems(ws)
        if(items.length == 0){
          router.push("/")
        }
      }
      catch(error){
        console.log("Error fetching workspaces:", error)
      }
    }

    fetchWorkspaces()
  },[session?.data?.user?.id])

  const handleCreateWorkspace = (workspace: Item) =>{
    setItems((prev) => [workspace,...prev])
    router.push(workspace.url)
  }

  const handleDelete = async (workspaceid: string) => {
    try{
        await deleteWorkspace(workspaceid)
        setItems((prev) => {
          const updated = prev.filter((item) => item.id !== workspaceid)

          if (updated.length > 0) {
            router.push(updated[0].url)
          } else {
            router.push("/")
          }

          return updated
        })
    }
    catch(error){
      console.error("error in workspace delete");
  
    }
  }

  return (
    <Sidebar className="rounded-r-lg">
        <SidebarHeader>
            <div className="h-16 flex items-center justify-center text-2xl font-bold">Logo</div>
        </SidebarHeader>
        <Separator />
      <SidebarContent>
        <SidebarGroup className="mt-2">
          <SidebarContent className="px-1.5">
            <CreateWorkspace onCreate={handleCreateWorkspace} limit={items.length}/>
          </SidebarContent>
        </SidebarGroup>
        <div className="px-2">
          <Separator />
        </div>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xl flex items-center justify-start pl-8 mb-2">Workspaces</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="flex flex-col space-y-3">
              {items.map((item,index) => (
                <SidebarMenuItem key={index} className="h-9 flex items-center justify-center border-transparent rounded-lg hover:border-gray-100">
                  <SidebarMenuButton asChild className="flex items-center gap-8 px-6 w-full h-full">
                    <Link href={item.url}>
                      <BotMessageSquare />
                      <span className=" text-start text-lg">{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuAction showOnHover>
                        <MoreHorizontal />
                        <span className="sr-only">More</span>
                      </SidebarMenuAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-48 rounded-lg"
                      align="start"
                      // side={isMobile ? "bottom" : "right"}
                      // align={isMobile ? "end" : "start"}
                    >
                      <DropdownMenuItem onClick={() => handleDelete(item.id)}>
                        <Trash2 color="red" className="text-muted-foreground" />
                        <span>Delete Workspace</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <div className="px-2">
          <Separator />
        </div>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
          <div className="h-16 w-full flex items-center justify-between px-3">
            
            <div className="flex w-[80%] items-center justify-start gap-2 min-w-0">
              <UserCircle/>
              <p className=" text-sm truncate">{session?.data?.user?.name}</p>
            </div>

          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                  <MoreVertical/>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-40" align="start">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <UserCircle />
                    <span className="truncate">
                      {session?.data?.user?.name}
                    </span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogInIcon color="red"/>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
              
        </div>
        </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

export default SideBar