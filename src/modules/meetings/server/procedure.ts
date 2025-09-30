import { db } from "@/db";
import {   z } from "zod";
import { and, desc, eq, getTableColumns, ilike, count, sql } from "drizzle-orm";
import { agents, meetings } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";


import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
} from "@/constants";
import { TRPCError } from "@trpc/server";
import { meetingsInsertSchema, meetingsUpdateSchema } from "../schems";
import { MeetingStatus } from "../types";
import { streamVideo } from "@/lib/stream-video";
import { generateAvatarUri } from "@/lib/avatar";

export const meetingsRouter = createTRPCRouter({
  generateToken: protectedProcedure.mutation(async({ctx})=>{
    await streamVideo.upsertUsers([
      {
        id: ctx.auth.user.id,
        name: ctx.auth.user.name || ctx.auth.user.email!,
        role: "admin",
        image:
         ctx.auth.user.image ?? generateAvatarUri({
          seed: ctx.auth.user.name ,
          variant: "initials",
         }),
      }
    ]);
    const expirationTime= Math.floor(Date.now()/1000) + 3600; 
    const issuedAt= Math.floor(Date.now()/1000)-60;
    const token= streamVideo.generateUserToken({
      user_id: ctx.auth.user.id,
      exp: expirationTime,
      validity_in_seconds: issuedAt,
    });
    return token;

  }),
  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { id, } = input;

      const [removedMeetings] = await db
        .delete(meetings)
        
        .where(and(eq(meetings.id, id), eq(meetings.userId, ctx.auth.user.id)))
        .returning();

      if (!removedMeetings) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Meeting not found",
        });
      }

      return removedMeetings;
    }),
  create: protectedProcedure
    .input(meetingsInsertSchema)
    .mutation(async ({ input, ctx }) => {
      const [createdMeeting] = await db
        .insert(meetings)
        .values({
          ...input,
          userId: ctx.auth.user.id,
        })
        .returning();
        const call= streamVideo.video.call("default", createdMeeting.id);
        await call.create({
          data:{
            created_by_id: ctx.auth.user.id,
            custom:{
              meetingId: createdMeeting.id,
              meetingsName: createdMeeting.name,
            },
            settings_override:{
            transcription: {
              language: "en",
              mode: "auto-on",
              closed_caption_mode: "auto-on",

              
            },recording:{
              mode:"auto-on",
              quality:"1080p",

            },

            
          }
          },
          
        });

        const [existingAgent]= await db.select()
        .from(agents)
        .where(and(eq(agents.id, createdMeeting.agentId), ));
        if(!existingAgent){
          throw new TRPCError({
            code:"BAD_REQUEST",
            message:"Agent not found",
          });
        }
        await streamVideo.upsertUsers([
          {
            id: existingAgent.id,
            name: existingAgent.name,
            role:"user",
            image: generateAvatarUri({
              seed: existingAgent.name,
              variant:"initials",
            })
            
          }
        ])


      return createdMeeting;
    }),

  
  update: protectedProcedure
    .input(meetingsUpdateSchema)
    .mutation(async ({ input, ctx }) => {
      const { id, ...data } = input;

      const [updatedMeeting] = await db
        .update(meetings)
        .set({
          ...data,
        })
        .where(and(eq(meetings.id, id), eq(meetings.userId, ctx.auth.user.id)))
        .returning();

      if (!updatedMeeting) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Meeting not found",
        });
      }

      return updatedMeeting;
    }),

  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const [existmeeting] = await db
        .select({
          ...getTableColumns(meetings),
          agent: agents,  
           duration: sql<number>`EXTRACT(EPOCH FROM (${ meetings.endedAt} - ${ meetings.startedAt})) `.as("duration"),
        })
        .from(meetings)
        .innerJoin(agents, eq(meetings.agentId, agents.id))
        .where(
          and(eq(meetings.id, input.id), eq(meetings.userId, ctx.auth.user.id))
        );

      if (!existmeeting) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Meeting not found",
        });
      }

      return existmeeting;
    }),

  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().default(DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(MIN_PAGE_SIZE)
          .max(MAX_PAGE_SIZE)
          .default(DEFAULT_PAGE_SIZE),
        search: z.string().nullish(),
        agentId: z.string().nullish(),
        status: z.enum([
          MeetingStatus.upcoming,
          MeetingStatus.active,
          MeetingStatus.completed,
          MeetingStatus.processing,
          MeetingStatus.cancelled,
        ]).nullish()
      })
    )
    .query(async ({ ctx, input }) => {
      const { search, page, pageSize, status,  agentId } = input;

      const data = await db
        .select({
          ...getTableColumns(meetings),
          agent: agents,
          duration: sql<number>`EXTRACT(EPOCH FROM (${ meetings.endedAt} - ${ meetings.startedAt})) `.as("duration"),
        })
        .from(meetings)
        .innerJoin(agents, eq(meetings.agentId, agents.id))
        .where(
          and(
            eq(meetings.userId, ctx.auth.user.id),
            search ? ilike(meetings.name, `%${search}%`) : undefined,
            status ? eq(meetings.status, status): undefined,
            agentId ? eq(meetings.agentId , agentId ): undefined,
            

          )
        )
        .orderBy(desc(meetings.createdAt), desc(meetings.id))
        .limit(pageSize)
        .offset((page - 1) * pageSize);

      const total = await db
        .select({
          count: count(),
        })
        .from(meetings)
        .innerJoin(agents, eq(meetings.agentId, agents.id))
        .where(
          and(
            eq(meetings.userId, ctx.auth.user.id),
            search ? ilike(meetings.name, `%${search}%`) : undefined,
            status ? eq(meetings.status, status): undefined,
            agentId ? eq(meetings.agentId , agentId ): undefined,
            
          )
        );

      const totalCount = total[0]?.count ?? 0;
      const totalPages = Math.ceil(totalCount / pageSize);

      return {
        items: data,
        total: totalCount,
        totalPages,
      };
    }),
});
