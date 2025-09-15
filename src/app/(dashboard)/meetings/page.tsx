import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { MeetingsView, MeetingsViewLoading, MeetingsViewError } from "@/modules/meetings/ui/views/meetings-views";

export default async function Page() {
  const queryClient = getQueryClient();

  
  await queryClient.prefetchQuery(
    trpc.meetings.getMany.queryOptions({})
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<MeetingsViewLoading />}>
        <ErrorBoundary FallbackComponent={MeetingsViewError}>
          <MeetingsView />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
}
