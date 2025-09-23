"use client"

import { DataTable } from "@/components/data-table";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client"
import {  useSuspenseQuery } from "@tanstack/react-query";
import { columns } from "../components/column";
import { EmptyState } from "@/components/empty-state";


export const MeetingsView=()=>{
    const trpc= useTRPC();
    const {data}= useSuspenseQuery(trpc.meetings.getMany.queryOptions({}));

    return (
        <div className="overflow-x-scroll ">
           <DataTable data={data.items}
           columns={columns}
           />
           {data.items.length=== 0 && (
                   <EmptyState
                     title="No Meetings available, Create your First Meetings "
                     description="You haven’t added any Meetings yet. Start by creating your first one."
                     
                   />
                 )}
           


        </div>
    )

}
export const  MeetingsViewLoading = () => {
  return (
    <LoadingState
      title="loading  meetings "
      description="this may take a few seconds"
    ></LoadingState>
  );
};

export const MeetingsViewError = () => {
  return (
    <ErrorState
      title="Failed to load Meetings"
      description="There was an error while loading Meetings. Please try again."
    />
  );
};