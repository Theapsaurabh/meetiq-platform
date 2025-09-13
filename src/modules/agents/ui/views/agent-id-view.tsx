"use client"
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { AgentIdViewHeader } from "../components/agent-id-view-header";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Badge } from "@/components/ui/badge"
import { VideoIcon } from "lucide-react";


interface Props {
  agentId: string;
}

export const AgentIdView = ({ agentId }: Props) => {
  const trpc = useTRPC();

  // Correct hook for a single query
  const { data } = useSuspenseQuery(
    trpc.agents.getOne.queryOptions({ id:agentId })
  );
  const avatarUrl = `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${
    data.name || "default"
  }`;
  return (
    <div className=" flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
      <h2>Agent Details</h2>
      <AgentIdViewHeader
      agentId={agentId}
      agentName={data.name}
      onEdit={()=>{}}
      onRemove= {()=>{}}
      
      />
      <div className="bg-white rounded-lg border">
        <div className="px-4 py-5 gap-y-5 flex flex-col col-span-5">
            <div className="flex items-center gap-x-3">
                {/* //generate Avatar Create  */}
                <Avatar className="border w-16 h-16 rounded-full">
          <AvatarImage src={avatarUrl} alt="Agent avatar" />
          <AvatarFallback>...</AvatarFallback>
        </Avatar>
          <h2 className="text-2xl font-medium ">
            {data.name}

          </h2>
                <Badge variant="outline" className="flex items-center gap-x-2 [&>svg]:size-4">
                     <VideoIcon/>
                     {data.meetingCount}{data.meetingCount===1 ?"meeinng": "Meetings"}
                </Badge>
               <div className="flex flex-col gap-y-4">
                <p>Instruction</p>
                <p>{data.instruction}</p>

               </div>


            </div>

        </div>

      </div>
    </div>
  );
};

export const AgentsIdViewLoading = () => {
  return (
    <LoadingState
      title="loading Agents "
      description="this may take a few seconds"
    ></LoadingState>
  );
};

export const AgentIdErrorView = () => {
  return (
    <ErrorState
      title="Failed to load Agents"
      description="There was an error while loading Agents. Please try again."
    />
  );
};
