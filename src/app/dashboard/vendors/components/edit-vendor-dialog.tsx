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
 * Vendor interface representing the structure of vendor data
 */
interface Vendor {
  id: string;
  name: string;
  code: string;
  contactPerson: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  gstNumber: string | null;
  panNumber: string | null;
  bankDetails: string | null;
  paymentTerms: string | null;
  isActive: boolean;
  entityId: string | null;
  entityName: string | null;
}

/**
 * Form schema for vendor editing
 */
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  code: z.string().min(2, "Code must be at least 2 characters").max(10, "Code must be at most 10 characters"),
  contactPerson: z.string().optional(),
  email: z.string().email("Invalid email address").optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  gstNumber: z.string().optional(),
  panNumber: z.string().optional(),
  bankDetails: z.string().optional(),
  paymentTerms: z.string().optional(),
  // Removed entityId as vendors can be used across multiple entities
});

/**
 * Props for EditVendorDialog component
 */
interface EditVendorDialogProps {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
  vendor: Vendor;
  onSuccessAction: () => void;
}

/**
 * Dialog component for editing an existing vendor
 */
export default function EditVendorDialog({
  open,
  onOpenChangeAction,
  vendor,
  onSuccessAction,
}: EditVendorDialogProps) {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingEntities, setFetchingEntities] = useState(true);

  // Initialize form with validation schema and vendor data
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: vendor.name,
      code: vendor.code,
      contactPerson: vendor.contactPerson || "",
      email: vendor.email || "",
      phone: vendor.phone || "",
      address: vendor.address || "",
      gstNumber: vendor.gstNumber || "",
      panNumber: vendor.panNumber || "",
      bankDetails: vendor.bankDetails || "",
      paymentTerms: vendor.paymentTerms || "",
      // Removed entityId as vendors can be used across multiple entities
    },
  });

  // Reset form when vendor changes
  useEffect(() => {
    if (vendor && open) {
      form.reset({
        name: vendor.name,
        code: vendor.code,
        contactPerson: vendor.contactPerson || "",
        email: vendor.email || "",
        phone: vendor.phone || "",
        address: vendor.address || "",
        gstNumber: vendor.gstNumber || "",
        panNumber: vendor.panNumber || "",
        bankDetails: vendor.bankDetails || "",
        paymentTerms: vendor.paymentTerms || "",
        // Removed entityId as vendors can be used across multiple entities
      });
    }
  }, [vendor, open, form]);

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
    }
  }, [open]);

  /**
   * Handle form submission
   */
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      
      const response = await fetch(`/api/vendors/${vendor.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update vendor");
      }
      
      onSuccessAction();
    } catch (error) {
      console.error("Error updating vendor:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update vendor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Vendor</DialogTitle>
          <DialogDescription>
            Update vendor information for {vendor.name} ({vendor.code})
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vendor Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter vendor name" {...field} />
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
                    <FormLabel>Vendor Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter vendor code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Removed entityId field - vendors can be used across multiple entities */}
            <div className="bg-blue-50 p-3 rounded-md border border-blue-200 mb-4">
              <p className="text-sm text-blue-700">
                <strong>Note:</strong> Vendors are not tied to a specific entity and can be used across multiple entities in the system.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="contactPerson"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Person</FormLabel>
                    <FormControl>
                      <Input placeholder="Contact person name" {...field} />
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
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email address" type="email" {...field} />
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
                    <Textarea placeholder="Full address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="gstNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GST Number</FormLabel>
                    <FormControl>
                      <Input placeholder="GST number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="panNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PAN Number</FormLabel>
                    <FormControl>
                      <Input placeholder="PAN number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="bankDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bank Details</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Bank account details" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="paymentTerms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Terms</FormLabel>
                  <FormControl>
                    <Input placeholder="Payment terms (e.g., Net 30)" {...field} />
                  </FormControl>
                  <FormMessage />
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
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Vendor
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
