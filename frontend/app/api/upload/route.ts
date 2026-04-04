"use server"

import { NextResponse } from "next/server"

export async function POST(req: Request){
    try{
        const form = await req.formData();

        const res = await fetch(process.env.BACKEND_URL + "/api/upload", {
            method: "POST",
            body: form
        })
        return NextResponse.json(await res.json(),{status: res.status})
    }
    catch(error){
        console.log(error);
        return NextResponse.json({error: "Error in /api/upload route"}, {status: 500})
    }
}