"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import CreateVendorDialog from "./components/create-vendor-dialog";
import EditVendorDialog from "./components/edit-vendor-dialog";
import DeleteVendorDialog from "./components/delete-vendor-dialog";

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
  createdAt: string;
  updatedAt: string;
}

/**
 * Vendors page component for managing vendors
 */
export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  
  const router = useRouter();

  // Fetch vendors on component mount
  useEffect(() => {
    fetchVendors();
  }, []);

  /**
   * Fetch vendors from the API
   */
  const fetchVendors = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/vendors");
      
      if (!response.ok) {
        throw new Error("Failed to fetch vendors");
      }
      
      const data = await response.json();
      setVendors(data);
    } catch (error) {
      console.error("Error fetching vendors:", error);
      toast.error("Failed to load vendors. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle opening the edit dialog for a vendor
   */
  const handleEdit = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setEditDialogOpen(true);
  };

  /**
   * Handle opening the delete dialog for a vendor
   */
  const handleDelete = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setDeleteDialogOpen(true);
  };

  /**
   * Handle successful vendor creation
   */
  const handleCreateSuccess = () => {
    setCreateDialogOpen(false);
    fetchVendors();
    toast.success("Vendor created successfully");
  };

  /**
   * Handle successful vendor update
   */
  const handleEditSuccess = () => {
    setEditDialogOpen(false);
    fetchVendors();
    toast.success("Vendor updated successfully");
  };

  /**
   * Handle successful vendor deletion/deactivation
   */
  const handleDeleteSuccess = () => {
    setDeleteDialogOpen(false);
    fetchVendors();
    toast.success("Vendor deactivated successfully");
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Vendors</h1>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Vendor
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vendor Management</CardTitle>
          <CardDescription>
            Manage vendors and suppliers for your construction projects
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : vendors.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No vendors found. Click "Add Vendor" to create your first vendor.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Contact Person</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>GST Number</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendors.map((vendor) => (
                  <TableRow key={vendor.id}>
                    <TableCell className="font-medium">{vendor.name}</TableCell>
                    <TableCell>{vendor.code}</TableCell>
                    <TableCell>{vendor.contactPerson || "—"}</TableCell>
                    <TableCell>{vendor.phone || "—"}</TableCell>
                    <TableCell>{vendor.gstNumber || "—"}</TableCell>
                    <TableCell>
                      {vendor.isActive ? (
                        <Badge variant="default" className="bg-green-500">Active</Badge>
                      ) : (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(vendor)}
                        title="Edit Vendor"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(vendor)}
                        title="Deactivate Vendor"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create Vendor Dialog */}
      <CreateVendorDialog
        open={createDialogOpen}
        onOpenChangeAction={setCreateDialogOpen}
        onSuccessAction={handleCreateSuccess}
      />

      {/* Edit Vendor Dialog */}
      {selectedVendor && (
        <EditVendorDialog
          open={editDialogOpen}
          onOpenChangeAction={setEditDialogOpen}
          vendor={selectedVendor}
          onSuccessAction={handleEditSuccess}
        />
      )}

      {/* Delete Vendor Dialog */}
      {selectedVendor && (
        <DeleteVendorDialog
          open={deleteDialogOpen}
          onOpenChangeAction={setDeleteDialogOpen}
          vendor={selectedVendor}
          onSuccessAction={handleDeleteSuccess}
        />
      )}
    </div>
  );
}
