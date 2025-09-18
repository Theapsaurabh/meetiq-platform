import { useTRPC } from "@/trpc/client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import { MeetingGetOne } from "../../types";

import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
import { meetingsCreateSchema } from "../../schemss";


interface MeetingFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  initialValues?: MeetingGetOne;
}

export const MeetingForm = ({
  onSuccess,
 
  initialValues,
}: MeetingFormProps) => {
  const trpc = useTRPC();

  const queryClient = useQueryClient();
   


  const createMeeting = useMutation(
    trpc.meetings.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.meetings.getMany.queryOptions({})
        );
        onSuccess();
      },
      onError: (error) => {
        
        toast.error(error.message)
        // TODO : Check if error code is "FORBIDDEN " redirect to "/upgrade "

      },
    })
  );
   const UpdateMeeting = useMutation(
    trpc.meetings.update.mutationOptions({
      onSuccess:async () => {
        queryClient.invalidateQueries(
          trpc.meetings.getMany.queryOptions({})
        );
        if(initialValues?.id){
          await queryClient.invalidateQueries(
            trpc.meetings.getOne.queryOptions({id:initialValues.id}),
          )
        }
        onSuccess?.();
      },
      onError: (error) => {
        
        toast.error(error.message)
        // TODO : Check if error code is "FORBIDDEN " redirect to "/upgrade "

      },
    })
  );

  const form = useForm<z.infer<typeof meetingsCreateSchema>>({
    resolver: zodResolver(meetingsCreateSchema),
    defaultValues: {
      name: initialValues?.name ?? "",
     agentId: initialValues?.agentId,
    },
  });

  const isEdit = !!initialValues?.id;
  const isPending = createMeeting.isPending || UpdateMeeting.isPending;

  const onSubmit = (values: z.infer<typeof meetingsCreateSchema>) => {
    if (isEdit) {
      UpdateMeeting.mutate({
        ...values,
        id:initialValues.id
      })
    } else {
      createMeeting.mutate(values);
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
