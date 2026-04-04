"use client"

import { LogOut } from "lucide-react"
import { ModeToggle } from "./mode-toggle"
import { signOut } from "next-auth/react"


const NavBar = () => {
  return (
    <div className="w-full flex items-center justify-center ">
        <div className="flex flex-1 items-center justify-end gap-4">
            <div>
                <ModeToggle/>
            </div>
            <div>
                <LogOut color="red" onClick={() => signOut()}/>
            </div>

        </div>
    </div>
  )
}

export default NavBar