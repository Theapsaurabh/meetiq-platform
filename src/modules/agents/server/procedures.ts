import { db } from "@/db";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { agents } from "@/db/schema";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { agentCreateSchema } from "../schemas";
export const agentsRouter = createTRPCRouter({
    // TODO: Change `getOne` to use `protectedProcedure`
    getOne:baseProcedure.input(z.object({id:z.string()})).query(async({input})=>{
        const [existingAgents]= await db.select().from(agents).where(eq(agents.id, input.id));
        
        return existingAgents;
    }),
    getMany:baseProcedure.query(async()=>{
        const data= await db.select().from(agents);
        
        return data;
    }),
    create: protectedProcedure.input(agentCreateSchema).mutation(async({input, ctx})=>{
        const [createdAgents]= await db.insert(agents).values({
           ...input,
              userId: ctx.auth.user.id
        }).returning();
        return createdAgents;
    })
});