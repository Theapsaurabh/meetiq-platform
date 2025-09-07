import { useTRPC } from "@/trpc/client";
import { AgentGetOne } from "../../types";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { agentCreateSchema } from "../../schemas";

import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

interface AgentFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  initialValues?: AgentGetOne;
}

export const AgentForm = ({
  onSuccess,
 
  initialValues,
}: AgentFormProps) => {
  const trpc = useTRPC();

  const queryClient = useQueryClient();

  const createAgent = useMutation(
    trpc.agents.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [["agents"]] });
        onSuccess();
      },
      onError: (error) => {
        
        toast.error(error.message)
        // TODO : Check if error code is "FORBIDDEN " redirect to "/upgrade "

      },
    })
  );

  const form = useForm<z.infer<typeof agentCreateSchema>>({
    resolver: zodResolver(agentCreateSchema),
    defaultValues: {
      name: initialValues?.name ?? "",
      instruction: initialValues?.instruction || "",
    },
  });

  const isEdit = !!initialValues?.id;
  const isPending = createAgent.isPending;

  const onSubmit = (values: z.infer<typeof agentCreateSchema>) => {
    if (isEdit) {
      console.log("Todo: updateAgent");
    } else {
      createAgent.mutate(values);
    }
  };

  
  const avatarUrl = `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${
    form.watch("name") || "default"
  }`;

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
       
        <Avatar className="border w-16 h-16 rounded-full">
          <AvatarImage src={avatarUrl} alt="Agent avatar" />
          <AvatarFallback>...</AvatarFallback>
        </Avatar>

        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="instruction"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instruction</FormLabel>
              <FormControl>
                <Textarea {...field} rows={4} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between gap-x-2">
            { (
                <Button variant="ghost"
                disabled={isPending}
                type="button"
                >
                    Cancel


                </Button>
            )}
            <Button disabled={isPending} type="submit">
                {isEdit? "Update ": "Create "}

            </Button>
        </div>
      </form>
    </Form>
  );
};
