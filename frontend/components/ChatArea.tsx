"use client"

import { useEffect, useRef, useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"

type msgType = {
  content: string;
  received : boolean
}

const ChatArea = ({messages}: {messages: msgType[]}) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  console.log(messages.length)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  },[messages])

  return (
    <>
    <ScrollArea className="h-full w-full rounded-md border">
      
      <div className="p-4 space-y-3">
        {messages.map((tag, index) => (
          <div
            key={index}
            className={`w-full flex ${
              tag.received ? "justify-start" : "justify-end"
            }`}
          >
            <div
              className={`inline-block p-3 rounded-md wrap-break-word max-w-[60%]
                ${
                  tag.received
                    ? "bg-blue-400 text-white"
                    : "bg-gray-400 text-black"
                }`}
            >
              {tag.content}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
    </>
  )
}

export default ChatArea
