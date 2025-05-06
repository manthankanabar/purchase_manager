import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";

export type StockItemRow = {
  id: string;
  name: string;
  code: string;
  description: string | null;
  specifications: string | null;
  cgstRate: number | null;
  sgstRate: number | null;
  igstRate: number | null;
  hsnCode: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  stockCategoryId: string | null;
  stockGroupId: string | null;
  uomId: string;
  categoryName: string | null;
  categoryPrefixCode: string | null;
  groupName: string | null;
  uomName: string;
  uomCode: string;
};

export const columns: ColumnDef<StockItemRow>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value: boolean | 'indeterminate') => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: boolean | 'indeterminate') => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className="font-medium">
          {row.getValue("name")}
        </div>
      );
    },
  },
  {
    accessorKey: "code",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Code" />
    ),
    cell: ({ row }) => {
      return (
        <div className="font-medium">
          {row.getValue("code")}
        </div>
      );
    },
  },
  {
    accessorKey: "hsnCode",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="HSN Code" />
    ),
    cell: ({ row }) => {
      return (
        <div className="font-medium">
          {row.getValue("hsnCode") || "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "categoryName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => {
      return (
        <div className="font-medium">
          {row.getValue("categoryName") || "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "groupName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Group" />
    ),
    cell: ({ row }) => {
      return (
        <div className="font-medium">
          {row.getValue("groupName") || "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "uomName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="UoM" />
    ),
    cell: ({ row }) => {
      return (
        <div className="font-medium">
          {row.getValue("uomName")} ({row.original.uomCode})
        </div>
      );
    },
  },
  {
    accessorKey: "gstRates",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="GST Rates" />
    ),
    cell: ({ row }) => {
      const cgst = row.original.cgstRate;
      const sgst = row.original.sgstRate;
      const igst = row.original.igstRate;
      
      return (
        <div className="flex flex-wrap gap-1">
          {cgst !== null && (
            <Badge variant="outline">CGST: {cgst}%</Badge>
          )}
          {sgst !== null && (
            <Badge variant="outline">SGST: {sgst}%</Badge>
          )}
          {igst !== null && (
            <Badge variant="outline">IGST: {igst}%</Badge>
          )}
          {cgst === null && sgst === null && igst === null && "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      return row.getValue("isActive") ? (
        <Badge className="bg-green-500">Active</Badge>
      ) : (
        <Badge variant="outline">Inactive</Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
