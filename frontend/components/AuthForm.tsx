"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Field, FieldError, FieldGroup, FieldLabel } from './ui/field'
import { Controller, useForm } from 'react-hook-form'
import { Input } from './ui/input'
import { Button } from './ui/button'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { LogIn, SignUp } from '@/actions/user.actions'
import { useRouter } from 'next/navigation'
import { use, useState } from 'react'

type authType = "login" | "signup"

const formSchema = z.object({
    email: z.email({message: "Invalid email address"}),
    name: z.string().optional().refine((val) => {
    if (!val || val.length === 0) return true;
    return val.length >= 2;
  }, { message: "Username must be at least 2 characters" }),
    password: z.string().min(6, {message: "Password must be at least 6 characters"})
})

const AuthForm = () => {

  const [type, setType] = useState<authType>("signup")

    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues:{
            email: "",
            password: "",
            name: "",
        }
    })
    
    const onSubmit = async(data: z.infer<typeof formSchema>) => {
        try{
            if(type === "signup"){
                await SignUp({
                    email: data.email,
                    password: data.password,
                    name: data.name as string
                })
            }
            await LogIn({
                    email: data.email,
                    password: data.password,
                })
            router.refresh()
        }
        catch(error){
            console.error("Authentication error:", error)
        }
        finally{
            form.reset()
        }
    }

  return (
    <>
    <CardHeader>
            <CardTitle className=' text-2xl text-center font-bold'>{type === "login" ? "Login" : "SignUp"}</CardTitle>
          </CardHeader>
      <CardContent>
        <form id="form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            {type == "signup" && <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-name">
                    Username
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-name"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter your username..."
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />}
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-email">
                    Email
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-email"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter your email..."
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-password">
                    Password
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-password"
                    type="password"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter your password..."
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter>
        <FieldGroup>
        <Field orientation="horizontal">
          <Button className='w-full' type="submit" form="form">
            {type == "login" ? 'Login' : 'Signup'}
          </Button>
        </Field>

        <Field className=' mt-0'>
            {type === "login" && 
              <div className="flex flex-wrap items-center justify-center gap-1 text-sm">
                <p>Don't have an account?</p>
                <p className="underline cursor-pointer hover:text-blue-600 transition-colors"
                    onClick={() => {
                      form.reset()
                      setType("signup")
                    }}
                >
                  Signup
                 </p>
              </div>
            } 
            {type === "signup" && 
              <div className="flex flex-wrap items-center justify-center gap-1 text-sm">
                <p>Already have an account?</p>
                <p
                  className="underline cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => {
                    form.reset()
                    console.log("button")
                    setType("login")
                  }}
                >
                Login
                </p>
              </div>
            }
        </Field>
        </FieldGroup>
      </CardFooter>
    </>
    
  )
}

export default AuthForm