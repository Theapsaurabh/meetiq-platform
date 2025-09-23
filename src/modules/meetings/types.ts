import { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/trpc/router/_app";
export type MeetingGetMany= inferRouterOutputs<AppRouter>['meetings']['getMany']["items"];
export type MeetingGetOne= inferRouterOutputs<AppRouter>['meetings']['getOne'];
export enum MeetingStatus{
    upcoming= "upcoming",
   active= "active",
   completed= "completed",
   processing= "processing",
   cancelled= "cancelled"

}

