import { db } from "@/db";
import { z } from "zod";
import { and, desc, eq, getTableColumns, ilike,  count } from "drizzle-orm";
import { meetings } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
} from "@/constants";
import { TRPCError } from "@trpc/server";

export const meetingsRouter = createTRPCRouter({
  

  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input,ctx }) => {
      const [existmeeting] = await db
        .select({
          ...getTableColumns(meetings),
         
        })
        .from(meetings)
        .where(and(
          eq(meetings.id, input.id),
          eq(meetings.userId, ctx.auth.user.id)
        ));
        if(!existmeeting){
          throw new TRPCError({code: "NOT_FOUND", message: "Meetings not found"});
          
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
      })
    )
    .query(async ({ ctx, input }) => {
      const { search, page, pageSize } = input;

      const data = await db
        .select({
          ...getTableColumns(meetings),
         
        })
        .from(meetings)
        .where(
          and(
            eq(meetings.userId, ctx.auth.user.id),
            search ? ilike(meetings.name, `%${search}%`) : undefined
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
        .where(
          and(
            eq(meetings.userId, ctx.auth.user.id),
            search ? ilike(meetings.name, `%${search}%`) : undefined
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
