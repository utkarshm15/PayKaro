"use server"

import prisma from "@repo/db/client"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth"

export async function startOnRamp(amount:number,provider:string){
    
    const session = await getServerSession(authOptions);
    if(!session || !session.user){
        return {
            message : "Unauthenticated"
        }
    }
    try {
        console.log(session.user.id);
        
        const token = (Math.random()*1000).toString()
        await prisma.onRampTransaction.create({
            data:{
                userId:session.user.id,
                amount:amount*100,
                status:"Processing",
                startTime: new Date(),
                provider,
                token

            }
        })
        return {
            message : "Done"
        }
    } catch (error) {
        console.log(error);
        return {
            message : "Error while processing" 
            
        }
    }
}