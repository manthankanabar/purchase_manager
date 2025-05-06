"use client";

import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateStockItemDialog } from "./create-stock-item-dialog";

// Define columns for the stock items table
const columns = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "code",
    header: "Code",
  },
  {
    accessorKey: "hsnCode",
    header: "HSN Code",
  },
  {
    accessorKey: "groupName",
    header: "Group",
  },
  {
    accessorKey: "categoryName",
    header: "Category",
  },
  {
    accessorKey: "uomName",
    header: "UoM",
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }: { row: any }) => (
      <div className={`font-medium ${row.original.isActive ? "text-green-600" : "text-red-600"}`}>
        {row.original.isActive ? "Active" : "Inactive"}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }: { row: any }) => {
      const stockItem = row.original;
      return (
        <div className="flex items-center gap-2">
          {/* Edit button will go here */}
          {/* Delete button will go here */}
        </div>
      );
    },
  },
];

interface StockItemsTableProps {
  data: any[];
  uomOptions: any[];
  categoryOptions: any[];
  groupOptions: any[];
}

export default function StockItemsTable({ 
  data, 
  uomOptions,
  categoryOptions,
  groupOptions
}: StockItemsTableProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Stock Items</h1>
        <CreateStockItemDialog 
          trigger={
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Stock Item
            </Button>
          }
          uomOptions={uomOptions}
          categoryOptions={categoryOptions}
          groupOptions={groupOptions}
        />
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
