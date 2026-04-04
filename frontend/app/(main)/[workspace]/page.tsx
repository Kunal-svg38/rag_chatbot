import { auth } from "@/auth";
import ChatArea from "@/components/ChatArea";
import ChatComponent from "@/components/ChatComponent";
import ChartForm from "@/components/ChatForm";
import { redirect } from "next/navigation";

const page = async ({params}: {params: Promise<{workspace: string}>}) => {
  const session = await auth()
  if(!session){
    redirect("/auth")
  }
    const {workspace} = await params;
  return (
    <ChatComponent workspace={workspace} />
  )
}

export default page