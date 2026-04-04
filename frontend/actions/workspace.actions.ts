"use server"

import {prisma} from "../lib/prisma"
import { updateUser } from "./user.actions";

type P1 = {
    name: string;
    userId: string;
}

type P2 = { 
    workspaceId: string;
    userId: string;
}

type P3 = {
    workspaceName: string;
    userId: string;
}

export const getWorkspaceId = async (props: P3) => {
    try{
        console.log({name: props.workspaceName,
                userId: props.userId})
        const workspace = await prisma.workspace.findFirst({
            where: {
                name: props.workspaceName,
                userId: props.userId
            },
            select: {
                id: true
            }
        })
        if(!workspace){
            throw new Error("Workspace not found")
        }
        return workspace.id;
    }
    catch(error){
        console.error(error)
        throw new Error("Failed to get workspace id")
    }
}

export const createWorkspace = async (props: P1) => {
    try{
        const workspace = await prisma.workspace.create({
            data: {
                name: props.name,
                userId: props.userId
            },
            select: {
                id: true
            }
        })
        await updateUser(props.userId)
        return workspace;
    }
    catch(error){
        console.error(error)
        throw new Error("Failed to create workspace")
    }
}

export const getWorkspacesByUserId = async (userId: string) => {
    try{
        const worspaces = await prisma.workspace.findMany({
            where:{
                userId: userId
            },
            select: {
                name: true,
                id: true
            },
            orderBy:{
                updatedAt: "desc"
            }
        })
        return worspaces;
    }
    catch(error){
        console.error(error)
        throw new Error("Failed to get workspaces")
    }
}

export const getMessagesInWorkspace = async (props: P2) => {
    try{
        const messages = await prisma.message.findMany({
            where: {
                workspaceId: props.workspaceId,
                userId : props.userId
            },
            select: {
                content:true,
                received: true
            },
            orderBy: {
                createdAt: "asc"
            }

        })
        return messages;
    }
    catch(error){
        console.error(error)
        throw new Error("Failed to get messages")
    }
}

export const getDocumentsInWorkspace = async (props: P2) => {
    try{
        const documents = await prisma.document.findMany({
            where:{
                workspaceId: props.workspaceId,
                userId: props.userId
            },
            select: {
                name: true,
                url: true
            }
        })
        return documents;
    }
    catch(error){
        console.error(error)
        throw new Error("Failed to get documents")
    }
}

export const deleteWorkspace = async (id : string) => {
    try{
        console.log(id)
        await prisma.workspace.delete({
            where: {
                id: id
            }
        })
    }
    catch(error){
        console.error(error)
        throw new Error("Failed to delete workspace")
    }
}