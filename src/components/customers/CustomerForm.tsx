
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { addCustomer, updateCustomer } from "@/services/customerService";
import { useQueryClient } from "@tanstack/react-query";
import { Customer } from "@/types";

const customerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().optional(),
  address: z.string().optional(),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

type CustomerFormProps = {
  customer?: Customer;
  isEditing?: boolean;
  onSuccess?: () => void;
};

export function CustomerForm({ customer, isEditing = false, onSuccess }: CustomerFormProps) {
  const queryClient = useQueryClient();
  
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: customer?.name || "",
      email: customer?.email || "",
      phone: customer?.phone || "",
      address: customer?.address || "",
    },
  });

  const onSubmit = async (values: CustomerFormValues) => {
    // Ensure all required fields are included
    const customerData = {
      name: values.name,
      email: values.email,
      phone: values.phone || "",
      address: values.address || "",
    };
    
    let result;
    
    if (isEditing && customer) {
      result = await updateCustomer({ ...customerData, id: customer.id, createdAt: customer.createdAt });
    } else {
      result = await addCustomer(customerData);
    }
    
    if (result) {
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['customers'] });
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
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter customer name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter email address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone (optional)</FormLabel>
              <FormControl>
                <Input placeholder="Enter phone number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address (optional)</FormLabel>
              <FormControl>
                <Input placeholder="Enter address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          {isEditing ? "Update Customer" : "Add Customer"}
        </Button>
      </form>
    </Form>
  );
}
