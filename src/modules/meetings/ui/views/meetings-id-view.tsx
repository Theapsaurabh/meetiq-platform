"use client"
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { MeetingIdViewHeader } from "../components/meetings-id-view-header";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/use-confirm";
import { UpdateMeetingDialog } from "../components/update-meetings-dialog";
import { useState } from "react";

interface Props {
  meetingId: string;
}

export const MeetingsIdView  = ({ meetingId }: Props) => {
  const trpc = useTRPC();
  const router= useRouter()
  const queryClient= useQueryClient();
  const [UpdateMeetingDialogOpen, setUpdateDialogOpen ]= useState(false)

  const [RemoveConfirmation, confirmRemove]= useConfirm(
    "Are you Sure ?",
    `The following action will remove the meeting and all associated transcripts`

  );

  
  const { data } = useSuspenseQuery(
    trpc.meetings.getOne.queryOptions({ id: meetingId })
  );


  const  removeMeeting= useMutation(
    trpc.meetings.remove.mutationOptions({
        onSuccess:()=>{
            queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}));
            // TODO : Invalidte free tier usage 
            router.push('/meetings')


        },
        onError:(error)=>{
            toast.error(error.message);
        }
    })
  )

  const handleRemoveMeeting= async()=>{
    const ok= await confirmRemove();
    if(!ok) return;
    await removeMeeting.mutateAsync({id:meetingId});

  } 

  return (
    <>
    <RemoveConfirmation/>
    <UpdateMeetingDialog
    open={UpdateMeetingDialogOpen}
    onOpenChange={setUpdateDialogOpen}
    initialValues={data}
    />
    <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
      <h2 className="text-lg font-semibold">Meeting Details</h2>
      <MeetingIdViewHeader
      meetingId={meetingId}
      meetingname={data.name}
      onEdit={()=>setUpdateDialogOpen(true)}
      onRemove={handleRemoveMeeting}
      />
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
    </>
    
  );
};
export const MeetingsIdLoading  = () => {
  

  return (
    <LoadingState
     title="loading meeting details"
     description="this may take few seconds"
    />



   
    
  );
};

export const MeetingsIdError = () => {
  

  return (
    <ErrorState
     title=" Error loading meeting "
     description="Please try again later"

    />
     
   
  );
};
