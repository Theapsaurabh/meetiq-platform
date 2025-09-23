import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { MeetingsView, MeetingsViewLoading, MeetingsViewError } from "@/modules/meetings/ui/views/meetings-views";
import { MeetingsListHeader } from "@/modules/meetings/ui/components/meetings-list-header";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Page() {
  const session= await auth.api.getSession({
        headers: await headers()
      });
      if(!session){
       redirect('/sign-in')
      }
  const queryClient = getQueryClient();

  
  void queryClient.prefetchQuery(
    trpc.meetings.getMany.queryOptions({})
  );

  return (
    <>
    <MeetingsListHeader/>
     <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<MeetingsViewLoading />}>
        <ErrorBoundary FallbackComponent={MeetingsViewError}>
          <MeetingsView />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
    </>
   
  );
}
