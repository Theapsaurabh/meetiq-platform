"use client"

import { Button } from "@/components/ui/button";
import { PlusIcon, XCircleIcon } from "lucide-react";
import { NewMeetingDialog } from "./new-meetings-dialog";
import { useState } from "react";
import { MeetingSearchFilters } from "./meetings-search-filter";
import { StatusFilter } from "./status-filter";
import { AgentIdFilter } from "./agent-id-filter";
import { useMeetingsFilters } from "../../hooks/use-Meetings-filters";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ScrollBar } from "@/components/ui/scroll-area";







export const MeetingsListHeader=()=>{
    const [filters, setFilters]= useMeetingsFilters()
    const [isDialogOpen, setIsDialogOpen]= useState(false);
    const isAnyFilterModified= !!filters.status || !!filters.agentId || !!filters.search;
    const onClearFilters= ()=>{
        setFilters({
            status:null,
            agentId: "",
            search: "",
            page: 1,
        });
    }

   
    
    
    return (
        <>
        <NewMeetingDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}/>
        
        <div className="px-4 py-4 md:px-8 flex flex-col gap-y-4">
            <div  className="flex items-center justify-between">
             <h5 className="font-medium text-xl">My Meetings</h5>
            <Button onClick={()=>setIsDialogOpen(true)} >
                <PlusIcon />
               New Meetings
            </Button>
            

            </div>
            <ScrollArea>
                <div className="flex items-center gap-x-2 p-1">
                <MeetingSearchFilters/>
                <StatusFilter/>
                <AgentIdFilter

                />
                 {isAnyFilterModified && (
                    <Button variant={"outline"} onClick={onClearFilters}>
                        <XCircleIcon className="size-4"/>
                        Clear

                    </Button>
                 )}
                


            </div>
            <ScrollBar orientation="horizontal"/>

            </ScrollArea>
            
           
        </div>
        </>
        
    );
}