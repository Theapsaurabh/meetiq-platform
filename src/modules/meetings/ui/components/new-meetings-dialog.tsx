import { ResponsiveDialog } from "@/components/responsive-dialog";
import { MeetingForm } from "./meeting-form";
import { useRouter } from "next/navigation";

interface NewMeetingsDialogProps{
    open:boolean;
    onOpenChange:(open:boolean)=>void;
}
export const NewMeetingDialog=({open,onOpenChange}:NewMeetingsDialogProps)=>{
    const router= useRouter()
    return (
        <ResponsiveDialog
        open={open}
        onOpenChange={onOpenChange}
        title="New Meetings"
        description="Create a new Meetings"
        >
            <MeetingForm 
            onSuccess={(id)=>{
                onOpenChange(false);
                router.push(`/meetings/${id}`);
            }}
            onCancel={()=>onOpenChange}
            />
            
        </ResponsiveDialog>
    );
}   