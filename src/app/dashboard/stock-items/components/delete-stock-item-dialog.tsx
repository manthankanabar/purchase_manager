"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

import { StockItemRow } from "./columns";

interface DeleteStockItemDialogProps {
  stockItem: StockItemRow;
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
}

export function DeleteStockItemDialog({
  stockItem,
  open,
  onOpenChangeAction,
}: DeleteStockItemDialogProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/stock-items/${stockItem.id}`);
      toast.success("Stock item deleted successfully");
      onOpenChangeAction(false);
      router.refresh();
    } catch (error: any) {
      toast.error(error.response?.data || "Failed to delete stock item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Stock Item</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this stock item? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Name:</span>
              <span>{stockItem.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Code:</span>
              <span>{stockItem.code}</span>
            </div>
            {stockItem.hsnCode && (
              <div className="flex justify-between">
                <span className="font-medium">HSN Code:</span>
                <span>{stockItem.hsnCode}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="font-medium">UoM:</span>
              <span>{stockItem.uomName} ({stockItem.uomCode})</span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onDelete} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
