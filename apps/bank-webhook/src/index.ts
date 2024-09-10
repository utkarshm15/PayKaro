import prisma from "@repo/db/client";
import express from "express"
import * as z from "zod"
const app = express();

app.use(express.json())

const bodySchema = z.object({
    token : z.string(),
    userId : z.string(),
    amount : z.string()
})

app.post("/hdfcWebhook",async(req,res)=>{
    const {data,success} = bodySchema.safeParse(req.body)
    if(!success){
        return res.status(411).json({message : "Invalid inputs"})
    }
    try{
        await prisma.$transaction([
            prisma.balance.update({
                where : {
                    userId : data.userId
                },
                data:{
                    amount : {
                        increment : Number(data.amount)
                    }
                }
            }),
            prisma.onRampTransaction.update({
                where : {
                    token : data.token
                },
                data:{
                    status : "Success"
                }
            })
        ])
        return res.json({
            message : "Captured"
        })
    }catch(err){
        console.log(err);
        return res.status(411).json({message : "Error while processing"})
    }
})

app.listen(3003,()=>{console.log("listening on 3003")})