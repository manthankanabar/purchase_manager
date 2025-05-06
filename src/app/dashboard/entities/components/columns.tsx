"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

// Define the Entity type based on our database schema
export type Entity = {
  id: string;
  name: string;
  code: string;
  address: string | null;
  baseCurrency: string;
  taxIdentificationNumber: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Column definitions for the entities data table
 */
export const columns: ColumnDef<Entity>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "code",
    header: "Code",
  },
  {
    accessorKey: "baseCurrency",
    header: "Currency",
    cell: ({ row }: { row: any }) => <span>{row.getValue("baseCurrency")}</span>,
  },
  {
    accessorKey: "taxIdentificationNumber",
    header: "Tax ID",
    cell: ({ row }: { row: any }) => {
      const taxId = row.getValue("taxIdentificationNumber") as string | null;
      return <span>{taxId || "—"}</span>;
    },
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }: { row: any }) => {
      const isActive = row.getValue("isActive") as boolean;
      return (
        <Badge variant={isActive ? "default" : "destructive"}>
          {isActive ? "Active" : "Inactive"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }: { row: any }) => {
      const date = row.getValue("createdAt") as Date;
      return <span>{date ? format(new Date(date), "MMM dd, yyyy") : "—"}</span>;
    },
  },
];
