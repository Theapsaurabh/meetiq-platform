import { EmptyState } from "@/components/empty-state"



export const ProcessingState= ()=>{
    return (
        <div className="bg-white rounded-lg px-4 py-5 flex-col gap-y-8 items-center justify-center">
            <EmptyState
            image="/processing.svg"
            title="Meeting Completed"
            description="This meeting was Completed, a summary will apprear soon"

            />
           

        </div>
    )
}