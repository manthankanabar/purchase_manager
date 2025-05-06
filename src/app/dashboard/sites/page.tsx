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
import CreateSiteDialog from "./components/create-site-dialog";
import EditSiteDialog from "./components/edit-site-dialog";
import DeleteSiteDialog from "./components/delete-site-dialog";

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
 * Sites page component for managing sites
 */
export default function SitesPage() {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  
  const router = useRouter();
  // toast is imported directly from sonner

  // Fetch sites on component mount
  useEffect(() => {
    fetchSites();
  }, []);

  /**
   * Fetch sites from the API
   */
  const fetchSites = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/sites");
      
      if (!response.ok) {
        throw new Error("Failed to fetch sites");
      }
      
      const data = await response.json();
      setSites(data);
    } catch (error) {
      console.error("Error fetching sites:", error);
      toast.error("Failed to load sites. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle opening the edit dialog for a site
   */
  const handleEdit = (site: Site) => {
    setSelectedSite(site);
    setEditDialogOpen(true);
  };

  /**
   * Handle opening the delete dialog for a site
   */
  const handleDelete = (site: Site) => {
    setSelectedSite(site);
    setDeleteDialogOpen(true);
  };

  /**
   * Handle successful site creation
   */
  const handleCreateSuccess = () => {
    setCreateDialogOpen(false);
    fetchSites();
    toast.success("Site created successfully");
  };

  /**
   * Handle successful site update
   */
  const handleEditSuccess = () => {
    setEditDialogOpen(false);
    fetchSites();
    toast.success("Site updated successfully");
  };

  /**
   * Handle successful site deletion/deactivation
   */
  const handleDeleteSuccess = () => {
    setDeleteDialogOpen(false);
    fetchSites();
    toast.success("Site deactivated successfully");
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Sites</h1>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Site
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Site Management</CardTitle>
          <CardDescription>
            Manage construction sites across different company entities
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : sites.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No sites found. Click "Add Site" to create your first site.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Entity</TableHead>
                  <TableHead>Contact Person</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sites.map((site) => (
                  <TableRow key={site.id}>
                    <TableCell className="font-medium">{site.name}</TableCell>
                    <TableCell>{site.code}</TableCell>
                    <TableCell>{site.entityName}</TableCell>
                    <TableCell>{site.contactPerson || "—"}</TableCell>
                    <TableCell>
                      {site.isActive ? (
                        <Badge variant="default" className="bg-green-500">Active</Badge>
                      ) : (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(site)}
                        title="Edit Site"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(site)}
                        title="Deactivate Site"
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

      {/* Create Site Dialog */}
      <CreateSiteDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={handleCreateSuccess}
      />

      {/* Edit Site Dialog */}
      {selectedSite && (
        <EditSiteDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          site={selectedSite}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* Delete Site Dialog */}
      {selectedSite && (
        <DeleteSiteDialog
          open={deleteDialogOpen}
          onOpenChangeAction={setDeleteDialogOpen}
          site={selectedSite}
          onSuccessAction={handleDeleteSuccess}
        />
      )}
    </div>
  );
}
