"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

/**
 * Entity interface for dropdown selection
 */
interface Entity {
  id: string;
  name: string;
  code: string;
}

/**
 * Form schema for site creation
 */
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  code: z.string().min(2, "Code must be at least 2 characters").max(10, "Code must be at most 10 characters"),
  address: z.string().optional(),
  contactPerson: z.string().optional(),
  contactPhone: z.string().optional(),
  entityId: z.string().uuid("Please select a valid entity"),
});

/**
 * Props for CreateSiteDialog component
 */
interface CreateSiteDialogProps {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
  onSuccessAction: () => void;
}

/**
 * Dialog component for creating a new site
 */
export default function CreateSiteDialog({
  open,
  onOpenChangeAction,
  onSuccessAction,
}: CreateSiteDialogProps) {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingEntities, setFetchingEntities] = useState(true);

  // Initialize form with validation schema
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      code: "",
      address: "",
      contactPerson: "",
      contactPhone: "",
      entityId: "",
    },
  });

  // Fetch entities for dropdown on component mount
  useEffect(() => {
    const fetchEntities = async () => {
      try {
        setFetchingEntities(true);
        const response = await fetch("/api/entities");
        
        if (!response.ok) {
          throw new Error("Failed to fetch entities");
        }
        
        const data = await response.json();
        // Filter only active entities
        const activeEntities = data.filter((entity: Entity & { isActive: boolean }) => entity.isActive);
        setEntities(activeEntities);
      } catch (error) {
        console.error("Error fetching entities:", error);
        toast.error("Failed to load entities. Please try again.");
      } finally {
        setFetchingEntities(false);
      }
    };

    if (open) {
      fetchEntities();
      form.reset();
    }
  }, [open, toast, form]);

  /**
   * Handle form submission
   */
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      
      const response = await fetch("/api/sites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          isActive: true,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create site");
      }
      
      onSuccessAction();
      form.reset();
    } catch (error) {
      console.error("Error creating site:", error);
      toast.error(error instanceof Error ? error.message : "Failed to create site");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Site</DialogTitle>
          <DialogDescription>
            Add a new construction site or location to the system.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="entityId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Entity (Company)</FormLabel>
                  <Select
                    disabled={fetchingEntities || loading}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an entity" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {fetchingEntities ? (
                        <div className="flex justify-center p-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                      ) : entities.length === 0 ? (
                        <div className="p-2 text-sm text-muted-foreground">
                          No entities found. Please create an entity first.
                        </div>
                      ) : (
                        entities.map((entity) => (
                          <SelectItem key={entity.id} value={entity.id}>
                            {entity.name} ({entity.code})
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Site name" {...field} />
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
                    <FormLabel>Site Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Site code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Site address"
                      className="resize-none"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="contactPerson"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Person</FormLabel>
                    <FormControl>
                      <Input placeholder="Contact person name" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="contactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="Contact phone number" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading || fetchingEntities}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Site
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
