"use client"

import { getUserLimit, updateUser } from "@/actions/user.actions"
import { createWorkspace } from "@/actions/workspace.actions"
import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

type Props = {
  onCreate: (workspace: {name: string, url: string, id: string}) => void;
  limit: number
}

const CreateWorkspace = ({onCreate, limit}: Props) => {
  const {data: session,status} = useSession()
  const [workspaceName, setWorkspaceName] = useState<string>("")
  const [workspacelimit, setWorkspaceLimit] = useState<number>(limit)

  // useEffect(() => {
  //   if(status !== "authenticated") return
  //   const fetchLimit = async () => {
  //     try{
  //       const res = await getUserLimit(session?.user?.id as string)
  //       setLimit(res as number)
  //     }
  //     catch(error){
  //       console.log("Error fetching user limit:", error)
  //     }
  //   }
  //   fetchLimit()
  // },[session?.user?.id])

  const slugify = (str: string) => {
    return str.trim().replace(/\s+/g, "-")
  }
 
  const handleSubmit = async () => {
    try{
      const wid = await createWorkspace({
        name: slugify(workspaceName),
        userId: session?.user?.id as string
      })
      onCreate({name: slugify(workspaceName), url: `/${slugify(workspaceName)}`, id: wid.id})
      setWorkspaceLimit((prev) => prev + 1)
    }
    catch(error){
      console.error("Error creating workspace:", error)
    }
    finally{
      setWorkspaceName("")
    }
  }
  return (
    <Field orientation="horizontal">
      <Input type="text" placeholder={workspacelimit >= 5 ? "Workspace limit reached" : "Create Workspace"} disabled={workspacelimit >= 5} value={workspaceName} onChange={(e) => setWorkspaceName(e.target.value)} />
      <Button type="submit" onClick={handleSubmit} disabled={limit >= 5 || workspaceName.trim().length === 0}>
        <Plus/>
      </Button>
    </Field>
  )
}

export default CreateWorkspace