"use client"

import { ColumnDef } from "@tanstack/react-table"
import { AgentGetOne } from "../../types"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { Badge } from "@/components/ui/badge" // if using shadcn-ui
import { CornerDownRightIcon, VideoIcon } from "lucide-react"

export const columns: ColumnDef<AgentGetOne>[] = [
  {
    accessorKey: "name",
    header: "Agent",
    cell: ({ row }) => {
      const name = row.getValue("name") as string
      const avatarUrl = `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${
        name || "default"
      }`

      return (
        <div className="group flex flex-col gap-2 p-2 rounded-lg transition-all duration-300 hover:bg-muted/30">
          {/* Top Row */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="border-2 border-muted-foreground/30 w-14 h-14 rounded-full shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:rotate-1">
                <AvatarImage src={avatarUrl} alt={`${name}'s avatar`} />
                <AvatarFallback className="bg-muted text-lg font-medium">
                  {name?.[0] || "?"}
                </AvatarFallback>
              </Avatar>
              {/* Little glowing dot */}
              <span className="absolute bottom-1 right-1 block w-3 h-3 rounded-full bg-green-500 border border-white animate-pulse" />
            </div>
            <span className="font-semibold capitalize text-base transition-colors group-hover:text-primary">
              {name}
            </span>
          </div>

          {/* Instruction row */}
          {row.original.instruction && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CornerDownRightIcon className="size-3 opacity-70 group-hover:translate-x-1 transition-transform duration-300" />
              <span className="truncate max-w-[220px] capitalize">
                {row.original.instruction}
              </span>
            </div>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "meetingCount",
    header: "Meetings",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className="flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-md hover:border-primary/40"
      >
        <VideoIcon className="text-blue-600 size-4 animate-pulse" />
        {row.original.meetingCount}{" "}
        {row.original.meetingCount === 1 ? "meeting" : "meetings"}
      </Badge>
    ),
  },
]
