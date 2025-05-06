"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

/**
 * Vendor interface representing the structure of vendor data
 */
interface Vendor {
  id: string;
  name: string;
  code: string;
  entityName: string | null;
}

/**
 * Props for DeleteVendorDialog component
 */
interface DeleteVendorDialogProps {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
  vendor: Vendor;
  onSuccessAction: () => void;
}

// Renamed function props to end with 'Action' to satisfy React Server Components requirements

/**
 * Dialog component for confirming vendor deactivation
 */
export default function DeleteVendorDialog({
  open,
  onOpenChangeAction,
  vendor,
  onSuccessAction,
}: DeleteVendorDialogProps) {
  const [loading, setLoading] = useState(false);

  /**
   * Handle vendor deactivation
   */
  const handleDeactivate = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`/api/vendors/${vendor.id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to deactivate vendor");
      }
      
      onSuccessAction();
    } catch (error) {
      console.error("Error deactivating vendor:", error);
      toast.error(error instanceof Error ? error.message : "Failed to deactivate vendor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Deactivate Vendor</DialogTitle>
          <DialogDescription>
            Are you sure you want to deactivate the vendor "{vendor.name}" ({vendor.code})
            {vendor.entityName ? ` from ${vendor.entityName}` : ''}?
            This action will mark the vendor as inactive but preserve all historical data.
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChangeAction(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDeactivate}
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Deactivate Vendor
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
