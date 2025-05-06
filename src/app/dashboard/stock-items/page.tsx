"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PlusCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

// Define interfaces for our data
interface StockItem {
  id: string;
  name: string;
  code: string;
  description: string | null;
  specifications: string | null;
  cgstRate: number;
  sgstRate: number;
  igstRate: number;
  hsnCode: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  stockCategoryId: string;
  stockGroupId: string;
  uomId: string;
  categoryName: string;
  categoryPrefixCode: string;
  groupName: string;
  uomName: string;
  uomCode: string;
}

interface UoM {
  id: string;
  name: string;
  code: string;
}

interface StockCategory {
  id: string;
  name: string;
  prefixCode: string;
}

interface StockGroup {
  id: string;
  name: string;
  code: string;
  categoryId: string;
}

interface HsnCodeReference {
  code: string;
  name: string;
  prefixCode?: string;
  codeName?: string;
  materialName?: string;
  gstRate?: number;
}

/**
 * Stock Items page component for managing stock items
 */
export default function StockItemsPage() {
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [uomOptions, setUomOptions] = useState<UoM[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<StockCategory[]>([]);
  const [groupOptions, setGroupOptions] = useState<StockGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  
  const { isLoaded, userId, isSignedIn } = useAuth();
  const router = useRouter();
  
  // Check authentication
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in');
    }
  }, [isLoaded, isSignedIn, router]);

  // Fetch data on component mount
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchStockItems();
      fetchOptions();
    }
  }, [isLoaded, isSignedIn]);

  /**
   * Fetch stock items from the API
   */
  const fetchStockItems = async () => {
    try {
      setLoading(true);
      // Add cache: 'no-store' to prevent caching issues
      const response = await fetch("/api/stock-items", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store"
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API error (${response.status}): ${errorText}`);
        throw new Error(`Failed to fetch stock items: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      setStockItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching stock items:", error);
      toast.error("Failed to load stock items. Please try again.");
      // Set empty array to prevent UI errors
      setStockItems([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch options for UoM, categories, and groups
   */
  const fetchOptions = async () => {
    try {
      // Fetch UoMs
      const uomResponse = await fetch("/api/uom");
      if (uomResponse.ok) {
        const uomData = await uomResponse.json();
        setUomOptions(uomData);
      }

      // Fetch stock categories
      const categoriesResponse = await fetch("/api/stock-categories");
      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json();
        setCategoryOptions(categoriesData);
      }

      // Fetch stock groups
      const groupsResponse = await fetch("/api/stock-groups");
      if (groupsResponse.ok) {
        const groupsData = await groupsResponse.json();
        setGroupOptions(groupsData);
      }
    } catch (error) {
      console.error("Error fetching options:", error);
      toast.error("Failed to load some options. Some features may be limited.");
    }
  };

  /**
   * Handle successful stock item creation
   */
  const handleCreateSuccess = () => {
    setCreateDialogOpen(false);
    fetchStockItems();
    toast.success("Stock item created successfully");
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Stock Items</h1>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Stock Item
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stock Item Management</CardTitle>
          <CardDescription>
            Manage stock items for your purchase orders and inventory
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : stockItems.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No stock items found. Click "Add Stock Item" to create your first stock item.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 px-4 text-left">Name</th>
                    <th className="py-3 px-4 text-left">Code</th>
                    <th className="py-3 px-4 text-left">HSN Code</th>
                    <th className="py-3 px-4 text-left">Group</th>
                    <th className="py-3 px-4 text-left">Category</th>
                    <th className="py-3 px-4 text-left">UoM</th>
                    <th className="py-3 px-4 text-left">Status</th>
                    <th className="py-3 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {stockItems.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">{item.name}</td>
                      <td className="py-3 px-4">{item.code}</td>
                      <td className="py-3 px-4">{item.hsnCode}</td>
                      <td className="py-3 px-4">{item.groupName}</td>
                      <td className="py-3 px-4">{item.categoryName}</td>
                      <td className="py-3 px-4">{item.uomName}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {item.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">Edit</Button>
                          <Button variant="outline" size="sm" className="text-destructive">Delete</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {createDialogOpen && (
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Stock Item</DialogTitle>
              <DialogDescription>
                Add a new stock item to your inventory
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-center text-muted-foreground">
                Please implement the create stock item form here.
                <br />
                This is a temporary placeholder until we fix the dynamic import issue.
              </p>
            </div>
            <DialogFooter>
              <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
              <Button onClick={() => {
                setCreateDialogOpen(false);
                toast.success("This is a placeholder. Actual implementation pending.");
              }}>
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
