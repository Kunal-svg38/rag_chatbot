"use server"

import { NextResponse } from "next/server";

export async function POST(req: Request){
    try{
        const body = await req.json();

        const res = await fetch(process.env.BACKEND_URL + "/api/query", {
            method: "POST",
            headers: {"Content-Type": "application/json" },
            body: JSON.stringify(body)
        })
        return NextResponse.json(await res.json(),{status: res.status})
    }
    catch(error){
        console.log(error);
        return NextResponse.json({error: "Failed to process query"}, {status: 500})
    }
}