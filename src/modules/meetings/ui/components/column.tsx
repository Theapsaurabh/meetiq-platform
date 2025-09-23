"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MeetingGetMany } from "../../types"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { Badge } from "@/components/ui/badge"
import {
  CircleCheckIcon,
  CircleXIcon,
  ClockArrowUpIcon,
  CornerDownRightIcon,
  ClockIcon,
  LoaderIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import humanizeDuration from "humanize-duration"

// Format duration into human-readable
function formatDuration(seconds: number) {
  return humanizeDuration(seconds * 1000, {
    largest: 1,
    round: true,
    units: ["h", "m", "s"],
  })
}

const statusIconMap = {
  upcoming: ClockArrowUpIcon,
  active: LoaderIcon,
  completed: CircleCheckIcon,
  cancelled: CircleXIcon,
  processing: LoaderIcon,
}

const statusColorMap = {
  upcoming: "bg-yellow-500/20 text-yellow-800 border-yellow-800/5",
  active: "bg-blue-500/20 text-blue-800 border-blue-800/5",
  completed: "bg-emerald-500/20 text-emerald-800 border-emerald-800/5",
  cancelled: "bg-rose-500/20 text-rose-800 border-rose-800/5",
  processing: "bg-gray-500/20 text-gray-800 border-gray-800/5",
}

export const columns: ColumnDef<MeetingGetMany[number]>[] = [
  {
    accessorKey: "name",
    header: "Meeting Name",
    cell: ({ row }) => {
      const name = row.getValue("name") as string
      const avatarUrl = `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${name || "default"}`

      return (
        <div className="group flex flex-col gap-2 p-3 rounded-lg transition-all duration-300 hover:bg-muted/30">
          {/* Meeting Title */}
          <span className="font-semibold capitalize text-lg">
            {row.original.name}
          </span>

          {/* Agent Row */}
          <div className="flex items-center gap-3">
            <Avatar className="border w-12 h-12 rounded-full">
              <AvatarImage src={avatarUrl} alt="Agent avatar" />
              <AvatarFallback>AG</AvatarFallback>
            </Avatar>

            <div className="flex flex-col">
              <span className="text-base font-medium capitalize">{name}</span>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <CornerDownRightIcon className="size-3" />
                <span className="truncate max-w-[160px]">
                  {row.original.agentId || "Unknown Agent"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const Icon =
        statusIconMap[row.original.status as keyof typeof statusIconMap]

      return (
        <Badge
          variant="outline"
          className={cn(
            "capitalize flex items-center gap-1 px-3 py-1 rounded-full text-sm",
            statusColorMap[row.original.status as keyof typeof statusColorMap]
          )}
        >
          <Icon
            className={cn(
              "size-4",
              row.original.status === "processing" && "animate-spin"
            )}
          />
          {row.original.status}
        </Badge>
      )
    },
  },
  {
    header: "Duration",
    cell: ({ row }) => {
      const start = new Date(row.original.startedAt)
      const end = new Date(row.original.endedAt)
      const diffSeconds = (end.getTime() - start.getTime()) / 1000

      return (
        <Badge
          variant="outline"
          className="flex items-center gap-2 px-3 py-1 rounded-full text-sm"
        >
          <ClockIcon className="size-4 text-blue-500" />
          {diffSeconds > 0 ? formatDuration(diffSeconds) : "No duration"}
        </Badge>
      )
    },
  },
]
