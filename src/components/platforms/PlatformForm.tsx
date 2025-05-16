
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { addPlatform, updatePlatform } from "@/services/platformService";
import { useQueryClient } from "@tanstack/react-query";
import { Textarea } from "@/components/ui/textarea";
import { Platform } from "@/types";

const platformSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  description: z.string().optional(),
  logoUrl: z.string().optional(),
});

type PlatformFormValues = z.infer<typeof platformSchema>;

type PlatformFormProps = {
  platform?: Platform;
  isEditing?: boolean;
  onSuccess?: () => void;
};

export function PlatformForm({ platform, isEditing = false, onSuccess }: PlatformFormProps) {
  const queryClient = useQueryClient();
  
  const form = useForm<PlatformFormValues>({
    resolver: zodResolver(platformSchema),
    defaultValues: {
      name: platform?.name || "",
      description: platform?.description || "",
      logoUrl: platform?.logoUrl || "",
    },
  });

  const onSubmit = async (values: PlatformFormValues) => {
    // Ensure all required fields are included
    const platformData = {
      name: values.name,
      description: values.description || "",
      logoUrl: values.logoUrl || "",
    };
    
    let result;
    
    if (isEditing && platform) {
      result = await updatePlatform({ ...platformData, id: platform.id });
    } else {
      result = await addPlatform(platformData);
    }
    
    if (result) {
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['platforms'] });
      if (onSuccess) onSuccess();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Platform Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter platform name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter platform description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="logoUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Logo URL (optional)</FormLabel>
              <FormControl>
                <Input placeholder="Enter logo URL" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          {isEditing ? "Update Platform" : "Add Platform"}
        </Button>
      </form>
    </Form>
  );
}
