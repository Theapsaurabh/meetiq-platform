"use client"
import {  useSuspenseQuery } from "@tanstack/react-query"
import { useTRPC } from "@/trpc/client";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";

export const AgentsView= ()=>{
    const trpc= useTRPC();
    const {data, }= useSuspenseQuery(trpc.agents.getMany.queryOptions());
   
    return (
        <div>
         
            {JSON.stringify(data, null,2)}
        </div>
    )
}

export const AgentsViewLoading=()=>{
    return (
      <LoadingState
      title="loading Agents " 
      description="this may take a few seconds"
      
      ></LoadingState>
    )
}

export const ErrorView = () => {
  return (
    <ErrorState
      title="Failed to load Agents"
      description="There was an error while loading Agents. Please try again."
    />
  );
};