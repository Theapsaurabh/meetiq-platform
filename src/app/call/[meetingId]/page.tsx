import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

import { headers } from "next/headers";

import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { CallView } from "@/modules/call/ui/views/call-views";

interface Props{
    params: Promise<{
        meetingId: string;
    }>
};
 const Page= async({params}:Props)=>{
    const session= await auth.api.getSession({
        headers: await headers(),

    });
    if(!session?.user){
        redirect("/sign-in")
    }
    const {meetingId}= await params;
    const queryClient= getQueryClient();
    void queryClient.prefetchQuery(
        trpc.meetings.getOne.queryOptions({id:meetingId})
    );
    
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <CallView
            meetingId={meetingId}

            />


        </HydrationBoundary>
        
    )

}
export default Page;