"use client"

import { Button } from "@/components/ui/button";
import { PlusIcon, XCircleIcon } from "lucide-react";
import { NewAgentDialog } from "./new-agent-dialog";
import { useState } from "react";
import { useAgentFilters } from "../../hooks/use-agents-filters";
import { AgentSearchFilters } from "./agents-search-filter";
import { DEFAULT_PAGE } from "@/constants";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ScrollBar } from "@/components/ui/scroll-area";

export const AgentListHeader=()=>{
    const [filters, setFilters] = useAgentFilters();
    const [isDialogOpen,setIsDialogOpen]= useState(false);
    const isAnyFilterModified= !!filters.search;
    const onClearFilters= ()=>{
        setFilters({
            search:"",
            page:DEFAULT_PAGE,

        })
    }
    return (
        <>
        <NewAgentDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}/>
        <div className="px-4 py-4 md:px-8 flex flex-col gap-y-4">
            <div  className="flex items-center justify-between">
             <h5 className="font-medium text-xl">Agents</h5>
            <Button onClick={()=>setIsDialogOpen(true)} >
                <PlusIcon />
                Create Agent
            </Button>

            </div>
            <ScrollArea>
                 <div className="flex items-center gap-x-2 p-1">
                <AgentSearchFilters/>
                {isAnyFilterModified && (
                    <Button variant="outline" size="sm" onClick={onClearFilters}>
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