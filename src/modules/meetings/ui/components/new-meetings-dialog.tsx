import { ResponsiveDialog } from "@/components/responsive-dialog";

interface NewMeetingsDialogProps{
    open:boolean;
    onOpenChange:(open:boolean)=>void;
}
export const NewMeetingDialog=({open,onOpenChange}:NewMeetingsDialogProps)=>{
    return (
        <ResponsiveDialog
        open={open}
        onOpenChange={onOpenChange}
        title="New Meetings"
        description="Create a new Meetings"
        >
            <div>
                New Agent Form goes here
            </div>
            TODO : Meeting form
        </ResponsiveDialog>
    );
}   