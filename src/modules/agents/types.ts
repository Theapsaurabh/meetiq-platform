import { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/trpc/router/_app";
export type AgentGetOne= inferRouterOutputs<AppRouter>['agents']['getOne'];
export type AgentGetMany= inferRouterOutputs<AppRouter>['agents']['getMany']["items"];
