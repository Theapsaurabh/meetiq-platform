
import { AgentsView, AgentsViewLoading, ErrorView } from "@/modules/agents/ui/views/agents-views";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";

const page = async () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions());
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<AgentsViewLoading/>}>
      <ErrorBoundary  fallback={<ErrorView></ErrorView>}>
          <AgentsView></AgentsView>
      </ErrorBoundary>
      
      </Suspense>
    </HydrationBoundary>
  );
};
export default page;
