import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { CommandSelect } from "@/components/command-select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import { useMeetingsFilters } from "../../hooks/use-Meetings-filters";

export const AgentIdFilter = () => {
  const [filters, setFilters] = useMeetingsFilters();
  const trpc = useTRPC();
  const [agentSearch, setAgentSearch] = useState("");

  const { data } = useQuery(
    trpc.agents.getMany.queryOptions({
      pageSize: 100,
      search: agentSearch,
    })
  );

  
  const getAvatarUrl = (name: string) =>
    `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${name || "default"}`;

  return (
    <CommandSelect
      className="h-9"
      placeholder="Filter by agent"
      value={filters.agentId ?? ""}
      options={(data?.items ?? []).map((agent) => ({
        id: agent.id,
        value: agent.id,
        children: (
          <div className="flex items-center gap-x-2">
            <Avatar className="size-4">
              <AvatarImage src={getAvatarUrl(agent.name)} />
              <AvatarFallback>{agent.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            {agent.name}
          </div>
        ),
      }))}
      onSelect={(value) => setFilters({ agentId: value })}
      onSearch={setAgentSearch}
    />
  );
};
