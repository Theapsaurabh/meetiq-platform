import { inferRouterOutputs } from "@trpc/server";
import type { AppRoute } from "@/trpc/router/_app";
export type AgentGetOne= inferRouterOutputs<AppRoute>['agents']['getOne'];
