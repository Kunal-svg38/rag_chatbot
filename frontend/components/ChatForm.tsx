"use client"


import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { Button } from "@/components/ui/button"
import { FileIcon, Send } from "lucide-react"
import { createDocument, createMessage, getFileUrl, uploadFile } from "@/actions/message.actions"
import { useSession } from "next-auth/react"

const chatFormSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
  file: z.instanceof(File).optional()
})

type P1 = {
  workspaceId: string;
  handleNewMessage: (message: {content: string, received: boolean}) => void;
  handleNewDocument: (document: {name: string, url: string}) => void;
}

const ChartForm = ({workspaceId, handleNewMessage, handleNewDocument}: P1) => {
  const session = useSession()
    const form = useForm<z.infer<typeof chatFormSchema>>({
        resolver: zodResolver(chatFormSchema),
        defaultValues: {
            prompt: "",
            file: undefined
        }
    })

    const onSubmit = async(data: z.infer<typeof chatFormSchema>) => {
        try{
          console.log(data)
          if(data.file){
            const formData = new FormData()
            const file = await uploadFile({file: data.file, workspaceId, userId: session?.data?.user?.id as string})
            console.log("file uploaded")
            const fileUrl = await getFileUrl(file.$id)

            await createDocument({
              name: file.name,
              url: fileUrl,
              workspaceId,
              userId: session?.data?.user?.id as string
            })

            handleNewDocument({name: file.name, url: fileUrl})

            formData.append("workspaceId", workspaceId)
            formData.append("file", data.file)
            formData.append("docId",file.$id)
            const res = await fetch('/api/upload',{
              method: 'POST',
              body: formData
            })
            if(!res.ok){
              throw new Error("upload error")
            }
          }

          await createMessage({
            content: data.prompt,
            workspaceId,
            userId: session?.data?.user?.id as string,
            received: false
          })

          handleNewMessage({content: data.prompt, received: false})

          const res = await fetch('/api/query',{
              method: 'POST',
              body: JSON.stringify({workspaceId: workspaceId, prompt: data.prompt}),
            })
          const result = await res.json();

          await createMessage({
            content: result.answer,
            workspaceId,
            userId: session?.data?.user?.id as string,
            received: true
          })

          handleNewMessage({content: result.answer, received: true})
          console.log(result)
        }
        catch(error){
          console.error("Error submitting form:", error)
        }
        finally{
          form.reset()
        }
    }

  return (
    <div className="h-full w-full flex items-center justify-center p-2">
      <form className="h-full w-full flex items-center justify-center" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="flex flex-row gap-2 items-center ">
            <Controller
              name="prompt"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}> 
                  <Input
                    {...field}
                    id = "form-prompt"
                    // aria-invalid={fieldState.invalid}
                    placeholder="Type your question here..."
                    autoComplete="off"
                  />
                </Field>
              )}
            />

            <Controller
              name="file"
              control={form.control}
              render={({ field: {value, onChange , ...rest}, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="w-fit">
                  <Input
                    {...rest}
                    id = "form-file"
                    type="file"
                    aria-invalid={fieldState.invalid}
                    placeholder="Attach"
                    className="hidden"
                    autoComplete="off"
                    onChange={(e) =>{
                      const f = e.target.files?.[0]
                      onChange(f)
                    }}
                  />
                  <label htmlFor="form-file" >
                      <FileIcon/>
                  </label>
                </Field>
              )}
            />

            <Button type="submit" disabled={Boolean(form.formState.errors.prompt)|| Boolean(form.formState.errors.file)|| form.formState.isSubmitting}>
              <Send />
            </Button>
            
          </FieldGroup>
        </form>
    </div>
  )
}

export default ChartForm