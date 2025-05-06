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
 * Form schema for vendor creation
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
 * Props for CreateVendorDialog component
 */
interface CreateVendorDialogProps {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
  onSuccessAction: () => void;
}

/**
 * Dialog component for creating a new vendor
 */
export default function CreateVendorDialog({
  open,
  onOpenChangeAction,
  onSuccessAction,
}: CreateVendorDialogProps) {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingEntities, setFetchingEntities] = useState(true);
  const [existingCodes, setExistingCodes] = useState<string[]>([]);

  // Initialize form with validation schema
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      code: "",
      contactPerson: "",
      email: "",
      phone: "",
      address: "",
      gstNumber: "",
      panNumber: "",
      bankDetails: "",
      paymentTerms: "",
      // Removed entityId as vendors can be used across multiple entities
    },
  });

  // Auto-generate vendor code when name changes
  const generateVendorCode = (name: string): string => {
    if (!name) return "";
    
    // Take first 3 letters and convert to uppercase
    const prefix = name.substring(0, 3).toUpperCase();
    
    // Find existing codes with the same prefix
    const codesWithPrefix = existingCodes.filter(code => 
      code.startsWith(prefix)
    );
    
    // Get the highest number suffix
    let highestSuffix = 0;
    codesWithPrefix.forEach(code => {
      const suffixMatch = code.substring(3).match(/^\d+/);
      if (suffixMatch) {
        const suffix = parseInt(suffixMatch[0], 10);
        if (suffix > highestSuffix) {
          highestSuffix = suffix;
        }
      }
    });
    
    // Create new code with incremented suffix
    return `${prefix}${highestSuffix + 1}`;
  };
  
  // Update code when name changes
  useEffect(() => {
    const name = form.getValues("name");
    if (name && name.length >= 3) {
      const generatedCode = generateVendorCode(name);
      form.setValue("code", generatedCode);
    }
  }, [form.watch("name")]);

  // Fetch existing vendor codes
  useEffect(() => {
    const fetchVendorCodes = async () => {
      try {
        const response = await fetch("/api/vendors/codes");
        
        if (!response.ok) {
          throw new Error("Failed to fetch vendor codes");
        }
        
        const data = await response.json();
        setExistingCodes(data);
      } catch (error) {
        console.error("Error fetching vendor codes:", error);
      }
    };
    
    if (open) {
      fetchVendorCodes();
    }
  }, [open]);

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
  }, [open, form]);

  /**
   * Handle form submission
   */
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      
      const response = await fetch("/api/vendors", {
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
        throw new Error(errorData.error || "Failed to create vendor");
      }
      
      onSuccessAction();
      form.reset();
    } catch (error) {
      console.error("Error creating vendor:", error);
      toast.error(error instanceof Error ? error.message : "Failed to create vendor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Vendor</DialogTitle>
          <DialogDescription>
            Add a new vendor or supplier to the system.
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
                      <Input 
                        placeholder="Auto-generated code" 
                        {...field} 
                        className="bg-muted"
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-muted-foreground">
                      Code is auto-generated based on vendor name
                    </p>
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
                Create Vendor
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
