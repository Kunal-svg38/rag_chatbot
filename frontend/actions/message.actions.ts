"use server"

import { storage } from "@/lib/appwrite";
import {prisma} from "@/lib/prisma";
import { ID } from "appwrite";
import { file } from "zod";

type P1 = {
    content: string;
    workspaceId: string;
    userId: string;
    received: boolean;
}

type p2 = {
    workspaceId: string;
    userId: string;
    name: string;
    url: string;
}

type p3 = {
    file: File;
    workspaceId: string;
    userId: string;
}

export const createMessage = async (props: P1) => {
    try{
        const message = await prisma.message.create({
            data: {
                content: props.content,
                workspaceId: props.workspaceId,
                userId: props.userId,
                received: props.received
            },
            select: {
                content: true,
                received: true
            }
        })
        return message;
    }
    catch(error){
        console.error(error)
        throw new Error("Failed to create message")
    }
}

export const createDocument = async (props: p2) => {
    try{
        const document = await prisma.document.create({
            data:{
                name: props.name,
                url: props.url,
                workspaceId: props.workspaceId,
                userId: props.userId
            },
            select: {
                name: true,
                url: true
            }
        })
        return document;
    }
    catch(error){
        console.error(error)
        throw new Error("Failed to create document")
    }
}

export const uploadFile = async (props: p3) => {
    try{
        const {file, workspaceId, userId} = props;
        const uploadedFile = await storage.createFile({
            bucketId: process.env.APPWRITE_BUCKET_ID!,
            fileId: ID.unique(),
            file: file,
        })
        return uploadedFile;
    }
    catch(error){
        console.error(error)
        throw new Error("Failed to upload file")
    }
}

export const getFileUrl = async (fileId: string) => {
    try{
        const fileUrl = storage.getFileView({
            bucketId: process.env.APPWRITE_BUCKET_ID!,
            fileId: fileId
        })
        return fileUrl;
    }
    catch(error){
        console.error(error)
        throw new Error("Failed to get file url")
    }
}