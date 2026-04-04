import NextAuth from "next-auth"
import bcrypt from "bcryptjs"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./lib/prisma"
import { getUserByEmail } from "./actions/user.actions"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma), 
    session: {
        strategy: "jwt",
    },
  providers: [
    Credentials({
        credentials: {
            email:{},
            password: {}
        },
        authorize: async (credentials) => {
            try{
                // console.log(credentials)
                const user = await getUserByEmail(credentials.email as string)
                if(!user){
                    throw new Error("Invalid credentials")
                }
                const isPasswordValid = await bcrypt.compare(credentials.password as string, user.password)
                if(!isPasswordValid){
                    throw new Error("Invalid credentials")
                }
                return user
            }
            catch(error){
                console.log(error)
                return null;
            }
        },
    })
  ],
  callbacks: {
    jwt: async({ token, user}) => {
        if(user){
            token.id = user.id
            token.email = user.email
        }
        return token;
    },
    session: async({ session, token }) => {
        if(token){
            session.user.id = token.id as string
            session.user.email = token.email as string
        }   
        // console.log("session",session)
        return session;
    }
    }
})