"use server"

import { signIn, signOut } from "@/auth";
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
 
type UserProps1 = {
    email: string;
    password: string;
}

type UserProps2 = {
    email: string;
    password: string;
    name: string;
}

export const SignUp = async (props: UserProps2) => {
    try{
        const hashedPassword = await bcrypt.hash(props.password, 10);
        const user = await prisma.user.create({
            data: {
                email: props.email,
                password: hashedPassword,
                name: props.name as string
            },
            select: {
                id: true,
                email: true,
            }
        })
        return user;
    }
    catch(error){
        console.error(error)
        throw new Error("Failed to sign in")
    }
}

export const getUserByEmail = async (email: string) => {
    try{
        const user = await prisma.user.findUnique({
            where: {
                email
            },
            select: {
                id: true,
                email: true,
                password: true,
                name: true,
                workspaceLimits: true
            }
        })
        return user;
    }
    catch(error){
        console.error(error)
        throw new Error("Failed to get user")
    }
}

export const LogIn = async (props: UserProps1) => {
    try{
        await signIn("credentials", {
            email: props.email,
            password: props.password,
            redirect: false,
        })
    }
    catch(error){
        console.error(error)
        throw new Error("Failed to log in")
    }
}

export const Logout = async () => {
    try{
        await signOut({redirectTo: "/signin"})
    }
    catch(error){
        console.error(error)
        throw new Error("Failed to log out")
    }
}

export const updateUser = async (id: string) => {
    try{
        await prisma.user.update({
            where: {
                id
            },
            data: {
                workspaceLimits: {
                    increment: 1
                }
            },
            select: null
        })
    }
    catch(error){
        console.error(error)
        throw new Error("Failed to update user")
    }
}

export const getUserLimit = async(id : string) => {
    try{
        const user = await prisma.user.findUnique({
            where: {
                id: id
            },
            select: {
                workspaceLimits: true
            }
        })
        return user?.workspaceLimits
    }
    catch(error){
        console.error(error)
        throw new Error("Failed to get user limit")
    }
}