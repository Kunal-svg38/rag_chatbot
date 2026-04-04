"use client"

import { useEffect, useState } from 'react'
import ChatArea from './ChatArea'
import ChartForm from './ChatForm'
import { useSession } from 'next-auth/react'
import { getDocumentsInWorkspace, getMessagesInWorkspace, getWorkspaceId } from '@/actions/workspace.actions'
import { set } from 'zod'
import Documents from './Documents'

type msgType = {
  content: string;
  received : boolean
}

type docType = {
  name: string;
  url: string 
}

const ChatComponent = ({workspace}: {workspace: string}) => {
    const [messages, setMessages] = useState<msgType[]>([])
    const [documents, setDocuments] = useState<docType[]>([])
    const [workspaceId, setWorkspaceId] = useState<string>("")

    const {data: session,status} = useSession()

    console.log("chat componenet",session?.user?.id)

    useEffect(() => {
      if(status !== "authenticated") return
        
        const fetchMessages = async ({workspaceName, userId}: {workspaceName: string, userId: string}) => {
          try{
            const wsId = await getWorkspaceId({workspaceName, userId})
            
            setWorkspaceId(wsId)
            const res = await getMessagesInWorkspace({workspaceId: wsId,userId})
            const docs = await getDocumentsInWorkspace({workspaceId: wsId,userId})
            setDocuments(docs)
            setMessages(res)
    
          }
          catch(error){
            console.log("Error fetching messages:", error);
          }
        }
        fetchMessages({workspaceName: workspace,userId: session?.user?.id as string})
      },[workspace, session?.user?.id])

      const handleNewMessage = (message: msgType) => {
        setMessages((prev) => [...prev, message]);
    }

    const handleNewDocument = (document: docType) => {
      setDocuments((prev) => [...prev,document])
    }

  return (
    <div className="flex flex-col w-full h-full space-y-5 px-4">
        <header className=" flex items-center justify-between h-[8%] gap-5">
          <span className=' w-[70%] text-2xl font-semibold truncate'>
            {`Workspace: ${workspace}`}
          </span>
          <div className=''>
            <Documents documents={documents}/>
          </div>
        </header>
        <div className="flex-1 h-[75%]">
            {messages.length > 0 ? (<ChatArea messages={messages}/>) : 
              (
                <div className=' w-full h-full flex items-center justify-center rounded-md border-gray-100'>
                  <span>no messages</span>
                </div>
              ) 
            }
        </div>
        <footer className="h-[15%]">
            <ChartForm handleNewMessage={handleNewMessage} handleNewDocument={handleNewDocument} workspaceId={workspaceId} />
        </footer>
    </div>  
  )
}

export default ChatComponent