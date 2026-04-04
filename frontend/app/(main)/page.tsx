import { auth } from "@/auth";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { redirect } from "next/navigation";


export default async function Home() {
  const session = await auth()
  if(!session){
    redirect("/auth")
  }
  return (
    <div className="flex flex-1 items-center justify-center h-full w-full p-4">
      <Card className=" h-fit  mx-auto w-[70%] max-w-sm ">
      <CardHeader>
        <CardTitle>Welcome to DocChat</CardTitle>
        <CardDescription>
          Create Different Workspaces to separate context
          Upload and chat with documents
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button className="w-full">Get Started by creating a workspace</Button>
      </CardFooter>
    </Card>
    </div>
  );
}
