import { auth } from '@/auth'
import AuthForm from '@/components/AuthForm'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { redirect } from 'next/navigation'



const page = async () => {
    const session = await auth()
    if(session){
        redirect("/")
    }

  return (
    <Card className="w-full sm:max-w-md bg-gray-50">
      <AuthForm/>
    </Card>
  )
}

export default page
