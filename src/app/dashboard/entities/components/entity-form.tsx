"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Simple toast notification system until we implement a proper one
const useToast = () => {
  const toast = (props: { title?: string; description?: string; variant?: 'default' | 'destructive' }) => {
    console.log(`Toast: ${props.title} - ${props.description}`);
    // In a real implementation, this would show a toast notification
    // For now, we'll just log to the console
  };

  return { toast };
};

// Define the form schema with validation
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  code: z.string().min(2, "Code must be at least 2 characters").max(10, "Code must be at most 10 characters"),
  address: z.string().optional(),
  baseCurrency: z.enum(["INR", "USD", "EUR", "GBP"]),
  taxIdentificationNumber: z.string().optional(),
  isActive: z.boolean(),
});

type EntityFormValues = z.infer<typeof formSchema>;

interface EntityFormProps {
  open: boolean;
  setOpenAction: (open: boolean) => void;
  entityId: string | null;
  onSuccessAction: () => void;
}

/**
 * Entity form component for creating and editing entities
 * 
 * @param open - Whether the form is open
 * @param setOpen - Function to set the open state
 * @param entityId - ID of the entity to edit (null for create)
 * @param onSuccess - Callback function on successful submission
 */
export const EntityForm: React.FC<EntityFormProps> = ({
  open,
  setOpenAction: setOpen,
  entityId,
  onSuccessAction: onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Initialize form with default values
  const form = useForm<EntityFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      code: "",
      address: "",
      baseCurrency: "INR" as const,
      taxIdentificationNumber: "",
      isActive: true,
    },
  });

  // Fetch entity data if editing an existing entity
  useEffect(() => {
    // Only run this effect when the form is opened
    if (!open) {
      return; // Don't do anything if the form is closed
    }
    
    const resetFormWithDefaults = () => {
      form.reset({
        name: "",
        code: "",
        address: "",
        baseCurrency: "INR" as const,
        taxIdentificationNumber: "",
        isActive: true,
      });
    };
    
    // Reset with defaults if creating a new entity
    if (!entityId) {
      resetFormWithDefaults();
      return;
    }
    
    // If we have an entityId, fetch and populate the form
    setLoading(true);
    fetch(`/api/entities/${entityId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch entity: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // Only reset form with fetched data if the form is still open
        if (open) {
          form.reset({
            name: data.name,
            code: data.code,
            address: data.address || "",
            baseCurrency: data.baseCurrency as "INR" | "USD" | "EUR" | "GBP",
            taxIdentificationNumber: data.taxIdentificationNumber || "",
            isActive: Boolean(data.isActive),
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching entity:", error);
        toast({
          title: "Error",
          description: "Failed to fetch entity data",
          variant: "destructive",
        });
        // Close the form on error
        setOpen(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [entityId, open, setOpen]); // Remove form from dependencies to prevent infinite loop

  // Handle form submission
  const onSubmit = async (data: EntityFormValues) => {
    try {
      setLoading(true);
      
      const url = entityId 
        ? `/api/entities/${entityId}` 
        : "/api/entities";
      
      const method = entityId ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        // Try to get the detailed error message from the response
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.error || errorData?.message || `Failed to save entity: ${response.status} ${response.statusText}`
        );
      }

      toast({
        title: "Success",
        description: `Entity ${entityId ? "updated" : "created"} successfully`,
      });
      
      onSuccess();
      setOpen(false);
    } catch (error: any) {
      console.error("Error saving entity:", error);
      toast({
        title: "Error",
        description: error?.message || "Failed to save entity",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>
            {entityId ? "Edit Entity" : "Create New Entity"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input 
                        disabled={loading} 
                        placeholder="Entity name" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code</FormLabel>
                    <FormControl>
                      <Input 
                        disabled={loading} 
                        placeholder="Entity code" 
                        {...field} 
                      />
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
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input 
                        disabled={loading} 
                        placeholder="Entity address" 
                        {...field} 
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="baseCurrency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Base Currency</FormLabel>
                    <FormControl>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={loading}
                        {...field}
                      >
                        <option value="INR">INR</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="taxIdentificationNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tax Identification Number</FormLabel>
                    <FormControl>
                      <Input 
                        disabled={loading} 
                        placeholder="Tax ID (e.g., GSTIN)" 
                        {...field} 
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        disabled={loading}
                        className="h-4 w-4 mt-1"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Active</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Inactive entities will not be available for selection in other parts of the application.
                      </p>
                    </div>
                  </FormItem>
                )}
              />
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : entityId ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
