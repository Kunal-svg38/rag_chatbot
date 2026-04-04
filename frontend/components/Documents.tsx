import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Button } from './ui/button'

type docType = {
  name: string;
  url: string 
}


const Documents = ({documents} : {documents : docType[]}) => {
    
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Documents</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="left"className="w-50" align="start">
        {documents.length === 0 && (
          <DropdownMenuItem disabled>
            No documents
          </DropdownMenuItem>
        )}

        {documents.map((doc, index) => (
          <DropdownMenuItem key={index} asChild>
            <DropdownMenuItem>
                <span className="truncate">
                  {doc.name}
                </span>
              </DropdownMenuItem>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default Documents