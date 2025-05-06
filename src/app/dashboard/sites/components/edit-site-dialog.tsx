"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm, type UseFormReturn, type SubmitHandler } from "react-hook-form";
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
  FormDescription,
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
import { Switch } from "@/components/ui/switch";

/**
 * Entity interface for dropdown selection
 */
interface Entity {
  id: string;
  name: string;
  code: string;
}

/**
 * Site interface representing the structure of site data
 */
interface Site {
  id: string;
  name: string;
  code: string;
  address: string | null;
  contactPerson: string | null;
  contactPhone: string | null;
  entityId: string;
  entityName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Form schema for site editing
 */
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  code: z.string().min(2, "Code must be at least 2 characters").max(10, "Code must be at most 10 characters"),
  address: z.string().optional(),
  contactPerson: z.string().optional(),
  contactPhone: z.string().optional(),
  entityId: z.string().uuid("Please select a valid entity"),
  isActive: z.boolean(),
});

/**
 * Props for EditSiteDialog component
 */
interface EditSiteDialogProps {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
  site: Site;
  onSuccessAction: () => void;
}

/**
 * Dialog component for editing an existing site
 */
export default function EditSiteDialog({
  open,
  onOpenChangeAction,
  site,
  onSuccessAction,
}: EditSiteDialogProps) {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingEntities, setFetchingEntities] = useState(true);
  // Toast is now imported directly from sonner

  // Define the form type explicitly
  type FormValues = z.infer<typeof formSchema>;
  
  // Initialize form with validation schema and site data
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: site.name,
      code: site.code,
      address: site.address || "",
      contactPerson: site.contactPerson || "",
      contactPhone: site.contactPhone || "",
      entityId: site.entityId,
      isActive: site.isActive,
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
        setEntities(data);
      } catch (error) {
        console.error("Error fetching entities:", error);
        toast.error("Failed to load entities. Please try again.");
      } finally {
        setFetchingEntities(false);
      }
    };

    if (open) {
      fetchEntities();
      // Reset form with site data when dialog opens
      form.reset({
        name: site.name,
        code: site.code,
        address: site.address || "",
        contactPerson: site.contactPerson || "",
        contactPhone: site.contactPhone || "",
        entityId: site.entityId,
        isActive: site.isActive,
      });
    }
  }, [open, site, toast, form]);

  /**
   * Handle form submission
   */
  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      
      const response = await fetch(`/api/sites/${site.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update site");
      }
      
      onSuccessAction();
    } catch (error) {
      console.error("Error updating site:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update site");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Site</DialogTitle>
          <DialogDescription>
            Update the details for site {site.name} ({site.code})
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
                          No entities found.
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
            
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Active Status</FormLabel>
                    <FormDescription className="text-sm text-muted-foreground">
                      Whether this site is active and available for use
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChangeAction(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading || fetchingEntities}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Site
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
