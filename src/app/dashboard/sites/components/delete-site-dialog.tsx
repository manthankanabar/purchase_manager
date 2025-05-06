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
 * Site interface representing the structure of site data
 */
interface Site {
  id: string;
  name: string;
  code: string;
  entityName: string;
}

/**
 * Props for DeleteSiteDialog component
 */
interface DeleteSiteDialogProps {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
  site: Site;
  onSuccessAction: () => void;
}

/**
 * Dialog component for confirming site deactivation
 */
export default function DeleteSiteDialog({
  open,
  onOpenChangeAction,
  site,
  onSuccessAction,
}: DeleteSiteDialogProps) {
  const [loading, setLoading] = useState(false);
  // Toast is now imported directly from sonner

  /**
   * Handle site deactivation
   */
  const handleDeactivate = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`/api/sites/${site.id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to deactivate site");
      }
      
      onSuccessAction();
    } catch (error) {
      console.error("Error deactivating site:", error);
      toast.error(error instanceof Error ? error.message : "Failed to deactivate site");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Deactivate Site</DialogTitle>
          <DialogDescription>
            Are you sure you want to deactivate the site "{site.name}" ({site.code}) from {site.entityName}?
            This action will mark the site as inactive but preserve all historical data.
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
            Deactivate Site
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
