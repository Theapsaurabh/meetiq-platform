import { ResponsiveDialog } from "@/components/responsive-dialog";
import { MeetingForm } from "./meeting-form";

import { MeetingGetOne } from "../../types";

interface NewMeetingsDialogProps{
    open:boolean;
    onOpenChange:(open:boolean)=>void;
    initialValues: MeetingGetOne;
}
export const UpdateMeetingDialog=({open,onOpenChange, initialValues}:NewMeetingsDialogProps)=>{
   
    return (
        <ResponsiveDialog
        open={open}
        onOpenChange={onOpenChange}
        title="Edit Meetings"
        description="Edit the  Meetings details"
        >
            <MeetingForm 
            onSuccess={()=>{
                onOpenChange(false);
                
              
            }}
            onCancel={()=>onOpenChange(false)}
            initialValues={initialValues}
            />
            
        </ResponsiveDialog>
    );
}   