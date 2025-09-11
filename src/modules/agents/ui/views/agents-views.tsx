"use client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { DataTable } from "../components/data-table";
import { columns } from "../components/column";
import { EmptyState } from "@/components/empty-state";

export const AgentsView = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions({}));

  return (
    <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
      <DataTable data={data.items} columns={columns} />
      {data.items.length=== 0 && (
        <EmptyState
          title="No agents available"
          description="You haven’t added any agents yet. Start by creating your first one."
          
        />
      )}
    </div>
  );
};

export const AgentsViewLoading = () => {
  return (
    <LoadingState
      title="loading Agents "
      description="this may take a few seconds"
    ></LoadingState>
  );
};

export const ErrorView = () => {
  return (
    <ErrorState
      title="Failed to load Agents"
      description="There was an error while loading Agents. Please try again."
    />
  );
};
